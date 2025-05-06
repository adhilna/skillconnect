from django.urls import path
from .views import ServiceListView, ServiceCreateView

urlpatterns = [
    path('services/', ServiceListView.as_view(), name='service-list'),
    path('services/create/', ServiceCreateView.as_view(), name='service-create'),
]
