from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ProposalViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'proposals', ProposalViewSet, basename='proposal')

urlpatterns = [
    path('', include(router.urls)),
]
