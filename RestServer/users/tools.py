import os
import json
from oauth2_provider.settings import oauth2_settings
from oauthlib.common import generate_token
from django.http import JsonResponse
from oauth2_provider.models import AccessToken, Application, RefreshToken
from django.utils.timezone import now, timedelta
import httplib2
from apiclient import discovery
from oauth2client.client import AccessTokenCredentials
from django.conf import settings

def get_token_json(access_token, user):
    token = {
        'access_token': access_token.token,
        'expires_in': oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS,
        'token_type': 'Bearer',
        'refresh_token': access_token.refresh_token.token,
        'scope': access_token.scope,
        'user': user.username,
        'username': user.first_name + ' ' + user.last_name
    }
    return JsonResponse(token)


def get_access_token(user):
    app = Application.objects.get(name=settings.APP_NAME)

    try:
        old_access_token = AccessToken.objects.get(
            user=user,
            application=app
        )
        old_refresh_token = RefreshToken.objects.get(
            user=user,
            access_token=old_access_token
        )
    except:
        pass
    else:
        old_access_token.delete()
        old_refresh_token.delete()

    token = generate_token()

    refresh_token = generate_token()

    expires = now() + timedelta(seconds=oauth2_settings.ACCESS_TOKEN_EXPIRE_SECONDS)
    scope = "read write"

    access_token = AccessToken.objects.create(
        user=user,
        application=app,
        expires=expires,
        token=token,
        scope=scope
    )

    RefreshToken.objects.create(
        user=user,
        application=app,
        token=refresh_token,
        access_token=access_token
    )

    return get_token_json(access_token, user)


def get_mails(request):
    credentials = AccessTokenCredentials(
        request.user.social_auth.get(provider="google-plus").extra_data.get('access_token'),
        'Testp/1.0')
    service = discovery.build(
        'gmail',
        'v1',
        http=credentials.authorize(httplib2.Http()))
    nextPageToken = request.GET.get('nextPageToken')
    perpage = settings.EMAILS_PER_PAGE
    response = service.users().messages().list(
        userId='me',
        maxResults=perpage,
        pageToken=nextPageToken
    ).execute()

    inbox = []
    result = {}
    if 'nextPageToken' in response:
        result['nextPageToken'] = response['nextPageToken']
    if 'messages' in response:
        for message in response['messages']:
            _message = service.users().messages().get(
                userId='me',
                id=message.get('id'),
                format='full'
            ).execute()
            mail = {}
            mail['snippet'] = _message.get('snippet')
            for head in _message.get('payload').get('headers'):
                if (head.get('name') == 'Subject'):
                    mail['subject'] = head.get('value')
                elif (head.get('name') == 'From'):
                    mail['from'] = head.get('value')
                elif (head.get('name') == 'To'):
                    mail['to'] = head.get('value')
                elif (head.get('name') == 'Date'):
                    mail['date'] = head.get('value')

                # mail['subject'] = ('', head.get('value'))[head.get('name') == 'Subject']
                # mail['from'] = ('', head.get('value'))[head.get('name') == 'From']
                # mail['to'] = ('', head.get('value'))[head.get('name') == 'To']
                # mail['date'] = ('', head.get('value'))[head.get('name') == 'Date']

            inbox.append(mail)
    result['emails'] = inbox
    return json.dumps(result)
