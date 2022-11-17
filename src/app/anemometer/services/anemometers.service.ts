import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, Observable, BehaviorSubject, delay} from 'rxjs';
import { Anemometer } from 'src/app/anemometer/models/anemometer.model';
import { environment } from '../../../environments/environment';

@Injectable()
export class AnemometersService {

  constructor(private http: HttpClient){}
    
  private _loading$ = new BehaviorSubject<boolean>(false);
  get loading$(): Observable<boolean> {
    return this._loading$.asObservable();
  }

  private _anemometers$ = new BehaviorSubject<Anemometer[]>([]);
  get anemometers$(): Observable<Anemometer[]> {
    return this._anemometers$.asObservable();
  }
  
  private setLoadingStatus(loading: boolean){
    this._loading$.next(loading);
  }

  private lastAnemosLoaded = 0;

  getAnemometersFromServeur(){
    if (Date.now() - this.lastAnemosLoaded <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.http.get<Anemometer[]>(`${environment.apiUrl}/anemometer/`).pipe(
      delay(1000),
      tap(anemometers => {
        this.lastAnemosLoaded = Date.now();
        this._anemometers$.next((anemometers as any)['results']);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getAnemometerById(id: number): Observable<Anemometer> {
    if (!this.lastAnemosLoaded) {
      this.getAnemometersFromServeur();
    }
    return this.anemometers$.pipe(
        map(anemometers => anemometers.filter(anemometer => anemometer.id === id)[0])
    );
  }

  // updateAnemometerTags -> choisir quel tag on ajoute avec un select (multiple) sortant tous les tags disponibles (et déjà assigné à l'anémomètre)
}