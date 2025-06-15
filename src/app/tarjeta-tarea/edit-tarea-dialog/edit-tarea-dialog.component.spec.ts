import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditTareaDialogComponent } from './edit-tarea-dialog.component';

describe('EditTareaDialogComponent', () => {
  let component: EditTareaDialogComponent;
  let fixture: ComponentFixture<EditTareaDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditTareaDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditTareaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
