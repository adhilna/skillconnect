from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ServiceViewSet, ProposalViewSet, ExploreServicesViewSet, ServiceOrderViewSet, ExploreProposalsViewSet, ProposalOrderViewSet

router = DefaultRouter()
router.register(r'services', ServiceViewSet, basename='service')
router.register(r'proposals', ProposalViewSet, basename='proposal')
router.register(r'explore-services', ExploreServicesViewSet, basename='explore-services')
router.register(r'service-orders', ServiceOrderViewSet, basename='serviceorder')
router.register(r'explore-proposals', ExploreProposalsViewSet, basename='exploreproposals')
router.register(r'proposal-orders', ProposalOrderViewSet, basename='proposalorder')



urlpatterns = [
    path('', include(router.urls)),
]
