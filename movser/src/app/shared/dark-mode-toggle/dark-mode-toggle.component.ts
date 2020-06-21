import { Component, OnInit, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-dark-mode-toggle',
  templateUrl: './dark-mode-toggle.component.html',
  styleUrls: ['./dark-mode-toggle.component.scss'],
})
export class DarkModeToggleComponent implements OnInit, AfterViewInit {
  private toggle;
  private prefersDark;
  constructor() { }

  ngOnInit() {
    
  }

  ngAfterViewInit(): void {
    
    // Query for the toggle that is used to change between themes
    this.toggle = document.querySelector('#themeToggle');
    this.prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    this.toggle.checked = document.body.classList.contains('dark');

    this.toggle.addEventListener('ionChange', (ev) => {
      document.body.classList.toggle('dark', ev.detail.checked);
    });
    // Listen for changes to the prefers-color-scheme media query
    this.prefersDark.addListener((e) => this.checkToggle(e.matches));

    this.loadApp();
  }

// Called when the app loads
private loadApp(): void {
  this.checkToggle(this.prefersDark.matches);
}

// Called by the media query to check/uncheck the toggle
private checkToggle(shouldCheck) {
  this.toggle.checked = shouldCheck;
}

}
