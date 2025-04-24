from django.db import models

class University(models.Model):
    name = models.CharField(max_length=200)
    rating = models.FloatField()
    price = models.FloatField()

    def __str__(self):
        return self.name

class Faculty(models.Model):
    university = models.ForeignKey(University, related_name='faculties', on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    price = models.FloatField()

    def __str__(self):
        return self.name
