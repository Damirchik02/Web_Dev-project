from django.contrib import admin
from .models import University, Faculty, Program, ConsultationRequest, UserProfile

@admin.register(University)
class UniversityAdmin(admin.ModelAdmin):
    list_display = ('name', 'country', 'city')
    search_fields = ('name', 'country', 'city')

@admin.register(Faculty)
class FacultyAdmin(admin.ModelAdmin):
    list_display = ('name', 'university')
    list_filter = ('university',)
    search_fields = ('name',)

@admin.register(Program)
class ProgramAdmin(admin.ModelAdmin):
    list_display = ('name', 'faculty', 'duration', 'cost')
    list_filter = ('faculty',)
    search_fields = ('name',)

@admin.register(ConsultationRequest)
class ConsultationRequestAdmin(admin.ModelAdmin):
    list_display = ('user', 'date', 'status')
    list_filter = ('status', 'date')
    search_fields = ('user__username', 'message')
    readonly_fields = ('date',)

@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):
    list_display = ('user', 'role')
    list_filter = ('role',)
    search_fields = ('user__username',)
