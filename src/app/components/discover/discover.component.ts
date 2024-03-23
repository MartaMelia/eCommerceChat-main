import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.component.html',
  styleUrls: ['./discover.component.scss']
})
export class DiscoverComponent {

  constructor(
    private _route: Router
  ) {}

  goToChatComponent() {
    this._route.navigate(['chat']);
  }
}
