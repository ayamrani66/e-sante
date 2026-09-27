import { Component } from '@angular/core';
import { PredictionService, PatientData } from '../services/prediction.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prediction-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './prediction.component.html',
  styleUrls: ['./prediction.component.scss']
})
export class PredictionFormComponent {
  patient: PatientData = {
    gender: 'Female',
    age: 21,
    hypertension: 0,
    heart_disease: 0,
    smoking_history: 'never',
    bmi: 22.7,
    HbA1c_level: 7.2,
    blood_glucose_level: 105
  };

  result: any;

  constructor(private prediction: PredictionService) {}

  onSubmit() {
    this.prediction.predict(this.patient).subscribe(
      data => this.result = data,
      err => console.error(err)
    );
  }
}
