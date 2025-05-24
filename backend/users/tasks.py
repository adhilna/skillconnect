from celery import shared_task
from .utils import send_otp_mail

@shared_task
def send_otp_email_task(email, otp):
    return send_otp_mail(email, otp)