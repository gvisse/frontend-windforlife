import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Anemometer } from 'src/app/anemometer/models/anemometer.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class AnemometersService {
  constructor(private http: HttpClient) {}

  getAnemometers(): Observable<Anemometer[]> {
    return this.http.get<Anemometer[]>(`${environment.apiUrl}/anemometer/`);
  }
}