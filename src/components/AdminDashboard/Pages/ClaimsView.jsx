import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClaimById } from "@/services/claims";
// import Map, { Marker } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";

export default function ClaimDetails() {
  const { id } = useParams();
  const {
    data: claim,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["claim", id],
    queryFn: async () => {
      try {
        const response = await getClaimById(id);
        return response;
      } catch (error) {
        console.error("Error fetching claim:", error.message);
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  if (isLoading)
    return (
      <div className="text-center text-gray-600">Loading claim details...</div>
    );
  if (error)
    return (
      <div className="text-center text-red-600">
        Failed to load claim details.
      </div>
    );

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 ">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Claim Details</h2>

      {/* Claim Info */}
      <div className="p-5 bg-gray-100 rounded-lg mb-4">
        <p className="text-lg font-bold">Claim ID: {claim.data._id}</p>
        <p className="text-md text-gray-700">
          Status:{" "}
          <span className="text-blue-600 font-semibold">
            {claim.data.status}
          </span>
        </p>
      </div>

      {/* Insurance Details */}
      <div className="p-5 bg-gray-100 rounded-lg mb-4">
        <h3 className="text-lg font-semibold">Insurance Details</h3>
        <p>Insurance ID: {claim.data.insuranceId}</p>
        <p>NIC No: {claim.data.nicNo}</p>
        <p>License No: {claim.data.drivingLicenseNo}</p>
      </div>

      {/* Damage Details & Map */}
      <div className="p-5 bg-gray-100 rounded-lg mb-4">
        <h3 className="text-lg font-semibold">Damage Details</h3>
        <p>Damaged Areas: {claim.data.damagedAreas.join(", ")}</p>
        {/* {claim.location && (
          // <Map
          //   initialViewState={{
          //     latitude: claim.location.latitude,
          //     longitude: claim.location.longitude,
          //     zoom: 14,
          //   }}
          //   style={{
          //     width: "100%",
          //     height: 200,
          //     borderRadius: "10px",
          //     marginTop: "10px",
          //   }}
          //   mapStyle="mapbox://styles/mapbox/streets-v11"
          //   mapboxAccessToken={process.env.REACT_APP_MAPBOX_TOKEN}
          // >
          //   <Marker
          //     latitude={claim.location.latitude}
          //     longitude={claim.location.longitude}
          //   />
          // </Map>
        )} */}
      </div>

      {/* Audio Recording */}
      <div className="p-5 bg-gray-100 rounded-lg mb-4">
        <h3 className="text-lg font-semibold">Voice Record</h3>
        <audio controls className="w-full mt-2">
          <source src={claim.data.audio} type="audio/mpeg" />
          Your browser does not support the audio element.
        </audio>
      </div>

      {/* Uploaded Images */}
      <div className="p-5 bg-gray-100 rounded-lg mb-4">
        <h3 className="text-lg font-semibold">Uploaded Images</h3>

        <div className="flex flex-wrap gap-4">
          <div>
            {/* Insurance Images */}
            <h4 h4 className="mt-4 font-medium text-gray-700">
              Insurance Documents
            </h4>
            <div className="flex gap-2 mt-2">
              <img
                src={claim.data.insuranceFront}
                className="w-32 h-32 rounded-md"
                alt="Insurance Front"
              />
              <img
                src={claim.data.insuranceBack}
                className="w-32 h-32 rounded-md"
                alt="Insurance Back"
              />
            </div>
          </div>

          <div>
            {/* NIC Images */}
            <h4 className="mt-4 font-medium text-gray-700">NIC Documents</h4>
            <div className="flex gap-2 mt-2">
              <img
                src={claim.data.nicFront}
                className="w-32 h-32 rounded-md"
                alt="NIC Front"
              />
              <img
                src={claim.data.nicBack}
                className="w-32 h-32 rounded-md"
                alt="NIC Back"
              />
            </div>
          </div>

          <div>
            {/* License Images */}
            <h4 className="mt-4 font-medium text-gray-700">
              License Documents
            </h4>
            <div className="flex gap-2 mt-2">
              <img
                src={claim.data.drivingLicenseFront}
                className="w-32 h-32 rounded-md"
                alt="License Front"
              />
              <img
                src={claim.data.drivingLicenseBack}
                className="w-32 h-32 rounded-md"
                alt="License Back"
              />
            </div>
          </div>

          <div>
            {/* Licencs plates */}
            <h4 className="mt-4 font-medium text-gray-700">Licence Plates</h4>
            <div className="flex gap-2 mt-2">
              <img
                src={claim.data.frontLicencePlate}
                className="w-32 h-32 rounded-md"
                alt="Front License Plate"
              />
              <img
                src={claim.data.backLicencePlate}
                className="w-32 h-32 rounded-md"
                alt="Back License Plate"
              />
            </div>
          </div>
        </div>

        {/* Damage Images */}
        <h4 className="mt-4 font-medium text-red-600">Damage Images</h4>
        <div className="flex gap-2 mt-2 overflow-x-auto">
          {claim.data.damageImages.map((img, index) => (
            <img
              key={index}
              src={img}
              className="w-32 h-32 rounded-md"
              alt={`Damage ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
