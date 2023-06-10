import { Component, OnInit } from '@angular/core';
import { CountriesService } from '../../services/countries.service';
import { Country } from '../../interfaces/country';
import { Region } from '../../interfaces/region.type';



@Component({
  selector: 'app-by-region-page',
  templateUrl: './by-region-page.component.html',
  styles: [
  ]
})
export class ByRegionPageComponent implements OnInit {

  public countries: Country[] = [];
  public regions: Region[] = ['Africa', 'Americas', 'Asia', 'Europe', 'Oceania'];
  public selectedRegion?: Region;
  public isLoading: boolean = false;

  constructor( private service: CountriesService ) {}
  ngOnInit(): void {
    this.countries = this.service.cacheStore.byRegion.countries;
    this.selectedRegion = this.service.cacheStore.byRegion.region;
  }

  searchByRegion( term: Region ):void {
    this.isLoading = true;
    this.selectedRegion = term;

    this.service.searchRegion( term )
      .subscribe( countries => {
        this.countries = countries;
        this.isLoading = false;
      });

  }

}
