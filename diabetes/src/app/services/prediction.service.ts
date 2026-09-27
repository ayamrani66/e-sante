import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export type PatientRisks = {
  cardiovasculaire: number;
  nephropathie: number;
  neuropathie: number;
  retinopathie: number;
};

export interface PatientData {
  gender: string;
  age: number;
  hypertension: number;
  heart_disease: number;
  smoking_history: string;
  bmi: number;
  HbA1c_level: number;
  blood_glucose_level: number;
  cardiovasculaire: number;
  nephropathie: number;
  neuropathie: number;
  retinopathie: number;
}
@Injectable({
  providedIn: 'root'
})
export class PredictionService {
  private predictionUrl = 'http://localhost:8080/api/predictions';
  private risksUrl = 'http://localhost:8080/api/consultations';
    private risksUr = 'http://localhost:8080/api/risks';

  constructor(private http: HttpClient) {}

  predict(patientId: number, inputData: any): Observable<any> {
    return this.http.post<any>(`${this.predictionUrl}/predict/${patientId}`, inputData);
  }

  getRisks(patientId: number, inputData: any): Observable<PatientRisks> {
    return this.http.post<PatientRisks>(`${this.risksUrl}/${patientId}`, inputData);
  
}

  evaluateRisks(patientId: number, inputData: any): Observable<any> {
    return this.http.post(`${this.risksUrl}/${patientId}`, inputData);
  }
  getLastRisk(patientId: number): Observable<PatientRisks> {
  return this.http.get<PatientRisks>(`${this.risksUr}/last/${patientId}`);
}


}

