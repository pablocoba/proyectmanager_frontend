import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateTareaDialogComponent } from './create-tarea-dialog.component';

describe('CreateTareaDialogComponent', () => {
  let component: CreateTareaDialogComponent;
  let fixture: ComponentFixture<CreateTareaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateTareaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateTareaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
