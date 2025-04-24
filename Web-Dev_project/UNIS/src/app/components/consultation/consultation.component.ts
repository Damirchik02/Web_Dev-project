import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ConsultationRequest } from '../../models/consultation.model';
import { AuthService } from '../../services/auth.service';
import { UniversityService } from '../../services/university.service';

@Component({
  selector: 'app-consultation',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './consultation.component.html',
  styleUrl: './consultation.component.css'
})
export class ConsultationComponent implements OnInit {
  consultationRequest: ConsultationRequest = {
    message: '',
    date: new Date(),
    status: 'pending',
    userId: 0
  };

  isLoggedIn = false;
  loading = false;
  submitted = false;
  errorMessage = '';
  successMessage = '';
  userRequests: ConsultationRequest[] = [];

  constructor(
    private authService: AuthService,
    private universityService: UniversityService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.consultationRequest.userId = user.id || 0;
        // Get existing requests
        this.loadUserRequests();
      }
    });
  }

  loadUserRequests(): void {
    if (this.isLoggedIn) {
      this.universityService.getConsultationRequests().subscribe({
        next: (requests) => {
          this.userRequests = requests;
        },
        error: (err) => {
          console.error('Error loading consultation requests:', err);
        }
      });
    }
  }

  onSubmit(): void {
    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.isLoggedIn) {
      this.errorMessage = 'You must be logged in to request a consultation';
      this.loading = false;
      return;
    }

    if (!this.consultationRequest.message) {
      this.errorMessage = 'Please provide a message for your consultation request';
      this.loading = false;
      return;
    }

    this.universityService.submitConsultationRequest(this.consultationRequest).subscribe({
      next: (response) => {
        this.loading = false;
        this.submitted = true;
        this.successMessage = 'Your consultation request has been submitted successfully!';
        // Reset form after submission
        this.consultationRequest.message = '';
        // Reload user requests
        this.loadUserRequests();
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = 'Failed to submit consultation request. Please try again later.';
        console.error('Error submitting consultation request:', error);
      }
    });
  }

  redirectToLogin(): void {
    this.router.navigate(['/login']);
  }
}
