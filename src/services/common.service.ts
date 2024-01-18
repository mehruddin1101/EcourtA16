import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private baseUrl = environment.baseUrl;

  constructor(private http: HttpClient) { }

  private error(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      errorMessage = error.error.message;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    return throwError(errorMessage);
  }

  AddCase(data: any): Observable<any> {
    const API_URL = `${this.baseUrl}api/CaseAdd`;
    return this.http.post(API_URL, data).pipe(catchError(this.error));
  }

  addFeedback(data: any): Observable<any> {
    const API_URL = `${this.baseUrl}/api/feedbacks/`;
    return this.http.post(API_URL, data).pipe(catchError(this.error));
  }
  getUserFeedbacks(): Observable<any> {
    const API_URL = `${this.baseUrl}/api/feedbacks/all`;
    return this.http.get(API_URL).pipe(catchError(this.error));
  }

}
