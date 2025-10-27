from django.urls import path
from turma.views import *


app_name = 'turma'

urlpatterns = [
    path('', turma, name='turma'),
    path('cadastro_turma/', cadTurma, name='cadTurma'),
    path('alter_turma/<int:id>', altTurma, name='altTurma'),
    path('excluir_turma/<int:id>', excluirTurma, name='excluirTurma'),
    path('verDocentes_turma/<int:id>/', verDocentesTurma, name='verDocentesTurma'),
    path('verAlunos_turma/<int:id>/', verAlunosTurma, name='verAlunosTurma'),
]
