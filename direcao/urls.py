from django.urls import path
from direcao.views import *


app_name = 'direcao'

urlpatterns = [
    path('', direcao, name='direcao'),
    path('alter_direcao/<int:id>', altDirecao, name='altDirecao'),
    path('excluir_direcao/<int:id>', excluirDirecao, name='excluirDirecao'),
]
