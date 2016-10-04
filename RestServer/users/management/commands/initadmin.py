__author__ = 'dkarchmer@gmail.com'

from django.conf import settings
from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from oauth2_provider.models import Application
class Command(BaseCommand):

    def handle(self, *args, **options):
        if User.objects.count() == 0:
            for user in settings.ADMINS:
                username = user[0].replace(' ', '')
                email = user[1]
                password = 'admin'
                print('Creating account for %s (%s)' % (username, email))
                admin = User.objects.create_superuser(email=email, username=username, password=password)
                admin.is_active = True
                admin.is_admin = True
                admin.save()
                if Application.objects.count() == 0:
                    app = Application.objects.create(client_id='4ahBPwbPfmzaOVWQjXS924wmiTF6hEks8HdX74xg',
                                               client_type='confidential',
                                               authorization_grant_type='client-credentials',
                                               client_secret='kSgAQHclVttt0aKlab4qe3fPUYVzmO54Wvg2SqpevfgJjSB3ubERQMwrGjG5DZpr62SUtfDAsFlC5424G496CM0mGkaJ5S6OtooXeKdFCHXtDxjN2L6xFd6fKGMmjDzP',
                                               name='Server', user=admin)
                    app.save()
        else:
            print('Admin accounts can only be initialized if no Accounts exist')