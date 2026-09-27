import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-reading-history',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reading-history.component.html',
  styleUrls: ['./reading-history.component.css']
})
export class ReadingHistoryComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private http = inject(HttpClient);
  private router = inject(Router);

  readings: any[] = [];
  patientId!: number;
  apiUrl = 'http://localhost:8080/api/readings';

  ngOnInit() {
    this.patientId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadHistorique();
  }
goToDashboard() {
    this.router.navigate(['/dashboard']);
  }
  goBack() {
    this.router.navigate(['/patient/', this.patientId]);
  }
  loadHistorique() {
    this.http.get<any[]>(`${this.apiUrl}/${this.patientId}`)
      .subscribe(data => this.readings = data);
  }
}
