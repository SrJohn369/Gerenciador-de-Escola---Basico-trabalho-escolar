from django.contrib.auth.decorators import login_required
from django.http import HttpResponseNotAllowed, JsonResponse
from django.shortcuts import get_object_or_404, render, redirect
from django.utils import timezone
from django.templatetags.static import static
from django.db.models import Q 

from turma.models import Turma
from docente.models import Docente
from aluno.models import Aluno
from disciplina.models import Disciplina

# ... (A view 'turma' de listagem permanece igual) ...
@login_required(login_url='loginInicio:login_usuario')
def turma(request):
     # (Esta view está correta)
    if request.method == 'GET':
        data_static = {
            'css': '/css/baseListagem.css',
            'js': 'javascript/direcaoListar.js',
            'titulo': 'Turma',
            'link': 'turma:cadTurma',
            'th_tabela': ['Nome da Turma', 'Ano', 'Data de Criação', 'Opções'],
        }

        turmas = Turma.objects.all()
        turmas_data = []
        for turma in turmas:
            turmas_data.append({
                'id': turma.id,
                'nome_turma': turma.nome_turma,
                'data_criacao': turma.data_criacao.strftime('%d/%m/%Y'),
                'ano': turma.ano,
                'links': {
                    'Ver Docentes': 'turma:verDocentesTurma',
                    'Ver Alunos': 'turma:verAlunosTurma',
                    'Alterar': 'turma:altTurma',
                    'Excluir': 'turma:excluirTurma'
                }
            })
        return render(request, 'baseListagem.html', {'data_static': data_static,
                                                     'data_cadastros': turmas_data})
    

@login_required(login_url='loginInicio:login_usuario')
def cadTurma(request):
    if request.method == 'GET':
        # ... (A lógica GET permanece igual) ...
        docentes = Docente.objects.all()
        alunos = Aluno.objects.filter(turma__isnull=True) 
        disciplinas = Disciplina.objects.all()
        
        data_docente = [{ 'id': docente.pk, 'nome': docente.user.first_name, 'turma': docente.turma } for docente in docentes]
        data_aluno = [{ 'id': aluno.pk, 'nome': aluno.user.first_name, 'cpf': aluno.cpf, 'data_nasc': aluno.data_nasc.strftime("%d/%m/%Y"), 'turma': aluno.turma } for aluno in alunos]
        data_disciplina = [{ 'nome_disciplina': disciplina.nome_disciplina } for disciplina in disciplinas]
        
        return render(request, 'cadTurma.html', {'submit': 'Criar Turma',
                                                 'data_docente': data_docente,
                                                 'data_aluno': data_aluno,
                                                 'data_disciplina': data_disciplina})
    
    # --- LÓGICA POST COM DEBUG ---
    if request.method == 'POST':
        
        # --- DEBUG 1: VER DADOS BRUTOS ---
        print("\n--- [DEBUG] INICIANDO POST /cadTurma ---")
        print(f"Request POST data: {request.POST}")
        # -----------------------------------

        nome = request.POST.get('nome_turma') 
        ano = request.POST.get('ano')
        data_criacao = request.POST.get('data_criacao')

        if not data_criacao:
            data_criacao = timezone.now()

        nova_turma = Turma.objects.create(
            nome_turma=nome,
            ano=ano,
            data_criacao=data_criacao
        )
        print(f"--- [DEBUG] Turma '{nova_turma.nome_turma}' (ID: {nova_turma.id}) criada.")

        # --- DEBUG 2: VER LISTAS RECEBIDAS ---
        alunos_ids_pk = request.POST.getlist('alunos')
        docentes_ids_pk = request.POST.getlist('docentes')
        print(f"--- [DEBUG] IDs de Alunos recebidos (lista): {"Alunos: " if 'alunos' in request.POST else ' N/D'}")
        print(f"--- [DEBUG] IDs de Docentes recebidos (lista): {docentes_ids_pk}")
        # -------------------------------------

        # --- CORREÇÃO DEFINITIVA (USANDO PK PARA ALUNOS) ---
        if alunos_ids_pk:
            try:
                # O teu HTML envia o ID (PK), então usamos pk__in
                alunos_atualizados = Aluno.objects.filter(pk__in=alunos_ids_pk).update(turma=nova_turma)
                print(f"--- [DEBUG] Alunos vinculados: {alunos_atualizados} ---")
            except Exception as e:
                print(f"--- [DEBUG] ERRO AO VINCULAR ALUNOS: {e} ---")
        
        if docentes_ids_pk:
            try:
                # A lógica de Docentes já estava correta (usando pk__in)
                docentes_atualizados = Docente.objects.filter(pk__in=docentes_ids_pk).update(turma=nova_turma)
                print(f"--- [DEBUG] Docentes vinculados: {docentes_atualizados} ---")
            except Exception as e:
                print(f"--- [DEBUG] ERRO AO VINCULAR DOCENTES: {e} ---")
        
        print("--- [DEBUG] Fim do POST. Redirecionando... ---\n")
        return redirect('turma:turma')
    
 
