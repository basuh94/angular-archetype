import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <main class="home">
      <h1>angular-archetype</h1>
      <p>Arquetipo Angular con Clean Architecture / Hexagonal orientada a frontend.</p>

      <a routerLink="/posts/1">Ver ejemplo de feature posts (GET /posts/1)</a>
    </main>
  `,
  styleUrl: './home.page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomePage {}
