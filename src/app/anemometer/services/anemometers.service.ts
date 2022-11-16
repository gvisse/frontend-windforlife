import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, tap, Observable, throwError } from 'rxjs';
import { Anemometer } from 'src/app/anemometer/models/anemometer.model';
import { Tag } from 'src/app/tag/models/tag.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class AnemometersService {
  constructor(private http: HttpClient) {}

  getAnemometers(): Observable<Anemometer[]> {
    return this.http.get<Anemometer[]>(`${environment.apiUrl}/anemometer/`);
  }

  getAnemometerById(id: number): Observable<Anemometer> {
    return this.http.get<Anemometer>(`${environment.apiUrl}/anemometer/${id}/`).
      pipe(
        catchError((error) => { return throwError(() => error)})
      );
  }

  // updateAnemometerTags -> choisir quel tag on ajoute avec un select (multiple) sortant tous les tags disponibles (et déjà assigné à l'anémomètre)
}