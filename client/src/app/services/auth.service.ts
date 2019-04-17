import { Injectable } from '@angular/core';
import { Http, Headers, RequestOptions  } from '@angular/http';
import { HttpErrorResponse } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map  } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  domain = 'http://localhost:8080';
  authToken: any;
  user: any;

  constructor(private http: Http) { }

  registerrUser(user): Observable <any> {
    return this.http.post(this.domain + '/api/register', user).pipe(
      map(this.extractData.bind(this)),
      catchError(this.handleError('registerrUser', user))
    );
  }


  checkUserEmail(email): Observable <any> {
    return this.http.get(this.domain + '/api/checkUserEmail/' + email).pipe(
      map(this.extractData.bind(this)),
      catchError(this.handleError('registerrUser', email))
    );
  }

  login(user): Observable <any> {
    return this.http.post( this.domain + '/api/login', user).pipe(
      map(this.extractData.bind(this)),
      catchError(this.handleError('login', user))
    );
  }

  storeUserData(token: any, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.authToken = token;
    this.user = user;
  }


   // common function to extract data from response
   private extractData(res: Response): any {
      const response = res.json();
      return response;
   }

  private handleError<T> (serviceName = '', operation = 'operation', result = {} as T) {

    return (error: HttpErrorResponse): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
      return of( result );
    };
  }

}