@login_required(login_url='loginInicio:login_usuario')
def altTurma(request, id):
    turma_para_alterar = get_object_or_404(Turma, id=id)

    if request.method == 'GET':
        # ... (A lógica GET permanece igual) ...
        docentes = Docente.objects.all()
        alunos = Aluno.objects.filter(Q(turma__isnull=True) | Q(turma=turma_para_alterar))
        disciplinas = Disciplina.objects.all()
        data_docente = [{ 'id': docente.pk, 'nome': docente.user.first_name, 'turma': docente.turma } for docente in docentes]
        data_aluno = [{ 'id': aluno.pk, 'nome': aluno.user.first_name, 'cpf': aluno.cpf, 'data_nasc': aluno.data_nasc.strftime("%d/%m/%Y"), 'turma': aluno.turma } for aluno in alunos]
        data_disciplina = [{ 'nome_disciplina': disciplina.nome_disciplina } for disciplina in disciplinas]

        return render(request, 'cadTurma.html', {
            'submit': 'Alterar Turma', 'turma': turma_para_alterar,
            'data_docente': data_docente, 'data_aluno': data_aluno, 'data_disciplina': data_disciplina
        })
        
    if request.method == 'POST':
        # --- DEBUG EM altTurma ---
        print(f"\n--- [DEBUG] INICIANDO POST /altTurma (ID: {id}) ---")
        print(f"Request POST data: {request.POST}")
        # -------------------------

        turma_para_alterar.nome_turma = request.POST.get('nome_turma')
        turma_para_alterar.ano = request.POST.get('ano')
        data_criacao = request.POST.get('data_criacao')
        
        if data_criacao:
            turma_para_alterar.data_criacao = data_criacao
        turma_para_alterar.save()
        print("--- [DEBUG] Dados da Turma (nome, ano) atualizados. ---")
        
        # Desvincula todos para começar do zero
        Aluno.objects.filter(turma=turma_para_alterar).update(turma=None)
        Docente.objects.filter(turma=turma_para_alterar).update(turma=None)

        # --- CORREÇÃO E DEBUG (USANDO PK PARA ALUNOS) ---
        alunos_ids_pk = request.POST.getlist('alunos')
        docentes_ids_pk = request.POST.getlist('docentes')
        print(f"--- [DEBUG] IDs de Alunos recebidos (lista): {"Alunos: " if 'alunos' in request.POST else ' N/D'}")
        print(f"--- [DEBUG] IDs de Docentes recebidos (lista): {docentes_ids_pk}")

        if alunos_ids_pk:
            alunos_atualizados = Aluno.objects.filter(pk__in=alunos_ids_pk).update(turma=turma_para_alterar)
            print(f"--- [DEBUG] Alunos revinculados: {alunos_atualizados} ---")

        if docentes_ids_pk:
            docentes_atualizados = Docente.objects.filter(pk__in=docentes_ids_pk).update(turma=turma_para_alterar)
            print(f"--- [DEBUG] Docentes revinculados: {docentes_atualizados} ---")
        
        print("--- [DEBUG] Fim do POST /altTurma. Redirecionando... ---\n")
        return redirect('turma:turma')
    
    
# ... (A view 'excluirTurma' permanece igual) ...
@login_required(login_url='loginInicio:login_usuario')
def excluirTurma(request, id):
    if request.method == "DELETE":
        turma = get_object_or_404(Turma, id=id)
        turma.delete()
        return JsonResponse({'mensagem': 'Excluido com sucesso'})
    return HttpResponseNotAllowed(['DELETE'])


# ... (A view 'verDocentesTurma' permanece igual) ...
@login_required(login_url='loginInicio:login_usuario')
def verDocentesTurma(request, id):
    turma = get_object_or_404(Turma, id=id)
    docentes_da_turma = Docente.objects.filter(turma=turma)
    docentes_data = []
    for docente in docentes_da_turma:
        docentes_data.append({
            'id': docente.pk, 'nome': f"{docente.user.first_name} {docente.user.last_name}",
            'cpf': docente.cpf, 'disciplina': docente.disciplina.nome_disciplina if docente.disciplina else 'N/A'
        })
    return JsonResponse({
        'titulo': f'Docentes da Turma: {turma.nome_turma}',
        'cabecalhos': ['Nome', 'CPF', 'Disciplina'], 'items': docentes_data
    })


@login_required(login_url='loginInicio:login_usuario')
def verAlunosTurma(request, id):
    turma = get_object_or_404(Turma, id=id)
    alunos_da_turma = Aluno.objects.filter(turma=turma)
    alunos_data = []
    for aluno in alunos_da_turma:
        alunos_data.append({
            'id': aluno.pk, 'nome': f"{aluno.user.first_name} {aluno.user.last_name}", 'cpf': aluno.cpf,
            # --- CORREÇÃO (BUG DE EXIBIÇÃO) ---
            # Chave mudada de 'data_nasc' para 'data_de_nascimento'
            # para corresponder ao que o alterarExcluir.js espera.
            'data_de_nascimento': aluno.data_nasc.strftime('%d/%m/%Y')
        })
    return JsonResponse({
        'titulo': f'Alunos da Turma: {turma.nome_turma}',
        'cabecalhos': ['Nome', 'CPF', 'Data de Nascimento'], 'items': alunos_data
    })