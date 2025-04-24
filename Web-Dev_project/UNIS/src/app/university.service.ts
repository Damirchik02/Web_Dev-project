import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Faculty {
  id: number;
  name: string;
  price: number;
}

interface University {
  id: number;
  name: string;
  rating: number;
  price: number;
  faculties: Faculty[];
}

@Injectable({
  providedIn: 'root'
})
export class UniversityService {

  private apiUrl = 'http://127.0.0.1:8000/api/universities/';

  constructor(private http: HttpClient) { }

  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(this.apiUrl);
  }
}
