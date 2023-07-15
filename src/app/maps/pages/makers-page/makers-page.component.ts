import { Component, ElementRef, ViewChild } from '@angular/core';
import { Map, LngLat, Marker } from 'mapbox-gl';

interface MarkerAndColor{
  marker: Marker;
  color: string;
}

interface PlainMarker{
  lngLat: number[];
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

      this.readFromLocalStorage();

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
    this.saveToLocalStorage();

    marker.on('dragend', () => this.saveToLocalStorage());
    // dragend
    
  }

  deleteMarker(index: number){
    this.markers[index].marker.remove();
    this.markers.splice(index, 1);
  }

  flyTo(marker: Marker){
    if(!this.map) return;

    this.map.flyTo({
      zoom: 14,
      center: marker.getLngLat(),
    })
  }

  saveToLocalStorage(){
    const plainMarker: PlainMarker[] = this.markers.map(({ marker, color}) => {
      
      return{
        color,
        lngLat: marker.getLngLat().toArray(),
      }
    });

    localStorage.setItem('plainMarkers', JSON.stringify(plainMarker));

  }

  readFromLocalStorage(){
    const plainMarkersString = localStorage.getItem('plainMarkers') ?? '[]';
    const plainMarkers: PlainMarker[] = JSON.parse(plainMarkersString); //! Ojo

    plainMarkers.forEach(({ color, lngLat }) => {
      const [lng, lat] = lngLat;
      const coords = new LngLat(lng, lat);
      this.addMarker(coords, color);
    })
  }

}
