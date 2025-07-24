from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ProposalViewSet, ExploreServicesViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'proposals', ProposalViewSet, basename='proposal')
router.register(r'explore-services', ExploreServicesViewSet, basename='explore-services')


urlpatterns = [
    path('', include(router.urls)),
]
