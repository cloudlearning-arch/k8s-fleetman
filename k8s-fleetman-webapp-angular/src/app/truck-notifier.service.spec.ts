import { TestBed, inject } from '@angular/core/testing';

import { TruckNotifierService } from './truck-notifier.service';

describe('TruckNotifierService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TruckNotifierService]
    });
  });

  it('should be created', inject([TruckNotifierService], (service: TruckNotifierService) => {
    expect(service).toBeTruthy();
  }));
});
