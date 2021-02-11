import React from "react";
import "../info-box.css";
import "../Map.css";
import { MapContainer as LeafletMap, TileLayer, useMap } from "react-leaflet";
import { showDataOnMap } from "../util";

function Map({ countries, casesType, center, zoom }) {
  function SetView() {
    const map = useMap();
    map.setView(center, zoom);

    return null;
  }
  return (
    <div className="Map">
      <LeafletMap center={center} zoom={zoom}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        ></TileLayer>
        {/* setview is used to re-render (re-center) map on state change */}
        <SetView />
        {/* Draw Circles on the map based on incoming data */}
        {showDataOnMap(countries, casesType)}
      </LeafletMap>
    </div>
  );
}

export default Map;
