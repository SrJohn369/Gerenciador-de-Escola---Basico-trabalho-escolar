from django.db import models
from django.contrib.auth.models import User
from turma.models import Turma
import datetime 

class Aluno(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    cpf = models.CharField(max_length=14, unique=True)
    data_nasc = models.DateField(default=datetime.date.today)
    # Adicionámos related_name='alunos'
    turma = models.ForeignKey(
        Turma, 
        on_delete=models.SET_NULL, 
        null=True, 
        blank=True,
        related_name='alunos'
    )
    
    def __str__(self) -> str:
        return f'{self.user.username}'
    
    class Meta:
        verbose_name = 'Aluno(a)'