from rest_framework import viewsets, permissions, status, filters
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import FreelancerProfile, ClientProfile
from .serializers import(
    FreelancerProfileSetupSerializer,
    ClientProfileSetupSerializer,
    FreelancerPublicMinimalSerializer,
    FreelancerPublicDetailSerializer,
    ClientPublicMinimalSerializer,
    ClientPublicDetailSerializer,
)
from .pagination import StandardResultsSetPagination
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
import json
import pprint
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django_filters.rest_framework import DjangoFilterBackend
from .constants import COUNTRIES, CITIES

@api_view(['GET'])
def country_autocomplete(request):
    query = request.GET.get('q', '').lower().strip()
    if not query:
        return Response([])

    # Filter by query (case-insensitive)
    filtered = sorted(
        [country for country in COUNTRIES if query in country.lower()],
        key=lambda x: x.lower()
    )

    # Limit number of results
    MAX_RESULTS = 10
    results = [
        {'id': idx, 'name': country}
        for idx, country in enumerate(filtered[:MAX_RESULTS])
    ]

    return Response(results)

@api_view(['GET'])
def city_autocomplete(request):
    query = request.GET.get('q', '').lower().strip()
    if not query:
        return Response([])
    # Filter and sort
    filtered = sorted(
        [city for city in CITIES if query in city.lower()],
        key=lambda x: x.lower()
    )
    # Limit results
    MAX_RESULTS = 10
    results = [
        {'id': idx, 'name': city}
        for idx, city in enumerate(filtered[:MAX_RESULTS])
    ]
    return Response(results)

class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of an object to edit it.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions are allowed to any request,
        # so we'll always allow GET, HEAD or OPTIONS requests.
        if request.method in permissions.SAFE_METHODS:
            return True
        # Write permissions are only allowed to the owner of the profile.
        return obj.user == request.user

