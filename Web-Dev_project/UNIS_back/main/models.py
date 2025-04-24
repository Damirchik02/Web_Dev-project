from django.db import models
from django.contrib.auth.models import User

# User profile model to extend Django User with roles
class UserProfile(models.Model):
    USER_ROLES = [
        ('admin', 'Administrator'),
        ('student', 'Student'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=USER_ROLES, default='student')
    
    def __str__(self):
        return f"{self.user.username} - {self.get_role_display()}"

# Модель университета - основная сущность в приложении
class University(models.Model):
    name = models.CharField(max_length=200)  # Название университета
    country = models.CharField(max_length=100)  # Страна расположения
    city = models.CharField(max_length=100)  # Город расположения
    description = models.TextField()  # Полное описание университета
    
    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name_plural = "Universities"  # Множественное название для админки

# Модель факультета - принадлежит к университету (связь многие-к-одному)
class Faculty(models.Model):
    name = models.CharField(max_length=200)  # Название факультета
    university = models.ForeignKey(University, related_name='faculties', on_delete=models.CASCADE)  # Связь с университетом, при удалении университета удаляются все его факультеты
    
    def __str__(self):
        return self.name
        
    class Meta:
        verbose_name_plural = "Faculties"  # Множественное название для админки

# Модель программы обучения - принадлежит к факультету (связь многие-к-одному)
class Program(models.Model):
    name = models.CharField(max_length=200)  # Название программы
    duration = models.CharField(max_length=50)  # Продолжительность обучения, например, "4 года", "2 семестра"
    cost = models.DecimalField(max_digits=10, decimal_places=2)  # Стоимость обучения
    faculty = models.ForeignKey(Faculty, related_name='programs', on_delete=models.CASCADE)  # Связь с факультетом
    
    def __str__(self):
        return self.name

# Модель заявки на консультацию - связывает пользователя с его запросом
class ConsultationRequest(models.Model):
    # Возможные статусы заявки
    STATUS_CHOICES = [
        ('pending', 'Pending'),  # Ожидающая обработки
        ('completed', 'Completed'),  # Выполненная
        ('rejected', 'Rejected'),  # Отклоненная
    ]
    
    user = models.ForeignKey(User, related_name='consultation_requests', on_delete=models.CASCADE)  # Пользователь, создавший заявку
    message = models.TextField()  # Текст сообщения с вопросом
    date = models.DateTimeField(auto_now_add=True)  # Дата создания (устанавливается автоматически)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')  # Статус заявки
    
    def __str__(self):
        return f"Consultation request by {self.user.username} on {self.date.strftime('%Y-%m-%d')}"
