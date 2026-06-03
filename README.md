# 🏫 Gerenciador Escolar

Sistema web de gerenciamento escolar desenvolvido com Django, 
cobrindo os principais módulos de uma instituição de ensino.

## 📋 Funcionalidades

- Cadastro e gerenciamento de alunos
- Cadastro de docentes e disciplinas
- Gerenciamento de turmas
- Painel de direção
- Sistema de login e autenticação
- API integrada
- Interface web com HTML, CSS e JavaScript

## 🛠️ Tecnologias

- Python 3
- Django
- SQLite
- HTML / CSS / JavaScript
- Docker

## 🚀 Como rodar o projeto

```bash
# Clone o repositório
git clone https://github.com/SrJohn369/Gerenciador-de-Escola---Basico-trabalho-escolar.git

# Instale as dependências
pip install -r requirements.txt

# Execute as migrações
python manage.py migrate

# Inicie o servidor
python manage.py runserver
```

## 📦 Com Docker

```bash
docker build -t gerenciador-escolar .
docker run -p 8000:0000 gerenciador-escolar
```

## 👨‍💻 Autor

João Victor de Sousa — [LinkedIn](https://linkedin.com/in/joao-sousa-developer) 
| [GitHub](https://github.com/SrJohn369)
