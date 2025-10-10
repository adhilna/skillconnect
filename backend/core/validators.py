from rest_framework import serializers
import re
from profiles.constants import COUNTRIES

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
