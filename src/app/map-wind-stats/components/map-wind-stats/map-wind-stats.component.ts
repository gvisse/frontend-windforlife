import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import maplibreGl, {GeoJSONSource, Map, NavigationControl, Popup } from 'maplibre-gl';
import { Observable } from 'rxjs';
import { Anemometer } from '../../../anemometer/models/anemometer.model';
import { AnemometersService } from '../../../anemometer/services/anemometers.service';
import { Tag } from '../../../tag/models/tag.model';
import { WindStatsService } from '../../services/wind-stats.service';

@Component({
  selector: 'app-map-wind-stats',
  templateUrl: './map-wind-stats.component.html',
  styleUrls: ['./map-wind-stats.component.scss']
})
export class MapWindStatsComponent implements OnInit, AfterViewInit {

  @ViewChild('map')
  private mapContainer!: ElementRef<HTMLElement>;

  anemometers$!: Observable<Anemometer[]>;

  map!: Map;

  minWind$!: Observable<number>;
  maxWind$!: Observable<number>;
  meanWind$!: Observable<number>;

  popup!: Popup;

  windStatsForm!: FormGroup;

  constructor(private anemometersService: AnemometersService,
              private windStatsService: WindStatsService,
              private fb: FormBuilder)
  {

  }

  ngOnInit(){
    this.initForm();
    this.anemometersService.getAllAnemometers();
    this.initObservables();
    this.popup = new maplibreGl.Popup({anchor: 'top',offset: [0, 7]})
  }

