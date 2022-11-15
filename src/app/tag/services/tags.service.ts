import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Tag } from 'src/app/tag/models/tag.model';
import { environment } from '../../../environments/environment';


@Injectable()
export class TagsService {
  constructor(private http: HttpClient) {}

  getTags(): Observable<Tag[]> {
    return this.http.get<Tag[]>(`${environment.apiUrl}/tag`);
  }
}