import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { DTOResponse } from 'src/app/in-lib/dto/dto.response';
import { State, toDataSourceRequest } from '@progress/kendo-data-query';
import { DTOECOMChannelGroup } from '../dtos/DTOECOMChannelGroup';

@Injectable()
export class ChannelGroupService extends BehaviorSubject<DTOECOMChannelGroup[]> {
    public loading: boolean = false;
    private localERP: string = 'http://172.16.10.86:75/qc';
    private token: string = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE3MTgwNzc5MDksImV4cCI6MTcxODA4MTUwOSwiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0L3Jlc291cmNlcyIsImFkbWluYXBpIl0sImNsaWVudF9pZCI6ImFkbWluIiwic3ViIjoiMTc1ZWFhZDAtMjBhZC00ZDNlLWEyNzgtYTY1OGQwNWQ1NWJjIiwiYXV0aF90aW1lIjoxNzE4MDc3OTA5LCJpZHAiOiJsb2NhbCIsInByb2ZpbGUiOiIxIiwibmFtZSI6Ik5ndXnhu4VuIFbEg24gSGFjaGkiLCJzY29wZSI6WyJhZG1pbmFwaSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwYXNzd29yZCJdfQ.nVaVF75gQA53WBsWG8lwCTy_cwryQBkqBcKpW6USdG196iDVxSTf6YOs023x4RBM6hb8qOqDgoAiOO61YDaPm4pE2AZtTDjZKrZwz08d7djET29AtRkDihR505rK8TV_K9AXOR3jqY0fB73OV3P-ys54eMFCc6f0fn5-8Ex9b1UMZGS6BgTxcgL5vccONu-tRsPeY5b6KS-7OTXXjGm62IEvnpZoCNyLRv-EW1JyT1ukOsVxRzli4GO62oKWpkxZsrQCmXp1s01nKmEB5NNA5iKWN_m0mcwzc19LFUpG6EBw_XFjwmLLmKiVnllSHx37VvihEmqkxT8ufRstxAYUMA';
    private apiUrlGetListChannelGroup: string = '/api/channelgroup/GetListChannelGroup';
    private apiUrlGetListChannelGroupTwoLevel: string = '/api/channelgroup/GetListChannelGroupTwoLevel';
    private GetListChildChannelGroup: string = '/api/channelgroup/GetListChildChannelGroup'
    private apiUrlGetListChannelGroupProduct: string = '/api/channelgroup/GetListChannelGroupProduct'
    private apiUrlGetListPriority: string = '/api/channelgroup/GetListPriority'



    constructor(private http: HttpClient) {
        super([]);
    }

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.token}`,
                'Company': 1
            })
        };
    }


    GetListChannelGroup(state: State): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();

        return this.http.post<DTOResponse>(this.localERP + this.apiUrlGetListChannelGroup, toDataSourceRequest(state), httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving list channel group:', error);
                    return throwError(error);
                })
            );
    }
}
