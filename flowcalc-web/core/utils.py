from django.conf import settings

import numpy as np


def montar_cabecalho(estacao):
    return {
        "codigoEstacao": estacao.codigo_estacao,
        "nomeEstacao": estacao.nome,
        "nomeEstado": estacao.co_cidade.co_estado.nome if estacao.co_cidade and estacao.co_cidade.co_estado else "",
        "nomeCidade": estacao.co_cidade.nome if estacao.co_cidade else "",
        "nomeRio": estacao.co_rio.nome if estacao.co_rio else "",
        "codigoBacia": estacao.codigo_bacia,
        "codigoSubBacia": estacao.codigo_sub_bacia,
        "latitudeEstacao": estacao.latitude,
        "longitudeEstacao": estacao.longitude,
        "altitudeEstacao": estacao.altitude,
    }

def verify_recaptcha(token):


    if getattr(settings, 'DISABLE_CAPTCHA', False):
        return True # Bypass reCAPTCHA in development mode

    """Verifica o token do reCAPTCHA usando a chave privada."""
    import requests
    url = "https://www.google.com/recaptcha/api/siteverify"
    data = {
        'secret': settings.RECAPTCHA_PRIVATE_KEY,
        'response': token
    }
    response = requests.post(url, data=data)
    result = response.json()
    return result.get("success", False)


def calcular_curva(vazoes):
            if not vazoes:
                return {
                    "curva": [],
                    "qmap": {},
                    "q50": 0, "q90": 0, "q95": 0, "q98": 0,
                    "classes": []
                }
            
            vazoes_sorted = sorted(vazoes, reverse=True)
            n = len(vazoes_sorted)
            curva = []
            qmap = {}
            for i, v in enumerate(vazoes_sorted):
                permanencia = ((i + 1) / n) * 100
                curva.append({"permanencia": permanencia, "vazao": v})
            for q in range(1, 100):
                val = np.percentile(vazoes_sorted, 100-q, interpolation='linear')
                qmap[q] = val

                
            # Classes logarítmicas
            classes = []
            if n > 0:
                minimo = min(vazoes_sorted)
                maximo = max(vazoes_sorted)
                num_classes = 30
                if minimo > 0:
                    li = np.logspace(np.log10(minimo), np.log10(maximo), num_classes+1)
                    for idx in range(num_classes):
                        classe = {
                            "classe": idx+1,
                            "li": li[idx],
                            "ls": li[idx+1],
                            "fi": len([v for v in vazoes_sorted if li[idx] <= v < li[idx+1]]),
                            "fac": len([v for v in vazoes_sorted if v < li[idx+1]])
                        }
                        classes.append(classe)
            return {
                "curva": curva,
                "qmap": qmap,
                "q50": np.percentile(vazoes_sorted, 50, interpolation='linear'),
                "q90": np.percentile(vazoes_sorted, 10, interpolation='linear'),
                "q95": np.percentile(vazoes_sorted, 5, interpolation='linear'),
                "q98": np.percentile(vazoes_sorted, 2, interpolation='linear'),
                "classes": classes
            }