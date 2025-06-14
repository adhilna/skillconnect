from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FreelancerProfileViewSet, ClientProfileViewSet

router = DefaultRouter()
router.register(r'freelancer/profile-setup', FreelancerProfileViewSet, basename='freelancer-profile')
router.register(r'client/profile-setup', ClientProfileViewSet, basename='client-profile')

urlpatterns = [
    path('', include(router.urls)),
]