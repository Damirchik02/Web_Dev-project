from django.shortcuts import render
from rest_framework import status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAdminUser, BasePermission
from rest_framework.views import APIView
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from django.contrib.auth.models import User

from .models import University, Faculty, Program, ConsultationRequest, UserProfile
from .serializers import (
    UserSerializer, 
    UserDetailSerializer,
    ConsultationRequestSerializer,
    UniversitySerializer, 
    UniversityDetailSerializer,
    FacultySerializer, 
    FacultyDetailSerializer,
    ProgramSerializer
)

# Custom permission class for admin users
class IsAdminRole(BasePermission):
    """
    Custom permission to only allow users with admin role.
    """
    def has_permission(self, request, view):
        # Check if user has a profile and if role is admin
        return (hasattr(request.user, 'profile') and 
                request.user.profile.role == 'admin')

# Функциональные представления (Function-Based Views)

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):
    """Регистрация нового пользователя и возврат токена авторизации."""
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        token, _ = Token.objects.get_or_create(user=user)
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'role': user.profile.role
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
@permission_classes([AllowAny])
def login_user(request):
    """Авторизация пользователя и возврат токена."""
    username = request.data.get('username')
    password = request.data.get('password')
    
    user = authenticate(username=username, password=password)
    
    if user:
        token, _ = Token.objects.get_or_create(user=user)
        role = user.profile.role if hasattr(user, 'profile') else 'student'
        return Response({
            'token': token.key,
            'user_id': user.id,
            'username': user.username,
            'role': role
        })
    else:
        return Response(
            {'error': 'Invalid credentials'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_user(request):
    """Удаление токена авторизации для выхода из системы."""
    request.user.auth_token.delete()
    return Response({'message': 'Successfully logged out'}, status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    """Get current user profile details."""
    serializer = UserDetailSerializer(request.user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_universities(request):
    """Получение списка всех университетов."""
    universities = University.objects.all()
    serializer = UniversitySerializer(universities, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def get_university_detail(request, pk):
    """Получение детальной информации об университете, включая его факультеты."""
    try:
        university = University.objects.get(pk=pk)
    except University.DoesNotExist:
        return Response({'error': 'University not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = UniversityDetailSerializer(university)
    return Response(serializer.data)

# Классовые представления (Class-Based Views)

class FacultyListView(APIView):
    """Получение списка факультетов для конкретного университета."""
    permission_classes = [AllowAny]
    
    def get(self, request, university_id):
        try:
            University.objects.get(pk=university_id)
        except University.DoesNotExist:
            return Response({'error': 'University not found'}, status=status.HTTP_404_NOT_FOUND)
            
        faculties = Faculty.objects.filter(university_id=university_id)
        serializer = FacultySerializer(faculties, many=True)
        return Response(serializer.data)

class FacultyDetailView(APIView):
    """Получение детальной информации о факультете, включая его программы."""
    permission_classes = [AllowAny]
    
    def get(self, request, pk):
        try:
            faculty = Faculty.objects.get(pk=pk)
        except Faculty.DoesNotExist:
            return Response({'error': 'Faculty not found'}, status=status.HTTP_404_NOT_FOUND)
            
        serializer = FacultyDetailSerializer(faculty)
        return Response(serializer.data)

class ProgramListView(APIView):
    """Получение списка программ для конкретного факультета."""
    permission_classes = [AllowAny]
    
    def get(self, request, faculty_id):
        try:
            Faculty.objects.get(pk=faculty_id)
        except Faculty.DoesNotExist:
            return Response({'error': 'Faculty not found'}, status=status.HTTP_404_NOT_FOUND)
            
        programs = Program.objects.filter(faculty_id=faculty_id)
        serializer = ProgramSerializer(programs, many=True)
        return Response(serializer.data)

class ConsultationRequestView(APIView):
    """Создание и получение списка заявок на консультацию для авторизованного пользователя."""
    permission_classes = [IsAuthenticated]
    
    def post(self, request):
        # Создание новой заявки на консультацию
        serializer = ConsultationRequestSerializer(data={
            **request.data,
            'user_id': request.user.id
        })
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self, request):
        # Получение списка заявок текущего пользователя
        consultations = ConsultationRequest.objects.filter(user=request.user)
        serializer = ConsultationRequestSerializer(consultations, many=True)
        return Response(serializer.data)

# Class to manage all consultation requests (admin only)
class AdminConsultationRequestView(APIView):
    """View and manage all consultation requests (admin only)."""
    permission_classes = [IsAuthenticated, IsAdminRole]
    
    def get(self, request):
        # Get all consultation requests for admin
        consultations = ConsultationRequest.objects.all()
        serializer = ConsultationRequestSerializer(consultations, many=True)
        return Response(serializer.data)
    
    def put(self, request, pk):
        # Update consultation request status
        try:
            consultation = ConsultationRequest.objects.get(pk=pk)
        except ConsultationRequest.DoesNotExist:
            return Response({'error': 'Consultation request not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = ConsultationRequestSerializer(consultation, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Административные операции для университетов (CRUD)

class UniversityAdminView(APIView):
    """CRUD операции для университетов (только для администраторов)."""
    permission_classes = [IsAuthenticated, IsAdminRole]
    
    def get(self, request):
        # Получение списка всех университетов
        universities = University.objects.all()
        serializer = UniversitySerializer(universities, many=True)
        return Response(serializer.data)
    
    def post(self, request):
        # Создание нового университета
        serializer = UniversitySerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class UniversityAdminDetailView(APIView):
    """CRUD операции для конкретного университета (только для администраторов)."""
    permission_classes = [IsAuthenticated, IsAdminRole]
    
    def get_object(self, pk):
        try:
            return University.objects.get(pk=pk)
        except University.DoesNotExist:
            return None
    
    def get(self, request, pk):
        # Получение информации об университете
        university = self.get_object(pk)
        if not university:
            return Response({'error': 'University not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UniversitySerializer(university)
        return Response(serializer.data)
    
    def put(self, request, pk):
        # Обновление информации об университете
        university = self.get_object(pk)
        if not university:
            return Response({'error': 'University not found'}, status=status.HTTP_404_NOT_FOUND)
        
        serializer = UniversitySerializer(university, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def delete(self, request, pk):
        # Удаление университета
        university = self.get_object(pk)
        if not university:
            return Response({'error': 'University not found'}, status=status.HTTP_404_NOT_FOUND)
        
        university.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
