import { Component, Input, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.css']
})
export class CarouselComponent implements AfterViewInit {
  @Input() documents: any[] = [];
  @Input() itemTemplate!: TemplateRef<any>; // template for rendering each item

  currentIndex = 0;

  ngAfterViewInit() {
    // Optional: you could setup autoplay or lazy loading here
  }

  prev() {
    this.currentIndex = (this.currentIndex === 0) ? this.documents.length - 1 : this.currentIndex - 1;
  }

  next() {
    this.currentIndex = (this.currentIndex === this.documents.length - 1) ? 0 : this.currentIndex + 1;
  }
}
