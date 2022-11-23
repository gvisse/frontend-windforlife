import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, tap, Observable, BehaviorSubject, delay, switchMap, take} from 'rxjs';
import { Anemometer } from 'src/app/anemometer/models/anemometer.model';
import { Tag } from 'src/app/tag/models/tag.model';
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

  private _allAnemometers$ = new BehaviorSubject<Anemometer[]>([]);
  get allAnemometers$(): Observable<Anemometer[]>{
    return this._allAnemometers$.asObservable();
  }
  
  private setLoadingStatus(loading: boolean){
    this._loading$.next(loading);
  }

  private lastAnemosLoaded = 0;

  private getAnemometers(){
    this.http.get<Anemometer[]>(`${environment.apiUrl}/anemometer/`).pipe(
      tap(anemometers => {
        this.lastAnemosLoaded = Date.now();
        this._anemometers$.next((anemometers as any)['results']);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getAllAnemometers(): void{
    this.http.get<Tag[]>(`${environment.apiUrl}/anemometer/?page_size=0`).pipe(
      tap((anemos:any) => {
        this.lastAnemosLoaded = Date.now();
        this._allAnemometers$.next(anemos);
      })
    ).subscribe();
  }

  getAnemometersFromServeur(){
    if (Date.now() - this.lastAnemosLoaded <= 300000) {
      return;
    }
    this.setLoadingStatus(true);
    this.getAnemometers();
  }

  getAnemometerById(id: number): Observable<Anemometer> {
    if (!this.lastAnemosLoaded) {
      this.getAnemometersFromServeur();
    }
    return this.anemometers$.pipe(
        map(anemometers => anemometers.filter(anemometer => anemometer.id === id)[0])
    );
  }

  deleteAnemometer(id: number): void {
    this.setLoadingStatus(true);
    this.http.delete(`${environment.apiUrl}/anemometer/${id}`).pipe(
        switchMap(() => this.anemometers$),
        take(1),
        map(anemometers => anemometers.filter((anemometer:Anemometer) => anemometer.id !== id)),
        tap(anemometers => {
            this._anemometers$.next(anemometers);
            this.setLoadingStatus(false);
        })
    ).subscribe();
  }

  addAnemometer(formValue: {name: string, latitude:number, longitude: number, altitude: number, tags: {id: number, name: string}[] | null}){
    this.http.post<Anemometer>(`${environment.apiUrl}/anemometer/`, formValue).pipe(
      tap(() => this.getAnemometers())
    ).subscribe();
  }

  // updateAnemometerTags -> choisir quel tag on ajoute avec un select (multiple) sortant tous les tags disponibles (et déjà assigné à l'anémomètre)
}