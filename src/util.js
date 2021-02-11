import React from "react";
import numeral from "numeral";
import { Circle, Popup } from "react-leaflet";

// ! helper function
export const sortData = (data) => {
  const sortedData = [...data];
  //   return the sorted data (sort by number)
  //   -1 can be considered as false
  return sortedData.sort((a, b) => (a.cases > b.cases ? -1 : 1));
};

//! format numbers
export const prettyFormatStats = (stat) => {
  return stat ? `+${numeral(stat).format("0.0a")}` : "+0";
};

// ! util for map
const casesTypeColors = {
  cases: {
    hex: "#CC1034",
    rgb: "rgb(204,16,52)",
    half_op: "rgba(204,16,52,0.5)",
    multiplier: 350,
  },
  recovered: {
    hex: "#7dd71d",
    rgb: "rgb(125,215,29)",
    half_op: "rgba(125,215,29,0.5)",
    multiplier: 1200,
  },
  deaths: {
    hex: "#fb4443",
    rgb: "rgb(251,68,67)",
    half_op: "rgba(251,68,67,0.5)",
    multiplier: 2000,
  },
};
//?Draw circles with interactive tooltip
export const showDataOnMap = (data, casesTypes = "cases") => {
  return data.map((country) => (
    <Circle
      center={[country.countryInfo.lat, country.countryInfo.long]}
      fillOpacity={0.4}
      color={casesTypeColors[casesTypes].hex}
      fillColor={casesTypeColors[casesTypes].hex}
      radius={
        Math.sqrt(country[casesTypes]) * casesTypeColors[casesTypes].multiplier
      }
    >
      <Popup>
        <div className="info-container">
          <div
            className="info-flag"
            style={{ backgroundImage: `url(${country.countryInfo.flag})` }}
          ></div>
          <div className="info-name">{country.country}</div>
          <div className="info-confirmed">
            Cases: {numeral(country.cases).format("0,0")}
          </div>
          <div className="info-recovered">
            Recovered: {numeral(country.recovered).format("0,0")}
          </div>
          <div className="info-deaths">
            Deaths: {numeral(country.deaths).format("0,0")}
          </div>
        </div>
      </Popup>
    </Circle>
  ));
};
