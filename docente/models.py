from django.db import models
from django.contrib.auth.models import User
from disciplina.models import Disciplina
from turma.models import Turma # Certifica-te que Turma pode ser importada
import datetime

class Docente(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    cpf = models.CharField(max_length=14, unique=True)
    data_nasc = models.DateField(default=datetime.date.today)
    #    Se uma Turma for apagada, o Docente NÃO deve ser apagado.
    turma = models.ForeignKey(Turma, on_delete=models.SET_NULL, null=True, blank=True)
    disciplina = models.ForeignKey(Disciplina, on_delete=models.SET_NULL, null=True, blank=True)
    
    def __str__(self) -> str:
        return f'{self.user.username}'
    
    class Meta:
        verbose_name = 'Docente'