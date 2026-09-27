import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConseilsService {
  private apiUrl = 'http://localhost:8080/api/conseils';

  constructor(private http: HttpClient) {}

  // Récupérer les conseils dynamiques du backend
  getConseils(patientId: number): Observable<any[]> {
  return this.http.get<any[]>(`${this.apiUrl}/${patientId}`);
}

}
