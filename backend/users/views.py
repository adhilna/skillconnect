from rest_framework import generics
from .serializers import RegisterSerializer, LoginSerializer
from .models import User
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import serializers, status
from rest_framework.exceptions import PermissionDenied
from rest_framework.views import APIView
from rest_framework.response import Response




class RegisterView(generics.CreateAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]
    queryset = User.objects.all()

class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        serializer = LoginSerializer(data=request.data)
        if serializer.is_valid():
            return Response(serializer.validated_data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class FreelancerRateView(generics.CreateAPIView):
#     queryset = Rate.objects.all()
#     permission_classes = [IsAuthenticated]
#     serializer_class = RateSerializer

#     def perform_create(self, serializer):
            
#             if self.request.user.role != 'FREELANCER':
#                 raise PermissionDenied("Only freelancers can set rates.")
#             serializer.save(user=self.request.user)

# class FreelancerProfileView(generics.RetrieveAPIView):
#      queryset = FreelancerProfile.objects.all()
#      serializer_class = FreelancerProfileSerializer
#      permission_classes = [IsAuthenticated]
#      lookup_field = 'pk'

# class FreelancerCreateUpdateView(generics.CreateAPIView, generics.UpdateAPIView):
#      queryset = FreelancerProfile.objects.all()
#      permission_classes = [IsAuthenticated]
#      serializer_class = FreelancerProfileSerializer

#      def perform_create(self, serializer):
#           if self.request.user.role != 'FREELANCER':
#                raise PermissionDenied("Only freelancers can set rates")
#           serializer.save(user=self.request.user)
#      def get_object(self):
#           return get_object_or_404(FreelancerProfile, user=self.request.user)



# class ProfileView(generics.RetrieveAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = ProfileSerializer

#     def get_object(self):
#         return self.request.user.profile
    
# class ProfileUpdateView(generics.UpdateAPIView):
#     permission_classes = [IsAuthenticated]
#     serializer_class = ProfileSerializer

#     def get_object(self):
#         return self.request.user.profile
    