import { Component, OnInit } from '@angular/core';
import { UniversityService } from './university.service';

interface Faculty {
  name: string;
  price: number;
}

interface University {
  name: string;
  rating: number;
  price: number;
  faculties: Faculty[];
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  universities: University[] = [];

  constructor(private universityService: UniversityService) {}

  ngOnInit() {
    this.universityService.getUniversities().subscribe(data => {
      this.universities = data;
    });
  }
}
