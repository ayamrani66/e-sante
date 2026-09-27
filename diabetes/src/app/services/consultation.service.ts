import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private http = inject(HttpClient);
  private baseUrl = 'http://localhost:8080/api/consultations';
  consultationAdded = new Subject<number>();

  create(patientId: number, consultation: any): Observable<any> {
  return this.http.post(`${this.baseUrl}/${patientId}`, consultation);
}

  getByPatientId(patientId: number): Observable<any[]> {
  return this.http.get<any[]>(`http://localhost:8080/api/patient/${patientId}`);
}

}