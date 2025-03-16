import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClaimById, fraudCompare } from "@/services/claims";
import {
  CheckCircle,
  XCircle,
  AlertTriangle,
  Camera,
  Car,
  Palette,
  Hash,
  AlertCircle,
  FileText,
  ShieldCheck,
  MapPin,
  Mic,
  Image,
} from "lucide-react";
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
    queryFn: () => getClaimById(id),
    staleTime: Infinity,
    retry: false,
  });

  const {
    data: fraud,
    isLoading: isFraudLoading,
    error: fraudError,
  } = useQuery({
    queryKey: ["fraud", id],
    queryFn: () => fraudCompare(id),
    staleTime: Infinity,
    retry: false,
  });

  console.log(fraud?.data?.fraud);
  // fraud?.model_result?.model
  // console.log(fraud?.data?.vehicle);

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
    <>
      {/* <div className="bg-white shadow-lg rounded-xl p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Vehicle Details
        </h2>

        <div className="p-4 bg-gray-100 rounded-lg mb-4">
          <p className="text-lg font-bold">
            Claim ID: {fraud?.data?.vehicle?._id}
          </p>
          <p className="text-lg font-bold">
            User ID: {fraud?.data?.vehicle?.userId}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-lg font-semibold">Insurance Policy No:</p>
            <p className="text-gray-700">
              {fraud?.data?.vehicle?.insurancePolicyNo}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">Vehicle Model:</p>
            <p className="text-gray-700">
              {fraud?.data?.vehicle?.vehicleModel}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">Engine No:</p>
            <p className="text-gray-700">{fraud?.data?.vehicle?.engineNo}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Chassis No:</p>
            <p className="text-gray-700">{fraud?.data?.vehicle?.chassisNo}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">VIN:</p>
            <p className="text-gray-700">{fraud?.data?.vehicle?.vinNumber}</p>
          </div>
          <div>
            <p className="text-lg font-semibold">Vehicle Color:</p>
            <p className="text-gray-700">
              {fraud?.data?.vehicle?.vehicleColor}
            </p>
          </div>
          <div>
            <p className="text-lg font-semibold">Vehicle Number Plate:</p>
            <p className="text-gray-700">
              {fraud?.data?.vehicle?.vehicleNumberPlate}
            </p>
          </div>
        </div>

        <h3 className="text-xl font-bold text-gray-800 mt-6">Insurance Card</h3>
        <div className="flex gap-2 mt-2">
          <img
            src={fraud?.data?.vehicle?.insuranceCard?.front}
            alt="Insurance Card Front"
            className="w-32 h-32 rounded-md shadow"
          />
          <img
            src={fraud?.data?.vehicle?.insuranceCard?.back}
            alt="Insurance Card Back"
            className="w-32 h-32 rounded-md shadow"
          />
        </div>

        <h3 className="text-xl font-bold text-gray-800 mt-6">Vehicle Photos</h3>
        <div className="flex flex-wrap gap-2 mt-2">
          {Object.entries(fraud?.data?.vehicle?.vehiclePhotos || {}).map(
            ([key, url]) => (
              <div key={key} className="text-center">
                <p className="text-sm font-semibold capitalize">{key}</p>
                <img
                  src={url}
                  alt={key}
                  className="w-32 h-32 rounded-md shadow"
                />
              </div>
            )
          )}
        </div>

        <h3 className="text-xl font-bold text-gray-800 mt-6">
          Number Plate Images
        </h3>
        <div className="flex gap-2 mt-2">
          <img
            src={fraud?.data?.vehicle?.numberPlateImages?.front}
            alt="Front Number Plate"
            className="w-32 h-32 rounded-md shadow"
          />
          <img
            src={fraud?.data?.vehicle?.numberPlateImages?.back}
            alt="Back Number Plate"
            className="w-32 h-32 rounded-md shadow"
          />
        </div>
      </div> */}
      <div className="p-6 bg-white shadow-md rounded-lg mb-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-3 px-5 rounded-md shadow-md flex items-center gap-2">
          <FileText size={24} />
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            Claim Details
          </h2>
        </div>

        {/* Claim Info */}
        <div className="p-4 bg-gray-100 rounded-md mt-4 flex justify-between items-center">
          <p className="text-sm font-medium">
            Claim ID: <span className="font-bold">{claim.data._id}</span>
          </p>
          <span
            className={`px-3 py-1 text-sm font-medium rounded-md ${
              claim.data.status === "Approved"
                ? "bg-green-600 text-white"
                : claim.data.status === "Pending"
                ? "bg-yellow-500 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {claim.data.status}
          </span>
        </div>

        {/* Insurance Details */}
        <div className="p-4 bg-gray-50 rounded-md mt-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
            <ShieldCheck className="text-blue-500" size={18} /> Insurance
            Details
          </h3>
          <div className="grid grid-cols-2 gap-3 mt-2 text-sm text-gray-800">
            <p>
              Insurance ID:{" "}
              <span className="font-medium">{claim.data.insuranceId}</span>
            </p>
            <p>
              NIC No: <span className="font-medium">{claim.data.nicNo}</span>
            </p>
            <p>
              License No:{" "}
              <span className="font-medium">{claim.data.drivingLicenseNo}</span>
            </p>
          </div>
        </div>

        {/* Damage Details */}
        <div className="p-4 bg-gray-50 rounded-md mt-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
            <AlertTriangle size={18} /> Damage Details
          </h3>
          <p className="mt-1 text-sm text-gray-700">
            <span className="font-medium">Damaged Areas:</span>{" "}
            {claim.data.damagedAreas.join(", ")}
          </p>
        </div>

        {/* Audio Recording */}
        <div className="p-4 bg-gray-50 rounded-md mt-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-600">
            <Mic size={18} /> Voice Record
          </h3>
          <audio controls className="w-full mt-2">
            <source src={claim.data.audio} type="audio/mpeg" />
            Your browser does not support the audio element.
          </audio>
        </div>

        {/* Uploaded Images */}
        <div className="p-4 bg-gray-50 rounded-md mt-4">
          <h3 className="text-lg font-semibold flex items-center gap-2 text-blue-600">
            <Image size={18} /> Uploaded Images
          </h3>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3">
            {/* Insurance Images */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                Insurance Documents
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.insuranceFront}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="Insurance Front"
                />
                <img
                  src={claim.data.insuranceBack}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="Insurance Back"
                />
              </div>
            </div>

            {/* NIC Images */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                NIC Documents
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.nicFront}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="NIC Front"
                />
                <img
                  src={claim.data.nicBack}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="NIC Back"
                />
              </div>
            </div>

            {/* License Images */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                License Documents
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.drivingLicenseFront}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="License Front"
                />
                <img
                  src={claim.data.drivingLicenseBack}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="License Back"
                />
              </div>
            </div>

            {/* License Plates */}
            <div className="bg-white p-3 rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                License Plates
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.frontLicencePlate}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="Front License Plate"
                />
                <img
                  src={claim.data.backLicencePlate}
                  className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                  alt="Back License Plate"
                />
              </div>
            </div>
          </div>

          {/* Damage Images */}
          <h4 className="mt-4 text-sm font-semibold text-red-600">
            Damage Images
          </h4>
          <div className="flex gap-2 mt-2 overflow-x-auto p-2">
            {claim.data.damageImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className="w-28 h-28 rounded-md shadow-md hover:scale-105 transition-transform"
                alt={`Damage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
      <div className="bg-white shadow-lg rounded-xl p-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-3 px-5 rounded-md shadow-md flex items-center gap-2 mb-5">
          <FileText size={24} />
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            Fraud Detection Results
          </h2>
        </div>
        {/* Vehicle Details */}
        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          {/* Section Header with Icon */}
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Car className="text-blue-600" size={24} />
            Vehicle Details
          </h3>

          <div className="mt-4 space-y-3">
            {/* Vehicle Model */}
            <div className="flex items-center gap-3">
              <Car className="text-indigo-500" size={20} />
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-gray-900">Model:</span>
                <span className="ml-2 text-indigo-600">
                  {fraud?.data?.fraud?.model_result?.model ?? "Unknown"}
                </span>
              </p>
            </div>

            {/* Vehicle Color */}
            <div className="flex items-center gap-3">
              <Palette className="text-green-500" size={20} />
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-gray-900">Color:</span>
                <span className="ml-2 text-green-600">
                  {fraud?.data?.fraud?.color?.color ?? "Not Detected"}
                </span>
              </p>
            </div>

            {/* Vehicle Number */}
            <div className="flex items-center gap-3">
              <Hash className="text-red-500" size={20} />
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-gray-900">
                  Number Plate:
                </span>
                {fraud?.data?.fraud?.number_plates?.status ? (
                  <span className="ml-2 text-red-600">
                    {fraud?.data?.fraud?.number_plates?.number_plate}
                  </span>
                ) : (
                  <span className="ml-2 text-gray-500">Not Available</span>
                )}
              </p>
            </div>
          </div>

          {/* Error Message (If Something is Missing) */}
          {!fraud?.data?.fraud?.model_result?.model ||
          !fraud?.data?.fraud?.color?.color ||
          !fraud?.data?.fraud?.number_plates?.number_plate ? (
            <div className="mt-4 flex items-center text-red-600">
              <AlertCircle size={20} />
              <p className="text-md ml-2">
                Some vehicle details could not be detected. Please verify
                manually.
              </p>
            </div>
          ) : null}
        </div>
        {/* Face Recognition */}
        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          {/* Section Header with Icon */}
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" />
            Face Recognition
          </h3>

          {/* Verification Status */}
          <div className="flex items-center gap-2 mt-3">
            {fraud?.data?.fraud?.face_result?.verified ? (
              <CheckCircle className="text-green-500 text-xl" />
            ) : (
              <XCircle className="text-red-500 text-xl" />
            )}
            <p
              className={`text-lg font-medium ${
                fraud?.data?.fraud?.face_result?.verified
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {fraud?.data?.fraud?.face_result?.verified
                ? "Verified"
                : "Not Verified"}
            </p>
          </div>

          {/* If Face Recognition Passed */}
          {fraud?.data?.fraud?.face_result?.status ? (
            <div className="mt-5">
              {/* Model Results */}
              <h4 className="text-xl font-semibold text-gray-700">
                Model Result
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-3">
                {fraud?.data?.fraud?.face_result?.model_results?.map(
                  (model, index) => (
                    <div
                      key={index}
                      className="bg-gray-100 p-4 rounded-lg shadow-md"
                    >
                      <p className="text-lg font-semibold text-gray-700">
                        Model:{" "}
                        <span className="text-indigo-600">{model.Model}</span>
                      </p>
                      <p className="text-md text-gray-500 flex items-center gap-2">
                        <Camera className="text-blue-500" size={16} />
                        Result:{" "}
                        <span
                          className={`font-medium ${
                            model.result ? "text-green-600" : "text-red-600"
                          }`}
                        >
                          {model.result.toString()}
                        </span>
                      </p>
                    </div>
                  )
                )}
              </div>

              <h4 className="text-xl font-semibold text-gray-700 mt-6">
                Images
              </h4>
              <div className="flex gap-4 mt-4 overflow-x-auto p-2">
                {fraud?.data?.fraud?.face_result?.images?.license && (
                  <div className="relative">
                    <img
                      src={fraud?.data?.fraud?.face_result?.images?.license}
                      className="w-54 h-36 rounded-lg shadow-lg border-2 border-gray-300"
                      alt="License"
                    />
                    <p className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      License
                    </p>
                  </div>
                )}
                {fraud?.data?.fraud?.face_result?.images?.driver && (
                  <div className="relative">
                    <img
                      src={fraud?.data?.fraud?.face_result?.images?.driver}
                      className="w-36 h-36 rounded-lg shadow-lg border-2 border-gray-300"
                      alt="Driver"
                    />
                    <p className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      Driver
                    </p>
                  </div>
                )}
                {fraud?.data?.fraud?.face_result?.images?.cropped_face && (
                  <div className="relative">
                    <img
                      src={
                        fraud?.data?.fraud?.face_result?.images?.cropped_face
                      }
                      className="w-36 h-36 rounded-lg shadow-lg border-2 border-gray-300"
                      alt="Cropped Face"
                    />
                    <p className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                      Licence Face
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            // If Face Recognition Fails
            <div className="mt-5 flex items-center gap-2 text-red-600">
              <XCircle className="text-2xl" />
              <p className="text-lg font-medium">
                Error Occurred in Face Recognition
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
