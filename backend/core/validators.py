from rest_framework import serializers
import re
from profiles.constants import COUNTRIES
from datetime import datetime
from django.core.validators import URLValidator
from django.core.exceptions import ValidationError

def validate_non_empty_string(value, field_name="Field", min_len=1, max_len=255, allow_special=False):
    """
    General-purpose string validator.
    - Trims leading/trailing spaces.
    - Checks min/max length.
    - If allow_special=False → only allows letters, digits, spaces, and hyphens.
    - If allow_special=True → allows any printable characters.
    """

    if not value or not isinstance(value, str) or not value.strip():
        raise serializers.ValidationError(f"{field_name.capitalize()} is required.")

    v = value.strip()

    if len(v) < min_len:
        raise serializers.ValidationError(f"{field_name.capitalize()} must be at least {min_len} characters long.")
    if len(v) > max_len:
        raise serializers.ValidationError(f"{field_name.capitalize()} must be at most {max_len} characters long.")

    if not allow_special:
        # Strict: only letters, digits, single spaces, and hyphens
        if not re.fullmatch(r"^[A-Za-z]+(?:[-' ][A-Za-z]+)*$", v):
            raise serializers.ValidationError(
                f"{field_name.capitalize()} must contain only letters, numbers, spaces, or hyphens."
            )

    return v

def validate_age(value):
    """
    Validates an integer age between 16 and 100 (inclusive).
    """
    try:
        age = int(value)
    except (ValueError, TypeError):
        raise serializers.ValidationError("Age must be a valid number.")

    if not (16 <= age <= 100):
        raise serializers.ValidationError("Age must be between 16 and 100 years old.")

    return age

def validate_location(value: str):
    """
    Validates a city/location name:
    - Only letters (A–Z, a–z)
    - Allows single spaces between words
    - No symbols, numbers, or multiple spaces
    - Min length 2, max length 64
    """
    if not value or not isinstance(value, str):
        raise serializers.ValidationError("Location is required.")

    cleaned = value.strip()

    if len(cleaned) < 2:
        raise serializers.ValidationError("Location must be at least 2 characters long.")

    if len(cleaned) > 64:
        raise serializers.ValidationError("Location must be at most 64 characters long.")

    # Regex: only letters, single spaces between words
    if not re.fullmatch(r"[A-Za-z]+(?: [A-Za-z]+)*", cleaned):
        raise serializers.ValidationError(
            "Location must contain only letters and single spaces (no symbols, dots, or numbers)."
        )

    return cleaned

def validate_country(value: str):
    if not value or not isinstance(value, str):
        raise serializers.ValidationError("Country is required.")

    cleaned = value.strip()

    if cleaned not in COUNTRIES:
        raise serializers.ValidationError("Select a valid country.")

    # Allow letters, single spaces, hyphens, apostrophes
    if not re.fullmatch(r"[A-Za-z]+(?:[-' ][A-Za-z]+)*", cleaned):
        raise serializers.ValidationError(
            "Country must contain only letters, single spaces, hyphens, or apostrophes."
        )

    return cleaned

def validate_skills_input(self, value):
    """
    Ensure the user selects at least one skill.
    """
    if not value or not isinstance(value, list) or len(value) == 0:
        raise serializers.ValidationError("Select at least one skill.")
    return value

def validate_optional_string(value, field_name="Field", min_len=1, max_len=255, allow_special=False):
    """
    Validates optional string fields.
    - Allows empty or None values (treated as not provided).
    - If a value is given, trims and checks length & format.
    """

    # Skip validation if not provided
    if not value or not isinstance(value, str) or not value.strip():
        return None  # Return None so serializer can treat it as blank

    v = value.strip()

    if len(v) < min_len:
        raise serializers.ValidationError(f"{field_name.capitalize()} must be at least {min_len} characters long.")
    if len(v) > max_len:
        raise serializers.ValidationError(f"{field_name.capitalize()} must be at most {max_len} characters long.")

    if not allow_special:
        if not re.fullmatch(r"^[A-Za-z]+(?:[-' ][A-Za-z]+)*$", v):
            raise serializers.ValidationError(
                f"{field_name.capitalize()} must contain only letters, numbers, spaces, or hyphens."
            )

    return v

def validate_optional_date_range(start_date, end_date=None, ongoing=False):
    """
    Validates optional start/end date fields.
    - start_date: required
    - end_date: required unless ongoing=True
    - Ensures start_date <= end_date
    """
    if not start_date:
        raise serializers.ValidationError("Start date is required.")

    try:
        start = datetime.strptime(str(start_date), "%Y-%m-%d").date()
    except ValueError:
        raise serializers.ValidationError("Start date must be a valid date (YYYY-MM-DD).")

    if not ongoing:
        if not end_date:
            raise serializers.ValidationError("End date is required unless marked as ongoing.")
        try:
            end = datetime.strptime(str(end_date), "%Y-%m-%d").date()
        except ValueError:
            raise serializers.ValidationError("End date must be a valid date (YYYY-MM-DD).")

        if start > end:
            raise serializers.ValidationError("End date cannot be earlier than start date.")

    return start_date, end_date

def validate_url_field(value, field_name="URL"):
    if not value:  # allow empty or None
        return value
    validator = URLValidator()
    try:
        validator(value)
    except ValidationError:
        raise serializers.ValidationError(f"{field_name} must be a valid URL.")
    return value

