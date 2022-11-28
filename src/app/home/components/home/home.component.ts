import { E } from '@angular/cdk/keycodes';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Map, Marker, NavigationControl, Popup } from 'maplibre-gl';
import { Observable, tap } from 'rxjs';
import { Anemometer } from 'src/app/anemometer/models/anemometer.model';
import { AnemometersService } from 'src/app/anemometer/services/anemometers.service';
import { Tag } from 'src/app/tag/models/tag.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, AfterViewInit {

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  anemometers$!: Observable<Anemometer[]>;

  constructor(private anemometersService: AnemometersService){

  }

  ngOnInit(){
    this.anemometersService.getAllAnemometers();
    this.anemometers$ = this.anemometersService.allAnemometers$;
  }

  ngAfterViewInit(){
    const initialState = {lng: 45.8793252, lat: 6.8786695, zoom: 1};

    const apiKey = '6208299ff37145eb8fd4a87e70831b14';
    const mapStyle = 'https://maps.geoapify.com/v1/styles/osm-bright/style.json';
    const map = new Map({
      container: this.mapContainer.nativeElement,
      style: `${mapStyle}?apiKey=${apiKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    map.addControl(new NavigationControl({showCompass: true, showZoom: true, visualizePitch: false}));
    this.anemometers$.subscribe(anemometers => {
      for(let anemometer of anemometers){
          var element = this.createElement(27, 40);
          var markerPopup = new Popup({
            anchor: 'bottom',
            offset: [0, -37], // height - shadow
            className: 'anemometer-popup',
            focusAfterOpen: false
          });
          var popupContent = document.createElement('div');
          popupContent.classList.add('anemometer-popup')
          popupContent.innerHTML = this.getPopupContent(anemometer);
          markerPopup.setDOMContent(popupContent);
          var marker = new Marker(element, {anchor: 'bottom', offset:[0, 5], draggable:false})
            .setLngLat([Number(anemometer.longitude), Number(anemometer.latitude)])
            .setPopup(markerPopup)
            .addTo(map)
        }
    });

  }

  getPopupContent(anemometer:Anemometer): string{
    var tagsContent = this.getTagsContent(anemometer.tags);
    var anemometerContent = `<mat-card appearance="raised">
      <mat-card-header>
        <mat-card-title><a href="anemometer/${anemometer.id}">${anemometer.name}</a></mat-card-title>
      </mat-card-header>
      <mat-card-content>
        <div>Lat: ${anemometer.latitude}°</div>
        <div>Long: ${anemometer.longitude}°</div>
      </mat-card-content>
      <mat-card-footer>
      ${tagsContent}
      </mat-card-footer>
    </mat-card>`
    return anemometerContent
  }

  getTagsContent(tags:Tag[] |undefined): string{
    var tagsContent = '';
    if(typeof tags !== 'undefined'){
      tagsContent = `<ul class="anemometer-tags d-flex flex-item-center flex-justify-end flex-wrap">`
      for(let tag of tags){
        tagsContent += `<li><a class="tag-name">${tag.name}</a></li>`
      }
      tagsContent += `</ul>`
    }
    return tagsContent;
  }

  createElement(width:number, height:number): HTMLElement{
    var element = document.createElement('div');
    element.style.height = `${height}px`;
    element.style.width = `${width}px`;
    element.style.backgroundImage = "url(https://api.geoapify.com/v1/icon/?type=material&color=%23ff0000&icon=my_location&scaleFactor=2&apiKey=6208299ff37145eb8fd4a87e70831b14)";
    element.style.backgroundSize = 'contain';
    element.style.cursor = 'pointer';
    return element
  }
}
