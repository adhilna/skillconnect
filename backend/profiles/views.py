from rest_framework import viewsets, permissions, status
from rest_framework.permissions import IsAuthenticated
from .models import FreelancerProfile, ClientProfile
from .serializers import FreelancerProfileSerializer, ClientProfileSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.decorators import action
import json

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

class FreelancerProfileViewSet(viewsets.ModelViewSet):
    serializer_class = FreelancerProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        return FreelancerProfile.objects.filter(user=self.request.user)
    
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)
    
    def create(self, request, *args, **kwargs):
        try:
             # 1. Parse the JSON data
            data = json.loads(request.POST.get('data'))

            # 2. Attach profile picture if present
            if 'profile_picture' in request.FILES:
                data['profile_picture'] = request.FILES['profile_picture']

            # 3. Attach certificate files to educations and experiences
            for i, edu in enumerate(data.get('educations', [])):
                cert_key = f'education_certificate_{i}'
                if cert_key in request.FILES:
                    edu['certificate'] = request.FILES[cert_key]
                else:
                    edu['certificate'] = None 

            for i, exp in enumerate(data.get('experiences', [])):
                cert_key = f'experience_certificate_{i}'
                if cert_key in request.FILES:
                    exp['certificate'] = request.FILES[cert_key]
                else:
                    exp['certificate'] = None 

            # print("Data before serializer:", data)


            # 4. Use your serializer to create the profile and nested objects
            serializer = self.get_serializer(data=data)
            if not serializer.is_valid():
                print("Serializer errors:", serializer.errors)
                return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)

        
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

class ClientProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ClientProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return ClientProfile.objects.filter(user=self.request.user)
