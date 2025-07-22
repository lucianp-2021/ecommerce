import { TestBed } from '@angular/core/testing';

import { ShopForm } from './shop-form';

describe('ShopForm', () => {
  let service: ShopForm;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ShopForm);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
