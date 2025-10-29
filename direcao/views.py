import json
from django.contrib.auth.models import User # <<< IMPORTANTE: Importar o User
from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotAllowed, JsonResponse
from django.shortcuts import render, get_object_or_404
from direcao.models import Direcao


@login_required(login_url='loginInicio:login_usuario')
def direcao(request):
    if request.method == 'GET':
        
        data_static = {
            'css': '/css/baseListagem.css',
            'js': 'javascript/direcaoListar.js',
            'titulo': 'Direção',
            'link': 'loginInicio:cadDirecao',
            'th_tabela': ['Nome', 'CPF', 'Data de Nascimento', 'Opções'],
            'td_links': {
                'Alterar':'direcao:altDirecao',
                'Excluir':'direcao:excluirDirecao'
            }
        }
        
        Diretores = Direcao.objects.all()
        direcao_data = [
            {
            'id': direcao.pk,
            'nome': direcao.user.first_name + ' ' + direcao.user.last_name,
            'cpf': direcao.cpf,
            'data_nascimento': direcao.data_nasc.strftime('%d/%m/%Y')
            } for direcao in Diretores
        ]
        
        return render(request, 'baseListagem.html', {'data_static': data_static,
                                                     'data_cadastros': direcao_data})
    

@login_required(login_url='loginInicio:login_usuario')
def altDirecao(request, id):
    direcao = get_object_or_404(Direcao, pk=id)
    
    if request.method == "GET":
        # Carrega a página de edição
        return render(request, 'cadDirecao.html', {
            'submit': 'Alterar Direção',
            'titulo': 'Alterar Direção',
            'direcao': direcao
        })
    
    if request.method == "PUT":
        dados = json.loads(request.body)
        
        nome = dados.get('nome')
        sep_nome = nome.split()
        data_nasc = dados.get('data_nascimento')
        first_name = sep_nome[0]
        last_name = sep_nome[1] if len(sep_nome) > 1 else ''
        
        # --- AJUSTE NA ATUALIZAÇÃO ---
        # 1. Atualiza os dados do perfil 'Direcao'
        direcao.data_nasc = data_nasc
        
        # 2. Atualiza os dados do 'User' associado
        direcao.user.first_name = first_name
        direcao.user.last_name = last_name

        try:
            direcao.save()       # Salva o objeto Direcao
            direcao.user.save()  # Salva o objeto User
            return JsonResponse(data={'mensagem': 'Atualizado'}, status=200)
        except Exception as e:
            return JsonResponse(data={'mensagem': f'Erro interno ao salvar: {e}'}, status=500)
        
        
@login_required(login_url='loginInicio:login_usuario')
def excluirDirecao(request, id):
    if request.method == "DELETE":
        # --- AJUSTE NA EXCLUSÃO ---
        # Apagamos o User, e o perfil Direcao será apagado em cascata.
        try:
            usuario = get_object_or_404(User, id=id)
            usuario.delete()
            return JsonResponse({'mensagem': 'Excluido com sucesso'})
        except Exception as e:
            return JsonResponse({'mensagem': f'Erro ao excluir: {e}'}, status=500)

    return HttpResponseNotAllowed(['DELETE'])