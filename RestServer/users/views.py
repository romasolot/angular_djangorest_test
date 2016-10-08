import json
from django.http import HttpResponse
from django.contrib.auth import login
from rest_framework import permissions
from rest_framework.decorators import authentication_classes, permission_classes, api_view
from social.apps.django_app.utils import psa
from .tools import get_access_token, get_mails
from django.views.decorators.csrf import csrf_exempt
from oauth2_provider.ext.rest_framework import OAuth2Authentication

@csrf_exempt
@psa('social:complete')
def register_by_access_token(request, backend):

    token = request.POST.get('access_token') or json.loads(request.body.decode('utf-8')).get('access_token')

    user = request.backend.do_auth(token)

    if user:
        login(request, user)

        response = get_access_token(user)

        response['access-control-allow-headers'] = 'Content-Type'
        response['access-control-allow-origin'] = '*'
        response['access-control-allow-methods'] = 'GET, POST, OPTION'
        return response
    else:
        response = HttpResponse("error")
        response['access-control-allow-headers'] = 'Content-Type'
        response['access-control-allow-origin'] = '*'
        response['access-control-allow-methods'] = 'GET, POST, OPTION'
        return response

@api_view(['GET'])
@authentication_classes([OAuth2Authentication])
@permission_classes([permissions.IsAuthenticated])
def emails(request):
    return HttpResponse(get_mails(request), content_type="application/json")
