from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView

from .serializers import *


class DocentesAPI(APIView):
    def get(self, request):
        dados = Docente.objects.all()
        serialize_dados = SerieDocente(dados, many=True)
        
        return Response(serialize_dados.data, status=status.HTTP_200_OK)
    

class DirecaoAPI(APIView):
    def get(self, request):
        dados = Direcao.objects.all()
        serialize_dados = SerieDirecao(dados, many=True)
        
        return Response(serialize_dados.data, status=status.HTTP_200_OK)
    
    
class AlunoAPI(APIView):
    def get(self, request):
        dados = Aluno.objects.all()
        print(dados)
        serialize_dados = SerieAluno(dados, many=True)
        
        return Response(serialize_dados.data, status=status.HTTP_200_OK)