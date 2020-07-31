import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { environment } from '@app/../environments/environment';

@Injectable({
  providedIn: 'root'
})

export class FileUploadService {

  constructor(private http: HttpClient) { }

  uploadFile(fileData: File): Observable<any> {
    var formData: any = new FormData();
    formData.append('file', fileData);

    return this.http.post(`${environment.apiUrl}/api/v1/admin/batchUpload`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      catchError(this.errorMgmt)
    )
  }

  errorMgmt(error: any) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = error;
    }
    console.log('errorMessage in file-upload service', errorMessage);
    return throwError(errorMessage);
  }

}