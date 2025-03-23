import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BiometricsContainerComponent } from './side-bar/components/biometrics-container/biometrics-container.component';

@Component({
  imports: [BiometricsContainerComponent, RouterModule],
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'project-app';
}
