import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent {
  @Output() pageChanger = new EventEmitter<string>();

  changePage(clickedPage: string){
    this.pageChanger.emit(clickedPage);
  }
}
