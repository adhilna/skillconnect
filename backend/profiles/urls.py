from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import FreelancerProfileViewset, ClientProfileViewset

router = DefaultRouter()
router.register(r'freelancer/profile-setup', FreelancerProfileViewset, basename='freelancer-profile')
router.register(r'client/profile-setup', ClientProfileViewset, basename='client-profile')

urlpatterns = [
    path('', include(router.urls)),
]