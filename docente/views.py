import json

from django.contrib.auth.decorators import login_required
from django.shortcuts import get_object_or_404, render
from django.http import HttpResponseNotAllowed, JsonResponse
from django.contrib.auth.models import User

from docente.models import Docente
from disciplina.models import Disciplina
from random import randint


@login_required(login_url='loginInicio:login_usuario')
def docente(request):
    if request.method == 'GET':
        data_static = {
            'css': '/css/baseListagem.css',
            'js': 'javascript/docenteListar.js',
            'titulo': 'Docente',
            'link': 'docente:cadDocente',
            'th_tabela': ['Nome', 'CPF', 'Data de Nascimento', 'Opções'],
            'td_links': {
                'Alterar':'docente:altDocente',
                'Excluir':'docente:excluirDocente'
            }
        }
        Docentes = Docente.objects.all()
        docente_data = [
            {
                'id': docente.pk,
                'nome': docente.user.first_name + ' ' + docente.user.last_name,
                'cpf': docente.cpf,
                'data_nascimento': docente.data_nasc.strftime('%d/%m/%Y')
            } for docente in Docentes
        ]
        # print(docente_data)
        
        return render(request, 'baseListagem.html', {'data_static': data_static,
                                                     'data_cadastros': docente_data})
        
    
@login_required(login_url='loginInicio:login_usuario')
def cadDocente(request):
    if request.method == 'GET':
        # 2. Buscar todas as disciplinas
        disciplinas_disponiveis = Disciplina.objects.all()
        
        return render(request, 'cadDocente.html', {
            'submit': 'Cadastrar',
            'titulo': 'Cadastro Docente',
            'disciplinas': disciplinas_disponiveis  # <<< 3. Enviar para o template
        })
        
    if request.method == 'POST':
        data = json.loads(request.body)
        nome = data.get('usuario')
        senha = data.get('senha')
        cpf = data.get('cpf')
        email = data.get('email')
        date = data.get('data_nascimento')
        disciplina_id = data.get('disciplina')  # <<< 4. Capturar o ID da disciplina

        names = nome.split()
        username = names[0] + str(randint(99,99999))
        
        if User.objects.filter(username=username).exists():
            username = nome + str(randint(99,99999))
            
        # 5. Encontrar a disciplina (se alguma foi enviada)
        disciplina_obj = None
        if disciplina_id:
            try:
                disciplina_obj = Disciplina.objects.get(pk=disciplina_id)
            except Disciplina.DoesNotExist:
                return JsonResponse(data={'mensagem': 'Disciplina não encontrada.'}, status=400)

        # Passo 1: Criar o 'User'
        try:
            novo_usuario = User.objects.create_user(
                username=username, 
                password=senha, 
                first_name=names[0],
                email=email,
                last_name=names[-1] if len(names) > 1 else ''
            )
        except Exception as e:
            return JsonResponse(data={'mensagem': f'Erro ao criar usuário: {e}'}, status=400)

        # Passo 2: Criar o 'Docente'
        try:
            cadastrar = Docente.objects.create(
                user=novo_usuario,
                cpf=cpf,
                data_nasc=date,
                disciplina=disciplina_obj  # <<< 6. Salvar a disciplina no novo docente
            )
        except Exception as e:
            novo_usuario.delete() 
            return JsonResponse(data={'mensagem': f'Erro ao criar perfil do docente: {e}'}, status=400)
        
        data = {
            'mensagem': 'Salvo com sucesso!',
            'user': f'{username}'
        }
        
        return JsonResponse(data=data, status=201)
    
    
@login_required(login_url='loginInicio:login_usuario')
def altDocente(request, id):
    docente = get_object_or_404(Docente, pk=id)
    
    if request.method == "GET":
        # 7. Buscar todas as disciplinas (também para a página de alterar)
        disciplinas_disponiveis = Disciplina.objects.all()
        
        return render(request, 'cadDocente.html', {
            'submit': 'Alterar Docente',
            'titulo': 'Alterar Docente',
            'docente': docente,
            'disciplinas': disciplinas_disponiveis  # <<< 8. Enviar para o template
        })
    
    if request.method == "PUT":
        dados = json.loads(request.body)
        
        nome = dados.get('nome')
        sep_nome = nome.split()
        data_nasc = dados.get('data_nascimento')
        disciplina_id = dados.get('disciplina')  # <<< 9. Capturar o ID da disciplina

        first_name = sep_nome[0]
        last_name = sep_nome[1] if len(sep_nome) > 1 else ''
        
        # 10. Encontrar a disciplina (se alguma foi enviada)
        disciplina_obj = None
        if disciplina_id:
            try:
                disciplina_obj = Disciplina.objects.get(pk=disciplina_id)
            except Disciplina.DoesNotExist:
                return JsonResponse(data={'mensagem': 'Disciplina não encontrada.'}, status=400)

        # Alterar os campos
        docente.user.first_name = first_name
        docente.user.last_name = last_name
        docente.data_nasc = data_nasc
        docente.disciplina = disciplina_obj  # <<< 11. Atualizar a disciplina

        try:
            docente.user.save()
            docente.save()
            return JsonResponse(data={'mensagem': 'Atualizado'}, status=200)
        except Exception as e:
            return JsonResponse(data={'mensagem': f'Erro interno ao salvar: {e}'}, status=500)
    

@login_required(login_url='loginInicio:login_usuario')
def excluirDocente(request, id):
    if request.method == "DELETE":
        docente = get_object_or_404(Docente, pk=id)
        docente.delete()
        return JsonResponse({'mensagem': 'Excluido com sucesso'})
    return HttpResponseNotAllowed(['DELETE'])