import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { University, Faculty, Program } from '../../models/university.model';
import { UniversityService } from '../../services/university.service';

@Component({
  selector: 'app-university-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './university-detail.component.html',
  styleUrl: './university-detail.component.css'
})
export class UniversityDetailComponent implements OnInit {
  university: University | null = null;
  faculties: Faculty[] = [];
  programs: Program[] = [];
  selectedFacultyId: number | null = null;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private universityService: UniversityService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const idParam = params.get('id');
      if (idParam) {
        const id = +idParam;
        this.loadUniversityDetails(id);
      }
    });
  }

  loadUniversityDetails(id: number): void {
    this.loading = true;
    this.universityService.getUniversity(id).subscribe({
      next: (university) => {
        this.university = university;
        this.loadFaculties(id);
      },
      error: (err) => {
        this.error = 'Failed to load university details. Please try again later.';
        this.loading = false;
        console.error('Error loading university details:', err);
      }
    });
  }

  loadFaculties(universityId: number): void {
    this.universityService.getFacultiesByUniversity(universityId).subscribe({
      next: (faculties) => {
        this.faculties = faculties;
        this.loading = false;
        
        // If there are faculties, automatically select the first one
        if (this.faculties.length > 0) {
          this.selectFaculty(this.faculties[0].id);
        }
      },
      error: (err) => {
        this.error = 'Failed to load faculties. Please try again later.';
        this.loading = false;
        console.error('Error loading faculties:', err);
      }
    });
  }

  selectFaculty(facultyId: number): void {
    this.selectedFacultyId = facultyId;
    this.loadPrograms(facultyId);
  }

  loadPrograms(facultyId: number): void {
    this.universityService.getProgramsByFaculty(facultyId).subscribe({
      next: (programs) => {
        this.programs = programs;
      },
      error: (err) => {
        console.error('Error loading programs:', err);
      }
    });
  }
}
