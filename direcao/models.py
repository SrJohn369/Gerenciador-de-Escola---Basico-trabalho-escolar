from django.contrib.auth.models import User
from django.db import models
import datetime # Importa para usar no default da data

class Direcao(models.Model):
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    cpf = models.CharField(max_length=14, unique=True)
    data_nasc = models.DateField(default=datetime.date.today) 

    def __str__(self) -> str:
        # Acedemos ao 'username' através do campo 'user'
        return f'{self.user.username}'
    
    class Meta:
        verbose_name = 'Diretor(a)'