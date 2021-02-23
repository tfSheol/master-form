import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogAddInputComponent } from './dialog-add-input.component';

describe('DialogAddInputComponent', () => {
  let component: DialogAddInputComponent;
  let fixture: ComponentFixture<DialogAddInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogAddInputComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogAddInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
