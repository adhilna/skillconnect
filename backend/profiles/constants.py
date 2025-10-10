# constants.py
ALLOWED_INDUSTRIES = [
    'Technology', 'Healthcare', 'Finance', 'Education', 'E-commerce', 'Real Estate',
    'Marketing & Advertising', 'Manufacturing', 'Food & Beverage', 'Fashion',
    'Travel & Tourism', 'Non-profit', 'Entertainment', 'Consulting', 'Other'
]

ALLOWED_COMPANY_SIZES = [
    'Just me (1)', 'Small team (2-10)', 'Growing business (11-50)',
    'Medium company (51-200)', 'Large enterprise (200+)'
]

COUNTRIES = [
    # Asia
    "Afghanistan", "Armenia", "Azerbaijan", "Bahrain", "Bangladesh", "Bhutan", "Brunei",
    "Cambodia", "China", "Cyprus", "Georgia", "India", "Indonesia", "Iran", "Iraq", "Israel",
    "Japan", "Jordan", "Kazakhstan", "Kuwait", "Kyrgyzstan", "Laos", "Lebanon", "Malaysia",
    "Maldives", "Mongolia", "Myanmar (Burma)", "Nepal", "North Korea", "Oman", "Pakistan",
    "Palestine", "Philippines", "Qatar", "Saudi Arabia", "Singapore", "South Korea", "Sri Lanka",
    "Syria", "Tajikistan", "Thailand", "Timor-Leste", "Turkey", "Turkmenistan", "United Arab Emirates",
    "Uzbekistan", "Vietnam", "Yemen",

    # Europe
    "Albania", "Andorra", "Austria", "Belarus", "Belgium", "Bosnia and Herzegovina", "Bulgaria",
    "Croatia", "Czech Republic", "Denmark", "Estonia", "Finland", "France", "Germany", "Greece",
    "Hungary", "Iceland", "Ireland", "Italy", "Kosovo", "Latvia", "Liechtenstein", "Lithuania",
    "Luxembourg", "Malta", "Moldova", "Monaco", "Montenegro", "Netherlands", "North Macedonia",
    "Norway", "Poland", "Portugal", "Romania", "Russia", "San Marino", "Serbia", "Slovakia",
    "Slovenia", "Spain", "Sweden", "Switzerland", "Ukraine", "United Kingdom", "Vatican City",

    # Africa
    "Algeria", "Angola", "Benin", "Botswana", "Burkina Faso", "Burundi", "Cabo Verde", "Cameroon",
    "Central African Republic", "Chad", "Comoros", "Congo (Brazzaville)", "Congo (Kinshasa)", "Djibouti",
    "Egypt", "Equatorial Guinea", "Eritrea", "Eswatini", "Ethiopia", "Gabon", "Gambia", "Ghana", "Guinea",
    "Guinea-Bissau", "Ivory Coast", "Kenya", "Lesotho", "Liberia", "Libya", "Madagascar", "Malawi", "Mali",
    "Mauritania", "Mauritius", "Morocco", "Mozambique", "Namibia", "Niger", "Nigeria", "Rwanda", "São Tomé and Príncipe",
    "Senegal", "Seychelles", "Sierra Leone", "Somalia", "South Africa", "South Sudan", "Sudan", "Tanzania",
    "Togo", "Tunisia", "Uganda", "Zambia", "Zimbabwe",

    # North America
    "Antigua and Barbuda", "Bahamas", "Barbados", "Belize", "Canada", "Costa Rica", "Cuba", "Dominica",
    "Dominican Republic", "El Salvador", "Grenada", "Guatemala", "Haiti", "Honduras", "Jamaica", "Mexico",
    "Nicaragua", "Panama", "Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines",
    "Trinidad and Tobago", "United States",

    # South America
    "Argentina", "Bolivia", "Brazil", "Chile", "Colombia", "Ecuador", "Guyana", "Paraguay", "Peru",
    "Suriname", "Uruguay", "Venezuela",

    # Oceania
    "Australia", "Fiji", "Kiribati", "Marshall Islands", "Micronesia", "Nauru", "New Zealand", "Palau",
    "Papua New Guinea", "Samoa", "Solomon Islands", "Tonga", "Tuvalu", "Vanuatu"
]

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

  # United States
  "New York", "Los Angeles", "Chicago", "San Francisco", "Miami", "Houston", "Boston", "Seattle", "Las Vegas", "Washington D.C.",
  
  # United Kingdom
  "London", "Manchester", "Liverpool", "Birmingham", "Edinburgh", "Glasgow", "Oxford", "Cambridge",
  
  # France
  "Paris", "Marseille", "Lyon", "Nice", "Toulouse",
  
  # Germany
  "Berlin", "Munich", "Frankfurt", "Hamburg", "Cologne",
  
  # Italy
  "Rome", "Milan", "Venice", "Florence", "Naples",
  
  # Spain
  "Madrid", "Barcelona", "Seville", "Valencia", "Bilbao",
  
  # Canada
  "Toronto", "Vancouver", "Montreal", "Ottawa", "Calgary",
  
  # Australia
  "Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide",
  
  # Japan
  "Tokyo", "Osaka", "Kyoto", "Nagoya", "Sapporo",
  
  # China
  "Beijing", "Shanghai", "Guangzhou", "Shenzhen", "Hong Kong",
  
  # UAE
  "Dubai", "Abu Dhabi", "Sharjah",
  
  # Brazil
  "Rio de Janeiro", "São Paulo", "Brasília", "Salvador",
  
  # Russia
  "Moscow", "Saint Petersburg", "Novosibirsk",
  
  # South Korea
  "Seoul", "Busan", "Incheon",
  
  # Mexico
  "Mexico City", "Guadalajara", "Monterrey",
  
  # Egypt
  "Cairo", "Alexandria",
  
  # Turkey
  "Istanbul", "Ankara", "Izmir",
  
  # Thailand
  "Bangkok", "Chiang Mai",
  
  # Singapore
  "Singapore"
]
