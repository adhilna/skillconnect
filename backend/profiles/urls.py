from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import FreelancerProfileViewSet, ClientProfileViewSet, city_autocomplete

router = DefaultRouter()
router.register(r'freelancer/profile-setup', FreelancerProfileViewSet, basename='freelancer-profile')
router.register(r'client/profile-setup', ClientProfileViewSet, basename='client-profile')

urlpatterns = [
    path('', include(router.urls)),
    path('city-autocomplete/', views.city_autocomplete, name='city-autocomplete'),
]