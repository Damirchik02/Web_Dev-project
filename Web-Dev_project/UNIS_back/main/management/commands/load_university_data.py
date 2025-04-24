from django.core.management.base import BaseCommand
from django.core.management import call_command


class Command(BaseCommand):
    help = 'Load university, faculty, and program data from fixture files'

    def handle(self, *args, **options):
        self.stdout.write(self.style.SUCCESS('Starting to load university data...'))
        
        # Clear existing data (optional, uncomment if needed)
        # from main.models import University, Faculty, Program
        # University.objects.all().delete()
        # Faculty.objects.all().delete()
        # Program.objects.all().delete()
        # self.stdout.write(self.style.SUCCESS('Cleared existing data'))
        
        # Load data from fixtures
        fixtures = [
            'main/fixtures/universities.json',
            'main/fixtures/faculties.json',
            'main/fixtures/programs.json',
        ]
        
        for fixture in fixtures:
            try:
                call_command('loaddata', fixture)
                self.stdout.write(self.style.SUCCESS(f'Successfully loaded {fixture}'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'Failed to load {fixture}: {str(e)}'))
        
        self.stdout.write(self.style.SUCCESS('Finished loading university data')) 