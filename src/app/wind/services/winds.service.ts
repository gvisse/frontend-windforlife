import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Wind } from 'src/app/wind/models/wind.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class WindsService {
  constructor(private http: HttpClient) {}

  getTags(): Observable<Wind[]> {
    return this.http.get<Wind[]>(`${environment.apiUrl}/wind/`);
  }
}