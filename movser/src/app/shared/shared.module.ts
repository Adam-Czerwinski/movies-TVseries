import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeToggleComponent } from './dark-mode-toggle/dark-mode-toggle.component';
import { MovieDetailsModalComponent } from './movie-details-modal/movie-details-modal.component';



@NgModule({
  declarations: [DarkModeToggleComponent, MovieDetailsModalComponent],
  imports: [
    CommonModule
  ],
  exports:[DarkModeToggleComponent, MovieDetailsModalComponent]
})
export class SharedModule { }
