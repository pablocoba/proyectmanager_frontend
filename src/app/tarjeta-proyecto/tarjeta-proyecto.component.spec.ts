import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TarjetaProyectoComponent } from './tarjeta-proyecto.component';

describe('TarjetaProyectoComponent', () => {
  let component: TarjetaProyectoComponent;
  let fixture: ComponentFixture<TarjetaProyectoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TarjetaProyectoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TarjetaProyectoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
