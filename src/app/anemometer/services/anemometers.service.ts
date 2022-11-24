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

  private _countAnemometers$ = new BehaviorSubject<number>(0);
  get countAnemometers$(): Observable<number>{
    return this._countAnemometers$.asObservable();
  }

  private _nextPage$ = new BehaviorSubject<string>('');
  get nextPage$(): Observable<string>{
    return this._nextPage$.asObservable();
  }

  private _previousPage$ = new BehaviorSubject<string>('');
  get previousPage$(): Observable<string>{
    return this._previousPage$.asObservable();
  }
  
  private setLoadingStatus(loading: boolean){
    this._loading$.next(loading);
  }

  private lastAnemosLoaded = 0;

  private setUrl(params: {[key:string]: string|number|undefined}[]): string{
    let getUrl = `${environment.apiUrl}/anemometer/?`;
    for(let param of params){
      for(let key in param){
        if(typeof param[key] !== 'undefined') getUrl += `&${key}=${param[key]}`
      }
    }
    return getUrl;
  }

  private getAnemometers(page?: number, size?: number){
    const getUrl = this.setUrl([{'page': page}, {'page_size': size}]);
    this.http.get<Anemometer[]>(getUrl).pipe(
      tap((anemometers:any) => {
        this.lastAnemosLoaded = Date.now();
        this._anemometers$.next(anemometers['results']);
        this._countAnemometers$.next(anemometers['count']);
        this._nextPage$.next(anemometers['next']);
        this._previousPage$.next(anemometers['previous']);
        this.setLoadingStatus(false);
      })
    ).subscribe();
  }

  getAllAnemometers(): void{
    this.http.get<Anemometer[]>(`${environment.apiUrl}/anemometer/?page_size=0`).pipe(
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
    return this.http.get<Anemometer>(`${environment.apiUrl}/anemometer/${id}`)
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

  goToPage(pageEvent: {page: number, size: number}): void{
    this.setLoadingStatus(true);
    this.getAnemometers(pageEvent.page, pageEvent.size);
  }

  updateAnemometer(id: number, formValue: {name: string, tags: Tag[]}){
    this.anemometers$.pipe(
      take(1),
      map(anemometers => anemometers
          .map(anemometer => anemometer.id === id ?
              {
                id : anemometer.id,
                name: formValue.name,
                tags: formValue.tags,
                latitude: anemometer.latitude,
                longitude: anemometer.longitude,
                altitude: anemometer.altitude
              } :
              anemometer
          )
      ),
      tap(updatedAnemometers => this._anemometers$.next(updatedAnemometers)),
      switchMap(updatedAnemometers =>
          this.http.patch(`${environment.apiUrl}/anemometer/${id}/`,
          updatedAnemometers.find(anemometer => anemometer.id === id))
      )
    ).subscribe();
  }
}