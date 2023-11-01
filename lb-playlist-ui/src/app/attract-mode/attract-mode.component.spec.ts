import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttractModeComponent } from './attract-mode.component';

describe('AttractModeComponent', () => {
  let component: AttractModeComponent;
  let fixture: ComponentFixture<AttractModeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AttractModeComponent]
    });
    fixture = TestBed.createComponent(AttractModeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
