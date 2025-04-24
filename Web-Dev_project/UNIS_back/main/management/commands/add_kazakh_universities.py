from django.core.management.base import BaseCommand
from main.models import University, Faculty, Program
from django.db import transaction

class Command(BaseCommand):
    help = 'Adds three Kazakh universities to the database'
    
    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Adding Kazakh universities...')
        
        # Create KBTU
        kbtu = University.objects.create(
            name="Kazakh-British Technical University",
            country="Kazakhstan",
            city="Almaty",
            description="Kazakh-British Technical University (KBTU) is a leading technical university in Kazakhstan established in 2001. It offers programs in engineering, petroleum, IT, and business, with strong connections to British educational traditions."
        )
        
        # Create KazGU
        kazgu = University.objects.create(
            name="Al-Farabi Kazakh National University",
            country="Kazakhstan",
            city="Almaty",
            description="Al-Farabi Kazakh National University (KazGU) is the oldest and largest university in Kazakhstan, founded in 1934. It is named after the renowned medieval philosopher and scientist Al-Farabi and offers programs across a wide range of disciplines."
        )
        
        # Create KIMEP
        kimep = University.objects.create(
            name="KIMEP University",
            country="Kazakhstan",
            city="Almaty",
            description="KIMEP University (formerly the Kazakhstan Institute of Management, Economics and Strategic Research) is a private institution in Almaty, founded in 1992. It specializes in business administration, law, and social sciences, with all instruction in English."
        )
        
        # Create faculties for KBTU
        it_faculty_kbtu = Faculty.objects.create(
            name="Faculty of Information Technology",
            university=kbtu
        )
        
        engineering_kbtu = Faculty.objects.create(
            name="Faculty of Engineering",
            university=kbtu
        )
        
        business_kbtu = Faculty.objects.create(
            name="School of Business",
            university=kbtu
        )
        
        # Create faculties for KazGU
        science_kazgu = Faculty.objects.create(
            name="Faculty of Natural Sciences",
            university=kazgu
        )
        
        philology_kazgu = Faculty.objects.create(
            name="Faculty of Philology",
            university=kazgu
        )
        
        # Create faculties for KIMEP
        business_kimep = Faculty.objects.create(
            name="Bang College of Business",
            university=kimep
        )
        
        law_kimep = Faculty.objects.create(
            name="School of Law",
            university=kimep
        )
        
        # Create programs for KBTU
        Program.objects.create(
            name="Computer Science",
            duration="4 years",
            cost=12000.00,
            faculty=it_faculty_kbtu
        )
        
        Program.objects.create(
            name="Petroleum Engineering",
            duration="4 years",
            cost=14000.00,
            faculty=engineering_kbtu
        )
        
        Program.objects.create(
            name="MBA",
            duration="2 years",
            cost=18000.00,
            faculty=business_kbtu
        )
        
        # Create programs for KazGU
        Program.objects.create(
            name="Physics",
            duration="4 years",
            cost=8000.00,
            faculty=science_kazgu
        )
        
        Program.objects.create(
            name="Kazakh Literature",
            duration="4 years",
            cost=7500.00,
            faculty=philology_kazgu
        )
        
        # Create programs for KIMEP
        Program.objects.create(
            name="Finance",
            duration="4 years",
            cost=16000.00,
            faculty=business_kimep
        )
        
        Program.objects.create(
            name="International Law",
            duration="4 years",
            cost=15000.00,
            faculty=law_kimep
        )
        
        self.stdout.write(self.style.SUCCESS('Kazakh universities added successfully!'))