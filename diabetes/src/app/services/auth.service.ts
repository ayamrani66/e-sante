import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/api/auth';
  private currentUserSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {}

  login(email: string, motdepasse: string): Observable<any> {
  return this.http.post(`${this.apiUrl}/login`, { email, motdepasse })
    .pipe(tap(user => this.currentUserSubject.next(user)));
}
updateUser(id: number, user: any) {
  return this.http.put(`${this.apiUrl}/${id}`, user);
}


register(payload: any) {
    return this.http.post<any>(`${this.apiUrl}/register`, payload);
  }

  logout() {
    this.currentUserSubject.next(null);
  }

  get currentUser() {
    return this.currentUserSubject.asObservable();
  }

  isLoggedIn(): boolean {
    return !!this.currentUserSubject.value;
  }

  getRole(): string {
    return this.currentUserSubject.value?.role;
  }
}
