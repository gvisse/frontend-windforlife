import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from 'src/app/core/models/tag.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class TagsService {
  constructor(private http: HttpClient) {}

  getPosts(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/tag`);
  }
}