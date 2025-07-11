from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from .models import FreelancerProfile, ClientProfile
from .serializers import FreelancerProfileSetupSerializer, ClientProfileSetupSerializer
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
import json
import pprint
from rest_framework.parsers import MultiPartParser, FormParser

CITIES = [
    # Andhra Pradesh (20 cities)
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kadapa", "Anantapur",
    "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur", "Srikakulam", "Guntakal",

    # Arunachal Pradesh (8 cities)
    "Itanagar", "Naharlagun", "Pasighat", "Tawang", "Ziro", "Bomdila", "Along", "Tezu",

    # Assam (15 cities)
    "Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon", "Tinsukia", "Bongaigaon", "Karimganj",
    "Goalpara", "Barpeta", "Lakhimpur", "Hailakandi", "Sivasagar", "Dhubri",

    # Bihar (25 cities)
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah", "Bihar Sharif", "Katihar",
    "Begusarai", "Chapra", "Hajipur", "Samastipur", "Motihari", "Siwan", "Bettiah", "Aurangabad", "Sasaram",
    "Dehri", "Madhubani", "Saharsa", "Kishanganj", "Jamui", "Buxar", "Jehanabad",

    # Chhattisgarh (15 cities)
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Jagdalpur", "Rajnandgaon", "Ambikapur", "Raigarh",
    "Dhamtari", "Mahasamund", "Janjgir", "Kanker", "Kawardha", "Bastar",

    # Goa (8 cities)
    "Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda", "Bicholim", "Curchorem", "Quepem",

    # Gujarat (25 cities)
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand",
    "Mehsana", "Nadiad", "Bharuch", "Porbandar", "Navsari", "Veraval", "Patan", "Morbi", "Surendranagar",
    "Gandhidham", "Vapi", "Ankleshwar", "Botad", "Palanpur", "Deesa", "Jetpur",

    # Haryana (20 cities)
    "Faridabad", "Gurgaon", "Panipat", "Hisar", "Rohtak", "Karnal", "Sonipat", "Yamunanagar", "Ambala",
    "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal", "Panchkula",
    "Fatehabad", "Hansi",

    # Himachal Pradesh (10 cities)
    "Shimla", "Mandi", "Solan", "Dharamshala", "Kullu", "Una", "Hamirpur", "Bilaspur", "Chamba", "Nahan",

    # Jharkhand (15 cities)
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Deoghar", "Giridih", "Ramgarh",
    "Phusro", "Medininagar", "Chaibasa", "Koderma", "Gumla", "Sahibganj", "Jhumri Telaiya",

    # Karnataka (25 cities)
    "Bangalore", "Mysuru", "Hubli", "Mangalore", "Belgaum", "Davanagere", "Ballari", "Shivamogga", "Tumakuru",
    "Bijapur", "Hospet", "Hassan", "Raichur", "Udupi", "Chitradurga", "Kolar", "Mandya", "Bagalkot", "Karwar",
    "Sirsi", "Gadag", "Chikkamagaluru", "Bidar", "Haveri", "Koppal",

    # Kerala (30 cities)
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha", "Kannur",
    "Kottayam", "Manjeri", "Thalassery", "Nedumangad", "Ponnani", "Pathanamthitta", "Malappuram",
    "Kasaragod", "Payyanur", "Aluva", "Muvattupuzha", "Perinthalmanna", "Tirur", "Koyilandy", "Irinjalakuda",
    "Changanassery", "Kanhangad", "Ottapalam", "Chalakudy", "Kodungallur", "Attingal", "Pala",  # Added

    # Madhya Pradesh (25 cities)
    "Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Ratlam", "Satna", "Rewa",
    "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha",
    "Chhatarpur", "Damoh", "Mandsaur", "Neemuch", "Hoshangabad", "Itarsi",

    # Maharashtra (25 cities)
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur", "Amravati",
    "Navi Mumbai", "Akola", "Dhule", "Jalgaon", "Nanded", "Sangli", "Malegaon", "Latur", "Ahmednagar",
    "Chandrapur", "Parbhani", "Jalna", "Bhiwandi", "Panvel", "Ulhasnagar", "Ichalkaranji",

    # Manipur (8 cities)
    "Imphal", "Thoubal", "Bishnupur", "Churachandpur", "Kakching", "Moreh", "Ukhrul", "Senapati",

    # Meghalaya (8 cities)
    "Shillong", "Tura", "Nongstoin", "Jowai", "Williamnagar", "Baghmara", "Resubelpara", "Nongpoh",

    # Mizoram (8 cities)
    "Aizawl", "Lunglei", "Champhai", "Saiha", "Kolasib", "Serchhip", "Lawngtlai", "Mamit",

    # Nagaland (8 cities)
    "Kohima", "Dimapur", "Mokokchung", "Wokha", "Tuensang", "Zunheboto", "Phek", "Mon",

    # Odisha (15 cities)
    "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur", "Puri", "Balasore", "Bhadrak",
    "Baripada", "Jeypore", "Jharsuguda", "Rayagada", "Angul", "Dhenkanal", "Paradip",

    # Punjab (15 cities)
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali", "Hoshiarpur", "Moga",
    "Firozpur", "Khanna", "Abohar", "Phagwara", "Barnala", "Sangrur", "Kapurthala",

    # Rajasthan (20 cities)
    "Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Bikaner", "Kota", "Alwar", "Sikar", "Bharatpur",
    "Pali", "Sriganganagar", "Hanumangarh", "Churu", "Dausa", "Nagaur", "Barmer", "Jhunjhunu",
    "Bhilwara", "Tonk", "Sawai Madhopur",

    # Sikkim (5 cities)
    "Gangtok", "Namchi", "Gyalshing", "Singtam", "Jorethang",

    # Tamil Nadu (30 cities)
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Vellore", "Thanjavur",
    "Tirunelveli", "Dindigul", "Cuddalore", "Kanchipuram", "Tiruvannamalai", "Hosur", "Nagercoil",
    "Kumbakonam", "Karur", "Pollachi", "Rajapalayam", "Sivakasi", "Pudukkottai", "Namakkal",
    "Dharmapuri", "Krishnagiri", "Perambalur", "Nagapattinam", "Virudhunagar", "Tenkasi", "Theni",
    "Ramanathapuram",

    # Telangana (15 cities)
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar", "Ramagundam", "Mahbubnagar",
    "Siddipet", "Suryapet", "Miryalaguda", "Jagtial", "Kothagudem", "Adilabad", "Mancherial", "Sangareddy",

    # Tripura (8 cities)
    "Agartala", "Udaipur", "Dharmanagar", "Kailasahar", "Ambassa", "Khowai", "Belonia", "Teliamura",  # Corrected

    # Uttar Pradesh (25 cities)
    "Lucknow", "Kanpur", "Agra", "Varanasi", "Allahabad", "Meerut", "Bareilly", "Aligarh",
    "Ghaziabad", "Noida", "Moradabad", "Saharanpur", "Gorakhpur", "Faizabad", "Jhansi",
    "Muzaffarnagar", "Mathura", "Shahjahanpur", "Rampur", "Sitapur", "Hapur", "Etah",
    "Budaun", "Bulandshahr", "Firozabad",

    # Uttarakhand (10 cities)
    "Dehradun", "Haridwar", "Nainital", "Rishikesh", "Haldwani", "Rudrapur", "Kashipur",
    "Roorkee", "Pithoragarh", "Ramnagar",

    # West Bengal (20 cities)
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman", "Jalpaiguri",
    "Kharagpur", "Haldia", "Berhampore", "Krishnanagar", "Purulia", "Raiganj", "Balurghat",
    "Basirhat", "Bankura", "Chakdaha", "Darjeeling", "Alipurduar",

    # Andaman and Nicobar Islands (5 cities)
    "Port Blair", "Diglipur", "Rangat", "Mayabunder", "Bambooflat",

    # Chandigarh (1 city)
    "Chandigarh",

    # Dadra and Nagar Haveli and Daman and Diu (5 cities)
    "Daman", "Diu", "Silvassa", "Dadra", "Nani Daman",

    # Delhi (2 cities)
    "New Delhi", "Delhi",

    # Jammu and Kashmir (10 cities)
    "Srinagar", "Jammu", "Anantnag", "Baramulla", "Sopore", "Kathua", "Udhampur",
    "Bandipora", "Kupwara", "Pulwama",

    # Ladakh (3 cities)
    "Leh", "Kargil", "Nubra",

    # Puducherry (5 cities)
    "Puducherry", "Karaikal", "Yanam", "Mahe", "Oulgaret",

    # Lakshadweep (3 cities)
    "Kavaratti", "Minicoy", "Andrott",
]

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
    parser_classes = [MultiPartParser, FormParser]

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

        data = request.data.copy()
        json_fields = [
            'skills_input', 'educations_input', 'experiences_input', 'languages_input',
            'portfolios_input', 'social_links_input', 'verification_input'
        ]

        # Extract FormData safely
        parsed_data = {}
        for key in data:
            val = data.getlist(key) if isinstance(data.getlist(key), list) and len(data.getlist(key)) > 1 else data.get(key)
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

        data = request.data.copy()
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
    parser_classes = [MultiPartParser, FormParser]

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

        # If you have any JSON fields, parse them here (for now, assuming none)
        # Example: if you add a JSON field in future, parse as below:
        # for field in ['project_types', 'business_goals', ...]:
        #     if field in data and isinstance(data[field], str):
        #         try:
        #             data[field] = json.loads(data[field])
        #         except Exception as e:
        #             print(f"[DEBUG] JSON parse error in {field}: {e}")
        #             data[field] = []

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