from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Problem

class StaticSitemap(Sitemap):
    def items(self):
        return ['about', 'contact']

    def location(self, item):
        return reverse('problems:'+item)
    
class ProblemSitemap(Sitemap):
    def items(self):
        return Problem.objects.all()[:100]