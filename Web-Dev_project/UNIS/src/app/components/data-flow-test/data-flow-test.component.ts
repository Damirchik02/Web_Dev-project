import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { University, Faculty, Program } from '../../models/university.model';
import { UniversityService } from '../../services/university.service';

@Component({
  selector: 'app-data-flow-test',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container">
      <h2>Backend to Frontend Data Flow Test</h2>
      
      <div *ngIf="loading">Loading data from backend...</div>
      
      <div *ngIf="error" class="error">
        <h3>Error</h3>
        <p>{{ error }}</p>
      </div>
      
      <div *ngIf="!loading && !error">
        <h3>Universities from Backend:</h3>
        <pre>{{ universities | json }}</pre>
        
        <h3>Selected University Faculties:</h3>
        <div *ngIf="selectedUniversity">
          <p>Showing faculties for: {{ selectedUniversity.name }}</p>
          <pre>{{ faculties | json }}</pre>
        </div>
        
        <h3>Selected Faculty Programs:</h3>
        <div *ngIf="selectedFaculty">
          <p>Showing programs for: {{ selectedFaculty.name }}</p>
          <pre>{{ programs | json }}</pre>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container {
      padding: 20px;
      max-width: 800px;
      margin: 0 auto;
    }
    pre {
      background-color: #f5f5f5;
      padding: 10px;
      border-radius: 5px;
      overflow-x: auto;
    }
    .error {
      color: red;
      background-color: #ffeeee;
      padding: 10px;
      border-radius: 5px;
    }
  `]
})
export class DataFlowTestComponent implements OnInit {
  universities: University[] = [];
  faculties: Faculty[] = [];
  programs: Program[] = [];
  
  selectedUniversity: University | null = null;
  selectedFaculty: Faculty | null = null;
  
  loading = true;
  error: string | null = null;

  constructor(private universityService: UniversityService) { }

  ngOnInit(): void {
    // Fetch universities
    this.universityService.getUniversities().subscribe({
      next: (data) => {
        this.universities = data;
        this.loading = false;
        console.log('Universities loaded from backend:', data);
        
        // After loading universities, load faculties for the first university
        if (data.length > 0) {
          this.selectedUniversity = data[0];
          this.loadFaculties(data[0].id);
        }
      },
      error: (err) => {
        this.error = `Error loading universities: ${err.message}`;
        this.loading = false;
        console.error('Error fetching universities:', err);
      }
    });
  }
  
  loadFaculties(universityId: number): void {
    this.universityService.getFacultiesByUniversity(universityId).subscribe({
      next: (data) => {
        this.faculties = data;
        console.log(`Faculties loaded for university ${universityId}:`, data);
        
        // After loading faculties, load programs for the first faculty
        if (data.length > 0) {
          this.selectedFaculty = data[0];
          this.loadPrograms(data[0].id);
        }
      },
      error: (err) => {
        this.error = `Error loading faculties: ${err.message}`;
        console.error('Error fetching faculties:', err);
      }
    });
  }
  
  loadPrograms(facultyId: number): void {
    this.universityService.getProgramsByFaculty(facultyId).subscribe({
      next: (data) => {
        this.programs = data;
        console.log(`Programs loaded for faculty ${facultyId}:`, data);
      },
      error: (err) => {
        this.error = `Error loading programs: ${err.message}`;
        console.error('Error fetching programs:', err);
      }
    });
  }
} 