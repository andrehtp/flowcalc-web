from django.conf import settings


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