import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { University, Faculty, Program } from '../models/university.model';
import { ConsultationRequest } from '../models/consultation.model';

@Injectable({
  providedIn: 'root'
})
export class UniversityService {
  private apiUrl = 'http://localhost:8000/api'; // URL API Django бэкенда
  
  constructor(private http: HttpClient) { }

  /**
   * Создает HTTP заголовки с токеном авторизации, если пользователь авторизован
   * @returns Объект с HTTP заголовками
   */
  private getHttpOptions() {
    // Получение токена из локального хранилища
    const token = localStorage.getItem('currentUser') ? 
      JSON.parse(localStorage.getItem('currentUser') || '{}').token : 
      null;
    
    // Создание заголовков для запроса
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': token ? `Token ${token}` : ''
      })
    };
  }

  /**
   * Получает список всех университетов с бэкенда
   * @returns Observable с массивом университетов
   */
  getUniversities(): Observable<University[]> {
    return this.http.get<University[]>(`${this.apiUrl}/universities/`);
  }

  /**
   * Получает детальную информацию об университете по его ID
   * @param id - ID университета
   * @returns Observable с данными университета
   */
  getUniversity(id: number): Observable<University> {
    return this.http.get<University>(`${this.apiUrl}/universities/${id}/`);
  }

  /**
   * Получает список факультетов для конкретного университета
   * @param universityId - ID университета
   * @returns Observable с массивом факультетов
   */
  getFacultiesByUniversity(universityId: number): Observable<Faculty[]> {
    return this.http.get<Faculty[]>(`${this.apiUrl}/universities/${universityId}/faculties/`);
  }

  /**
   * Получает детальную информацию о факультете
   * @param facultyId - ID факультета
   * @returns Observable с данными факультета
   */
  getFaculty(facultyId: number): Observable<Faculty> {
    return this.http.get<Faculty>(`${this.apiUrl}/faculties/${facultyId}/`);
  }

  /**
   * Получает список программ обучения для конкретного факультета
   * @param facultyId - ID факультета
   * @returns Observable с массивом программ
   */
  getProgramsByFaculty(facultyId: number): Observable<Program[]> {
    return this.http.get<Program[]>(`${this.apiUrl}/faculties/${facultyId}/programs/`);
  }

  /**
   * Отправляет заявку на консультацию (требуется авторизация)
   * @param request - объект заявки на консультацию
   * @returns Observable с созданной заявкой
   */
  submitConsultationRequest(request: ConsultationRequest): Observable<ConsultationRequest> {
    return this.http.post<ConsultationRequest>(
      `${this.apiUrl}/consultation-requests/`, 
      { message: request.message },
      this.getHttpOptions()
    );
  }

  /**
   * Получает список заявок на консультацию текущего пользователя (требуется авторизация)
   * @returns Observable с массивом заявок
   */
  getConsultationRequests(): Observable<ConsultationRequest[]> {
    return this.http.get<ConsultationRequest[]>(
      `${this.apiUrl}/consultation-requests/`,
      this.getHttpOptions()
    );
  }
}
