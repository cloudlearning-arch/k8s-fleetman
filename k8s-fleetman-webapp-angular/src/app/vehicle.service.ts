import { Injectable } from '@angular/core';
import { Vehicle } from './vehicle';
import { Observable, Subscription, ReplaySubject, BehaviorSubject ,  of, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import {Message} from '@stomp/stompjs';
import {StompService} from '@stomp/ng2-stompjs';

import {  LatLng } from 'leaflet';

@Injectable()
export class VehicleService  {

  subscription: ReplaySubject<Vehicle>;
  centerVehicle: BehaviorSubject<Vehicle>;
  centerVehicleHistory: BehaviorSubject<any>;

  constructor(private _stompService: StompService, private http: HttpClient) {
    // Store local reference to Observable
    // for use with template ( | async )
    var messages = new Subject();
    this.subscribe(messages);
    this.subscription = new ReplaySubject(5);
    this.centerVehicle = new BehaviorSubject(null);
    this.centerVehicleHistory = new BehaviorSubject(null);

    messages.next(
      {
        "body": {
          "name": "Ibrahims Truck",
          "lat": 53.35799806751310825347900390625,
          "longitude": -1.5097549371421337127685546875,
          "timestamp": "1601899291",
          "speed": 70
        }
      }
    );
    messages.next(
      {
        "body": {
          "name": "City Truck",
          "lat": 53.3798165805637836456298828125,
          "longitude": -1.46622528322041034698486328125,
          "timestamp": "1601898306",
          "speed": 50
        }
      }
    );

    messages.next(
      {
        "body": {
          "name": "City2 Truck",
          "lat": 53.3798165805637836456298828125,
          "longitude": -1.46622528322041034698486328125,
          "timestamp": "1601898306",
          "speed": 50
        }
      }
    );
  }

  subscribe(messages) {
    // Stream of messages
    // var messages = this._stompService.subscribe('/vehiclepositions/messages');
    
    
    // Subscribe a function to be run on_next message
    messages.subscribe(this.onMessage);
  }

  /** Consume a message from the _stompService */
  onMessage = (message) => {
    let body = message.body;
    console.log('Get message' + message);
    // update vehicle and notify
    let newVehicle = new Vehicle(body.name,
                                 Number(body.lat),
                                 Number(body.longitude),
                                 body.timestamp,
                                Number(body.speed));
    this.subscription.next(newVehicle);
  }

  updateCenterVehicle(centerVehicle: Vehicle) {
    this.centerVehicle.next(centerVehicle);

    if (centerVehicle == null)
    {
      this.centerVehicleHistory.next(null);
    }
    else
    {
      // call API gateway, get the history for this vehicle.
      this.http.get("http://" + window.location.hostname + ":" + window.location.port + "/api/history/" + centerVehicle.name);
    }
  }
}
