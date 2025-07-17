from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import TbEstacao, TbResumoMensal, TbVazaoDiaria
from django.conf import settings
from django.db.models import Q
from .utils import montar_cabecalho, verify_recaptcha, calcular_curva
from .serializers import (
    ConsultaEstacaoSerializer,
    LinhaResumoSerializer,
    ResumoHidrologicoSerializer,
    CurvaPermanenciaInputSerializer
)
from core.etl.etl_service import atualizar_estacao

# Endpoint: Consulta de estação (usado no EstacaoForm e nos filtros do DadosPage)
class ConsultaEstacaoView(APIView):
    """
    Requests:
    const body = {
      codEstacao: codigo.trim(),
      captchaToken,
      ...(inicio ? { dataInicio: inicio } : {}),
      ...(fim ? { dataFim: fim } : {}),
    };
    ==============================================
    returns:
    {
      cabecalho: {
        codigo: estacao.codigo_estacao,
        nome: estacao.nome,
        // outros campos do cabeçalho
      },
      resumosMensais: [
        {
          mes: resumo.mes,
          ano: resumo.ano,
          // outros campos do resumo
        },
        // outros resumos
      ]
    }
    """


    def post(self, request):
        print(f"ConsultaEstacaoView request data: {request.data}")  # Debugging line
        serializer = ConsultaEstacaoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data


        if not getattr(settings, 'DISABLE_CAPTCHA', False):
            # Bypass reCAPTCHA in development mode
            print("Bypassing reCAPTCHA in development mode")
            captcha_token = data.get("captchaToken")
            if not captcha_token or not verify_recaptcha(captcha_token):
                return Response({"error": "Captcha inválido"}, status=400)

        # Fazer ETL
        '''
        try:
            atualizar_estacao(data["codEstacao"])  # roda migrate se necessário e popula os dados
        except Exception as e:
            return Response({"error": f"Falha ao atualizar dados da estação: {str(e)}"}, status=500)
        '''
        estacao = TbEstacao.objects.filter(codigo_estacao=data["codEstacao"]).first()
        if not estacao:
            return Response({"error": "Estação não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
    
        # Monta cabeçalho
        cabecalho = montar_cabecalho(estacao)

        # Filtros para resumos mensais
        filtro = {"co_estacao": estacao}
        if data.get("dataInicio"):
            filtro["data_inicial__gte"] = data["dataInicio"]
        if data.get("dataFim"):
            filtro["data_inicial__lte"] = data["dataFim"]

        resumos = TbResumoMensal.objects.filter(**filtro).order_by("data_inicial")
        resumos_serializados = LinhaResumoSerializer(resumos, many=True).data

        resp = {
            "cabecalho": cabecalho,
            "resumosMensais": resumos_serializados
        }

        print(f"ConsultaEstacaoView response: {resp['cabecalho']}")  # Debugging line
        return Response(resp)

# Endpoint dedicado ao resumo hidrológico (pode usar o mesmo do ConsultaEstacaoView se preferir)
class ResumoHidrologicoView(APIView):

    """Requests:
    const body = {
      codEstacao: codigo.trim(),
      dataInicio: inicio,
      dataFim: fim,
      nivelConsistencia: nivel,
    };
    ==============================================
    returns:
    {
      resumosMensais: [
        {
          mes: resumo.mes,
          ano: resumo.ano,
          // outros campos do resumo
        },
        // outros resumos
      ]
    }
    """
    def post(self, request):
        serializer = ResumoHidrologicoSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data

        estacao = TbEstacao.objects.filter(codigo_estacao=data["codEstacao"]).first()
        if not estacao:
            return Response({"error": "Estação não encontrada"}, status=status.HTTP_404_NOT_FOUND)

        filtro = {"co_estacao": estacao}
        if data.get("dataInicio"):
            filtro["data_inicial__gte"] = data["dataInicio"]
        if data.get("dataFim"):
            filtro["data_inicial__lte"] = data["dataFim"]
        if data.get("nivelConsistencia"):
            filtro["nivel_consistencia"] = data["nivelConsistencia"]

        resumos = TbResumoMensal.objects.filter(**filtro).order_by("data_inicial")
        resumos_serializados = LinhaResumoSerializer(resumos, many=True).data

        cabecalho = montar_cabecalho(estacao)

        resp = {
        "cabecalho": cabecalho,
        "resumosMensais": resumos_serializados
        }

        return Response(resp)
    

class CurvaPermanenciaView(APIView):
    def post(self, request):
        serializer = CurvaPermanenciaInputSerializer(data=request.data)
        if not serializer.is_valid():
            return Response({"error": serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
        data = serializer.validated_data

        # 1. Busca a estação
        estacao = TbEstacao.objects.filter(codigo_estacao=data["codigoEstacao"]).first()
        if not estacao:
            return Response({"error": "Estação não encontrada"}, status=status.HTTP_404_NOT_FOUND)
        
        # 2. Monta o filtro para os resumos mensais
        filtro_resumo = Q(co_estacao=estacao)
        if data.get("dataInicio"):
            filtro_resumo &= Q(data_inicial__gte=data["dataInicio"])
        if data.get("dataFim"):
            filtro_resumo &= Q(data_inicial__lte=data["dataFim"])
        if data.get("nivelConsistencia"):
            filtro_resumo &= Q(nivel_consistencia=data["nivelConsistencia"])

        resumos = TbResumoMensal.objects.filter(filtro_resumo).order_by("data_inicial")
        vazoes_mensais = [r.vazao_media_real for r in resumos if r.vazao_media_real is not None]

        # 3. Busca as vazões diárias associadas aos resumos filtrados
        resumos_ids = [r.pk for r in resumos]
        vazoes_diarias = TbVazaoDiaria.objects.filter(co_resumo_mensal_id__in=resumos_ids).order_by("data_vazao")
        vazoes_diarias_lista = [v.vazao for v in vazoes_diarias if v.vazao is not None]
        
        resp = {
            "resumoMensal": calcular_curva(vazoes_mensais),
            "vazaoDiaria": calcular_curva(vazoes_diarias_lista)
        }
        return Response(resp)