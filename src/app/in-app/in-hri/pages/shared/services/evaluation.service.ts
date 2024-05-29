import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { DTOSession } from '../dtos/DTOSession.dto';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { State, toDataSourceRequest } from '@progress/kendo-data-query';

@Injectable()
export class EvaluationService extends BehaviorSubject<DTOSession[]> {
    public loading: boolean = false;
    private BASE_URL = "https://gist.githubusercontent.com/CRCAT25/36ad75e88e4e98774a5b7338e943ff81/raw/6a5201e936f360ef5b0e9cf3fdb3e6207f2aff16/evaluationData";
    private apiUrlGetSession: string = 'http://172.16.10.86:75/qc/api/quiz/GetListQuizSession'
    private apiUrlUpdateSession: string = 'http://172.16.10.86:75/qc/api/quiz/UpdateQuizSessionStatus';


    constructor(private http: HttpClient) {
        super([]);
    }

    public read(): void {
        this.loading = true;
        this.fetch().subscribe((data) => {
            super.next(data);
            this.loading = false;
        });
    }

    private fetch(): Observable<DTOSession[]> {
        return this.http
            .get(`${this.BASE_URL}`)
            .pipe(map((data: any) => <DTOSession[]>data["data"]));
    }


    getData(token: string) {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`
        });

        return this.http.post('/api/quiz/GetListQuizSession', { localERP: localStorage.getItem('tokenLogin') }, { headers });
    }


    getHttpOptions() {
        const token = localStorage.getItem('tokenLogin');
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
                'Company': 1
            })
        };
    }


    getListQuesionSesstion(state: State): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();

        return this.http.post<DTOResponse>(this.apiUrlGetSession, toDataSourceRequest(state), httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving quiz sessions:', error);
                    return throwError(error);
                })
            );
    }


    updateQuizSessionStatus(sessionData: any): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.http.post(this.apiUrlUpdateSession, sessionData, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating quiz session:', error);
                    return throwError(error);
                })
            );
    }
}
