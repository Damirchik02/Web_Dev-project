from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from main.models import University, Faculty, Program, ConsultationRequest
from django.db import transaction

class Command(BaseCommand):
    help = 'Creates sample data for testing the application'
    
    @transaction.atomic
    def handle(self, *args, **kwargs):
        self.stdout.write('Creating sample data...')
        
        # Create sample universities
        mit = University.objects.create(
            name="Massachusetts Institute of Technology",
            country="USA",
            city="Cambridge",
            description="Massachusetts Institute of Technology (MIT) is a private research university in Cambridge, Massachusetts. Founded in 1861, MIT has since played a key role in the development of modern technology and science."
        )
        
        stanford = University.objects.create(
            name="Stanford University",
            country="USA",
            city="Stanford",
            description="Stanford University is a private research university in Stanford, California. Stanford is ranked among the top universities in the world by academic publications."
        )
        
        oxford = University.objects.create(
            name="University of Oxford",
            country="UK",
            city="Oxford",
            description="The University of Oxford is a collegiate research university in Oxford, England. It is the oldest university in the English-speaking world and the world's second-oldest university in continuous operation."
        )
        
        # Create sample faculties
        cs_faculty_mit = Faculty.objects.create(
            name="Computer Science",
            university=mit
        )
        
        engineering_mit = Faculty.objects.create(
            name="Engineering",
            university=mit
        )
        
        business_stanford = Faculty.objects.create(
            name="Business School",
            university=stanford
        )
        
        humanities_oxford = Faculty.objects.create(
            name="Humanities",
            university=oxford
        )
        
        # Create sample programs
        Program.objects.create(
            name="Computer Science BS",
            duration="4 years",
            cost=50000.00,
            faculty=cs_faculty_mit
        )
        
        Program.objects.create(
            name="Computer Science MS",
            duration="2 years",
            cost=70000.00,
            faculty=cs_faculty_mit
        )
        
        Program.objects.create(
            name="Electrical Engineering BS",
            duration="4 years",
            cost=48000.00,
            faculty=engineering_mit
        )
        
        Program.objects.create(
            name="MBA",
            duration="2 years",
            cost=80000.00,
            faculty=business_stanford
        )
        
        Program.objects.create(
            name="English Literature",
            duration="3 years",
            cost=35000.00,
            faculty=humanities_oxford
        )
        
        # Create a test user (if they don't exist)
        try:
            test_user = User.objects.get(username='testuser')
        except User.DoesNotExist:
            test_user = User.objects.create_user(
                username='testuser',
                email='test@example.com',
                password='password123'
            )
        
        # Create sample consultation requests
        ConsultationRequest.objects.create(
            user=test_user,
            message="I'm interested in the Computer Science program at MIT. Could you provide more information?",
            status='pending'
        )
        
        ConsultationRequest.objects.create(
            user=test_user,
            message="What are the admission requirements for Stanford's MBA program?",
            status='completed'
        )
        
        self.stdout.write(self.style.SUCCESS('Sample data created successfully!')) 