from rest_framework import serializers
from django.contrib.auth.models import User
from .models import University, Faculty, Program, ConsultationRequest, UserProfile

# Сериализатор пользователя - преобразует данные пользователя в JSON и обратно
class UserSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)  # ID только для чтения (автоматически присваивается)
    username = serializers.CharField(max_length=150)  # Имя пользователя
    email = serializers.EmailField(required=False)  # Email (необязательный)
    password = serializers.CharField(write_only=True, style={'input_type': 'password'})  # Пароль (только для записи)
    role = serializers.CharField(write_only=True, required=False, default='student')  # Role (only for write)
    
    def create(self, validated_data):
        # Get role from data (default is student)
        role = validated_data.pop('role', 'student')
        
        # Создание нового пользователя
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password']
        )
        
        # Create the user profile with the role
        UserProfile.objects.create(user=user, role=role)
        
        return user
    
    def update(self, instance, validated_data):
        # Обновление существующего пользователя
        instance.username = validated_data.get('username', instance.username)
        instance.email = validated_data.get('email', instance.email)
        if 'password' in validated_data:
            instance.set_password(validated_data['password'])
            
        # Update role if provided
        role = validated_data.get('role')
        if role and hasattr(instance, 'profile'):
            instance.profile.role = role
            instance.profile.save()
            
        instance.save()
        return instance

# Сериализатор профиля пользователя
class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ['role']

# Расширенный сериализатор пользователя, включающий профиль
class UserDetailSerializer(serializers.ModelSerializer):
    profile = UserProfileSerializer(read_only=True)
    
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'profile']

# Сериализатор заявок на консультацию
class ConsultationRequestSerializer(serializers.Serializer):
    id = serializers.IntegerField(read_only=True)  # ID только для чтения
    message = serializers.CharField()  # Сообщение с вопросом
    date = serializers.DateTimeField(read_only=True)  # Дата создания (только для чтения)
    status = serializers.CharField(read_only=True)  # Статус заявки (только для чтения)
    user_id = serializers.IntegerField(write_only=True, required=False)  # ID пользователя (только для записи)
    
    def create(self, validated_data):
        # Создание новой заявки на консультацию
        return ConsultationRequest.objects.create(**validated_data)
    
    def update(self, instance, validated_data):
        # Обновление существующей заявки
        instance.message = validated_data.get('message', instance.message)
        instance.status = validated_data.get('status', instance.status)
        instance.save()
        return instance

# Сериализатор для университетов (базовая информация)
class UniversitySerializer(serializers.ModelSerializer):
    class Meta:
        model = University
        fields = ['id', 'name', 'country', 'city', 'description']

# Сериализатор для факультетов (базовая информация)
class FacultySerializer(serializers.ModelSerializer):
    class Meta:
        model = Faculty
        fields = ['id', 'name', 'university']

# Расширенный сериализатор для университетов с включением связанных факультетов
class UniversityDetailSerializer(serializers.ModelSerializer):
    faculties = FacultySerializer(many=True, read_only=True)  # Включает список факультетов
    
    class Meta:
        model = University
        fields = ['id', 'name', 'country', 'city', 'description', 'faculties']

# Сериализатор для программ обучения
class ProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = Program
        fields = ['id', 'name', 'duration', 'cost', 'faculty']

# Расширенный сериализатор для факультетов с включением связанных программ и университета
class FacultyDetailSerializer(serializers.ModelSerializer):
    programs = ProgramSerializer(many=True, read_only=True)  # Включает список программ
    university = UniversitySerializer(read_only=True)  # Включает информацию об университете
    
    class Meta:
        model = Faculty
        fields = ['id', 'name', 'university', 'programs'] 