import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import * as L from 'leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';

@Component({
  selector: 'app-map-picker',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative h-full w-full">
      <!-- Search bar -->
      <input
        #searchBox
        type="text"
        placeholder="Search location & press Enter"
        class="absolute z-[500] top-2 left-1/2 -translate-x-1/2 w-11/12 md:w-7/12 shadow-lg rounded px-4 py-2 text-sm focus:outline-none"
        (keyup.enter)="search(searchBox.value); searchBox.blur()"
      />

      <!-- Leaflet map canvas -->
      <div #map class="h-full w-full"></div>
    </div>
  `,
  styles: [':host { display: block; height: 100%; width: 100%; }'],
})
export class MapPickerComponent implements AfterViewInit {
  @Input() lat = 44.8673;
  @Input() lng = -0.5755; // Default: Bordeaux, France
  @Input() zoom = 13;

  /** Emits when a location is picked */
  @Output() locationSelected = new EventEmitter<{
    lat: number;
    lng: number;
    address?: string;
  }>();

  @ViewChild('map', { static: true }) mapContainer!: ElementRef<HTMLDivElement>;

  private map!: L.Map;
  private marker!: L.Marker;
  private provider = new OpenStreetMapProvider({
    params: { countrycodes: 'fr', addressdetails: 1 },
  });

  ngAfterViewInit(): void {
    this.map = L.map(this.mapContainer.nativeElement, {
      center: [this.lat, this.lng],
      zoom: this.zoom,
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© OpenStreetMap',
    }).addTo(this.map);

    this.marker = L.marker([this.lat, this.lng], { draggable: true }).addTo(
      this.map,
    );

    this.marker.on('dragend', () => {
      const { lat, lng } = this.marker.getLatLng();
      this.emitLocation(lat, lng);
    });

    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker.setLatLng(e.latlng);
      this.emitLocation(e.latlng.lat, e.latlng.lng);
    });

    setTimeout(() => this.map.invalidateSize(), 0); // recalculate map size after first render
    this.map.setView([this.lat, this.lng], this.zoom);
    this.marker.setLatLng([this.lat, this.lng]);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!this.map) return; // map not yet initialised

    if (changes['lat'] || changes['lng']) {
      this.marker.setLatLng([this.lat, this.lng]);
      this.map.setView([this.lat, this.lng], this.zoom);
    }

    if (changes['zoom']) {
      this.map.setZoom(this.zoom);
      this.map.invalidateSize(); // Recalculate tiles size after zoom change
    }
  }

  /* ---------- Search ---------- */
  search(query: string): void {
    const trimmed = query.trim();
    if (!trimmed) return;

    this.provider.search({ query: trimmed }).then((results) => {
      if (!results?.length) return;

      const { x, y, label } = results[0];
      this.map.setView([y, x], 14);
      this.marker.setLatLng([y, x]);
      this.emitLocation(y, x, label);
    });
  }

  /* ---------- Helpers ---------- */
  private emitLocation(lat: number, lng: number, address?: string): void {
    this.locationSelected.emit({ lat, lng, address });
  }
}
