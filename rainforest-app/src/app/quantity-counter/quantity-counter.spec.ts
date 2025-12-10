import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuantityCounter } from './quantity-counter';

describe('QuantityCounter', () => {
  let component: QuantityCounter;
  let fixture: ComponentFixture<QuantityCounter>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [QuantityCounter]
    })
    .compileComponents();

    fixture = TestBed.createComponent(QuantityCounter);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
