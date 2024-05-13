import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DTOEvaluation } from '../dtos/DTOEvaluation.dto';
import { HttpClient } from '@angular/common/http';
import { map, tap } from 'rxjs/operators';
import { State, toODataString } from '@progress/kendo-data-query';

export class EvaluationMainService extends BehaviorSubject<Array<any>> {
    public loading: boolean = false;

    private BASE_URL = "https://gist.githubusercontent.com/CRCAT25/36ad75e88e4e98774a5b7338e943ff81/raw/1051dd23cf7430fe89ee55659c8a7e2420f1bae1/evaluationData";

    constructor(private http: HttpClient) {
        super([]);
    }

    public query(state: State): void {
        this.fetch(state).subscribe((x) => super.next(x));
    }

    protected fetch(state: State): Observable<DTOEvaluation[]> {
        const queryStr = `${toODataString(state)}&$count=true`;
        this.loading = true;
        console.log(queryStr);

        return this.http.get(`${this.BASE_URL}?${queryStr}`).pipe(
            map((response: any) => <DTOEvaluation[]>response["data"]),
            tap(() => (this.loading = false))
        );
    }
}

@Injectable()
export class EvaluationService extends EvaluationMainService {
    constructor(http: HttpClient) {
        super(http);
    }
}