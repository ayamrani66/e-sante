import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({ providedIn: 'root' })
export class PatientService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/patients';

  getAll() {
    return this.http.get<any[]>(this.baseUrl);
  }

  getById(id: number) {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  create(patient: any) {
    return this.http.post<any>(this.baseUrl, patient);
  }
  update(id: number | string, patient: any): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/${id}`, patient);
  }

  delete(id: number | string): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}