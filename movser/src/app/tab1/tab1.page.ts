import { Component, ViewChild } from '@angular/core';
import { MoviesService } from '../service/movies.service';
import { Movie } from '../model/movie.model';
import {
  IonInfiniteScroll,
  Platform,
  IonSearchbar,
  IonProgressBar,
  LoadingController,
  IonSelect,
  ModalController,
  ToastController,
} from '@ionic/angular';
import { timeout, delay } from 'rxjs/operators';
import { of } from 'rxjs';
import { MovieDetailsModalComponent } from '../shared/movie-details-modal/movie-details-modal.component';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
})
export class Tab1Page {
  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;
  @ViewChild(IonSearchbar) searchbar: IonSearchbar;
  @ViewChild(IonProgressBar) progressbar: IonProgressBar;
  @ViewChild(IonSelect) genresSelect: IonSelect;

  genres: { id: number; name: string }[] = [];

  movies: Movie[];
  pagination = <
    {
      page: number;
      total_pages: number;
      total_results: number;
      results: number;
    }
  >{};
  state = <
    {
      error: boolean;
      errorMessage: string;
      isLoading: boolean;
      state: 'discover_movies' | 'find_movies';
      ignoreSelectChange: boolean;
      ignoreSearchChange: boolean;
    }
  >{};

  async presentLoading() {
    const loading = await this.loadingController.create({
      cssClass: 'my-spinner',
      message: 'Ładowanie...',
    });
    await loading.present();
  }

  constructor(
    private _moviesService: MoviesService,
    public platform: Platform,
    public loadingController: LoadingController,
    private modalController: ModalController,
    private toastController: ToastController
  ) {
    this.state.isLoading = true;
    this.fetchMovies();
    this._moviesService.getGenres().subscribe(
      (re) => (this.genres = re),
      (err) => {
        this.showToast('Wystąpił nieoczekiwany błąd');
      }
    );
  }

  async openDetails(movie: Movie): Promise<any> {
    const x = await this.modalController.create({
      component: MovieDetailsModalComponent,
      componentProps: { movie: movie },
    });

    return await x.present();
  }

  async showToast(message?: string): Promise<void> {
    const toast = await this.toastController.create({
      message: message ? message : this.state.errorMessage,
      duration: 4000,
    });
    return toast.present();
  }

  private fetchMovies(data?: { page: number; genres?: number[] }): void {
    this.state.isLoading = true;
    this.state.error = false;
    this.state.errorMessage = undefined;
    this.state.state = 'discover_movies';
    setTimeout((_) => {
      this._moviesService
        .getMovies(data)
        .subscribe(
          (re) => {
            this.movies = re.results;

            Object.assign(this.pagination, re, { results: re.results.length });
            return;
          },
          (error) => {
            this.state.error = true;
            this.state.errorMessage = error.errors
              ? error.errors[0]
              : 'Wystąpił nieoczekiwany błąd';
            this.showToast();
          }
        )
        .add((_) => {
          this.state.isLoading = false;
          this.loadingController.dismiss();
        });
    }, 2000);
  }

  onGenreChange(event): void {
    if (this.state.ignoreSelectChange) {
      this.state.ignoreSelectChange = false;
      return;
    }

    this.state.ignoreSearchChange = true;
    this.searchbar.value = '';
    this.presentLoading();
    setTimeout((_) => (this.state.ignoreSearchChange = false), 2000);
    this.fetchMovies({
      page: 1,
      genres: event.target.value as number[],
    });
  }

  onFind(event: any): void {
    if (this.state.ignoreSearchChange) {
      this.state.ignoreSearchChange = false;
      return;
    }

    this.state.ignoreSelectChange = true;
    this.genresSelect.value = [];

    this.presentLoading();
    if (!event.target.value) {
      this.fetchMovies();
      return;
    }

    this.findMovies(event.target.value);
  }

  private findMovies(title: string): void {
    this.state.isLoading = true;
    this.state.error = false;
    this.state.errorMessage = undefined;
    this.state.state = 'find_movies';

    setTimeout((_) => {
      this._moviesService
        .searchMovies({ query: title })
        .subscribe(
          (re) => {
            this.movies = re.results;

            Object.assign(this.pagination, re, { results: re.results.length });
            return;
          },
          (error) => {
            this.state.error = true;
            this.state.errorMessage = error.errors
              ? error.errors[0]
              : 'Wystąpił nieoczekiwany błąd';
            this.showToast();
          }
        )
        .add((_) => {
          this.state.isLoading = false;
          this.loadingController.dismiss();
        });
    }, 1000);
  }

  onFetchMoreMovies(): void {
    this.state.isLoading = true;
    this.state.error = false;
    this.state.errorMessage = undefined;
    if (this.state.state == 'discover_movies') {
      this.state.state = 'discover_movies';
      this._moviesService
        .getMovies({
          page: this.pagination.page + 1,
          genres: this.genresSelect.value,
        })
        .subscribe(
          (re) => {
            this.movies = [...this.movies, ...re.results];

            Object.assign(this.pagination, re, { results: re.results.length });
            return;
          },
          (error) => {
            this.state.error = true;
            this.state.errorMessage = error.errors
              ? error.errors[0]
              : 'Wystąpił nieoczekiwany błąd';
            this.showToast();
          }
        )
        .add((_) => {
          this.state.isLoading = false;
          this.loadingController.dismiss();
          this.infiniteScroll.complete();
        });
    } else if (this.state.state == 'find_movies') {
      this.state.state = 'find_movies';
      const title = this.searchbar.value;
      this._moviesService
        .searchMovies({ query: title, page: this.pagination.page + 1 })
        .subscribe(
          (re) => {
            this.movies = [...this.movies, ...re.results];

            Object.assign(this.pagination, re, { results: re.results.length });
            return;
          },
          (error) => {
            this.state.error = true;
            this.state.errorMessage = error.errors
              ? error.errors[0]
              : 'Wystąpił nieoczekiwany błąd';
            this.showToast();
          }
        )
        .add((_) => {
          this.state.isLoading = false;
          this.loadingController.dismiss();
          this.infiniteScroll.complete();
        });
    }
  }
}
