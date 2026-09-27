import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConseilsPersonnalisesComponent } from './conseils-personnalises.component';

describe('ConseilsPersonnalisesComponent', () => {
  let component: ConseilsPersonnalisesComponent;
  let fixture: ComponentFixture<ConseilsPersonnalisesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConseilsPersonnalisesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConseilsPersonnalisesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
