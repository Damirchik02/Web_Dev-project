from django.urls import path
from . import views

urlpatterns = [
    # Эндпоинты для авторизации и регистрации
    path('auth/register/', views.register_user, name='register'),  # Регистрация нового пользователя
    path('auth/login/', views.login_user, name='login'),  # Вход пользователя (получение токена)
    path('auth/logout/', views.logout_user, name='logout'),  # Выход пользователя (удаление токена)
    path('auth/profile/', views.get_user_profile, name='user-profile'),  # Get current user profile
    
    # Эндпоинты для университетов
    path('universities/', views.get_universities, name='universities-list'),  # Получение списка всех университетов
    path('universities/<int:pk>/', views.get_university_detail, name='university-detail'),  # Получение детальной информации об университете
    
    # Эндпоинты для факультетов
    path('universities/<int:university_id>/faculties/', views.FacultyListView.as_view(), name='faculties-list'),  # Получение списка факультетов для конкретного университета
    path('faculties/<int:pk>/', views.FacultyDetailView.as_view(), name='faculty-detail'),  # Получение детальной информации о факультете
    
    # Эндпоинты для программ
    path('faculties/<int:faculty_id>/programs/', views.ProgramListView.as_view(), name='programs-list'),  # Получение списка программ для конкретного факультета
    
    # Эндпоинты для заявок на консультацию
    path('consultation-requests/', views.ConsultationRequestView.as_view(), name='consultation-requests'),  # Создание и получение заявок на консультацию
    
    # Admin endpoints for consultation requests
    path('admin/consultation-requests/', views.AdminConsultationRequestView.as_view(), name='admin-consultation-requests'),  # Admin access to all consultation requests
    path('admin/consultation-requests/<int:pk>/', views.AdminConsultationRequestView.as_view(), name='admin-consultation-request-detail'),  # Admin management of consultation request
    
    # Эндпоинты для администрирования университетов (CRUD)
    path('admin/universities/', views.UniversityAdminView.as_view(), name='admin-universities'),  # Список и создание университетов (только для админов)
    path('admin/universities/<int:pk>/', views.UniversityAdminDetailView.as_view(), name='admin-university-detail'),  # Получение, изменение и удаление университета (только для админов)
] 