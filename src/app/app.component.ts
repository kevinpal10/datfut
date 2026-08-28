import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DataFreshnessService } from './core/data-freshness';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'dashboard_futbol';

  /** Alimenta el aviso de datos en caché (SPEC §4.3). */
  protected freshness = inject(DataFreshnessService);
}
