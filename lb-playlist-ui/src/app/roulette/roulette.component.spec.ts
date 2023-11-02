import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RouletteComponent } from './roulette.component';

describe('RouletteComponent', () => {
  let component: RouletteComponent;
  let fixture: ComponentFixture<RouletteComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RouletteComponent]
    });
    fixture = TestBed.createComponent(RouletteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
