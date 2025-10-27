from django.urls import path
from disciplina.views import *


app_name = 'disciplina'

urlpatterns = [
    path('', disciplina, name='disciplina'),
    path('cadastrar_diciplina/', cadDisciplina, name='cadDisciplina'),
    path('alter_disciplina/<int:id>', altDisciplina, name='altDisciplina'),
    path('excluir_disciplina/<int:id>', excluirDisciplina, name='excluirDisciplina'),
]
