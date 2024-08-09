import { Injectable } from "@angular/core";
import { Observable, throwError } from "rxjs";
import { DTOResponse } from "src/app/in-lib/dto/dto.response";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { EnumConfig } from "src/app/in-lib/enum/config.enum";
import { catchError } from "rxjs/operators";
import { DTOGroup } from "../dtos/DTOGroup";

@Injectable({
    providedIn: 'root'
})
export class SystemService {

    constructor(private httpClient: HttpClient) { }

    private accessToken: string = 'eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCN0FDQzUyMDMwNUJGREI0RjcyNTJEQUVCMjE3N0NDMDkxRkFBRTEiLCJ0eXAiOiJKV1QiLCJ4NXQiOiJhM3JNVWdNRnY5dFBjbExhNnlGM3pBa2ZxdUUifQ.eyJuYmYiOjE3MjIwNjEwNzMsImV4cCI6MTcyMjA2NDY3MywiaXNzIjoiaHR0cDovL2xvY2FsaG9zdCIsImF1ZCI6WyJodHRwOi8vbG9jYWxob3N0L3Jlc291cmNlcyIsImFkbWluYXBpIl0sImNsaWVudF9pZCI6ImFkbWluIiwic3ViIjoiMTc1ZWFhZDAtMjBhZC00ZDNlLWEyNzgtYTY1OGQwNWQ1NWJjIiwiYXV0aF90aW1lIjoxNzIyMDYxMDczLCJpZHAiOiJsb2NhbCIsInByb2ZpbGUiOiIxIiwibmFtZSI6Ik5ndXnhu4VuIFbEg24gSGFjaGkiLCJzY29wZSI6WyJhZG1pbmFwaSIsIm9mZmxpbmVfYWNjZXNzIl0sImFtciI6WyJwYXNzd29yZCJdfQ.Lpo7OMSq9WGSVv45UGKzMGjjV6MXdGsrrtLg2olFombMZLAVaMjoYCmbSHxneDhARB4NXsCZ5Hi4TUpUj30epd3-AHei35Akmtm443SmxRvNRck8a5-ARjuh3GIcfmvyzwQzq10EgYjRovk5u5QZB1jlKEe0GHIO1j8oTvw11NXdwEechgM3Wn9pPCqQzBp6QUMb3ywFs2issWaTV7DTRiKFaDYWZ4tJqaN7iTJrWVjfe-NtVqzRv1D6uoYd1ugpxbyyLhJ5zWzT-VpUod-E5ZtSd_8v3r245bZomCiiPqyCLIH7etOTFj8sVCt2YDMG_Q2puMbcfMbCL8IlFcqimg';

    getHttpOptions() {
        return {
            headers: new HttpHeaders({
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.accessToken}`,
                'Company': 1
            })
        };
    }

    // Lấy danh sách cấu trúc hệ thống
    GetListSysStructureTree(): Observable<DTOResponse> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(EnumConfig.GetListSysStructureTree, {}, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving list system structure tree:', error);
                    return throwError(error);
                })
            );
    }

    // Lấy danh sách module tree
    GetListModuleTree(level: number, dtoGroup?: DTOGroup): Observable<DTOResponse> {
        let param = {
            "Level": level,
            "DTO": dtoGroup
        }
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post<DTOResponse>(EnumConfig.GetListModuleTree, JSON.stringify(param), httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error retrieving list module tree:', error);
                    return throwError(error);
                })
            );
    }

    // Cập nhật module
    UpdateModule(objModule: DTOGroup): Observable<any> {
        const httpOptions = this.getHttpOptions();
        return this.httpClient.post(EnumConfig.UpdateModule, objModule, httpOptions)
            .pipe(
                catchError(error => {
                    console.error('Error updating module:', error);
                    return throwError(error);
                })
            );
    }
}