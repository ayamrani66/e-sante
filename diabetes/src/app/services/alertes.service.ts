import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AlerteService {
  private baseUrl = 'http://localhost:8080/api/alertes';

  constructor(private http: HttpClient) {}

  getAlertesNonResolues(): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/nonresolues`);
  }

  repondreAlerte(alerteId: number, conseil: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/${alerteId}/repondre`, conseil,{ responseType: 'text' });
  }

  getAlertesByPatient(patientId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/patient/${patientId}`);
  }
}
