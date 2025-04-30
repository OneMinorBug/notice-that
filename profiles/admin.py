from django.contrib import admin
from .models import Profile

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'profile_picture']
    list_per_page = 20
    search_fields = ['user']
    readonly_fields = ['user', 'profile_picture']

# Register your models here.
admin.site.register(Profile, ProfileAdmin)