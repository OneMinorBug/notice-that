from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "problems"

urlpatterns = [
    path('', views.home, name='home'),
    path('home/', views.home, name='home'),
    path('archives/', views.archives, name='archives'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('problem/<str:pk>/', views.problem_detail, name='problem_detail'),
    path('post/', views.post_problem, name='post_problem'),
    path('search', views.search, name='search'),
    path('upload/', views.upload_image, name='upload_image'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)