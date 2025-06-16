from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from rest_framework import permissions
from .models import FreelancerProfile, ClientProfile
from .serializers import FreelancerProfileSerializer, ClientProfileSerializer
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view
from rest_framework.response import Response

CITIES = [
    # Andhra Pradesh (20 cities)
    "Visakhapatnam", "Vijayawada", "Guntur", "Nellore", "Tirupati", "Kurnool", "Rajahmundry", "Kadapa", "Anantapur",
    "Eluru", "Ongole", "Nandyal", "Machilipatnam", "Adoni", "Tenali", "Proddatur", "Chittoor", "Hindupur", "Srikakulam", "Guntakal",  # Added

    # Arunachal Pradesh (8 cities)
    "Itanagar", "Naharlagun", "Pasighat", "Tawang",
    "Ziro", "Bomdila", "Along", "Tezu",  # Added

    # Assam (15 cities)
    "Guwahati", "Dibrugarh", "Silchar", "Jorhat", "Tezpur", "Nagaon",
    "Tinsukia", "Bongaigaon", "Karimganj", "Goalpara", "Barpeta", "Lakhimpur", "Hailakandi", "Sivasagar", "Dhubri",  # Added

    # Bihar (25 cities)
    "Patna", "Gaya", "Bhagalpur", "Muzaffarpur", "Darbhanga", "Purnia", "Arrah",
    "Bihar Sharif", "Katihar", "Begusarai", "Chapra", "Hajipur", "Samastipur", "Motihari", "Siwan", "Bettiah", "Aurangabad", "Sasaram", "Dehri", "Madhubani", "Saharsa", "Kishanganj", "Jamui", "Buxar", "Jehanabad",  # Added

    # Chhattisgarh (15 cities)
    "Raipur", "Bhilai", "Bilaspur", "Korba", "Durg", "Jagdalpur",
    "Rajnandgaon", "Ambikapur", "Raigarh", "Dhamtari", "Mahasamund", "Janjgir", "Kanker", "Kawardha", "Bastar",  # Added

    # Goa (8 cities)
    "Panaji", "Vasco da Gama", "Margao", "Mapusa", "Ponda",
    "Bicholim", "Curchorem", "Quepem",  # Added

    # Gujarat (25 cities)
    "Ahmedabad", "Surat", "Vadodara", "Rajkot", "Gandhinagar", "Bhavnagar", "Jamnagar", "Junagadh", "Anand",
    "Mehsana", "Nadiad", "Bharuch", "Porbandar", "Navsari", "Veraval", "Patan", "Morbi", "Surendranagar", "Gandhidham", "Vapi", "Ankleshwar", "Botad", "Palanpur", "Deesa", "Jetpur",  # Added

    # Haryana (20 cities)
    "Faridabad", "Gurgaon", "Panipat", "Hisar", "Rohtak", "Karnal", "Sonipat",
    "Yamunanagar", "Ambala", "Bhiwani", "Sirsa", "Bahadurgarh", "Jind", "Thanesar", "Kaithal", "Rewari", "Palwal", "Panchkula", "Fatehabad", "Hansi",  # Added

    # Himachal Pradesh (10 cities)
    "Shimla", "Mandi", "Solan", "Dharamshala", "Kullu", "Una",
    "Hamirpur", "Bilaspur", "Chamba", "Nahan",  # Added

    # Jharkhand (15 cities)
    "Ranchi", "Jamshedpur", "Dhanbad", "Bokaro Steel City", "Hazaribagh", "Deoghar",
    "Giridih", "Ramgarh", "Phusro", "Medininagar", "Chaibasa", "Koderma", "Gumla", "Sahibganj", "Jhumri Telaiya",  # Added

    # Karnataka (25 cities)
    "Bangalore", "Mysuru", "Hubli", "Mangalore", "Belgaum", "Davanagere", "Ballari", "Shivamogga", "Tumakuru",
    "Bijapur", "Hospet", "Hassan", "Raichur", "Udupi", "Chitradurga", "Kolar", "Mandya", "Bagalkot", "Karwar", "Sirsi", "Gadag", "Chikkamagaluru", "Bidar", "Haveri", "Koppal",  # Added

    # Kerala (15 cities)
    "Thiruvananthapuram", "Kochi", "Kozhikode", "Thrissur", "Kollam", "Palakkad", "Alappuzha",
    "Kannur", "Kottayam", "Manjeri", "Thalassery", "Nedumangad", "Ponnani", "Pathanamthitta", "Malappuram",  # Added

    # Madhya Pradesh (25 cities)
    "Indore", "Bhopal", "Gwalior", "Jabalpur", "Ujjain", "Sagar", "Dewas", "Ratlam",
    "Satna", "Rewa", "Katni", "Singrauli", "Burhanpur", "Khandwa", "Bhind", "Chhindwara", "Guna", "Shivpuri", "Vidisha", "Chhatarpur", "Damoh", "Mandsaur", "Neemuch", "Hoshangabad", "Itarsi",  # Added

    # Maharashtra (30 cities)
    "Mumbai", "Pune", "Nagpur", "Nashik", "Aurangabad", "Thane", "Kolhapur", "Solapur", "Amravati",
    "Navi Mumbai", "Akola", "Dhule", "Jalgaon", "Nanded", "Sangli", "Malegaon", "Latur", "Ahmednagar", "Chandrapur", "Parbhani", "Jalna", "Bhiwandi", "Panvel", "Ulhasnagar", "Ichalkaranji", "Wardha", "Yavatmal", "Satara", "Gondia", "Beed",  # Added

    # Manipur (8 cities)
    "Imphal", "Thoubal", "Bishnupur",
    "Churachandpur", "Kakching", "Moreh", "Ukhrul", "Senapati",  # Added

    # Meghalaya (8 cities)
    "Shillong", "Tura", "Nongstoin",
    "Jowai", "Williamnagar", "Baghmara", "Resubelpara", "Nongpoh",  # Added

    # Mizoram (8 cities)
    "Aizawl", "Lunglei", "Champhai",
    "Saiha", "Kolasib", "Serchhip", "Lawngtlai", "Mamit",  # Added

    # Nagaland (8 cities)
    "Kohima", "Dimapur", "Mokokchung", "Wokha",
    "Tuensang", "Zunheboto", "Phek", "Mon",  # Added

    # Odisha (15 cities)
    "Bhubaneswar", "Cuttack", "Rourkela", "Sambalpur", "Berhampur", "Puri",
    "Balasore", "Bhadrak", "Baripada", "Jeypore", "Jharsuguda", "Rayagada", "Angul", "Dhenkanal", "Paradip",  # Added

    # Punjab (15 cities)
    "Amritsar", "Ludhiana", "Jalandhar", "Patiala", "Bathinda", "Mohali",
    "Hoshiarpur", "Moga", "Firozpur", "Khanna", "Abohar", "Phagwara", "Barnala", "Sangrur", "Kapurthala",  # Added

    # Rajasthan (20 cities)
    "Jaipur", "Jodhpur", "Udaipur", "Ajmer", "Bikaner", "Kota",
    "Alwar", "Sikar", "Bharatpur", "Pali", "Sriganganagar", "Hanumangarh", "Churu", "Dausa", "Nagaur", "Barmer", "Jhunjhunu", "Bhilwara", "Tonk", "Sawai Madhopur",  # Added

    # Sikkim (5 cities)
    "Gangtok", "Namchi", "Gyalshing",
    "Singtam", "Jorethang",  # Added

    # Tamil Nadu (30 cities)
    "Chennai", "Coimbatore", "Madurai", "Tiruchirappalli", "Salem", "Erode", "Vellore", "Thanjavur",
    "Tirunelveli", "8", "Dindigul", "Cuddalore", "Kanchipuram", "Tiruvannamalai", "Hosur", "Nagercoil", "Kumbakonam", "Karur", "Pollachi", "Rajapalayam", "Sivakasi", "Pudukkotta", "Namakkal", "Dharmapuri", "Krishnagiri", "Perambalur", "Nagapattinam", "Virudhunagar", "Tenkasi", "Theni",  # Added

    # Telangana (15 cities)
    "Hyderabad", "Warangal", "Nizamabad", "Khammam", "Karimnagar",
    "Ramagundam", "Mahbubnagar", "Siddipet", "Suryapet", "Miryalaguda", "Jagtial", "Kothagudem", "Adilabad", "Mancherial", "Sangareddy",  # Added

    # Tripura (8 cities)
    "Agartala", "Udaipur", "Dharman",
",
    "Kailas",
 "K",
    "Ambassa",
 "Khow",
    "Belonia",
 "Telonia",  # Added

    # Uttar Pradesh (40 cities)
    "Lucknow", "Kanpur", "Agra", "Varanasi",
 "Allahabad", "Meerut", "Bareilly", "Aligarh",
    "Ghaziabad", "Noida", "Moradabad", "Saharanpur",
    "Gorakhpur", "Faihazabad", "Jhansi", "Muzaffarnagar", "Mathura", "Shahjahanpur", "Rampur", "Sitapur", "Hapur", "Etah", "Budaun", "Bulandshahr", "Firozabad", "Basti", "Deoria", "Sultanpur", "Azamgarh", "Banda", "Jaunpur", "Mirzapur", "Raebareli", "Ball",ia", "Mauz", "Ambed",karn,agar", "n",
", "Hathra",
    "s",
    #Hat Addedra added

    # Uttar Pradesh continued
    "Amroha",
 "Sambhal",
    # AddedS

    # Himachal Pradesh continued
    "Paonta Sahib",
    # Added

    # West Bengal (20 cities)
    "Kolkata", "Howrah", "Durgapur", "Asansol", "Siliguri", "Malda", "Bardhaman",
    "Jalpaiguri", "Kharagpur", "Haldia", "Berhampore", "Krishnanagar", "Purulia", "Raiganj", "Balurghat", "Basirhat", "Bankura", "Chakdaha", "Darjeeling", "Alipurduar",  # Added

    # Andaman and Nicobar Islands (5 cities)
    "Port Blair", "Diglipur", "Rangat",
    "Mayabunder", "Bambooflat",  # Added

    # Chandigarh (1 city)
    "Chandigarh",

    # Dadra and Nagar Haveli and Daman and Diu (5 cities)
    "Daman", "Diu", "Silvassa",
    "Dadra", "Nani Daman",  # Added

    # Delhi (2 cities)
    "New Delhi", "Delhi",

    # Jammu and Kashmir (10 cities)
    "Srinagar", "Jammu", "Anantnag", "Baramulla",
    "Sopore", "Kathua", "Udhampur", "Bandipora", "Kupwara", "Pulwama",  # Added

    # Ladakh (3 cities)
    "Leh", "Kargil",
    "Nubra",  # Added

    # Puducherry (5 cities)
    "Puducherry", "Karaikal", "Yanam",
    "Mahe", "Oulgaret",  # Added

    # Lakshadweep (3 cities)
    "Kavaratti", "Minicoy", "Andrott",
]

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

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return FreelancerProfile.objects.filter(user=self.request.user)

class ClientProfileViewSet(viewsets.ModelViewSet):
    serializer_class = ClientProfileSerializer
    permission_classes = [IsAuthenticated, IsOwnerOrReadOnly]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def get_queryset(self):
        return ClientProfile.objects.filter(user=self.request.user)
