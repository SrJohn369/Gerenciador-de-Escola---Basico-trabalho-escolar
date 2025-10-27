from django.urls import path
from docente.views import *


app_name = 'docente'

urlpatterns = [
    path('', docente, name='docente'),
    path('cadastro_docente/', cadDocente, name='cadDocente'),
    path('alter_docente/<int:id>', altDocente, name='altDocente'),
    path('excluir_docente/<int:id>', excluirDocente, name='excluirDocente'),
]
