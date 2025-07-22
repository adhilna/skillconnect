from rest_framework import viewsets, permissions, status
from rest_framework.parsers import MultiPartParser, FormParser
from .models import Service, Proposal
from .serializers import ServiceSerializer, ProposalSerializer
import pprint
import json
from rest_framework.response import Response

def parse_json_fields(data, fields):
    """
    Parses fields like 'skills_input' from FormData that might look like:
    ['[{"name":"React"}, {"name":"Python"}]'] → [{'name': ...}, ...]
    Handles double-nested lists as well: [[{...}]] → [{...}]
    """
    for field in fields:
        raw = data.get(field)
        try:
            # Handle case: ['[{"name":"..."}]']
            if isinstance(raw, list) and len(raw) == 1 and isinstance(raw[0], str):
                parsed = json.loads(raw[0])
            elif isinstance(raw, str):
                parsed = json.loads(raw)
            else:
                parsed = raw

            # Flatten [[{...}, {...}]] → [{...}, {...}]
            if isinstance(parsed, list) and len(parsed) == 1 and isinstance(parsed[0], list):
                parsed = parsed[0]

            data[field] = parsed
        except Exception as e:
            print(f"[ERROR] Failed to parse field '{field}': {e}")
            data[field] = []
    return data


class ServiceViewSet(viewsets.ModelViewSet):
    serializer_class = ServiceSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        return Service.objects.filter(freelancer=self.request.user.freelancer_profile)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def perform_create(self, serializer):
        serializer.save(freelancer=self.request.user.freelancer_profile)

    def create(self, request, *args, **kwargs):
        print("==== [DEBUG] RAW DATA RECEIVED ====")
        pprint.pprint({k: v for k, v in request.data.items()})
        print("==== [DEBUG] RAW FILES RECEIVED ====")
        pprint.pprint(dict(request.FILES))

        data = request.data.copy()
        data = parse_json_fields(data, ['skills_input'])

        serializer = self.get_serializer(data=data)
        if not serializer.is_valid():
            print("==== [DEBUG] SERIALIZER ERRORS ====")
            pprint.pprint(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        partial = kwargs.pop('partial', True)

        data = request.data.copy()
        data = parse_json_fields(data, ['skills_input'])

        serializer = self.get_serializer(instance, data=data, partial=partial)
        if not serializer.is_valid():
            print("==== [DEBUG] SERIALIZER ERRORS ====")
            pprint.pprint(serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        serializer.save()
        return Response(serializer.data)


class ProposalViewSet(viewsets.ModelViewSet):
    serializer_class = ProposalSerializer
    permission_classes = [permissions.IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)

    def get_queryset(self):
        # For current user's client profile; adjust filter as needed
        return Proposal.objects.filter(client=self.request.user.client_profile)

    def perform_create(self, serializer):
        serializer.save(client=self.request.user.client_profile)