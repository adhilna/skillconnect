from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from .views import (
FreelancerProfileSetupViewSet,
city_autocomplete,
ClientProfileSetupViewSet,
FreelancerBrowseViewSet,
ClientBrowseViewSet
)

router = DefaultRouter()
router.register(r'freelancer/profile-setup', FreelancerProfileSetupViewSet, basename='freelancer-profile')
router.register(r'client/profile-setup', ClientProfileSetupViewSet, basename='client-profile')
router.register(r'freelancers/browse', FreelancerBrowseViewSet, basename='freelancer-browse')
router.register(r'clients/browse', ClientBrowseViewSet, basename='client-browse')

urlpatterns = [
    path('', include(router.urls)),
    path('city-autocomplete/', views.city_autocomplete, name='city-autocomplete'),
]