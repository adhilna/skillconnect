from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import FreelancerProfileSetupViewSet, city_autocomplete

router = DefaultRouter()
router.register(r'freelancer/profile-setup', FreelancerProfileSetupViewSet, basename='freelancer-profile')

urlpatterns = [
    path('', include(router.urls)),
    path('city-autocomplete/', views.city_autocomplete, name='city-autocomplete'),
]