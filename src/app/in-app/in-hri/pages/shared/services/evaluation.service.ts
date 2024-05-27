import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DTOEvaluation } from '../dtos/DTOEvaluation.dto';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Injectable()
export class EvaluationService extends BehaviorSubject<DTOEvaluation[]> {
    public loading: boolean = false;
    private BASE_URL = "https://gist.githubusercontent.com/CRCAT25/36ad75e88e4e98774a5b7338e943ff81/raw/6a5201e936f360ef5b0e9cf3fdb3e6207f2aff16/evaluationData";

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

    private fetch(): Observable<DTOEvaluation[]> {
        return this.http
            .get(`${this.BASE_URL}`)
            .pipe(map((data: any) => <DTOEvaluation[]>data["data"]));
    }
}
