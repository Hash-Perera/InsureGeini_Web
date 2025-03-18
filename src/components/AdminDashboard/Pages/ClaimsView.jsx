import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getClaimById, fraudCompare, fraudApprove } from "@/services/claims";
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
  BadgeCheck,
  Activity,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { fraudApproveSchema } from "@/constants/validationSchema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import GoogleMapComponent from "../components/google-map";
import { obdCodes, statusColors } from "@/constants/other";
import { format } from "date-fns";
// import Map, { Marker } from "react-map-gl";
// import "mapbox-gl/dist/mapbox-gl.css";
import { staffTypes } from "@/constants/other.js";

export default function ClaimDetails() {
  const { id } = useParams();
  const [submitLoading, setSubmitLoading] = useState(false);
  const queryClient = useQueryClient();

  // // Submit form data
  const fraudApproveForm = useForm({
    resolver: zodResolver(fraudApproveSchema),
    defaultValues: {
      claimId: id,
      status: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      try {
        setSubmitLoading(true);
        const response = await fraudApprove(data);
        toast.success("Submitted successfully");
        queryClient.invalidateQueries({ queryKey: ["staff"] });
        fraudApproveForm.reset();
        return response;
      } catch (error) {
        toast.error("Error occurred");
      } finally {
        setSubmitLoading(false);
      }
    },
  });

  //! Data Get Queries ===>
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

  //! Data Preperation Queries =====>
  const obdCodesString = fraud?.data?.obdData?.obdCodes;
  const obdCodeStringArray = obdCodesString?.split(",");
  const obdObjectList = obdCodeStringArray?.map((code) => {
    const obdObject = obdCodes.find((obd) => obd.code === code);
    return obdObject;
  });

  const imageLocation = claim?.data?.imageLocation;
  const actualLocation = claim?.data?.location;

  const isLocationMatching =
    imageLocation?.latitude === actualLocation?.latitude &&
    imageLocation?.longitude === actualLocation?.longitude;

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

  const onSubmit = (data) => {
    setSubmitLoading(true);
    mutation.mutate(data);
  };

  //! Render Details Component
  const RenderDetails = ({ title, details }) => {
    return (
      <div className="p-4 bg-gray-50 rounded-lg shadow-md">
        <h3 className="flex gap-2 items-center text-lg font-semibold text-gray-700">
          <BadgeCheck className="text-green-500" size={18} /> {title}
        </h3>
        <div className="grid grid-cols-1 gap-3 mt-2 text-sm text-gray-800 md:grid-cols-2">
          {Object.entries(details).map(([key, value], index) => (
            <p key={index}>
              <span className="font-medium capitalize">
                {key.replace(/_/g, " ")}:
              </span>{" "}
              {value}
            </p>
          ))}
        </div>
      </div>
    );
  };

  return (
    <>
      {/* <div className="p-6 bg-white rounded-xl shadow-lg">
        <h2 className="mb-4 text-2xl font-bold text-gray-800">
          Vehicle Details
        </h2>

        <div className="p-4 mb-4 bg-gray-100 rounded-lg">
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

        <h3 className="mt-6 text-xl font-bold text-gray-800">Insurance Card</h3>
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

        <h3 className="mt-6 text-xl font-bold text-gray-800">Vehicle Photos</h3>
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

        <h3 className="mt-6 text-xl font-bold text-gray-800">
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

      <div className="p-6 mb-6 bg-white rounded-lg shadow-md">
        {/* Header */}
        <div className="flex gap-2 items-center px-5 py-3 text-white bg-gradient-to-r from-blue-900 to-blue-600 rounded-md shadow-md">
          <FileText size={24} />
          <h2 className="text-2xl font-bold tracking-wide uppercase">
            Claim Details
          </h2>
        </div>

        {/* Claim Info */}
        <div className="flex justify-between items-center p-4 mt-4 bg-gray-100 rounded-md">
          <p className="text-sm font-medium">
            Claim ID: <span className="font-bold">{claim.data._id}</span>
          </p>
          <span
            className="px-3 py-1 text-sm font-medium rounded-md"
            style={{
              backgroundColor: statusColors[claim.data.status || "default"].bg,
              color: statusColors[claim.data.status || "default"].text,
            }}
          >
            {claim.data.status}
          </span>
        </div>

        {/* Insurance Details */}
        <div className="grid grid-cols-1 gap-4 p-4 mt-4 bg-gray-50 rounded-md md:grid-cols-2">
          <div>
            <h3 className="flex gap-2 items-center text-lg font-semibold text-gray-700">
              <ShieldCheck className="text-blue-500" size={18} /> Insurance
              Details
            </h3>
            <div className="grid grid-cols-1 gap-3 mt-2 text-sm text-gray-800">
              <p>
                Insurance ID:{" "}
                <span className="font-medium">{claim.data.insuranceId}</span>
              </p>
              <p>
                NIC No: <span className="font-medium">{claim.data.nicNo}</span>
              </p>
              <p>
                License No:{" "}
                <span className="font-medium">
                  {claim.data.drivingLicenseNo}
                </span>
              </p>
            </div>
          </div>

          <div>
            <h3 className="flex gap-2 items-center text-lg font-semibold text-red-600">
              <AlertTriangle size={18} /> Damage Details
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              <span className="font-medium">Damaged Areas:</span>{" "}
              {claim.data.damagedAreas.join(", ")}
            </p>

            <div>
              <h3 className="flex gap-2 items-center mt-5 text-lg font-semibold text-purple-600">
                <Mic size={18} /> Voice Record
              </h3>
              <audio controls className="mt-2 w-96">
                <source src={claim.data.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        </div>

        {/* Uploaded Images */}
        <div className="p-4 mt-4 bg-gray-50 rounded-md">
          <h3 className="flex gap-2 items-center text-lg font-semibold text-blue-600">
            <Image size={18} /> Uploaded Images
          </h3>

          <div className="grid grid-cols-2 gap-3 mt-3 md:grid-cols-3">
            {/* Insurance Images */}
            <div className="p-3 bg-white rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                Insurance Documents
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.insuranceFront}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="Insurance Front"
                />
                <img
                  src={claim.data.insuranceBack}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="Insurance Back"
                />
              </div>
            </div>

            {/* NIC Images */}
            <div className="p-3 bg-white rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                NIC Documents
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.nicFront}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="NIC Front"
                />
                <img
                  src={claim.data.nicBack}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="NIC Back"
                />
              </div>
            </div>

            {/* License Images */}
            <div className="p-3 bg-white rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                License Documents
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.drivingLicenseFront}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="License Front"
                />
                <img
                  src={claim.data.drivingLicenseBack}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="License Back"
                />
              </div>
            </div>

            {/* License Plates */}
            <div className="p-3 bg-white rounded-md shadow-sm">
              <h4 className="text-sm font-semibold text-gray-600">
                License Plates
              </h4>
              <div className="flex gap-2 mt-2">
                <img
                  src={claim.data.frontLicencePlate}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="Front License Plate"
                />
                <img
                  src={claim.data.backLicencePlate}
                  className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                  alt="Back License Plate"
                />
              </div>
            </div>
          </div>

          {/* Damage Images */}
          <h4 className="mt-4 text-sm font-semibold text-red-600">
            Damage Images
          </h4>
          <div className="flex overflow-x-auto gap-2 p-2 mt-2">
            {claim.data.damageImages.map((img, index) => (
              <img
                key={index}
                src={img}
                className="w-28 h-28 rounded-md shadow-md transition-transform hover:scale-105"
                alt={`Damage ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Fraud Detection Results */}
      <div className="p-6 bg-white rounded-xl">
        <div className="flex gap-2 items-center px-5 py-3 mb-5 text-white bg-gradient-to-r from-blue-900 to-blue-600 rounded-md shadow-md">
          <FileText size={24} />
          <h2 className="text-2xl font-bold tracking-wide uppercase">
            Fraud Detection Results
          </h2>
        </div>
        {/* Vehicle Details ================================================================================================================================= */}
        <div className="p-6 mb-6 bg-white rounded-xl shadow-lg">
          {/* Section Header with Icon */}

          {claim?.data?.fraud_verification ? (
            <div className="p-4 bg-gray-50 mt-4 mb-5">
              <h2 className="text-lg font-semibold text-gray-800">
                Fraud Verification Results
              </h2>

              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-3 ">
                {Object.entries(claim?.data?.fraud_verification).map(
                  ([key, value], index) => (
                    <div key={index} className="flex items-center space-x-2">
                      {value ? (
                        <CheckCircle className="text-green-500" size={18} />
                      ) : (
                        <XCircle className="text-red-500" size={18} />
                      )}
                      <p className="text-sm text-gray-700 capitalize">
                        {key.replace(/_/g, " ")}
                      </p>
                    </div>
                  )
                )}
              </div>
            </div>
          ) : null}

          <h3 className="flex gap-2 items-center text-2xl font-semibold text-gray-800">
            <Car className="text-blue-600" size={24} />
            Vehicle Details
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex gap-3 items-center">
              <Car className="text-indigo-500" size={20} />
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-gray-900">Model:</span>
                <span className="ml-2 text-indigo-600">
                  {fraud?.data?.fraud?.model_result?.model ?? "Unknown"}
                </span>
              </p>
            </div>

            <div className="flex gap-3 items-center">
              <Palette className="text-green-500" size={20} />
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-gray-900">Color:</span>
                <span className="ml-2 text-green-600">
                  {fraud?.data?.fraud?.color?.color ?? "Not Detected"}
                </span>
              </p>
            </div>

            <div className="flex gap-3 items-center">
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

          {!fraud?.data?.fraud?.model_result?.model ||
          !fraud?.data?.fraud?.color?.color ||
          !fraud?.data?.fraud?.number_plates?.number_plate ? (
            <div className="flex items-center mt-4 text-red-600">
              <AlertCircle size={20} />
              <p className="ml-2 text-md">
                Some vehicle details could not be detected. Please verify
                manually.
              </p>
            </div>
          ) : null}
        </div>
        {/* Face Recognition =============================================================================================================================================*/}
        <div className="p-6 mb-6 bg-white rounded-xl shadow-lg">
          {/* Section Header with Icon */}
          <h3 className="flex gap-2 items-center text-2xl font-semibold text-gray-800">
            <AlertTriangle className="text-yellow-500" />
            Face Recognition
          </h3>

          <div className="flex gap-2 items-center mt-3">
            {fraud?.data?.fraud?.face_result?.verified ? (
              <CheckCircle className="text-xl text-green-500" />
            ) : (
              <XCircle className="text-xl text-red-500" />
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

          {fraud?.data?.fraud?.face_result?.status ? (
            <div className="mt-5">
              <h4 className="text-xl font-semibold text-gray-700">
                Model Result
              </h4>
              <div className="grid grid-cols-2 gap-4 mt-3 md:grid-cols-3">
                {fraud?.data?.fraud?.face_result?.model_results?.map(
                  (model, index) => (
                    <div
                      key={index}
                      className="p-4 bg-gray-100 rounded-lg shadow-md"
                    >
                      <p className="text-lg font-semibold text-gray-700">
                        Model:{" "}
                        <span className="text-indigo-600">{model.Model}</span>
                      </p>
                      <p className="flex gap-2 items-center text-gray-500 text-md">
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

              <h4 className="mt-6 text-xl font-semibold text-gray-700">
                Images
              </h4>
              <div className="flex overflow-x-auto gap-4 p-2 mt-4">
                {fraud?.data?.fraud?.face_result?.images?.license && (
                  <div className="relative">
                    <img
                      src={fraud?.data?.fraud?.face_result?.images?.license}
                      className="h-36 rounded-lg border-2 border-gray-300 shadow-lg w-54"
                      alt="License"
                    />
                    <p className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-gray-800 rounded">
                      License
                    </p>
                  </div>
                )}
                {fraud?.data?.fraud?.face_result?.images?.driver && (
                  <div className="relative">
                    <img
                      src={fraud?.data?.fraud?.face_result?.images?.driver}
                      className="w-36 h-36 rounded-lg border-2 border-gray-300 shadow-lg"
                      alt="Driver"
                    />
                    <p className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-gray-800 rounded">
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
                      className="w-36 h-36 rounded-lg border-2 border-gray-300 shadow-lg"
                      alt="Cropped Face"
                    />
                    <p className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-gray-800 rounded">
                      Licence Face
                    </p>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex gap-2 items-center mt-5 text-red-600">
              <XCircle className="text-2xl" />
              <p className="text-lg font-medium">
                Error Occurred in Face Recognition
              </p>
            </div>
          )}
        </div>
        {/* Similarity Detection ================================================================================================================================ */}
        <div className="p-6 mb-6 bg-white rounded-xl shadow-lg">
          <h3 className="flex gap-2 items-center text-2xl font-semibold text-gray-800">
            <Car className="text-blue-600" size={24} />
            Previous Damages Similarities
          </h3>

          {/* Similarity List */}
          {fraud?.data?.fraud?.similarity_score?.status ? (
            <div className="grid grid-cols-1 gap-6 mt-4 md:grid-cols-2">
              {fraud?.data?.fraud?.similarity_score?.results?.map(
                (item, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg shadow-md"
                  >
                    {/* Image Comparison */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <img
                          src={item.image_url_1}
                          className="object-cover w-full h-40 rounded-lg shadow"
                          alt={`Damage ${index + 1}`}
                        />
                        <p className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-gray-800 rounded">
                          Current Claim
                        </p>
                      </div>
                      <div className="relative">
                        <img
                          src={item.image_url_2}
                          className="object-cover w-full h-40 rounded-lg shadow"
                          alt={`Previous Damage ${index + 1}`}
                        />
                        <p className="absolute bottom-2 left-2 px-2 py-1 text-xs text-white bg-gray-800 rounded">
                          Previous Damage
                        </p>
                      </div>
                    </div>

                    {/* Similarity Score */}
                    <div className="mt-3">
                      <p className="text-sm font-semibold text-gray-700">
                        Similarity Score:{" "}
                        <span className="text-blue-600">
                          {(item.similarity_score * 100).toFixed(1)}%
                        </span>
                      </p>
                      <div className="mt-1 w-full h-2 bg-gray-300 rounded-full">
                        <div
                          className={`h-full rounded-full ${
                            item.similarity_score > 0.75
                              ? "bg-red-500"
                              : "bg-yellow-500"
                          }`}
                          style={{ width: `${item.similarity_score * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    {/* Similarity Message */}
                    <div className="flex items-center mt-2 text-sm text-gray-700">
                      <AlertTriangle className="mr-2 text-red-500" size={16} />
                      <p>{item.message}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="flex gap-2 items-center mt-4 text-red-600">
              <AlertCircle size={20} />
              <p className="text-md">Error Occurred in Similarity Detection</p>
            </div>
          )}
        </div>
        {/* Insurance Card Details ================================================================================================================================ */}
        <div className="p-6 mb-6 bg-white rounded-xl shadow-lg">
          {/* Insurance Details */}
          <h3 className="flex gap-2 items-center text-2xl font-semibold text-gray-800">
            <FileText className="text-blue-600" size={24} />
            Insurance & License Details
          </h3>

          <div className="mt-4 space-y-4">
            {/* Insurance Details */}
            {fraud?.data?.fraud?.read_insurance_result?.status ? (
              <RenderDetails
                title="Insurance Details"
                details={
                  fraud?.data?.fraud?.read_insurance_result?.insurance_Details
                }
              />
            ) : (
              <div className="text-red-600">
                <AlertCircle size={20} />
                <p>Insurance Details could not be read.</p>
              </div>
            )}

            {/* License Details */}

            {/* License Details */}
            {fraud?.data?.fraud?.read_licence_result?.status ? (
              <RenderDetails
                title="License Details"
                details={
                  fraud?.data?.fraud?.read_licence_result?.licence_Details
                }
              />
            ) : (
              <div className="text-red-600">
                <AlertCircle size={20} />
                <p>License Details could not be read.</p>
              </div>
            )}
          </div>
        </div>
        <div className="p-6 mb-6 bg-white rounded-xl shadow-lg">
          {/* Insurance Details */}
          <h3 className="flex gap-2 items-center text-2xl font-semibold text-gray-800">
            <MapPin className="text-blue-600" size={24} />
            Location Details
          </h3>

          <div className="mt-4 space-y-4">
            <div className="p-6 mx-auto max-w-6xl">
              {/* Two Maps in One Row */}
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                {/* Claim Photos Location Map */}
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <h3 className="mb-2 text-lg font-semibold text-gray-700">
                    Image Location
                  </h3>
                  {imageLocation?.latitude ? (
                    <GoogleMapComponent
                      latitude={imageLocation.latitude}
                      longitude={imageLocation.longitude}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle size={20} />
                      <p>Location Details could not be found.</p>
                    </div>
                  )}
                </div>

                {/* Actual Location Map */}
                <div className="p-4 bg-white rounded-lg shadow-lg">
                  <h3 className="mb-2 text-lg font-semibold text-gray-700">
                    Reported Location
                  </h3>
                  {actualLocation?.latitude ? (
                    <GoogleMapComponent
                      latitude={actualLocation.latitude}
                      longitude={actualLocation.longitude}
                    />
                  ) : (
                    <div className="flex items-center space-x-2 text-red-600">
                      <AlertCircle size={20} />
                      <p>Location Details could not be found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Result */}
              <div className="mt-6 text-center">
                {isLocationMatching ? (
                  <div className="flex justify-center items-center px-6 py-3 space-x-2 font-medium text-green-700 bg-green-100 rounded-lg">
                    <CheckCircle size={24} />
                    <p>✅ The claim location and image location match.</p>
                  </div>
                ) : (
                  <div className="flex justify-center items-center px-6 py-3 space-x-2 font-medium text-red-700 bg-red-100 rounded-lg">
                    <AlertCircle size={24} />
                    <p>
                      ⚠️ The locations do not match! Further verification
                      needed.
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 mb-6 bg-white rounded-xl shadow-lg">
          {/* Vehicle Condition Details */}
          <h3 className="flex gap-2 items-center mb-5 text-2xl font-semibold text-gray-800">
            <Activity className="text-blue-600" size={24} />
            Vehicle Prior Condition
          </h3>

          {fraud?.data?.obdData?.obdCodes ? (
            <>
              <p className="mb-5 text-gray-600">
                <span className="font-medium capitalize">Updated Time</span>:{" "}
                {fraud?.data?.obdData?.updateTime
                  ? format(
                      new Date(fraud?.data?.obdData?.updateTime),
                      "MMM d, yyyy h:mm a"
                    )
                  : "N/A"}
              </p>

              {obdObjectList.length > 0 ? (
                <div className="space-y-4">
                  {obdObjectList.map((obd, index) => (
                    <div
                      key={index}
                      className="p-4 rounded-lg border border-gray-200 shadow-sm transition duration-300 hover:shadow-md"
                    >
                      <h4 className="flex justify-between text-lg font-semibold text-gray-800">
                        <span>
                          Code:{" "}
                          <span className="text-blue-600">{obd.code}</span>
                        </span>
                        <span className="text-sm text-gray-500">{`*#${
                          index + 1
                        }`}</span>
                      </h4>
                      <p className="mt-2 text-gray-600">
                        <strong>Description:</strong> {obd.codeDescription}
                      </p>
                      <p className="mt-2 text-gray-700">
                        <strong>Possible Impact:</strong> {obd.possibleResult}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-center text-gray-500">
                  No OBD issues detected.
                </p>
              )}
            </>
          ) : (
            <p className="mt-4 text-center text-gray-500">
              No OBD issues detected.
            </p>
          )}
        </div>
      </div>

      <Form {...fraudApproveForm}>
        <form
          className="flex gap-4 items-center pr-12 w-full"
          onSubmit={fraudApproveForm.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2 flex-1 min-w-[300px]">
            <Label htmlFor="Status" className="text-sm font-medium">
              Status
            </Label>
            <FormField
              control={fraudApproveForm.control}
              name="status"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <Select
                      {...field}
                      id="status"
                      className="w-full"
                      value={field.value} // ✅ Ensure the selected value is managed by React Hook Form
                      onValueChange={field.onChange} // ✅ Handle changes properly
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue>
                          {
                            staffTypes.find(
                              (type) => type.value === field.value
                            )?.label
                          }
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {staffTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <Button
            type="submit"
            className="h-9 w-[150px] btn-primary"
            disabled={submitLoading}
          >
            {submitLoading ? "Submitting..." : "Submit"}
          </Button>
        </form>
      </Form>
    </>
  );
}
