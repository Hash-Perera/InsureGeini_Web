import React, { useMemo } from "react";
import { GoogleMap, Marker, LoadScript } from "@react-google-maps/api";

const GoogleMapComponent = ({ latitude, longitude }) => {
  const mapContainerStyle = {
    width: "100%",
    height: "250px",
  };

  const center = useMemo(
    () => ({ lat: latitude, lng: longitude }),
    [latitude, longitude]
  );

  return (
    <LoadScript googleMapsApiKey="AIzaSyCM_jPgUk3E-KBeC_wSwmGCKrXBUT6UAko">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={15}
      >
        <Marker position={center} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapComponent;
