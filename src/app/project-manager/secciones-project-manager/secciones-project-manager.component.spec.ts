import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeccionesProjectManagerComponent } from './secciones-project-manager.component';

describe('SeccionesProjectManagerComponent', () => {
  let component: SeccionesProjectManagerComponent;
  let fixture: ComponentFixture<SeccionesProjectManagerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeccionesProjectManagerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeccionesProjectManagerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
