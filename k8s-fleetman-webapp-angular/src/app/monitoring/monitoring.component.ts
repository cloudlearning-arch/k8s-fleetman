import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TruckNotifierService } from '../truck-notifier.service';

@Component({
  selector: 'app-monitoring',
  templateUrl: './monitoring.component.html',
  styleUrls: ['./monitoring.component.css']
})
export class MonitoringComponent implements OnInit {

  constructor(private notifierService: TruckNotifierService) { }

  ngOnInit() {
  }

  onNotifyTrucks(form: NgForm) {
    const value = form.value;
    this.notifierService.sendMessage(value.broadcastMessage);
  }

}
