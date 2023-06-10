import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, of, map, delay, tap } from 'rxjs';

import { Country } from '../interfaces/country';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({ providedIn: 'root' })
export class CountriesService {

  private apiUrl: string = 'https://restcountries.com/v3.1';
  public cacheStore: CacheStore = {
    byCapital: {   term: '', countries: [] },
    byCountries: { term: '', countries: [] },
    byRegion: {    region: '', countries: [] },
  }

  constructor(private http: HttpClient){}

  private searchCountriesRequest( url: string ): Observable<Country[]> {
    return this.http.get<Country[]>( url )
      .pipe(
        catchError( () => of ([]) ),
        delay( 100 )
      );
  }

  searchCapital( term:string ): Observable<Country[]> {
    const url = `${this.apiUrl}/capital/${term}`;
    return this.searchCountriesRequest( url )
      .pipe(
        tap( countries => this.cacheStore.byCapital = { term: term, countries: countries } )
      );
  }

  searchCountry( term:string ): Observable<Country[]> {
    const url = `${this.apiUrl}/name/${term}`;
    return this.searchCountriesRequest( url )
      .pipe(
        tap( countries => this.cacheStore.byCountries = { term: term, countries: countries } )
      );
  }

  searchRegion( region: Region ): Observable<Country[]> {
    const url = `${this.apiUrl}/region/${region}`;
    return this.searchCountriesRequest( url )
      .pipe(
        tap( countries => this.cacheStore.byRegion = { region,  countries })
      );
  }

  searchAlpha( code: string ): Observable<Country | null>  {
    return this.http.get<Country[]>(`${this.apiUrl}/alpha/${code}`)
      .pipe(
        map( countries => countries.length > 0 ? countries[0] : null ),
        catchError( () => of(null) )
      );
  }

}
