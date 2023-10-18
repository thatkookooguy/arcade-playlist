import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SoftTabsComponent } from './soft-tabs.component';

describe('SoftTabsComponent', () => {
  let component: SoftTabsComponent;
  let fixture: ComponentFixture<SoftTabsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ SoftTabsComponent ]
    });
    fixture = TestBed.createComponent(SoftTabsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
