import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  currentpage: string = "recipes";

  handlePageRequest(requestedPage: string){
    this.currentpage = requestedPage;
  }
}
