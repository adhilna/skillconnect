from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ProposalViewSet, ExploreServicesViewSet, ServiceOrderViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'proposals', ProposalViewSet, basename='proposal')
router.register(r'explore-services', ExploreServicesViewSet, basename='explore-services')
router.register(r'service-orders', ServiceOrderViewSet, basename='serviceorder')


urlpatterns = [
    path('', include(router.urls)),
]
