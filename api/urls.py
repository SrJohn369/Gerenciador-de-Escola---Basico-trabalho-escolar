from django.urls import path
from api.views import DirecaoAPI, DocentesAPI, AlunoAPI

app_name = 'api'

urlpatterns = [
    path('docentes/', DocentesAPI.as_view(), name='docentes'),
    path('diretores/', DirecaoAPI.as_view(), name='direções'),
    path('alunos/', AlunoAPI.as_view(), name='alunos'),
]
