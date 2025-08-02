from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

app_name = "problems"

urlpatterns = [
    path('', views.home, name='home'),
    path('problems/', views.problems, name='problems'),
    path('archives/', views.archives, name='archives'),
    path('about/', views.about, name='about'),
    path('contact/', views.contact, name='contact'),
    path('problem/<str:pk>/', views.problem_detail, name='problem_detail'),
    path('search', views.search, name='search'),
    path('upload/', views.upload_image, name='upload_image'),
]

management_urlpatterns = [
    path('manage/', views.manage_dashboard, name='manage_dashboard'),
    path('manage/problem/new/', views.problem_create_view, name='problem_create'), 
    path('manage/problem/<str:pk>/edit/', views.problem_update_view, name='problem_edit'),
    path('manage/problem/<str:pk>/delete/', views.ProblemDeleteView.as_view(), name='problem_delete'),
]

urlpatterns += management_urlpatterns

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)