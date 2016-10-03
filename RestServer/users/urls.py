from django.conf.urls import url
from . import views

urlpatterns = [
    url(r'^register-by-token/(?P<backend>[^/]+)/$', views.register_by_access_token),
    url(r'^emails/', views.emails),
]
