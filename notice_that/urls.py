"""
URL configuration for notice_that project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, re_path, include
from django.conf import settings
from django.conf.urls.static import static
from django.views.generic.base import TemplateView
from problems.views import view_log_file
from django.contrib.staticfiles.storage import staticfiles_storage
from django.views.generic.base import RedirectView
from django.http import JsonResponse, HttpResponseNotFound

#Sitemaps
from django.contrib.sitemaps.views import sitemap
from problems.sitemaps import *

sitemaps = {
    'static' : StaticSitemap,
    'problems' : ProblemSitemap,
}

def health_check(request):
    return JsonResponse({"status": "ok"})

urlpatterns = [
    path('sitemap.xml/', sitemap, {'sitemaps':sitemaps}, name='django.contrib.sitemaps.views.sitemap'),
    path('robots.txt/', TemplateView.as_view(template_name="robots.txt", content_type="text/plain")),
    path('favicon.ico', RedirectView.as_view(url=staticfiles_storage.url('images/favicon.ico'))),
    path("health/", health_check, name="health_check"),
    path('notadmin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('profiles/', include('profiles.urls')),
    path('logs/<filename>/', view_log_file, name="view_log_file"),
    path('', include('problems.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    urlpatterns += re_path(r'^\.well-known/appspecific/com\.chrome\.devtools\.json$', lambda request: HttpResponseNotFound()),