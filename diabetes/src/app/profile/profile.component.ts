import { Component, inject, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { PatientService } from '../services/patient.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile-patient',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  private authService = inject(AuthService);
  private patientService = inject(PatientService);
  private router = inject(Router);

  patient: any;
  user: any = {};
  editMode = false;
goToDashboard() {
    this.router.navigate(['/dashboardPatient']);
  }
  ngOnInit() {
  this.authService.currentUser.subscribe(user => {
    if (user) {
      this.user = user; 
      this.patientService.getById(user.patientId).subscribe(p => {
        this.patient = p;
        // stocke l'id du user pour update
        this.user.id = p.user?.id ?? user.id; 
      });
    }
  });
}


  toggleEdit() {
    this.editMode = !this.editMode;
  }

  saveChanges() {
  // Update patient
  this.patientService.update(this.patient.id, this.patient).subscribe(p => {
    this.patient = p;

    // Update user (email + motdepasse)
    const userUpdate = {
      email: this.user.email,       // prends depuis l'input lié à ngModel
      motdepasse: this.user.motdepasse
    };

    this.authService.updateUser(this.user.id, userUpdate).subscribe(u => {
      console.log("User mis à jour :", u);
      this.editMode = false;
    });
  });
}

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
