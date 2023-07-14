import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor{
  marker: Marker;
  color: string;
}


@Component({
  templateUrl: './makers-page.component.html',
  styleUrls: ['./makers-page.component.css']
})
export class MakersPageComponent {

  @ViewChild('map') divMap?: ElementRef;

  public markers: MarkerAndColor[] = [];
 
  public map?: Map;
  public currentLngLat: LngLat = new LngLat(-75.56768727196558, 6.239536372223171);

  ngAfterViewInit(): void {
    
    if(!this.divMap) throw 'El elemento HTML no fue encontrado'

    this.map = new Map({
      container: this.divMap.nativeElement, // container ID
      style: 'mapbox://styles/mapbox/streets-v12', // style URL
      center: this.currentLngLat, // starting position [lng, lat]
      zoom: 13, // starting zoom
      });

      // Marker personalizado

      // const markerHtml = document.createElement('div');
      // markerHtml.innerHTML = 'Heider marker';

      // const marker = new Marker({
      //   // color: 'red,'
      //   element: markerHtml,
      // })
      //   .setLngLat(this.currentLngLat)
      //   .addTo(this.map);
  }

  createMarker() {
    if(!this.map) return;

    const color = '#xxxxxx'.replace(/x/g, y=>(Math.random()*16|0).toString(16));
    const lngLat = this.map.getCenter();
    this.addMarker(lngLat, color);
  }

  addMarker(lngLat: LngLat, color: string ){
    if(!this.map) return;

    const marker = new Marker({
      color: color,
      draggable: true,
    })
    .setLngLat(lngLat)
    .addTo(this.map);

    this.markers.push({
      marker,
      color
    });
    
  }

  deleteMarker(index: number){
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

}
