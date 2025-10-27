import json
import uuid

from django.shortcuts import render, redirect
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_protect
from django.http import JsonResponse
from django.contrib.auth.models import User

from direcao.models import Direcao

from random import randint


@login_required(login_url='loginInicio:login_usuario')
def inicio(request):
    if request.method == 'GET':
        return render(request, 'inicio.html')


@csrf_protect
def login_usuario(request):
    if request.method == 'GET':
        return render(request, 'login.html')
    if request.method == 'POST':
        data = json.loads(request.body)
        login_usuario = data.get('usuario')
        login_senha = data.get('senha')
        user_existe = User.objects.filter(username=login_usuario).exists()
        
        if not user_existe:
            # Retorna 404 (Not Found) se o USUÁRIO não for encontrado
            return JsonResponse({'mensagem': 'Usuário não existe'}, status=404)

        # O usuário existe. A senha está correta?
        # Agora autenticamos
        user = authenticate(username=login_usuario, password=login_senha)
        
        if user is not None:
            # Sucesso
            login(request, user)
            return JsonResponse({'mensagem': 'Sucesso no login'}, status=200)
        else:
            # Retorna 401 (Unauthorized) se a SENHA estiver incorreta
            return JsonResponse({'mensagem': 'Senha incorreta'}, status=401)
        

@login_required(login_url='loginInicio:login_usuario')
def logout_usuario(request):
    logout(request)
    return redirect('loginInicio:login_usuario')


@csrf_protect
def cadDirecao(request):
    if request.method == 'GET':
        return render(request, 'cadDirecao.html')
    
    if request.method == 'POST':
        data = json.loads(request.body)
        nome = data.get('usuario')
        senha = data.get('senha')
        cpf = data.get('cpf')
        email = data.get('email')
        date = data.get('data_nascimento')
        names = nome.split()
        username = names[0] + str(randint(99,99999))
        
        # AJUSTE: A verificação de 'username' deve ser no modelo User
        if User.objects.filter(username=username).exists():
            username = names[0] + str(randint(99,99999))
        
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
            # Ex: Acontece se o username ou email já estiverem em uso
            return JsonResponse(data={'mensagem': f'Erro ao criar usuário: {e}'}, status=400)

        # Passo 2: Criar o 'Direcao' (Perfil) e ligar ao 'user'
        try:
            # Não precisamos de 'cadastrar.save()' pois .create() já salva
            Direcao.objects.create(
                user=novo_usuario,  # <<< A ligação chave!
                cpf=cpf,
                data_nasc=date
                # AJUSTE: 'id' aleatório removido. O Django trata da PK.
            )
        except Exception as e:
            # Ex: Acontece se o CPF for duplicado
            # Se falhar aqui, apagamos o User que criámos no Passo 1
            novo_usuario.delete() 
            return JsonResponse(data={'mensagem': f'Erro ao criar perfil da direção: {e}'}, status=400)
        
        # --- FIM DA LÓGICA CORRIGIDA ---

        data = {
            'mensagem': 'Salvo com sucesso!',
            'user': f'{username}'
        }
        
        # Se chegámos aqui, ambos foram criados com sucesso
        return JsonResponse(data=data, status=201)


@csrf_protect
def escSenha(request):
    if request.method == 'GET':
        return render(request, 'escSenha.html')
    
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            username = data.get('usuario')
            nova_senha = data.get('senha')
            # Usamos get() que levanta uma exceção se não encontrar
            user = User.objects.get(username=username)
            
            # O set_password() trata de hashear a senha corretamente
            user.set_password(nova_senha)
            user.save()
            
            # Retorna 200 (OK) se foi bem-sucedido
            return JsonResponse({'mensagem': 'Senha alterada com sucesso!'}, status=200)

        except User.DoesNotExist:
            # Retorna 404 (Not Found) se o usuário não foi encontrado
            return JsonResponse({'mensagem': 'Usuário não encontrado'}, status=404)
        except Exception as e:
            # Retorna 500 para qualquer outro erro
            return JsonResponse({'mensagem': f'Erro interno: {e}'}, status=500)


