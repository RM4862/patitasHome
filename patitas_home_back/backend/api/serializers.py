from rest_framework import serializers
from .models import CustomUser

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = CustomUser
        fields = ('id','nombre', 'apellido', 'fecha_nacimiento', 'genero','email', 'numero_celular','password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            nombre=validated_data.get('nombre', ''),
            apellido=validated_data.get('apellido', ''),
            fecha_nacimiento=validated_data.get('fecha_nacimiento', '1990-01-01'),
            genero=validated_data.get('genero', 'N'),
            numero_celular=validated_data.get('numero_celular', '0000000000'),
    )
        return user
    
class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required = True)

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()