import { Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Movie } from '../model/movie.model';
import { map } from 'rxjs/operators';
import { Show } from '../model/show.model';
@Injectable({
  providedIn: 'root',
})
export class MoviesService {
  constructor(private _http: HttpClient) {}

  searchMovies(data: {
    query: string;
    page?: number;
  }): Observable<MoviesResult> {
    const params = { query: data.query };
    if (data.page) {
      params['page'] = data.page;
    }

    return this._http.get<MoviesResult>('/3/search/movie', {
      params: params,
    });
  }

  getGenres(): Observable<{ id: number; name: string }[]> {
    return this._http.get<any>('/3/genre/movie/list').pipe(
      map((re) => {
        return re.genres;
      })
    );
  }

  getMovies(data?: {
    page?: number;
    genres?: number[];
  }): Observable<MoviesResult> {
    const params: { [key: string]: string } = {
      sort_by: 'popularity.desc',
      include_adult: 'false',
      include_video: 'false',
      page: '1',
      language: 'en',
    };

    if (data) {
      if (data.page) {
        params.page = String(data.page);
      }

      if (data.genres) {
        params['with_genres'] = '';
        data.genres.forEach((g) => {
          if (g && !isNaN(+g)) {
            params['with_genres'] += g + ',';
          }
        });
        params['with_genres'] = params['with_genres'].substring(
          0,
          params['with_genres'].length - 1
        );
      }
    }

    return this._http.get<MoviesResult>('/3/discover/movie', {
      params: params,
    });
  }

  // #################################
  searchTvs(data: { query: string; page?: number }): Observable<ShowResult> {
    const params = { query: data.query };
    if (data.page) {
      params['page'] = data.page;
    }

    return this._http.get<ShowResult>('/3/search/tv', {
      params: params,
    });
  }

  getTvs(data?: {
    page?: number;
    genres?: number[];
  }): Observable<ShowResult> {
    const params: { [key: string]: string } = {
      sort_by: 'popularity.desc',
      include_adult: 'false',
      include_video: 'false',
      page: '1',
      language: 'en',
    };

    if (data) {
      if (data.page) {
        params.page = String(data.page);
      }

      if (data.genres) {
        params['with_genres'] = '';
        data.genres.forEach((g) => {
          if (g && !isNaN(+g)) {
            params['with_genres'] += g + ',';
          }
        });
        params['with_genres'] = params['with_genres'].substring(
          0,
          params['with_genres'].length - 1
        );
      }
    }

    return this._http.get<ShowResult>('/3/discover/tv', {
      params: params,
    });
  }
}

export interface MoviesResult {
  page: number;
  total_results: number;
  total_pages: number;
  results: Movie[];
}

export interface ShowResult {
  page: number;
  total_results: number;
  total_pages: number;
  results: Show[];
}
