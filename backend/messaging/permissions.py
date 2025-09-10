from rest_framework import permissions

class IsPaymentParticipantPermission(permissions.BasePermission):
    """
    Custom permission to allow:
    - Freelancers to create payment requests.
    - Payees (clients) to view and update payment requests.
    - Only participants (freelancer or payee) to view payment requests.
    """

    def has_permission(self, request, view):
        # Anyone can view (safe methods) if authenticated
        if request.method in permissions.SAFE_METHODS:
            return request.user and request.user.is_authenticated

        # Create allowed only for authenticated freelancers
        if view.action == 'create':
            return hasattr(request.user, 'freelancer_profile') and request.user.is_authenticated

        # Other write actions (update/partial_update) require object permission check
        return request.user and request.user.is_authenticated

    def has_object_permission(self, request, view, obj):
        user = request.user

        # Check if user is freelancer who requested
        is_requester = hasattr(user, 'freelancer_profile') and obj.requested_by == user

        # Check if user is client payee
        is_payee = hasattr(user, 'client_profile') and obj.payee == user

        # Read permissions allowed to requester or payee
        if request.method in permissions.SAFE_METHODS:
            return is_requester or is_payee

        # Write permissions allowed only to payee (client)
        return is_payee
