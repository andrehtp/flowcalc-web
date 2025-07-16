from rest_framework import serializers
from .models import TbEstacao, TbResumoMensal, TbCidade, TbRio, TbEstado
#========================================SAÍDAS=========================================
# Serializer para linha do Resumo Hidrológico (um resumo mensal) Saída
class LinhaResumoSerializer(serializers.Serializer):
    dataInicial = serializers.DateTimeField(source="data_inicial")
    resumoMensalId = serializers.IntegerField(source="co_seq_resumo_mensal")
    vazaoMedia = serializers.FloatField(source="vazao_media")
    vazaoMaxima = serializers.FloatField(source="vazao_maxima")
    vazaoMinima = serializers.FloatField(source="vazao_minima")
    vazaoMediaReal = serializers.FloatField(source="vazao_media_real")
    vazaoMaximaReal = serializers.FloatField(source="vazao_maxima_real")
    vazaoMinimaReal = serializers.FloatField(source="vazao_minima_real")
    nivelConsistencia = serializers.IntegerField(source="nivel_consistencia")
    metodoObtencao = serializers.IntegerField(source="metodo_obtencao")

# Serializer para o "cabeçalho" da estação (dados que vão no painel lateral) - Saída
class CabecalhoSerializer(serializers.Serializer):
    codigoEstacao = serializers.CharField()
    nomeEstacao = serializers.CharField()
    nomeEstado = serializers.CharField()
    nomeCidade = serializers.CharField()
    nomeRio = serializers.CharField()
    codigoBacia = serializers.IntegerField(allow_null=True)
    codigoSubBacia = serializers.IntegerField(allow_null=True)
    latitudeEstacao = serializers.CharField(allow_blank=True, allow_null=True)
    longitudeEstacao = serializers.CharField(allow_blank=True, allow_null=True)
    altitudeEstacao = serializers.CharField(allow_blank=True, allow_null=True)

# Serializer da resposta principal para o DadosPage - Saída
class EstacaoResponseSerializer(serializers.Serializer):
    cabecalho = CabecalhoSerializer()
    resumosMensais = LinhaResumoSerializer(many=True)


#========================================ENTRADAS=========================================
# Serializer para receber os filtros do frontend (entrada da consulta) -Entradas
class ConsultaEstacaoSerializer(serializers.Serializer):
    codEstacao = serializers.CharField()
    dataInicio = serializers.DateTimeField(required=False, allow_null=True)
    dataFim = serializers.DateTimeField(required=False, allow_null=True)
    captchaToken = serializers.CharField(required=False, allow_null=True, allow_blank=True)

class ResumoHidrologicoSerializer(serializers.Serializer):
    codEstacao = serializers.CharField()
    dataInicio = serializers.DateTimeField(required=False, allow_null=True)
    dataFim = serializers.DateTimeField(required=False, allow_null=True)
    nivelConsistencia = serializers.IntegerField(required=False, allow_null=True)


class CurvaPermanenciaInputSerializer(serializers.Serializer):
    codigoEstacao = serializers.IntegerField()
    dataInicio = serializers.DateField(required=False, allow_null=True)
    dataFim = serializers.DateField(required=False, allow_null=True)
    nivelConsistencia = serializers.IntegerField(required=False, allow_null=True)
