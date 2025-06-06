import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  OnChanges,
  SimpleChanges,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

import type * as Leaflet from 'leaflet';

@Component({
  selector: 'app-map-display',
  standalone: true,
  imports: [CommonModule],
  template: `<div #map class="h-full w-full rounded-lg"></div>`,
  styles: [':host { display: block; height: 100%; width: 100%; }'],
})
export class MapDisplayComponent implements AfterViewInit, OnChanges {
  @Input() lat  = 44.8673;
  @Input() lng  = -0.5755; // default: Bordeaux
  @Input() zoom = 10;

  @ViewChild('map', { static: true })
  private mapContainer!: ElementRef<HTMLDivElement>;

  private L?: typeof Leaflet;
  private map?: Leaflet.Map;
  private marker?: Leaflet.Marker;

  constructor(@Inject(PLATFORM_ID) private platformId: object) {}

  /** Client-only initialisation */
  async ngAfterViewInit(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) { // running in SSR, do not load Leaflet
      return;
    }

    const L = await import('leaflet');
    this.L = L;

    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.lat, this.lng],
      zoom:   this.zoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom:     19,
      attribution: '© OpenStreetMap contributors',
    }).addTo(this.map);
    this.marker = L.marker([this.lat, this.lng]).addTo(this.map);
    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) { return; }  // map not ready (or running in SSR)

    if (changes['lat'] || changes['lng']) {
      this.marker?.setLatLng([this.lat, this.lng]);
      this.map.setView([this.lat, this.lng], this.zoom);
    }

    if (changes['zoom']) {
      this.map.setZoom(this.zoom);
      this.map.invalidateSize();
    }
  }
}
