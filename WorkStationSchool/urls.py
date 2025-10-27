from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('', include('loginInicio.urls')),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('aluno/', include('aluno.urls')),
    path('direcao/', include('direcao.urls')),
    path('disciplina/', include('disciplina.urls')),
    path('docente/', include('docente.urls')),
    path('turma/', include('turma.urls')),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)