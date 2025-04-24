import json
from django.core.management.base import BaseCommand
from universities.models import University, Faculty

class Command(BaseCommand):
    help = 'Импортирует данные университетов из JSON файла'

    def handle(self, *args, **kwargs):
        # Загружаем данные из JSON файла
        with open('universities.json', 'r', encoding='utf-8') as f:
            data = json.load(f)

        for uni_data in data:
            # Создаем университет
            university = University.objects.create(
                name=uni_data['name'],
                rating=uni_data['rating'],
                price=uni_data['price']
            )

            # Создаем факультеты для этого университета
            for faculty_data in uni_data['faculties']:
                Faculty.objects.create(
                    university=university,
                    name=faculty_data['name'],
                    price=faculty_data['price']
                )

        self.stdout.write(self.style.SUCCESS('Данные успешно импортированы!'))
