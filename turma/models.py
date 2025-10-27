from django.db import models

class Turma(models.Model):
    
    nome_turma = models.CharField(max_length=50)
    ano = models.CharField(max_length=10, default='1ª Ano')
    data_criacao = models.DateTimeField(default='1999-01-01')
    
    def __str__(self) -> str:
        return f'{self.nome_turma}'
    
    class Meta:
        verbose_name = 'Turma'