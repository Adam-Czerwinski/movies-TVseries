import { Component, OnInit, Input } from '@angular/core';
import { Show } from 'src/app/model/show.model';
import { Movie } from 'src/app/model/movie.model';
import { ModalController, Platform } from '@ionic/angular';
import { MoviesService } from 'src/app/service/movies.service';

@Component({
  selector: 'app-movie-details-modal',
  templateUrl: './movie-details-modal.component.html',
  styleUrls: ['./movie-details-modal.component.scss'],
})
export class MovieDetailsModalComponent implements OnInit {
  public movie: Movie | Show;
  genres: {
    id: number;
    name: string;
  }[];

  movieGenres: string[] = [];
  constructor(
    private modalController: ModalController,
    public platform: Platform,
    private movieService: MoviesService
  ) {}

  ngOnInit() {
    console.log(this.movie);
    this.movieService.getGenres().subscribe((re) => {
      this.genres = re;
      this.movie.genre_ids.forEach((id) =>
        this.movieGenres.push(this.genres.find((or) => or.id == id).name)
      );
    });
  }

  onClose(): void {
    this.modalController.dismiss();
  }
}
