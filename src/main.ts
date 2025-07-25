/// <reference types="@angular/localize" />

import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

import 'leaflet/dist/leaflet.css';

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
