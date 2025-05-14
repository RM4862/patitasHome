from rest_framework import status
from django.db.models import Q
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Publicacion
from .serializers import (
    UserSerializer, LoginSerializer, ChangePasswordSerializer, MascotaSerializer,
    MascotaEncontradaSerializer, AdopcionSerializer, PublicacionSerializer, ComentarioSerializer
)

# Registro de usuario
@api_view(['POST'])
@permission_classes([AllowAny])
def register(request):
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({'message': 'Usuario registrado exitosamente'},
                        status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Login de usuario
@api_view(['POST'])
@permission_classes([AllowAny])
def login(request):
    serializer = LoginSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data.get('email')
        password = serializer.validated_data.get('password')
        user = authenticate(request, username=email, password=password)
        if user is not None:
            refresh = RefreshToken.for_user(user)
            return Response({
                'token': str(refresh.access_token),
                'refresh': str(refresh),
                'email': user.email,
                'id': user.id
            })
        else:
            return Response({'error': 'Credenciales inválidas'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Cambio de contraseña
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def change_password(request):
    serializer = ChangePasswordSerializer(data=request.data)
    if serializer.is_valid():
        user = request.user
        if user.check_password(serializer.data.get('old_password')):
            user.set_password(serializer.data.get('new_password'))
            user.save()
            return Response({'message': 'Contraseña actualizada correctamente'}, status=status.HTTP_200_OK)
        return Response({'error': 'La contraseña actual es incorrecta'}, status=status.HTTP_400_BAD_REQUEST)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para registrar mascotas perdidas
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def registrar_mascota(request):
    data = request.data.copy()
    data['usuario'] = request.user.id  # Asigna el usuario autenticado
    serializer = MascotaSerializer(data=data)
    if serializer.is_valid():
        mascota = serializer.save()
        # Crear publicación asociada automáticamente
        publicacion = Publicacion.objects.create(
            usuario=request.user,
            tipo='busqueda',  # 'busqueda' para mascotas perdidas
            contenido=f"Se busca a {mascota.nombre}. {mascota.caracteristicas_especiales}",
        )
        publicacion.mascotas.add(mascota)
        return Response({'message': 'Mascota registrada y publicación creada exitosamente'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para registrar mascotas encontradas
@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def registrar_mascota_encontrada(request):
    data = request.data.copy()
    data['usuario'] = request.user.id
    serializer = MascotaEncontradaSerializer(data=data)
    if serializer.is_valid():
        mascota_encontrada = serializer.save()
        # Crear publicación asociada automáticamente
        publicacion = Publicacion.objects.create(
            usuario=request.user,
            tipo='encontrada',  # 'encontrada' para mascotas encontradas
            contenido=f"Se encontró a {mascota_encontrada.nombre}. {mascota_encontrada.senas_particulares}",
        )
        publicacion.mascotas_encontradas.add(mascota_encontrada)
        return Response({'message': 'Mascota encontrada registrada y publicación creada exitosamente'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para registrar adopciones
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def registrar_adopcion(request):
    data = request.data.copy()
    data['usuario'] = request.user.id
    serializer = AdopcionSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Adopción registrada exitosamente'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_publicacion(request):
    data = request.data.copy()
    data['usuario'] = request.user.id
    serializer = PublicacionSerializer(data=data)
    if serializer.is_valid():
        publicacion = serializer.save()
        # Para ManyToMany, asigna después de guardar
        if 'mascotas' in request.data:
            publicacion.mascotas.set(request.data.get('mascotas', []))
        if 'mascotas_encontradas' in request.data:
            publicacion.mascotas_encontradas.set(request.data.get('mascotas_encontradas', []))
        return Response({'message': 'Publicación creada exitosamente'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def crear_comentario(request):
    data = request.data.copy()
    data['usuario'] = request.user.id
    serializer = ComentarioSerializer(data=data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Comentario agregado exitosamente'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Vista para obtener publicaciones
@api_view(['GET'])
@permission_classes([AllowAny])
def lista_publicaciones(request):
    publicaciones = Publicacion.objects.all().order_by('-fecha_registro')

    # Filtros
    tipo_mascota = request.GET.get('tipo_mascota')
    raza = request.GET.get('raza')
    color = request.GET.get('color')
    tamanio = request.GET.get('tamanio')
    zona = request.GET.get('zona')

    if tipo_mascota:
        publicaciones = publicaciones.filter(mascotas__especie__icontains=tipo_mascota)
    if raza:
        publicaciones = publicaciones.filter(mascotas__raza__icontains=raza)
    if color:
        publicaciones = publicaciones.filter(mascotas__color_principal__icontains=color)
    if tamanio:
        publicaciones = publicaciones.filter(mascotas__caracteristicas_especiales__icontains=tamanio)
    if zona:
        publicaciones = publicaciones.filter(
            Q(mascotas__lugar_perdida__icontains=zona) |
            Q(mascotas_encontradas__ultima_ubicacion__icontains=zona)
        )

    publicaciones = publicaciones.distinct()
    serializer = PublicacionSerializer(publicaciones, many=True)
    return Response(serializer.data)
