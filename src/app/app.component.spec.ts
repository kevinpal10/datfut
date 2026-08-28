import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { AppComponent } from './app.component';
import { DataFreshnessService } from './core/data-freshness';
import { provideHttpTesting } from './testing/test-providers';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent],
      // `router-outlet` está en la plantilla, así que el router debe existir.
      providers: [...provideHttpTesting(), provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
  });

  it('se crea', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('no muestra el aviso de caché mientras los datos son frescos', () => {
    const texto: string = fixture.nativeElement.textContent ?? '';
    expect(texto).not.toContain('caché');
  });

  it('muestra el aviso cuando el backend sirve datos rancios', () => {
    TestBed.inject(DataFreshnessService).marcarRancio();
    fixture.detectChanges();
    expect(fixture.nativeElement.textContent).toContain('caché');
  });
});
