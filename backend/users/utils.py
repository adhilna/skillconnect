import secrets
import string
import logging
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

logger = logging.getLogger(__name__)

# Configurable OTP validity time (in minutes)
OTP_VALIDITY_MINUTES = 5

def generate_otp(length=6):
    digits = string.digits
    return ''.join(secrets.choice(digits) for _ in range(length))

def send_otp_mail(email, otp):
    subject = 'Verify your email - Skill+Connect'
    plain_message = f"Your OTP is {otp}. It is valid for {OTP_VALIDITY_MINUTES} minutes.\n\nIf you did not request this, please contact our support team at support@skillconnect.com.\n\n© 2025 Skill+Connect. All rights reserved."
    html_message = f"""
    <html>
        <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h2>Skill+Connect Email Verification</h2>
            <p>Your one-time verification code is: <strong style="font-size: 1.2em;">{otp}</strong></p>
            <p>This code is valid for {OTP_VALIDITY_MINUTES} minutes. Please enter it to verify your email.</p>
            <p>If you did not request this, please contact our support team at support@skillconnect.com.</p>
            <p>© 2025 Skill+Connect. All rights reserved.</p>
        </body>
    </html>
    """
    try:
        email_message = EmailMultiAlternatives(
            subject=subject,
            body=plain_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[email],
            reply_to=[settings.SUPPORT_EMAIL] if hasattr(settings, 'SUPPORT_EMAIL') else None
        )
        email_message.attach_alternative(html_message, "text/html")
        email_message.send(fail_silently=False)
        logger.info(f"OTP sent successfully to {email}")
        return True
    except Exception as e:
        logger.error(f"Failed to send OTP to {email}: {str(e)}")
        return False
