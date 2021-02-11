import React, { useState, useEffect } from "react";
import { MenuItem, FormControl, Select, Card } from "@material-ui/core";
import "./App.css";
import InfoBox from "./components/InfoBox";
import Map from "./components/Map";
import Table from "./components/Table";
import { sortData, prettyFormatStats } from "./util";
import LineGraph from "./components/LineGraph";
import "leaflet/dist/leaflet.css";

function App() {
  const [countries, setCountries] = useState([]); //list of all the countries with covid cases
  const [country, setCountry] = useState("worldwide"); //store drop menu selection
  const [countryInfo, setCountryInfo] = useState({}); //for all data
  const [tableData, setTableData] = useState([]); // sorted data of all countries by # of cases
  const [mapCenter, setMapCenter] = useState({
    lat: 30.2638255,
    lng: -42.5757726,
  }); //center on a map
  const [mapZoom, setMapZoom] = useState(2.7); //default zoom of the map
  const [mapCountries, setMapCountries] = useState([]); //
  const [casesType, setCasesType] = useState("cases");

  //? Get info from all the countries worldwide
  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all").then((res) =>
      res.json().then((data) => {
        //? all of the data from API (worldwide)
        setCountryInfo(data);
      })
    );
  }, []);

  //? 1) get names of all the countries and the abbrevation
  //? 2) sort the data by number of cases and set the table data
  //? 3) set the list of countries by setCountries
  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries").then((response) =>
        response.json().then((data) => {
          const countries = data.map((country) => ({
            name: country.country, //? Pakistan, United Kindom
            value: country.countryInfo.iso2, //? PK, UK
          }));
          // sort the data by number of cases
          const sortedData = sortData(data);
          // set tabled data as sorted
          setTableData(sortedData);
          //
          setMapCountries(data);
          // set all countries for drop down menu
          setCountries(countries);
        })
      );
    };
    getCountriesData();
  }, []);

  //
  //? Handle a selection change from dropdown menu (handle UI changes if necessary)
  //? 1) set the selected country state by setCountry
  //? 2) Create a URL to fetch details for the selected country and fetch
  //? 3) update countryInfo state with the new country specific data (aka: change the InfoBox)
  //? 4) re-render the map by changing mapCenter and mapZoom state
  //
  const onCountryChange = async (event) => {
    const countryCode = event.target.value;
    setCountry(countryCode);

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url).then((res) =>
      res.json().then((data) => {
        setCountry(countryCode);

        //? all of the data from API (worldwide and/or an individual country)
        setCountryInfo(data);

        //? change map center when a country is changed
        setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
        setMapZoom(4);
      })
    );
  };
  return (
    <div className="app">
      <div className="app__left">
        <div className="app__header">
          <h1>Covid-19 Tracker</h1>
          <FormControl className="app__dropdown">
            <Select
              variant="outlined"
              onChange={(e) => onCountryChange(e)}
              value={country}
            >
              <MenuItem value="worldwide">Worldwide</MenuItem>
              {countries.map((country) => (
                <MenuItem value={country.value}>{country.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>

        <div className="app__stats">
          <InfoBox
            title={"Coronavirus cases"}
            cases={prettyFormatStats(countryInfo.todayCases)}
            total={prettyFormatStats(countryInfo.cases)}
          ></InfoBox>
          <InfoBox
            title={"Recovered"}
            cases={prettyFormatStats(countryInfo.todayRecovered)}
            total={prettyFormatStats(countryInfo.recovered)}
          ></InfoBox>
          <InfoBox
            title={"Deaths"}
            cases={prettyFormatStats(countryInfo.todayDeaths)}
            total={prettyFormatStats(countryInfo.deaths)}
          ></InfoBox>
        </div>

        <Map countries={mapCountries} center={mapCenter} zoom={mapZoom}></Map>
      </div>

      <Card className="app__right">
        <h3>Live Cases by Country</h3>
        <Table countries={tableData} />
        <h3>Worldwide new cases</h3>
        <LineGraph />
      </Card>
    </div>
  );
}

export default App;
