from django.urls import path
from loginInicio.views import *

app_name = 'loginInicio'

urlpatterns = [
    path('', inicio, name='inicio'),
    path('login/', login_usuario, name='login_usuario'),
    path('logout/', logout_usuario, name='logout_usuario'),
    path('cadastro_direcao/', cadDirecao, name='cadDirecao'),
    path('esqueceu_senha/', escSenha, name='escSenha')
]
