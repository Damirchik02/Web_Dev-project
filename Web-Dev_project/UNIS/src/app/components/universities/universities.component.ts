import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { University } from '../../models/university.model';
import { UniversityService } from '../../services/university.service';

@Component({
  selector: 'app-universities',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './universities.component.html',
  styleUrl: './universities.component.css'
})
export class UniversitiesComponent implements OnInit {
  universities: University[] = [];
  loading = true;
  error = '';

  constructor(private universityService: UniversityService) {}

  ngOnInit(): void {
    this.loadUniversities();
  }

  loadUniversities(): void {
    this.universityService.getUniversities().subscribe({
      next: (data) => {
        this.universities = data;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load universities. Please try again later.';
        this.loading = false;
        console.error('Error loading universities:', err);
      }
    });
  }
}
