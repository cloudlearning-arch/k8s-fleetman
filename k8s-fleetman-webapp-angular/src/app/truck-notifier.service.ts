import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TruckNotifierService {

  constructor() { }

  sendMessage(message: String) {
    console.log('Notification Service: '+ message);
  }
}
