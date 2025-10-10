# Users API (SkillConnect)

**Base URL:** `/api/v1/users/`

## Endpoints

---

### **1. Register User**

**POST /register/**
Register a new user (CLIENT or FREELANCER). Sends OTP to email.
_Request:_ `{"email": "user@example.com","password": "Password123","role": "CLIENT" // or "FREELANCER"}`
_Response (201):_`{"message": "OTP sent to your email. Please verify to complete registration."}`
_Error (400):_`{"email": ["This email is already registered."],"password": ["Password must be at least 8 characters long."]}`

---

### **2. Login**

**POST /login/**
Authenticate and obtain tokens.
_Request:_`{"email": "user@example.com","password": "Password123"}`
_Response (200):_`{"refresh": "<refresh_token>","access": "<access_token>","user": {"id": 1,"email": "user@example.com","role": "CLIENT","first_login": true}}`
_Error (400):_`{"non_field_errors": ["Invalid email or password"]}`

---

### **3. View Profile**

**GET /profile/**
Get current authenticated user profile.  
_Authorization:_ Bearer token required  
_Response:_`{"id": 1,"email": "user@example.com","role": "FREELANCER","first_login": false}`

---

### **4. Update Profile**

**PUT/PATCH /update/**
Update profile fields (non-email/role).
_Request Example:_`{"first_login": false}`
_Response:_`{"id": 1,"email": "user@example.com","role": "CLIENT","first_login": false}`

_Note: email and role are read-only for update._

---

### **5. Email/OTP Verification**

#### a. Verify OTP

**POST /verify-otp/**
Complete registration by verifying email OTP.
_Request:_`{ "email": "user@example.com", "otp": "123456" }`
_Response (200):_`{"message": "Email verified successfully.","refresh": "<refresh_token>","access": "<access_token>","user": {"id": 1, "email": "user@example.com", "role": "CLIENT", "first_login": true}}`
_Error (400):_`{ "otp": ["Invalid OTP."] }`

#### b. Resend OTP

**POST /resend-otp/**
Resends OTP for registration verification.
_Request:_`{ "email": "user@example.com" }`
_Response (200):_`{ "message": "New OTP sent to your email." }`
_Error (400):_`{ "email": ["User with this email does not exist."] }`
_Error (400, already verified):_`{ "error": "Email already verified." }`

---

### **6. Forgot Password**

#### a. Request OTP

**POST /forgot-password/request/**
_Request:_`{ "email": "user@example.com" }`
_Response (200):_`{ "detail": "OTP sent to email" }`
_Error (400):_`{ "email": ["No user is registered with this email."] }`

#### b. Verify OTP

**POST /forgot-password/verify/**
_Request:_`{ "email": "user@example.com", "otp": "123456" }`
_Response (200):_`{ "detail": "OTP is valid" }`
_Error (400):_`{ "otp": ["Invalid OTP."] }`

#### c. Reset Password

**POST /forgot-password/reset/**
_Request:_`{"email": "user@example.com","otp": "123456","new_password": "NewPassword456"}`
_Response (200):_`{ "detail": "Password reset successfully" }`
_Error (400):_`{ "otp": ["OTP has expired."] }`

---

### **7. Google OAuth Login**

**POST /google/**
_Request:_`{"token": "<GOOGLE_OAUTH_ID_TOKEN>","role": "CLIENT"}`
// If user is new, role is required.
_Response (existing user, 200):_`{"access": "<access_token>","refresh": "<refresh_token>","user": { "id": 10, "email": "user@domain.com", "role": "CLIENT" }}`
_Response (new user, needs role, 200):_`{ "need_role": true }`
_Error (400):_`{ "detail": "Invalid Google token" }`

## Profiles API (SkillConnect)

**Base URL:** `/api/v1/profiles/`

---

## Profile Endpoints

### 1. City Autocomplete

`GET /city-autocomplete/`
> **Description:** Search Indian cities by query string for location selection.

**Query Parameters:**

- `q` : Search string (e.g., `?q=mum`)
- **Authorization:** Not required

**Response (200):** `[{"id": 0, "name": "Mumbai"},{"id": 1, "name": "Mumfordganj"},{"id": 2, "name": "Muvattupuzha"}]`
**Response (empty query):** []

---

## Freelancer Profile Endpoints

### 2. Create Freelancer Profile

`POST /freelancer/profile-setup/`
> **Description:** Create a new freelancer profile (one per user).

- **Authorization:** Bearer token required
- **Content-Type:** `multipart/form-data` or `application/json`

**Request Example:** `{
"first_name": "John",
"last_name": "Doe",
"about": "Full-stack developer with 5 years experience",
"age": 28,
"country": "India",
"location": "Mumbai",
"is_available": true,
"profile_picture": "<file>",
"skills_input": [
{"name": "Python"},
{"name": "Django"}
],
"educations_input": [
{
"college": "MIT",
"degree": "B.Tech Computer Science",
"start_year": 2015,
"end_year": 2019
}
],
"experiences_input": [
{
"role": "Senior Developer",
"company": "Tech Corp",
"start_date": "2020-01-15",
"end_date": "2023-06-30",
"description": "Led backend development",
"ongoing": false
}
],
"languages_input": [
{"name": "English", "proficiency": "Native"},
{"name": "Hindi", "proficiency": "Fluent"}
],
"portfolios_input": [
{
"title": "E-commerce Platform",
"description": "Built scalable marketplace",
"project_link": "https://github.com/johndoe/ecommerce"
}
],
"social_links_input": {
"github_url": "https://github.com/johndoe",
"linkedin_url": "https://linkedin.com/in/johndoe",
"twitter_url": null,
"facebook_url": null,
"instagram_url": null
},
"verification_input": {
"email_verified": true,
"phone_verified": false,
"id_verified": false,
"video_verified": false
}}`

**Note:** For file uploads (certificates), use keys: `education_certificate_0`, `education_certificate_1`, `experience_certificate_0`, etc.

**Response (201):** `{
"id": 1,
"user": 5,
"first_name": "John",
"last_name": "Doe",
"profile_picture": "/media/profiles/john_pic.jpg",
"about": "Full-stack developer with 5 years experience",
"age": 28,
"country": "India",
"location": "Mumbai",
"is_available": true,
"created_at": "2025-10-10T10:30:00Z",
"updated_at": "2025-10-10T10:30:00Z",
"skills_output": [
{"id": 1, "name": "Python"},
{"id": 2, "name": "Django"}
],
"educations_output": [
{
"id": 1,
"college": "MIT",
"degree": "B.Tech Computer Science",
"start_year": 2015,
"end_year": 2019,
"certificate": null
}
],
"experiences_output": [
{
"id": 1,
"role": "Senior Developer",
"company": "Tech Corp",
"start_date": "2020-01-15",
"end_date": "2023-06-30",
"description": "Led backend development",
"ongoing": false,
"certificate": null
}
],
"languages_output": [
{"id": 1, "name": "English", "proficiency": "Native"},
{"id": 2, "name": "Hindi", "proficiency": "Fluent"}
],
"portfolios_output": [
{
"id": 1,
"title": "E-commerce Platform",
"description": "Built scalable marketplace",
"project_link": "https://github.com/johndoe/ecommerce"
}
],
"social_links_output": {
"github_url": "https://github.com/johndoe",
"linkedin_url": "https://linkedin.com/in/johndoe",
"twitter_url": null,
"facebook_url": null,
"instagram_url": null
},
"verification_output": {
"email_verified": true,
"phone_verified": false,
"id_verified": false,
"video_verified": false
}
}`

**Error (400):** `{
"non_field_errors": ["Profile already exists for this user"]
}`

---

### 3. Get Own Freelancer Profile

`GET /freelancer/profile-setup/me/`
> **Description:** Retrieve the authenticated user's freelancer profile.

- **Authorization:** Bearer token required

**Response (200):** (Same structure as above)

**Error (404):** `{
"detail": "Profile not found."
}`

---

### 4. Update Own Freelancer Profile (Full)

`PUT /freelancer/profile-setup/me/`
> **Description:** Fully update the authenticated user's freelancer profile.

**Request:** Same as POST (all fields)

**Response (200):** (Updated profile structure)

**Error (400):**`{
"skills_input": ["This field is required."]
}`

---

### 5. Update Own Freelancer Profile (Partial)

`PATCH /freelancer/profile-setup/me/`
> **Description:** Partially update the authenticated user's freelancer profile.

**Request Example:** `{
"about": "Updated bio with new skills",
"is_available": false,
"skills_input": [
{"name": "React"},
{"name": "Node.js"}
]
}`

**Response (200):** (Updated profile structure)

---

### 6. Browse Freelancers (List)

`GET /freelancers/browse/`
> **Description:** Browse all freelancer profiles (filter, search, paginate).

**Query Parameters:**

- `search` - keyword
- `location` - (city)
- `skills__name` - skill name
- `is_available` - true/false
- `ordering` - created_at/-created_at
- `page` - number
- `page_size` - number

**Response (200):** `{
"count": 150,
"next": "http://api.example.com/api/v1/profiles/freelancers/browse/?page=2",
"previous": null,
"results": [
{
"id": 1,
"name": "John Doe",
"title": "Senior Developer",
"location": "Mumbai",
"rating": 0,
"review_count": 0,
"is_available": true,
"skills": [
{"id": 1, "name": "Python"},
{"id": 2, "name": "Django"}
],
"profile_picture": "/media/profiles/john_pic.jpg",
"about": "Full-stack developer with 5 years experience"
}
]
}`

---

### 7. View Freelancer Profile Details

`GET /freelancers/browse/{id}/`
> **Description:** Get detailed public profile of a specific freelancer.

**Response (200):** (Full public profile output)

**Error (404):** `{
"detail": "Not found."
}`

---

## Client Profile Endpoints

### 8. Create Client Profile

`POST /client/profile-setup/`
> **Description:** Create a new client profile (one per user).

- **Authorization:** Bearer token required
- **Content-Type:** `multipart/form-data` or `application/json`

**Request Example:**`{
"account_type": "business",
"first_name": "Jane",
"last_name": "Smith",
"company_name": "TechStart Inc",
"profile_picture": "<file>",
"company_description": "We build innovative software solutions",
"country": "India",
"location": "Bangalore",
"industry": "Technology",
"company_size": "10-50",
"website": "https://techstart.com",
"project_types": "Web Development, Mobile Apps",
"budget_range": "$10,000 - $50,000",
"project_frequency": "Monthly",
"preferred_communications": "Email, Slack",
"working_hours": "9 AM - 6 PM IST",
"business_goals": "Scale our platform to 10k users",
"current_challenges": "Need faster development cycles",
"previous_experiences": "Worked with 5 freelancers before",
"expected_timeline": "3-6 months",
"quality_importance": "High",
"payment_method": "Bank Transfer",
"monthly_budget": 50000,
"project_budget": 200000,
"payment_timing": "Milestone-based"
}`

**Response (201):** `{
"id": 1,
"user": 10,
"account_type": "business",
"first_name": "Jane",
"last_name": "Smith",
"company_name": "TechStart Inc",
"profile_picture": "/media/profiles/jane_pic.jpg",
"company_description": "We build innovative software solutions",
"country": "India",
"location": "Bangalore",
"industry": "Technology",
"company_size": "10-50",
"website": "https://techstart.com",
"project_types": "Web Development, Mobile Apps",
"budget_range": "$10,000 - $50,000",
"project_frequency": "Monthly",
"preferred_communications": "Email, Slack",
"working_hours": "9 AM - 6 PM IST",
"business_goals": "Scale our platform to 10k users",
"current_challenges": "Need faster development cycles",
"previous_experiences": "Worked with 5 freelancers before",
"expected_timeline": "3-6 months",
"quality_importance": "High",
"payment_method": "Bank Transfer",
"monthly_budget": 50000,
"project_budget": 200000,
"payment_timing": "Milestone-based",
"created_at": "2025-10-10T11:00:00Z",
"updated_at": "2025-10-10T11:00:00Z"
}`

**Error (400):**`{
"company_name": ["Company name is required for business accounts."]
}`
**Error (400, duplicate):** `{
"non_field_errors": ["Profile already exists for this user"]
}`

---

### 9. Get Own Client Profile

`GET /client/profile-setup/me/`
> **Description:** Retrieve the authenticated user's client profile.

**Response (200):** (Same structure as above)

**Error (404):** `{
"detail": "Profile not found."
}`

---

### 10. Update Own Client Profile (Full)

`PUT /client/profile-setup/me/`
> **Description:** Fully update the authenticated user's client profile.

**Request:** Same as POST (all fields)

**Response (200):** (Updated profile structure)

---

### 11. Update Own Client Profile (Partial)

`PATCH /client/profile-setup/me/`
> **Description:** Partially update the authenticated user's client profile.

**Request Example:** `{
"company_description": "Updated description",
"monthly_budget": 75000
}`

**Response (200):** (Updated profile structure)

---

### 12. Browse Clients (List)

`GET /clients/browse/`
> **Description:** Browse all client profiles (filter, search, paginate).

**Query Parameters:**

- `search` - keyword
- `country` - (country)
- `location` - (city)
- `industry` - (industry)
- `ordering` - created_at/-created_at/company_name
- `page` - number
- `page_size` - number

**Response (200):** `{
"count": 75,
"next": "http://api.example.com/api/v1/profiles/clients/browse/?page=2",
"previous": null,
"results": [
{
"id": 1,
"name": "Jane Smith",
"account_type": "business",
"company_name": "TechStart Inc",
"profile_picture": "/media/profiles/jane_pic.jpg",
"company_description": "We build innovative software solutions",
"country": "India",
"location": "Bangalore",
"industry": "Technology"
}]}`

---

### 13. View Client Profile Details

`GET /clients/browse/{id}/`
> **Description:** Get detailed public profile of a specific client.

**Response (200):** (Full public profile output)

**Error (404):** `{
"detail": "Not found."
}`

---

## Notes

- All endpoints returning profiles include read-only fields: `id`, `user`, `created_at`, `updated_at`
- File uploads for `profile_picture` and certificates must use `multipart/form-data` content type
- Education and experience certificates are uploaded using indexed field names: `education_certificate_0`, `experience_certificate_0`, etc.
- Skills are managed via Many-to-Many relationship; duplicates are automatically handled
- Social links and verification are stored on the User model (OneToOne relationships)
- Nested arrays (`skills`, `educations`, `experiences`, `languages`, `portfolios`) use `_input` suffix for write operations and `_output` suffix for read operations
- Profile updates (PUT/PATCH on `/me/`) replace all nested arrays; include all items to preserve existing data
- Browse endpoints support Django Filter Backend with multiple filter and search options
- Default pagination returns 6 results per page (configurable in `StandardResultsSetPagination`)

## Gigs API (SkillConnect)

**Base URL:** `/api/v1/gigs/`

---

## Gigs Endpoints

---

## 1. Service (Gig) Endpoints

---

### 1.1 Create Service

`POST /services/`
> **Description:** Create a new service/gig (freelancer only).

- **Authorization:** Bearer token required
- **Content-Type:** `multipart/form-data` or `application/json`

**Request Example:** `{
"title": "Website Design",
"description": "Beautiful portfolio website built with React & Django.",
"category_id": 2,
"skills_input": [
{"name": "React"},
{"name": "Django"}
],
"price": 25000,
"delivery_time": 10,
"revisions": 3,
"image": "<file>",
"is_featured": false,
"is_active": true
}`

**Response (201):** `{
"id": 12,
"title": "Website Design",
"description": "Beautiful portfolio website built with React & Django.",
"category": {
"id": 2,
"name": "Web Development"
},
"skills_output": [
{"id": 3, "name": "React"},
{"id": 4, "name": "Django"}
],
"freelancer": {...},
"price": 25000,
"delivery_time": 10,
"revisions": 3,
"image": "/media/services/web_design.jpg",
"is_featured": false,
"is_active": true,
"created_at": "2025-10-10T11:06:00Z",
"updated_at": "2025-10-10T11:06:00Z"
}`
**Error (400):**`{
"skills_input": ["Invalid skills format."]
}`

---

### 1.2 Get Own Services (List)

`GET /services/`
> **Description:** List all services created by authenticated freelancer.

- **Authorization:** Bearer token required

**Response (200):**`[
{...}, {...}
]`

---

### 1.3 Update Service (Full/Partial)

`PUT/PATCH /services/{id}/`
> **Description:** Update an existing service. (Partial update allowed)

- **Authorization:** Bearer token required
- **Content-Type:** `multipart/form-data` or `application/json`

**Request Example:** `{
"title": "Updated Website Design",
"skills_input": [
{"name": "Next.js"}
]}`

**Response (200):**`{
"id": 12,
"title": "Updated Website Design",
...
}`

---

### 1.4 Delete Service

`DELETE /services/{id}/`
> **Description:** Delete a service (by freelancer).

- **Authorization:** Bearer token required

**Response (204):** Service deleted

---

## 2. Explore Services (Public Browse)

---

`GET /explore-services/`
> **Description:** List/publicly browse all active services with pagination, search, and filtering.

- **Authorization:** Bearer token required (may be public in future)
- **Query Parameters:**
  - `search=<keyword>`
  - `category=<category_id>`
  - `min_price=<int>`
  - `max_price=<int>`
  - `delivery_time=<int>`
  - `skills=<keyword>`
  - `ordering=price` or `-price` or `created_at`
  - `page=<number>`
  - `page_size=<number>`

**Response (200):** `{
"count": 35,
"next": ".../explore-services/?page=2",
"previous": null,
"results": [
{
"id": 12,
"title": "Website Design",
"category": {"id": 2, "name": "Web Development"},
"skills_output": [
{"id": 3, "name": "React"},
{"id": 4, "name": "Django"}
],
"freelancer": {...},
"price": 25000,
"delivery_time": 10,
"image": "/media/services/web_design.jpg",
"is_featured": false
}]}`

---

## 3. Proposal Endpoints

---

### 3.1 Create Proposal

`POST /proposals/`
> **Description:** Create a new freelance project proposal (client only).

- **Authorization:** Bearer token required

**Request Example:**`{
"title": "Landing Page Design Required",
"description": "Need a creative landing page for our startup.",
"category_id": 2,
"skills_input": [
{"name": "UI/UX"},
{"name": "React"}
],
"budget_min": 10000,
"budget_max": 30000,
"timeline_days": 7,
"project_scope": "Single page app",
"is_urgent": true
}`

**Response (201):**`{
"id": 13,
"title": "Landing Page Design Required",
"description": "...",
"category": {...},
"required_skills": [
{"id": 5, "name": "UI/UX"},
{"id": 3, "name": "React"}
],
"skills_output": [
{"id": 5, "name": "UI/UX"},
{"id": 3, "name": "React"}
],
"budget_min": 10000,
"budget_max": 30000,
"timeline_days": 7,
"project_scope": "Single page app",
"is_urgent": true,
"client": "...",
"applied_freelancers": [],
"selected_freelancer": null,
"status": "open",
"is_active": true,
"created_at": "2025-10-10T11:10:00Z",
"updated_at": "2025-10-10T11:10:00Z"
}`

**Error (400):**`{
"skills_input": ["Invalid skills format."]
}`

---

### 3.2 Get Own Proposals (List)

`GET /proposals/`
> **Description:** List proposals created by authenticated client.

- **Authorization:** Bearer token required

---

### 3.3 Update Proposal (Full/Partial)

`PUT/PATCH /proposals/{id}/`
> **Description:** Update project proposal (owned by client).

- **Authorization:** Bearer token required

---

### 3.4 Delete Proposal

`DELETE /proposals/{id}/`
> **Description:** Delete proposal.

- **Authorization:** Bearer token required

---

## 4. Explore Proposals (Public Browse)

---

`GET /explore-proposals/`
> **Description:** List/browse all active proposals with pagination, search, filtering.

- **Authorization:** Bearer token required (may be public in future)
- **Query Parameters:**
  - `search=<keyword>`
  - `category=<category_id>`
  - `min_budget=<int>`
  - `max_budget=<int>`
  - `delivery_time=<int>`
  - `skills=<keyword>`
  - `ordering=budget` or `-budget` or `created_at`
  - `page=<number>`
  - `page_size=<number>`

**Response (200):** `{
"count": 18,
"next": ".../explore-proposals/?page=2",
"previous": null,
"results": [
{
"id": 13,
"title": "Landing Page Design Required",
"category": {...},
"skills_output": [
{"id": 5, "name": "UI/UX"},
{"id": 3, "name": "React"}
],
"budget_min": 10000,
"budget_max": 30000,
"timeline_days": 7,
"project_scope": "Single page app",
"is_urgent": true,
"client": {...},
"status": "open"
}]}`

---

## 5. Service Orders

---

### 5.1 Create Service Order

`POST /service-orders/`
> **Description:** Place an order for a service/gig (client only).

- **Authorization:** Bearer token required

**Request Example:** `{
"service_id": 12,
"message": "Excited to work, please start ASAP!"
}`
**Response (201):** `{
"id": 27,
"client": {...},
"freelancer": {...},
"service": {...},
"message": "Excited to work, please start ASAP!",
"status": "pending",
"created_at": "2025-10-10T11:15:00Z",
"updated_at": "2025-10-10T11:15:00Z"
}`

---

### 5.2 List Own Service Orders

`GET /service-orders/`
> **Description:** List all service orders for authenticated freelancer.

- **Authorization:** Bearer token required

---

### 5.3 Update Service Order Status (Partial)

`PATCH /service-orders/{id}/`
> **Description:** Update status of service order (accepted/rejected/cancelled) by freelancer.

- **Authorization:** Bearer token required

**Request Example:** `{
"status": "accepted"
}`
**Response (200):** `{
"id": 27,
"status": "accepted"
}`
**Error (400):** `{
"error": "Status must be one of ['accepted', 'rejected', 'cancelled']."
}`

---

## 6. Proposal Orders

---

### 6.1 Create Proposal Order (Application)

`POST /proposal-orders/`
> **Description:** Freelancer applies to client proposal.

- **Authorization:** Bearer token required

**Request Example:** `{
"status": "accepted"
}`
**Error (400):**`{
"error": "Status must be one of ['accepted', 'rejected', 'cancelled']."
}`

---

## 7. WebSocket Notifications

---

### 7.1 Notification WebSocket (Realtime Channel)

- **URL:** `ws/notifications/`
- **Protocol:** WebSocket (Django Channels)
- **Authentication:** JWT token required (user must be logged in)

> Users connect to channel: `user_{user_id}`
> Receive real-time notifications for service and proposal orders

**Message Example:** `{
"id": 27,
"title": "Website Design",
"client": "Jane Doe",
"status": "pending",
"text": "New order received from Jane Doe for service 'Website Design'.",
"created_at": "2025-10-10T11:15:00Z"
}`

---

## Notes-2

- All endpoints for creation/updating require authentication and relevant permissions (client/freelancer).
- Skills are represented as arrays of `{name: ...}` for input and `{id, name}` for output.
- Service orders and proposal orders status update allowed values: `accepted`, `rejected`, `cancelled`.
- Real-time notification sent to freelancer (on new service order) and client (on application/proposal order).
- Use paginated output format for browse/list endpoints (`count`, `next`, `previous`, `results`).
- File/image uploads require `multipart/form-data`.

---

## Messaging API (SkillConnect)

**Base URL:** `/api/v1/messaging/`

---

## Messaging Endpoints

---

## 1. Conversation Endpoints

---

### 1.1 List & Create Conversation

`GET /conversations/`
> **Description:** List conversations where user is participant (freelancer or client).

- **Authorization:** Bearer token required

**Response (200):** `[
{
"id": 15,
"client_id": 2,
"client_name": "A Client",
"freelancer_id": 5,
"freelancer_name": "B Freelancer",
"order_type": "serviceorder", # or "proposalorder"
"order_id": 10,
"is_active": true,
"created_at": "2025-10-10T11:13:00Z",
"updated_at": "2025-10-10T11:13:00Z",
"service_title": "Website Design",
"service_price": "$25000",
"service_deadline": "10 days",
"last_message": {...},
"unread_count": 2
}]`

`POST /conversations/`
> **Description:** Create a conversation for an order (`order_type` must be `"serviceorder"` or `"proposalorder"`).

**Request Example:** `{
"order_type": "serviceorder",
"order_id": 10
}`
**Response (201):** `{
"id": 15,
...
}`
**Error (400):**`{ "order_type": "Must be 'serviceorder' or 'proposalorder'." }`

---

### 1.2 Get, Update, Delete Conversation

`GET /conversations/{id}/`
> **Description:** Get details for a conversation.

`PATCH /conversations/{id}/`
> **Description:** Update metadata for a conversation.

`DELETE /conversations/{id}/`
> **Description:** Archive/delete conversation.

---

## 2. Message Endpoints (Nested under Conversation)

---

### 2.1 List Messages in Conversation

`GET /conversations/{conversation_id}/messages/`
> **Description:** Get all messages for a conversation (paginated).

**Response (200):** `[
{
"id": 23,
"conversation": 15,
"sender_id": 2,
"message_type": "text",
"content": "Hello",
"attachment": null,
"payment_amount": null,
"payment_status": null,
"created_at": "2025-10-10T11:13:05Z",
"reactions": {"👍": 2}
},
{
"id": 24,
"message_type": "file",
"attachment": {
"id": 7,
"file": "https://site.com/media/attachments/file.pdf",
"file_name": "file.pdf",
"file_type": "pdf",
"file_size": 132329,
"thumbnail_url": null,
"uploaded_at": "2025-10-10T11:13:06Z"
}}]`

---

### 2.2 Send Message

`POST /conversations/{conversation_id}/messages/`
> **Description:** Send a message to the conversation. Can be text or file (attachment).

**Request Example:** `{
"message_type": "text",
"content": "Hi, can you send the payment?",
"payment_amount": null,
"payment_status": null
}`
OR for file: `{
"message_type": "file",
"attachment_file": "<file>"
}`
**Response (201):** `{
"id": 25,
...
}`
**Error (400):** `{ "attachment_file": "required when message_type is 'file'." }`

---

### 2.3 React to Message (Emoji)

`POST /conversations/{conversation_id}/messages/{pk}/react/`
> **Description:** Add/update emoji reaction to a message.

**Request Example:**`{
"emoji": "👍"
}`
**Response (200):**`{
"id": 25,
"reactions": {"👍": 1}
}`
**Error (400):** `{ "error": "emoji field is required" }`

---

## 3. Attachment Endpoints

---

_Attachments are handled inline as part of message creation. No standalone endpoint; all files/images are uploaded via message POST._

---

## 4. Contract Endpoints (Optional module for contract tracking within conversations)

---

`GET /contracts/`
> **Description:** List contracts relevant to logged-in user.

- **Authorization:** Bearer token required
- **Query Params:**
  - `order_type=service|proposal`
  - `order_id=<id>`

`POST /contracts/`
> **Description:** Create contract for an order.

**Request Example:** `{
"order_type": "service",
"order_id": 10,
"amount": 20000,
"deadline": "2025-11-01",
"terms": "100% upon completion"
}`
**Response (201):** `{
"id": 9,
"amount": 20000,
"deadline": "2025-11-01",
"status": "pending",
"workflow_status": "draft",
"service_order": 10,
"created_at": "..."
}`
**Error (400):**`{ "order_type": "Must be 'service' or 'proposal'." }
{ "amount": "Amount must be greater than zero." }`

`PATCH /contracts/{id}/`
> **Description:** Update contract status, workflow, etc.

_Custom Actions:_

- `POST /contracts/{id}/accept/` : Accept contract.
- `POST /contracts/{id}/reject/` : Reject contract.

---

## 5. Payment Request Endpoints

---

`GET /payment-requests/`
> **Description:** List payment requests (relevant to authenticated user).

`POST /payment-requests/`
> **Description:** Create payment request, linked to a conversation.

**Request Example:** `{
"contract": 9,
"conversation_id": 15,
"amount": 20000,
"description": "Final payment due",
"status": "pending"
}`
**Response (201):**`{
"id": 21,
"amount": 20000,
"status": "pending",
"created_at": "2025-10-10T12:34:00Z"
}`
**Error (400):**`{ "amount": "Amount must be greater than zero." }`

---

## 6. Payment Processing (Razorpay Integration)

---

`POST /payments/{id}/create-razorpay-order/`
> **Description:** Create Razorpay payment order for the payment request.

**Response (200):**`{
"order_id": "order_XXXXXXXXXX",
"razorpay_key": "rzp_test_xxxxxxxxx",
"amount": 2000000,
"currency": "INR",
"description": "Final payment"
}`

`POST /payments/{id}/verify-razorpay-payment/`
> **Description:** Verify payment after client completes payment on Razorpay.

**Request Example:**`{
"razorpay_order_id": "order_XXXXXXXXXX",
"razorpay_payment_id": "pay_YYYYYYYYY",
"razorpay_signature": "<signature>"
}`
**Response (200):**`{ "success": true }`
**Error (400):**`{ "success": false, "error": "Invalid signature!" }`

---

## 7. WebSocket Endpoints

---

### 7.1 Messaging Chat Channel

**URL:** `ws/messaging/chat/<conversation_id>/`
> **Description:** Join real-time messaging channel for a conversation. Supports:

- Presence notification ("online"/"offline")
- Typing event broadcast
- Real-time delivery of new messages
- User must be authenticated and a conversation participant

**Events:** `// Typing event
{
"type": "typing",
"conversation_id": 15,
"user_id": 5,
"typing": true
}

// New message
{
"id": 25,
"sender_id": 5,
"content": "Hi!",
"created_at": "2025-10-10T11:13:05Z"
}

// Presence notification
{
"type": "presence",
"conversation_id": 15,
"user_id": 2,
"status": "online"
}`

---

### 7.2 Contracts Tracking Channel

**URL:** `ws/messaging/contracts/<order_type>/<order_id>/`
> **Description:** Track contract status for a serviceorder/proposalorder in real time.

- Broadcast contract data to all participants of the order

**Event Example:** `{
"id": 9,
"amount": 20000,
"status": "accepted",
"workflow_status": "completed"
}`

---

## Notes -3

- All endpoints require authentication. Many require user to be a participant (client/freelancer).
- Attachments (files, voice, images) are uploaded via `POST /messages/` with field `attachment_file`.
- Emoji reactions and message edits are supported.
- Pagination is applied on message listing endpoints.
- Payment requests and contract messages appear in chat history.
- WebSocket channels are permissioned; only conversation members can join.

---
