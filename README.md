# FlowCalc Web

FlowCalc é uma aplicação web para consulta e análise de dados hidrológicos, com integração à API da ANA (Agência Nacional de Águas) para exibir e calcular dados de vazões e curvas de permanência de estações hidrológicas.

## ✨ Funcionalidades

- Consulta de estações fluviométricas
- Integração com WebService SOAP da ANA (`HidroInventario`, `HidroSerieHistorica`)
- Cálculo de curva de permanência
- Exibição de resumos mensais e vazões diárias
- Interface interativa e responsiva (frontend em React)
- Backend com Django (em desenvolvimento)

---

## 📦 Tecnologias Utilizadas

- **Frontend:** React + TypeScript
- **Backend:** Django + Django REST Framework (adaptado do Java original)
- **Banco de Dados:** PostgreSQL
- **API externa:** WebService da ANA (SOAP)

---

## 🚀 Instalação Local

### 1. Clonar o repositório

```bash
git clone https://github.com/andrehtp/flowcalc-web.git
cd flowcalc-web
```

### 2. Criar e ativar ambiente virtual (backend)

```bash
python -m venv venv
source venv/bin/activate  # Linux/macOS
venv\Scripts\activate     # Windows
```

### 3. Instalar dependências do backend

```bash
pip install -r requirements.txt
```

### 4. Criar o banco de dados e configurando .env

Configure o PostgreSQL local ou em nuvem com as credenciais definidas no arquivo `.env` ou `settings.py`. Exemplo de configuração:

```env
LEGACY_DB = True #Coloque 'True' se estiver usando um banco já populado
PG_DB=flowCalc_DB
PG_USER=postgres
PG_PASS=123
PG_HOST=localhost
PG_PORT=5432

RECAPTCHA_PRIVATE_KEY=suaprivatekey
```

> Utilize o banco legacy: https://drive.google.com/file/d/1sxa3aR-b8i0rfLh8fkqXTmOBt4D43Jub/view?usp=drive_link


### 6. Executar o backend

```bash
python manage.py runserver 8080
```

---

### 7. Instalar e rodar o frontend

Em outro terminal:

```bash
cd ../frontend-web
npm install
npm run dev
```

> O frontend roda em `http://localhost:5173` e o backend em `http://localhost:8080`

---

## 📑 Licença

Este projeto está licenciado sob a licença MIT.

---

## 👨‍💻 Autor

Desenvolvido por André Tavares e Gabriel Sodré, com adaptações para Django feitas por contribuidores da comunidade.

GitHub: [@andrehtp](https://github.com/andrehtp)
GitHub: [@GabrielSM99](https://github.com/GabrielSM99)
