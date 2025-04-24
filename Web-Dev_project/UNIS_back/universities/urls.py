from django.urls import path
from .views import UniversityList, UniversityDetail

urlpatterns = [
    path('universities/', UniversityList.as_view(), name='university-list'),
    path('universities/<int:pk>/', UniversityDetail.as_view(), name='university-detail'),
]
