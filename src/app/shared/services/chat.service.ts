import { Injectable } from '@angular/core';
import { ApiService } from './api.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(private readonly _apiService: ApiService) {}

  askQuestion(data: any) {
    return this._apiService.post('/assistant', data);
  }

  checkImage(url: string) {
    return this._apiService.get(url);
  }
}
