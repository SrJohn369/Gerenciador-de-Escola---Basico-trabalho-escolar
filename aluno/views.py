import json
from django.contrib.auth.models import User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotAllowed, JsonResponse
from django.shortcuts import get_object_or_404, render
from aluno.models import Aluno
from random import randint

@login_required(login_url='loginInicio:login_usuario')
def aluno(request):
    if request.method == 'GET':
        data_static = {
            'css': '/css/baseListagem.css',
            'js': 'javascript/alunoListar.js',
            'titulo': 'Aluno(a)',
            'link': 'aluno:cadAluno',
            'th_tabela': ['Nome', 'CPF', 'Data de Nascimento', 'Opções'],
            'td_links': {
                'Alterar':'aluno:altAluno',
                'Excluir':'aluno:excluirAluno'
            }
        }
        
        alunos = Aluno.objects.all()
        alunos_data = [
            {
            'id': aluno.pk, 
            'nome': aluno.user.first_name + ' ' + aluno.user.last_name, 
            'cpf': aluno.cpf,
            'data_nascimento': aluno.data_nasc.strftime('%d/%m/%Y')
            } for aluno in alunos
        ]
        
        return render(request, 'baseListagem.html', {'data_static': data_static,
                                                     'data_cadastros': alunos_data})


@login_required(login_url='loginInicio:login_usuario')
def cadAluno(request):
    if request.method == 'GET':
        return render(request, 'cadAluno.html', {'titulo': 'Cadastrar Aluno(a)',
                                                 'submit': 'Cadastrar'})
    if request.method == 'POST':
        data = json.loads(request.body)
        nome = data.get('usuario')
        senha = data.get('senha')
        cpf = data.get('cpf')
        email = data.get('email')
        date = data.get('data_nascimento')
        names = nome.split()
        username = names[0] + str(randint(99,99999))

        if User.objects.filter(username=username).exists(): # <<< Verifica o User
            username = nome + str(randint(99,99999))

        # --- INÍCIO DA LÓGICA CORRIGIDA (2 PASSOS) ---

        # Passo 1: Criar o 'User' (Autenticação)
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

        # Passo 2: Criar o 'Aluno' (Perfil) e ligar ao 'user'
        try:
            cadastrar = Aluno.objects.create(
                user=novo_usuario,  # <<< A ligação chave
                cpf=cpf,
                data_nasc=date
                # NOTA: Não definimos 'id' aleatório.
            )
        except Exception as e:
            # Se a criação do Aluno falhar (ex: CPF duplicado),
            # apagamos o User que criámos no Passo 1.
            novo_usuario.delete() 
            return JsonResponse(data={'mensagem': f'Erro ao criar perfil do aluno: {e}'}, status=400)
        
        # --- FIM DA LÓGICA CORRIGIDA ---
        
        data = {
            'mensagem': 'Salvo com sucesso!',
            'user': f'{username}'
        }
        
        # .create() e .create_user() já salvam, não precisas de .save()
        return JsonResponse(data=data, status=201)


@login_required(login_url='loginInicio:login_usuario')
def altAluno(request, id):
    aluno = get_object_or_404(Aluno, pk=id)
    
    if request.method == "GET":
        # Carrega a página de edição
        return render(request, 'cadAluno.html', {
            'submit': 'Alterar Aluno',
            'titulo': 'Alterar Aluno',
            'aluno': aluno
        })
    
    if request.method == "PUT":
        dados = json.loads(request.body)
        
        nome = dados.get('nome')
        sep_nome = nome.split()
        data_nasc = dados.get('data_nascimento')
        first_name = sep_nome[0]
        last_name = sep_nome[1] if len(sep_nome) > 1 else ''
        
        # --- AJUSTE NA ATUALIZAÇÃO ---
        # 1. Atualiza os dados do perfil 'Aluno'
        aluno.data_nasc = data_nasc
        
        # 2. Atualiza os dados do 'User' associado
        aluno.user.first_name = first_name
        aluno.user.last_name = last_name

        try:
            aluno.save()         # Salva o objeto Aluno
            aluno.user.save()    # Salva o objeto User
            return JsonResponse(data={'mensagem': 'Atualizado'}, status=200)
        except Exception as e:
            return JsonResponse(data={'mensagem': f'Erro interno ao salvar: {e}'}, status=500)


@login_required(login_url='loginInicio:login_usuario')
def excluirAluno(request, id):
    if request.method == "DELETE":
        # --- AJUSTE NA EXCLUSÃO ---
        # Em vez de apagar o Aluno, apagamos o User.
        # O 'on_delete=models.CASCADE' no modelo Aluno
        # fará com que o perfil do Aluno seja apagado automaticamente.
        try:
            usuario = get_object_or_404(User, pk=id)
            usuario.delete()
            return JsonResponse({'mensagem': 'Excluido com sucesso'})
        except Exception as e:
            return JsonResponse({'mensagem': f'Erro ao excluir: {e}'}, status=500)
        
    return HttpResponseNotAllowed(['DELETE'])