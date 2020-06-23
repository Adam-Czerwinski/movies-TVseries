import { Component, OnInit, AfterViewInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { MoviesService } from './service/movies.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private moviesService: MoviesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
      this.runAllTests();
    });
  }

  private async runAllTests(): Promise<void> {
    const passed = true;
    let allTests = 0;
    let passedTests = 0;
    let failedTests = 0;

    await this.getMoviesTest().then((re) => {
      allTests++;
      if (!passed) {
        console.log(`%c FAILED`, 'color: red; font-size: 20px', re);
        failedTests++;
      } else {
        console.log(`%c PASSED`, 'color: green; font-size: 20px', re);
        passedTests++;
      }
    });
    await this.getMoviesTitleTest().then((re) => {
      allTests++;
      if (!passed) {
        console.log(`%c FAILED`, 'color: red; font-size: 20px', re);
        failedTests++;
      } else {
        console.log(`%c PASSED`, 'color: green; font-size: 20px', re);
        passedTests++;
      }
    });
    await this.getShowsTest().then((re) => {
      allTests++;
      if (!passed) {
        console.log(`%c FAILED`, 'color: red; font-size: 20px', re);
        failedTests++;
      } else {
        console.log(`%c PASSED`, 'color: green; font-size: 20px', re);
        passedTests++;
      }
    });
    await this.getShowsTitleTest().then((re) => {
      allTests++;
      if (!passed) {
        console.log(`%c FAILED`, 'color: red; font-size: 20px', re);
        failedTests++;
      } else {
        console.log(`%c PASSED`, 'color: green; font-size: 20px', re);
        passedTests++;
      }
    });

    console.log('%c ILOŚĆ TESTÓW: ' + allTests, 'color:blue;font-size:20px');
    console.log(
      '%c ILOŚĆ ZALICZONYCH TESTÓW: ' + passedTests,
      'color:green;font-size:20px'
    );
    console.log(
      '%c ILOŚĆ NIEZALICZONYCH TESTÓW: ' + failedTests,
      'color:red;font-size:20px'
    );
  }

  private getMoviesTest(): Promise<{
    should: string;
    success: boolean;
    result: any;
    reason?: any;
  }> {
    return new Promise<{
      should: string;
      success: boolean;
      result: any;
      reason?: any;
    }>((resolve, reject) => {
      this.moviesService.getMovies().subscribe((response) => {
        const count = response.results.length == 20;

        if (count) {
          resolve({
            should: 'Powinien zwrócić 20 filmów',
            reason: `Oczekiwana wartość: 20. Zwrócono ${response.results.length}`,
            result: response.results,
            success: count,
          });
        } else {
          reject({
            should: 'Powinien zwrócić 20 filmów',
            reason: `Oczekiwana wartość: 20. Zwrócono ${response.results.length}`,
            result: response.results,
            success: count,
          });
        }
      });
    });
  }

  private getShowsTest(): Promise<{
    should: string;
    success: boolean;
    result: any;
    reason?: any;
  }> {
    return new Promise<{
      should: string;
      success: boolean;
      result: any;
      reason?: any;
    }>((resolve, reject) => {
      this.moviesService.getTvs().subscribe((response) => {
        const count = response.results.length == 20;

        if (count) {
          resolve({
            should: 'Powinien zwrócić 20 seriali',
            reason: `Oczekiwana wartość: 20. Zwrócono ${response.results.length}`,
            result: response.results,
            success: count,
          });
        } else {
          reject({
            should: 'Powinien zwrócić 20 seriali',
            reason: `Oczekiwana wartość: 20. Zwrócono ${response.results.length}`,
            result: response.results,
            success: count,
          });
        }
      });
    });
  }

  private getShowsTitleTest(): Promise<{
    should: string;
    success: boolean;
    result: any;
    reason?: any;
  }> {
    return new Promise<{
      should: string;
      success: boolean;
      result: any;
      reason?: any;
    }>((resolve, reject) => {
      this.moviesService
        .searchTvs({
          query: 'Harry Potter',
        })
        .subscribe((response) => {
          const includes = response.results[0].name
            .toLowerCase()
            .includes('Harry Potter'.toLowerCase());

          if (includes) {
            resolve({
              should:
                'Powinien zwrócić seriale z tytułem zawierającym słowo Harry Potter',
              result: response.results,
              success: includes,
            });
          } else {
            reject({
              should:
                'Powinien zwrócić seriale z tytułem zawierającym słowo Harry Potter',
              result: response.results,
              success: includes,
            });
          }
        });
    });
  }

  private getMoviesTitleTest(): Promise<{
    should: string;
    success: boolean;
    result: any;
    reason?: any;
  }> {
    return new Promise<{
      should: string;
      success: boolean;
      result: any;
      reason?: any;
    }>((resolve, reject) => {
      this.moviesService
        .searchMovies({
          query: 'Harry Potter',
        })
        .subscribe((response) => {
          const includes = response.results[0].title
            .toLowerCase()
            .includes('Harry Potter'.toLowerCase());

          if (includes) {
            resolve({
              should:
                'Powinien zwrócić filmy z tytułem zawierającym słowo Harry Potter',
              result: response.results,
              success: includes,
            });
          } else {
            reject({
              should:
                'Powinien zwrócić filmy z tytułem zawierającym słowo Harry Potter',
              result: response.results,
              success: includes,
            });
          }
        });
    });
  }
}