class FreelancerProfileSetupViewSet(viewsets.ModelViewSet):
    """
    ViewSet for creating and managing FreelancerProfile with full multipart/form-data and JSON support.
    Includes extensive debugging/logging for all incoming data and files.
    """
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]
    queryset = FreelancerProfile.objects.all()
    serializer_class = FreelancerProfileSetupSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def get_queryset(self):
        # Only allow users to access their own profiles
        return self.queryset.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        # Attach the current user to the new profile
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):

        print("==== [DEBUG] RAW DATA RECEIVED ====")
        pprint.pprint(dict(request.data))
        print("==== [DEBUG] RAW FILES RECEIVED ====")
        pprint.pprint(dict(request.FILES))

        data = request.data 
        json_fields = [
            'skills_input', 'educations_input', 'experiences_input', 'languages_input',
            'portfolios_input', 'social_links_input', 'verification_input'
        ]

        # Extract FormData safely
        parsed_data = {}
        if hasattr(data, "getlist"):
            for key in data:
                val = data.getlist(key) if len(data.getlist(key)) > 1 else data.get(key)
                parsed_data[key] = val
        else:
            parsed_data = data

        # Parse JSON fields safely
        for field in json_fields:
            if field in parsed_data:
                try:
                    parsed_data[field] = json.loads(parsed_data[field]) if isinstance(parsed_data[field], str) else parsed_data[field]
                except Exception as e:
                    print(f"[DEBUG] JSON parse error in {field}: {e}")
                    parsed_data[field] = [] if 'input' in field else {}

        # Normalize lists of dicts
        def ensure_list_of_dicts(val):
            if isinstance(val, list):
                flat = []
                for item in val:
                    if isinstance(item, list):
                        flat.extend(item)
                    elif isinstance(item, dict):
                        flat.append(item)
                return flat
            return []

        for field in ['skills_input', 'educations_input', 'experiences_input', 'languages_input', 'portfolios_input']:
            parsed_data[field] = ensure_list_of_dicts(parsed_data.get(field, []))

        # Final check
        for field in ['skills_input', 'educations_input', 'experiences_input', 'languages_input', 'portfolios_input']:
            print(f"Final {field}:", parsed_data[field])
            for idx, val in enumerate(parsed_data[field]):
                print(f"{field}[{idx}] type: {type(val)} => {val}")

        # Now pass to serializer
        serializer = self.get_serializer(data=parsed_data)
        if not serializer.is_valid():
            print("==== [DEBUG] SERIALIZER ERRORS ====")
            pprint.pprint(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        try:
            profile = self.get_queryset().get(user=request.user)
        except FreelancerProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = self.get_serializer(profile, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        # ---- Start of robust parsing logic ----
        print("==== [DEBUG] RAW DATA RECEIVED ====")
        pprint.pprint(dict(request.data))
        print("==== [DEBUG] RAW FILES RECEIVED ====")
        pprint.pprint(dict(request.FILES))

        data = request.data 
        json_fields = [
            'skills_input', 'educations_input', 'experiences_input', 'languages_input',
            'portfolios_input', 'social_links_input', 'verification_input'
        ]

        # Extract FormData safely
        parsed_data = {}
        for key in data:
            val = data.getlist(key) if hasattr(data, 'getlist') and isinstance(data.getlist(key), list) and len(data.getlist(key)) > 1 else data.get(key)
            parsed_data[key] = val

        # Parse JSON fields safely
        for field in json_fields:
            if field in parsed_data:
                try:
                    parsed_data[field] = json.loads(parsed_data[field]) if isinstance(parsed_data[field], str) else parsed_data[field]
                except Exception as e:
                    print(f"[DEBUG] JSON parse error in {field}: {e}")
                    parsed_data[field] = [] if 'input' in field else {}

        # Normalize lists of dicts
        def ensure_list_of_dicts(val):
            if isinstance(val, list):
                flat = []
                for item in val:
                    if isinstance(item, list):
                        flat.extend(item)
                    elif isinstance(item, dict):
                        flat.append(item)
                return flat
            return []

        for field in ['skills_input', 'educations_input', 'experiences_input', 'languages_input', 'portfolios_input']:
            parsed_data[field] = ensure_list_of_dicts(parsed_data.get(field, []))

        # Final check
        for field in ['skills_input', 'educations_input', 'experiences_input', 'languages_input', 'portfolios_input']:
            print(f"Final {field}:", parsed_data[field])
            for idx, val in enumerate(parsed_data[field]):
                print(f"{field}[{idx}] type: {type(val)} => {val}")

        # ---- End of robust parsing logic ----

        partial = request.method == 'PATCH'
        serializer = self.get_serializer(profile, data=parsed_data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            refreshed_serializer = self.get_serializer(profile, context={'request': request})
            return Response(refreshed_serializer.data, status=status.HTTP_200_OK)

        print("==== [DEBUG] SERIALIZER ERRORS ====")
        pprint.pprint(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ClientProfileSetupViewSet(viewsets.ModelViewSet):
    """
    ViewSet for creating and managing ClientProfile with full multipart/form-data and JSON support.
    Includes extensive debugging/logging for all incoming data and files.
    """
    permission_classes = [permissions.IsAuthenticated]
    queryset = ClientProfile.objects.all()
    serializer_class = ClientProfileSetupSerializer
    parser_classes = [MultiPartParser, FormParser, JSONParser]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return ClientProfile.objects.filter(user=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def create(self, request, *args, **kwargs):
        print("==== [DEBUG] RAW DATA RECEIVED ====")
        pprint.pprint(dict(request.data))
        print("==== [DEBUG] RAW FILES RECEIVED ====")
        pprint.pprint(dict(request.FILES))

        data = request.data.copy()

        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            print("==== [DEBUG] SERIALIZER ERRORS ====")
            pprint.pprint(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    @action(detail=False, methods=['get', 'put', 'patch'], url_path='me')
    def me(self, request):
        try:
            profile = self.get_queryset().get(user=request.user)
        except ClientProfile.DoesNotExist:
            return Response({"detail": "Profile not found."}, status=status.HTTP_404_NOT_FOUND)

        if request.method == 'GET':
            serializer = self.get_serializer(profile, context={'request': request})
            return Response(serializer.data, status=status.HTTP_200_OK)

        print("==== [DEBUG] RAW DATA RECEIVED ====")
        pprint.pprint(dict(request.data))
        print("==== [DEBUG] RAW FILES RECEIVED ====")
        pprint.pprint(dict(request.FILES))

        data = request.data.copy()

        # If you have any JSON fields, parse them here as above

        partial = request.method == 'PATCH'
        serializer = self.get_serializer(profile, data=data, partial=partial)
        if serializer.is_valid():
            serializer.save()
            refreshed_serializer = self.get_serializer(profile, context={'request': request})
            return Response(refreshed_serializer.data, status=status.HTTP_200_OK)

        print("==== [DEBUG] SERIALIZER ERRORS ====")
        pprint.pprint(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FreelancerBrowseViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint that allows freelancers to be viewed.
    Lists minimal data, detail returns full profile.
    """
    queryset = FreelancerProfile.objects.all().select_related('user').prefetch_related('skills', 'educations', 'experiences', 'languages', 'portfolios')

    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    pagination_class = StandardResultsSetPagination

    filterset_fields = ['location', 'skills__name', 'is_available']
    search_fields = ['first_name', 'last_name', 'user__username', 'about', 'skills__name']
    ordering_fields = ['created_at', 'updated_at']

    def get_serializer_class(self):
        if self.action == 'list':
            return FreelancerPublicMinimalSerializer
        return FreelancerPublicDetailSerializer

class ClientBrowseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = ClientProfile.objects.all()
    permission_classes = [AllowAny]  # or custom, if you want login to see

    def get_serializer_class(self):
        # List: minimal data; Retrieve: full data
        if self.action == 'list':
            return ClientPublicMinimalSerializer
        return ClientPublicDetailSerializer

    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    pagination_class = StandardResultsSetPagination
    search_fields = ['company_name', 'first_name', 'last_name', 'industry', 'company_description']
    filterset_fields = ['country', 'location', 'industry']  # Add others if needed.
    ordering_fields = ['created_at', 'company_name']
