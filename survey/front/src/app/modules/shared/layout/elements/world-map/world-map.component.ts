import { Component, Inject, PLATFORM_ID, AfterViewInit } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-world-map',
  standalone: false,
  template: `
    <div id="map" class="map-container"></div>
    <div *ngIf="hoveredCountry" class="country-info">
      🟢 {{ hoveredCountry }}
    </div>
  `,
  styles: [`
    .map-container {
      height: 500px;
      border: 3px solid #2e7d32;
      border-radius: 10px;
      box-shadow: 0 0 15px rgba(46, 125, 50, 0.5);
    }
    .country-info {
      margin-top: 10px;
      font-weight: bold;
      color: #2e7d32;
      background: #e8f5e9;
      padding: 6px 10px;
      display: inline-block;
      border-radius: 6px;
      box-shadow: 0 2px 6px rgba(0,0,0,0.2);
    }
  `]
})
export class WorldMapComponent implements AfterViewInit {
  hoveredCountry = '';
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    this.isBrowser = isPlatformBrowser(this.platformId);
  }

async ngAfterViewInit() {
  if (!this.isBrowser) return;

  // ✅ Leaflet dynamic import with fallback
  const leafletModule: any = await import('leaflet');
  const L = leafletModule?.default ?? leafletModule;

  // 👇 Safe check for Icon
  if (L?.Icon?.Default) {
    (L.Icon.Default.prototype as any)._getIconUrl = () => '';
  }

  const map = L.map('map').setView([20, 0], 2);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/">OSM</a> &copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  const geoJson = await fetch('/assets/countries.geo.json').then(res => res.json());
  const countryInfo = await fetch('/assets/countries.json').then(res => res.json());

  const geoJsonLayer = L.geoJSON(geoJson, {
    style: () => ({
      fillColor: '#388e3c',
      color: '#ffffff',
      weight: 1,
      fillOpacity: 0.6
    }),
    onEachFeature: (feature: any, layer: any) => {
      const props = feature.properties;
      const countryCode = (props['ISO3166-1-Alpha-2'] || props.ISO_A2 || 'unknown').toUpperCase();
      const countryName = countryInfo[countryCode]?.name || props.ADMIN || 'Unknown';

      layer.on('mouseover', () => {
        this.hoveredCountry = countryName;
        (layer as L.Path).setStyle({
          fillColor: '#66bb6a',
          fillOpacity: 0.8,
          weight: 2,
          color: '#2e7d32'
        });
      });

      layer.on('mouseout', () => {
        this.hoveredCountry = '';
        geoJsonLayer.resetStyle(layer);
      });

      layer.on('click', () => {
        if (this.shouldOpenSite(countryCode)) {
          window.open(this.getUrlForCountry(countryCode), '_blank');
        }
      });
    }
  });

  geoJsonLayer.addTo(map);
}



  private shouldOpenSite(code: string): boolean {
    return ['IN', 'US', 'FR', 'JP', 'NG'].includes(code);
  }

  private getUrlForCountry(code: string): string {
    const urls: Record<string, string> = {
      IN: 'https://isas.ng/india',
      US: 'https://isas.ng/usa',
      FR: 'https://isas.ng/france',
      JP: 'https://isas.ng/japan',
      NG: 'https://www.google.com/'
    };
    return urls[code] || 'https://isas.ng';
  }
}
