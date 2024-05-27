import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable()
export class AuthorizationService {
    private tokenUrl = 'http://172.16.10.86:5001/connect/token';
  
    constructor(private http: HttpClient) {}
  
    onLogin(obj: any): Observable<any> {
      // Thiết lập header để gửi yêu cầu dưới dạng Form URL Encoded
      const headers = new HttpHeaders({
        'Content-Type': 'application/x-www-form-urlencoded'
      });
  
      // Chuyển đổi obj thành HttpParams
      const body = new HttpParams()
        .set('grant_type', obj.grant_type)
        .set('client_id', obj.client_id)
        .set('client_secret', obj.client_secret)
        .set('username', obj.username)
        .set('password', obj.password);
  
      return this.http.post(this.tokenUrl, body.toString(), { headers });
    }
  }