  ngAfterViewInit(){
    const initialState = {lng: -1.5634060, lat: 46.2441246, zoom: 2};
    const apiKey = '6208299ff37145eb8fd4a87e70831b14';
    const mapStyle = 'https://maps.geoapify.com/v1/styles/osm-bright/style.json';
    this.map = new Map({
      container: this.mapContainer.nativeElement,
      style: `${mapStyle}?apiKey=${apiKey}`,
      center: [initialState.lng, initialState.lat],
      zoom: initialState.zoom
    });

    const mapLoading = this.map;
    var features:any = [];
    this.anemometers$.subscribe(anemometers => {
        for(let anemometer of anemometers){
          features.push({
            type: 'Feature',
            properties: {
              title: anemometer.name,
              description: this.getPopupContent(anemometer)
            },
            geometry: {
              type: 'Point',
              'coordinates' : [anemometer.longitude, anemometer.latitude]
            }
          });
        }
    });
    mapLoading.on('load', function() {
      mapLoading.loadImage(
        'https://api.geoapify.com/v1/icon/?type=material&color=red&size=small&icon=my_location&iconType=material&iconSize=medium&apiKey=6208299ff37145eb8fd4a87e70831b14',
        function (error, image){
          if (error) throw error;
          if(image) mapLoading.addImage('custom-marker', image);
          mapLoading.addSource('circle', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [{
              }]
            }
          });
          mapLoading.addLayer({
            id: 'circle',
            type: 'fill',
            source : 'circle',
            layout: {},
            paint: {'fill-color': "#088", 'fill-opacity': 0.6}
          });
          mapLoading.addSource('places', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features : features
            }
          });
          mapLoading.addLayer({
            id: 'places',
            type: 'symbol',
            source: 'places',
            layout: {
              'icon-image': 'custom-marker',
              'icon-overlap': 'always'
            }
          });
          mapLoading.on('mouseenter', 'places', function(e){
            mapLoading.getCanvas().style.cursor = 'pointer'
          });
          mapLoading.on('mouseleave', 'places', function(e){
            mapLoading.getCanvas().style.cursor = ''
          });
          mapLoading.on('click', 'places', function (e) {
            if(e.features && e.features[0].geometry.type === 'Point'){
              mapLoading.flyTo({
                center: [e.features[0].geometry.coordinates[0], e.features[0].geometry.coordinates[1]],
                zoom: 5,
                speed: 0.8,
                easing: function (t) {
                  return t;
                },
              });
              var coordinates = e.features[0].geometry.coordinates.slice();
              if(e.features[0].properties){
                var description = e.features[0].properties['description'];
              }
              while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
              }
                
              new maplibreGl.Popup({
                anchor: 'bottom',
                offset: [0, -17], // height - shadow
                className: 'anemometer-popup',
                focusAfterOpen: false
              })
              .setLngLat(new maplibreGl.LngLat(coordinates[0], coordinates[1]))
              .setHTML(description)
              .addTo(mapLoading);
              }
          });
          
        }
      );      
      mapLoading.addControl(new NavigationControl({showCompass: true, showZoom: true, visualizePitch: false}));
    })
    this.map = mapLoading;
  }

  private initForm(){
    this.windStatsForm = this.fb.group({
      lng: [null, [Validators.required, Validators.min(-180), Validators.max(180)]],
      lat: [null, [Validators.required, Validators.min(-90), Validators.max(90)]],
      radius: [null, [Validators.required]]
    })
  }

  private initObservables(){
    this.minWind$ = this.windStatsService.min$;
    this.maxWind$ = this.windStatsService.max$;
    this.meanWind$ = this.windStatsService.mean$;
    this.anemometers$ = this.anemometersService.allAnemometers$;
  }

  getFormControlErrorText(ctrl: AbstractControl) {
    if (ctrl.hasError('required')) {
      return 'Ce champ est requis';
    } else if (ctrl.hasError('min')) {
      return `Merci d'entrer une coordonnée valide (> ${ctrl.errors!['min']['min']})`;
    } else if (ctrl.hasError('max')) {
      return `Merci d'entrer une coordonnée valide (< ${ctrl.errors!['max']['max']})`;
    } else {
      return 'Ce champ contient une erreur';
    }
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

  drawCircle(){
    if(this.windStatsForm.invalid){
      return;
    }
    var coordinates = {lat: this.windStatsForm.value['lat'], lng: this.windStatsForm.value['lng']}
    var radius = this.windStatsForm.value['radius']
    this.windStatsService.getStats(coordinates, radius * 1852).subscribe(() => {
      const map = this.map;
      var circleSource = this.map.getSource('circle') as GeoJSONSource;
      var windStats = this.getWindStatsData();
      const popup = this.popup
      function addPopup(e:any){
        // setDOMContent(document.createElement('div'))...
         popup.setLngLat(e.lngLat).setHTML(
          `min: ${windStats.min} kn<br/>
          max: ${windStats.max} kn<br/>
          mean: ${windStats.mean} kn`)
        .addTo(map);
      }

      var polygon = this.getCircleData(coordinates, radius);
      if(circleSource){
        circleSource.setData(polygon);
        map.getLayer('circle').setPaintProperty('fill-color', "#088");
        map.getLayer('circle').setPaintProperty('fill-opacity', 0.6);
        map.panTo([coordinates.lng, coordinates.lat])
        map.on('click', 'circle', addPopup);
      }
    });
    // call service to get data (http://localhost:8000/wind-stats?central_point=lat,long&radius=radius) {'min': xxx, 'max': xxx, 'mean': xxx}
    // store min, max, mean in observable and BehaviorSubject<number>(0)
    // draw circle and add stats in description of popup
  }


  private getWindStatsData(){
    var min = 0; var max = 0; var mean = 0;
    this.windStatsService.min$.subscribe(data => { min = data});
    this.windStatsService.max$.subscribe(data => { max = data});
    this.windStatsService.mean$.subscribe(data => { mean = data});
    return {min: min,max: max,mean: mean}
  }

  private getCircleData(coordinates : {lng: number, lat :number}, radius: number){
    const circleToPolygon = require("circle-to-polygon");
    var polygon = circleToPolygon([coordinates.lng, coordinates.lat], radius * 1852, { numberOfEdges: 2048});
    return polygon
  }
}
