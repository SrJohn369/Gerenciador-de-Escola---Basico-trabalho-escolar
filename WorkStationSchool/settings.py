import os

from dotenv import load_dotenv
from pathlib import Path

load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
# SECRET_KEY = os.environ.get('SECRET_KEY')
SECRET_KEY = "dlsakt4ing9439as09wngpdsbjn4-bj94gmsdflçkb9"

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = True

ALLOWED_HOSTS = [
    'syswebschoolmanagement.onrender.com', 'localhost', '127.0.0.1'
]
CORS_ALLOWED_ORIGINS = [
    'https://127.0.0.1:8000', 'https://syswebschoolmanagement.onrender.com'
]
CSRF_TRUSTED_ORIGINS = [
    "https://syswebschoolmanagement.onrender.com", "https://127.0.0.1:8000"
]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'aluno',
    'direcao',
    'disciplina',
    'docente',
    'loginInicio',
    'turma',
    'rest_framework',
    'api',
    'corsheaders',
]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
    'corsheaders.middleware.CorsMiddleware',
]

ROOT_URLCONF = 'WorkStationSchool.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [
            BASE_DIR/'WorkStationSchool'/'templates'
            ],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'WorkStationSchool.wsgi.application'


# Database
import dj_database_url

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('DBNAME'),
        'HOST': os.environ.get('HOST'),
        'PASSWORD': os.environ.get('PASSWORD'),
        'USER': os.environ.get('USER'),
        'PORT': os.environ.get('PORT'),
    }
}

# DATABASES['default'] = dj_database_url.parse(
#     os.environ.get('URLDATABASE')
# )

DATABASES['default'] = {
    'ENGINE': 'django.db.backends.sqlite3',
    'NAME': BASE_DIR / 'db.SchoolManager.sqlite3'
}

# Password validation
# https://docs.djangoproject.com/en/5.0/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/5.0/topics/i18n/

LANGUAGE_CODE = 'pt-br'

TIME_ZONE = 'UTC'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/5.0/howto/static-files/

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static'] # , 'syswebschoolmanagement.onrender.com/static'
STATIC_ROOT = BASE_DIR / 'static_cdn'

# Default primary key field type
# https://docs.djangoproject.com/en/5.0/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
