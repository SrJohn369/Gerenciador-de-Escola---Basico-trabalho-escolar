from direcao.models import Direcao
from docente.models import Docente
from aluno.models import Aluno
from rest_framework import serializers


class SerieDirecao(serializers.ModelSerializer):
    class Meta:
        model = Direcao
        fields = ['first_name', 'cpf', 'data_nasc']
        

class SerieDocente(serializers.ModelSerializer):
    class Meta:
        model = Docente
        fields = ['first_name', 'cpf', 'data_nasc']


class SerieAluno(serializers.ModelSerializer):
    class Meta:
        model = Aluno
        fields = ['first_name', 'cpf', 'data_nasc']
        