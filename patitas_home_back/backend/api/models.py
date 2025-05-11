from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.contrib.auth.hashers import make_password
from django.db import models
from django.utils.timezone import now
now
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('El Email es obligatorio')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        if password:
            user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)

class CustomUser(AbstractUser):
   #Opciones de género
    GENERO_CHOICES = [
        ('F', 'Femenino'),
        ('M', 'Masculino'),
        ('N', 'Prefiero no decirlo')
    ]
    id=models.AutoField(primary_key=True)
    username = None
    nombre = models.CharField(max_length=100, default='NombreDesconocido')
    apellido=models.CharField(max_length=100,default='ApellidoDesconocido')
    fecha_nacimiento=models.DateField(default='1990-01-01')
    genero = models.CharField(
        max_length=1,
        choices=GENERO_CHOICES,
        default='N', # Opción por defecto: prefiero no decirlo
    )
    email = models.EmailField('email address', unique=True)
    numero_celular=models.CharField(max_length=15, default='0000000000')
    fecha_registro=models.DateTimeField(auto_now_add=True) #Fecha de registro al momento de crear el usuario
    ultima_actualizacion=models.DateTimeField(auto_now=True) #Fecha de la última actualización al momento de crear el usuario
    
    objects = CustomUserManager()
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['nombre','apellido','fecha_nacimiento','genero','numero_celular']

    class Meta:
        verbose_name = 'Usuario'
        verbose_name_plural = 'Usuarios'

    def __str__(self):
        return f"{self.nombre} {self.apellido}"

    def save(self, *args, **kwargs):
        # Asegura que la contraseña esté hasheada antes de guardar
        if self.password and not self.password.startswith('pbkdf2_sha256$'):
            self.set_password(self.password)
        super().save(*args, **kwargs)
    