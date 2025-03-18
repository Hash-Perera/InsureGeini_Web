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

export default function ClaimDetails() {
  const { id } = useParams();
  const [submitLoading, setSubmitLoading] = useState(false);
  const queryClient = useQueryClient();

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

  // // Submit form data
  // const fraudApproveForm = useForm({
  //   resolver: zodResolver(fraudApproveSchema),
  //   defaultValues: {
  //     claimId: id,
  //     status: "",
  //   },
  // });

  // const mutation = useMutation({
  //   mutationFn: async (data) => {
  //     try {
  //       setSubmitLoading(true); // Prevent multiple submissions
  //       const response = await fraudApprove(data);
  //       toast.success("Submitted successfully");
  //       queryClient.invalidateQueries({ queryKey: ["staff"] });
  //       fraudApproveForm.reset();
  //       return response;
  //     } catch (error) {
  //       toast.error("Error occurred");
  //     } finally {
  //       setSubmitLoading(false);
  //     }
  //   },
  // });

  // const onSubmit = (data) => {
  //   setSubmitLoading(true);
  //   mutation.mutate(data);
  // };

  // const staffTypes = [
  //   { value: "Approve", label: "Approve" },
  //   { value: "Reject", label: "Reject" },
  // ];

  //! Render Details Component
  const RenderDetails = ({ title, details }) => {
    return (
      <div className="p-4 bg-gray-50 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
          <BadgeCheck className="text-green-500" size={18} /> {title}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-sm text-gray-800">
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
        <div className="p-4 bg-gray-50 rounded-md mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2 text-gray-700">
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
            <h3 className="text-lg font-semibold flex items-center gap-2 text-red-600">
              <AlertTriangle size={18} /> Damage Details
            </h3>
            <p className="mt-1 text-sm text-gray-700">
              <span className="font-medium">Damaged Areas:</span>{" "}
              {claim.data.damagedAreas.join(", ")}
            </p>

            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2 text-purple-600 mt-5">
                <Mic size={18} /> Voice Record
              </h3>
              <audio controls className="w-96 mt-2">
                <source src={claim.data.audio} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
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

      {/* Fraud Detection Results */}
      <div className="bg-white  rounded-xl p-6">
        <div className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-3 px-5 rounded-md shadow-md flex items-center gap-2 mb-5">
          <FileText size={24} />
          <h2 className="text-2xl font-bold uppercase tracking-wide">
            Fraud Detection Results
          </h2>
        </div>
        {/* Vehicle Details ================================================================================================================================= */}
        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          {/* Section Header with Icon */}
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Car className="text-blue-600" size={24} />
            Vehicle Details
          </h3>

          <div className="mt-4 space-y-3">
            <div className="flex items-center gap-3">
              <Car className="text-indigo-500" size={20} />
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-gray-900">Model:</span>
                <span className="ml-2 text-indigo-600">
                  {fraud?.data?.fraud?.model_result?.model ?? "Unknown"}
                </span>
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Palette className="text-green-500" size={20} />
              <p className="text-lg text-gray-700">
                <span className="font-semibold text-gray-900">Color:</span>
                <span className="ml-2 text-green-600">
                  {fraud?.data?.fraud?.color?.color ?? "Not Detected"}
                </span>
              </p>
            </div>

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
        {/* Face Recognition =============================================================================================================================================*/}
        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          {/* Section Header with Icon */}
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" />
            Face Recognition
          </h3>

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

          {fraud?.data?.fraud?.face_result?.status ? (
            <div className="mt-5">
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
            <div className="mt-5 flex items-center gap-2 text-red-600">
              <XCircle className="text-2xl" />
              <p className="text-lg font-medium">
                Error Occurred in Face Recognition
              </p>
            </div>
          )}
        </div>
        {/* Similarity Detection ================================================================================================================================ */}
        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <Car className="text-blue-600" size={24} />
            Previous Damages Similarities
          </h3>

          {/* Similarity List */}
          {fraud?.data?.fraud?.similarity_score?.status ? (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-6">
              {fraud?.data?.fraud?.similarity_score?.results?.map(
                (item, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-4 rounded-lg shadow-md"
                  >
                    {/* Image Comparison */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="relative">
                        <img
                          src={item.image_url_1}
                          className="w-full h-40 object-cover rounded-lg shadow"
                          alt={`Damage ${index + 1}`}
                        />
                        <p className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
                          Current Claim
                        </p>
                      </div>
                      <div className="relative">
                        <img
                          src={item.image_url_2}
                          className="w-full h-40 object-cover rounded-lg shadow"
                          alt={`Previous Damage ${index + 1}`}
                        />
                        <p className="absolute bottom-2 left-2 bg-gray-800 text-white text-xs px-2 py-1 rounded">
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
                      <div className="w-full bg-gray-300 h-2 rounded-full mt-1">
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
                    <div className="mt-2 flex items-center text-gray-700 text-sm">
                      <AlertTriangle className="text-red-500 mr-2" size={16} />
                      <p>{item.message}</p>
                    </div>
                  </div>
                )
              )}
            </div>
          ) : (
            <div className="mt-4 flex items-center gap-2 text-red-600">
              <AlertCircle size={20} />
              <p className="text-md">Error Occurred in Similarity Detection</p>
            </div>
          )}
        </div>
        {/* Insurance Card Details ================================================================================================================================ */}
        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          {/* Insurance Details */}
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
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
        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          {/* Insurance Details */}
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2">
            <MapPin className="text-blue-600" size={24} />
            Location Details
          </h3>

          <div className="mt-4 space-y-4">
            <div className="max-w-6xl mx-auto p-6">
              {/* Two Maps in One Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Claim Photos Location Map */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Image Location
                  </h3>
                  {imageLocation?.latitude ? (
                    <GoogleMapComponent
                      latitude={imageLocation.latitude}
                      longitude={imageLocation.longitude}
                    />
                  ) : (
                    <div className="text-red-600 flex items-center space-x-2">
                      <AlertCircle size={20} />
                      <p>Location Details could not be found.</p>
                    </div>
                  )}
                </div>

                {/* Actual Location Map */}
                <div className="bg-white shadow-lg rounded-lg p-4">
                  <h3 className="text-lg font-semibold text-gray-700 mb-2">
                    Reported Location
                  </h3>
                  {actualLocation?.latitude ? (
                    <GoogleMapComponent
                      latitude={actualLocation.latitude}
                      longitude={actualLocation.longitude}
                    />
                  ) : (
                    <div className="text-red-600 flex items-center space-x-2">
                      <AlertCircle size={20} />
                      <p>Location Details could not be found.</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Comparison Result */}
              <div className="mt-6 text-center">
                {isLocationMatching ? (
                  <div className="bg-green-100 text-green-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2">
                    <CheckCircle size={24} />
                    <p>✅ The claim location and image location match.</p>
                  </div>
                ) : (
                  <div className="bg-red-100 text-red-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center space-x-2">
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

        <div className="p-6 bg-white shadow-lg rounded-xl mb-6">
          {/* Vehicle Condition Details */}
          <h3 className="text-2xl font-semibold text-gray-800 flex items-center gap-2 mb-5">
            <Activity className="text-blue-600" size={24} />
            Vehicle Prior Condition
          </h3>

          {fraud?.data?.obdData?.obdCodes ? (
            <>
              <p className="text-gray-600 mb-5">
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
                      className="p-4 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-300"
                    >
                      <h4 className="text-lg font-semibold text-gray-800 flex justify-between">
                        <span>
                          Code:{" "}
                          <span className="text-blue-600">{obd.code}</span>
                        </span>
                        <span className="text-sm text-gray-500">{`*#${
                          index + 1
                        }`}</span>
                      </h4>
                      <p className="text-gray-600 mt-2">
                        <strong>Description:</strong> {obd.codeDescription}
                      </p>
                      <p className="text-gray-700 mt-2">
                        <strong>Possible Impact:</strong> {obd.possibleResult}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center mt-4">
                  No OBD issues detected.
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-500 text-center mt-4">
              No OBD issues detected.
            </p>
          )}
        </div>
      </div>

      {/* <Form {...fraudApproveForm}>
        <form
          className="w-full flex items-center gap-4"
          onSubmit={fraudApproveForm.handleSubmit(mutation.mutate)}
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
                    <Select {...field} id="Status" className="w-full">
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
      </Form> */}
    </>
  );
}
