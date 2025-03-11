import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getCustomerById } from "@/services/customer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  User,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  FileText,
  IdCard,
  Car,
  Key,
  Hash,
  FileCode,
  Palette,
  ChevronDown,
  ChevronUp,
  Camera,
  Edit,
  SquarePlus,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { deleteVehicle } from "@/services/vehicle";
import { toast } from "sonner";

const ClientView = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { data: customerData } = useQuery({
    queryKey: ["customer", id],
    queryFn: async () => {
      try {
        const response = await getCustomerById(id);
        return response;
      } catch (error) {
        console.error("Error fetching all customers:", error.message);
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      try {
        const response = await deleteVehicle(id);
        queryClient.invalidateQueries({ queryKey: ["customer", id] });
        toast.success("Vehicle deleted successfully");
        return response;
      } catch (error) {
        console.error("Error deleting staff:", error.message);
        throw error;
      }
    },
  });

  const handleDelete = (id) => {
    console.log("Delete vehicle with ID:", id);
    deleteMutation.mutate(id);
  };

  return (
    <div className="flex flex-col w-full gap-8">
      <div className="flex flex-col max-w-5xl gap-6 p-8 bg-white shadow-lg rounded-xl">
        <div className="flex items-center w-full gap-3 pb-4 border-b border-gray-100">
          <User className="w-6 h-6 text-indigo-600" />
          <h2 className="text-2xl font-semibold text-gray-800">
            Customer Details
          </h2>
          <Button
            variant="primary"
            className="flex items-center gap-1 px-3 py-1 text-sm font-medium"
          >
            <Edit className="w-4 h-4" />
          </Button>

          <Link
            to={`/admin/clients/${customerData?.data?._id}/${customerData?.data?._id}`}
            className="ml-auto "
          >
            <Button
              variant="primary"
              className="flex items-center gap-1 px-3 py-1 text-sm font-medium"
            >
              <SquarePlus className="w-4 h-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Customer Name */}
          <div className="flex items-start gap-3 p-4 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
            <User className="w-5 h-5 mt-1 text-indigo-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Name</h3>
              <p className="text-lg font-medium text-gray-800">
                {customerData?.data?.name}
              </p>
            </div>
          </div>

          {/* Customer Email */}
          <div className="flex items-start gap-3 p-4 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
            <Mail className="w-5 h-5 mt-1 text-indigo-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Email</h3>
              <a
                href={`mailto:${customerData?.data?.email}`}
                className="text-lg font-medium text-indigo-600 hover:text-indigo-800"
              >
                {customerData?.data?.email}
              </a>
            </div>
          </div>

          {/* Customer Phone */}
          <div className="flex items-start gap-3 p-4 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
            <Phone className="w-5 h-5 mt-1 text-indigo-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Phone</h3>
              <p className="text-lg font-medium text-gray-800">
                {customerData?.data?.mobileNumber}
              </p>
            </div>
          </div>

          {/* Customer Address */}
          <div className="flex items-start gap-3 p-4 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
            <MapPin className="w-5 h-5 mt-1 text-indigo-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">Address</h3>
              <p className="text-lg font-medium text-gray-800">
                {customerData?.data?.address}
              </p>
            </div>
          </div>

          {/* Customer NIC */}
          <div className="flex items-start gap-3 p-4 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
            <CreditCard className="w-5 h-5 mt-1 text-indigo-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">NIC</h3>
              <p className="text-lg font-medium text-gray-800">
                {customerData?.data?.nicNo}
              </p>
            </div>
          </div>

          {/* Customer Insurance ID */}
          <div className="flex items-start gap-3 p-4 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
            <Shield className="w-5 h-5 mt-1 text-indigo-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Insurance ID
              </h3>
              <p className="text-lg font-medium text-gray-800">
                {customerData?.data?.insuranceId}
              </p>
            </div>
          </div>

          {/* Customer Insurance Policy */}
          <div className="flex items-start gap-3 p-4 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
            <FileText className="w-5 h-5 mt-1 text-indigo-500" />
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Insurance Policy
              </h3>
              <p className="text-lg font-medium text-gray-800">
                {customerData?.data?.inusrancePolicy}
              </p>
            </div>
          </div>
        </div>

        {/* Documents Section */}
        <div className="pt-4 mt-4 border-t border-gray-100">
          <h3 className="mb-4 text-xl font-medium text-gray-700">Documents</h3>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* NIC Image */}
            <div className="overflow-hidden transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center gap-2 p-3 border-b border-gray-200">
                <IdCard className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-medium text-gray-600">NIC Image</h4>
              </div>
              {customerData?.data?.nicImage ? (
                <div className="p-4">
                  <img
                    src={customerData?.data?.nicImage}
                    alt="NIC Image"
                    className="object-cover w-full h-32 rounded"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 text-gray-400">
                  No image available
                </div>
              )}
            </div>

            {/* Driving License Image */}
            <div className="overflow-hidden transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
              <div className="flex items-center gap-2 p-3 border-b border-gray-200">
                <Car className="w-5 h-5 text-indigo-500" />
                <h4 className="text-sm font-medium text-gray-600">
                  Driving License
                </h4>
              </div>
              {customerData?.data?.drivingLicenseImage ? (
                <div className="p-4">
                  <img
                    src={customerData?.data?.drivingLicenseImage}
                    alt="Driving License Image"
                    className="object-cover w-full h-32 rounded"
                  />
                </div>
              ) : (
                <div className="flex items-center justify-center p-4 text-gray-400">
                  No image available
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <VehicleDetailsView
        vehicles={customerData?.vehicles}
        handleDelete={handleDelete}
      />
    </div>
  );
};

export default ClientView;

const VehicleDetailsView = ({ vehicles, handleDelete }) => {
  const [expandedVehicles, setExpandedVehicles] = useState({});

  if (!vehicles || vehicles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-6 bg-white shadow-lg rounded-xl">
        <Car className="w-16 h-16 mb-4 text-gray-300" />
        <h3 className="text-xl font-medium text-gray-500">No vehicles found</h3>
        <p className="mt-2 text-gray-400">
          This customer doesn't have any registered vehicles yet
        </p>
      </div>
    );
  }

  const toggleVehicle = (id) => {
    setExpandedVehicles((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="flex flex-col w-full gap-6 mt-8">
      <div className="flex items-center gap-3 pb-2">
        <Car className="w-6 h-6 text-indigo-600" />
        <h2 className="text-2xl font-semibold text-gray-800">
          Vehicle Information
        </h2>
        <div className="px-3 py-1 ml-2 text-sm font-medium text-indigo-800 bg-indigo-100 rounded-full">
          {vehicles.length} {vehicles.length === 1 ? "Vehicle" : "Vehicles"}
        </div>
      </div>

      {vehicles.map((vehicle) => (
        <div
          key={vehicle._id}
          className="mr-4 overflow-hidden bg-white shadow-lg rounded-xl"
        >
          {/* Vehicle Header - Always Visible */}
          <div
            className="flex items-center justify-between p-5 cursor-pointer bg-gray-50"
            onClick={() => toggleVehicle(vehicle._id)}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center w-10 h-10 bg-indigo-100 rounded-full">
                <Car className="w-5 h-5 text-indigo-600" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-800">
                  {vehicle.vehicleModel}
                </h3>
                <p className="text-sm text-gray-500">
                  Plate: {vehicle.vehicleNumberPlate}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 ">
              <div className="flex items-center gap-1 px-3 py-1 text-sm rounded-full bg-indigo-50">
                <Shield className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-700">Insured</span>
              </div>
              {expandedVehicles[vehicle._id] ? (
                <ChevronUp className="w-5 h-5 text-gray-500" />
              ) : (
                <ChevronDown className="w-5 h-5 text-gray-500" />
              )}
            </div>
          </div>

          {/* Expandable Content */}
          {expandedVehicles[vehicle._id] && (
            <div className="p-5">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {/* Insurance Policy */}
                <div className="flex items-start gap-3 p-3 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
                  <Shield className="w-5 h-5 mt-1 text-indigo-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Insurance Policy
                    </h3>
                    <p className="text-base font-medium text-gray-800">
                      {vehicle.insurancePolicyNo}
                    </p>
                  </div>
                </div>

                {/* Engine Number */}
                <div className="flex items-start gap-3 p-3 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
                  <Key className="w-5 h-5 mt-1 text-indigo-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Engine Number
                    </h3>
                    <p className="text-base font-medium text-gray-800">
                      {vehicle.engineNo}
                    </p>
                  </div>
                </div>

                {/* Chassis Number */}
                <div className="flex items-start gap-3 p-3 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
                  <Hash className="w-5 h-5 mt-1 text-indigo-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Chassis Number
                    </h3>
                    <p className="text-base font-medium text-gray-800">
                      {vehicle.chassisNo}
                    </p>
                  </div>
                </div>

                {/* VIN Number */}
                <div className="flex items-start gap-3 p-3 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
                  <FileCode className="w-5 h-5 mt-1 text-indigo-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      VIN Number
                    </h3>
                    <p className="text-base font-medium text-gray-800">
                      {vehicle.vinNumber}
                    </p>
                  </div>
                </div>

                {/* Vehicle Color */}
                <div className="flex items-start gap-3 p-3 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
                  <Palette className="w-5 h-5 mt-1 text-indigo-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      Vehicle Color
                    </h3>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-4 h-4 rounded-full"
                        style={{ backgroundColor: vehicle.vehicleColor }}
                      />
                      <p className="text-base font-medium text-gray-800 capitalize">
                        {vehicle.vehicleColor}
                      </p>
                    </div>
                  </div>
                </div>

                {/* License Plate */}
                <div className="flex items-start gap-3 p-3 transition-all rounded-lg bg-gray-50 hover:bg-gray-100">
                  <CreditCard className="w-5 h-5 mt-1 text-indigo-500" />
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      License Plate
                    </h3>
                    <p className="text-base font-medium text-gray-800">
                      {vehicle.vehicleNumberPlate}
                    </p>
                  </div>
                </div>
              </div>

              {/* Photos Section using Tabs */}
              <div className="mt-6">
                <Tabs defaultValue="vehicle" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger
                      value="vehicle"
                      className="flex items-center gap-2"
                    >
                      <Car className="w-4 h-4" />
                      <span>Vehicle Photos</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="insurance"
                      className="flex items-center gap-2"
                    >
                      <Shield className="w-4 h-4" />
                      <span>Insurance Card</span>
                    </TabsTrigger>
                    <TabsTrigger
                      value="plate"
                      className="flex items-center gap-2"
                    >
                      <CreditCard className="w-4 h-4" />
                      <span>Number Plates</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Vehicle Photos Tab */}
                  <TabsContent value="vehicle" className="mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-4">
                      {Object.entries(vehicle.vehiclePhotos || {}).map(
                        ([view, url]) => (
                          <div
                            key={view}
                            className="overflow-hidden rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center justify-between p-2 bg-gray-100">
                              <div className="flex items-center gap-1">
                                <Camera className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {view} View
                                </span>
                              </div>
                            </div>
                            <div className="p-2">
                              <img
                                src={url}
                                alt={`${view} view`}
                                className="object-cover w-full h-32 rounded-md"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>

                  {/* Insurance Card Tab */}
                  <TabsContent value="insurance" className="mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {Object.entries(vehicle.insuranceCard || {}).map(
                        ([side, url]) => (
                          <div
                            key={side}
                            className="overflow-hidden rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center justify-between p-2 bg-gray-100">
                              <div className="flex items-center gap-1">
                                <Shield className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {side} Side
                                </span>
                              </div>
                            </div>
                            <div className="p-2">
                              <img
                                src={url}
                                alt={`Insurance card ${side}`}
                                className="object-cover w-full h-40 rounded-md"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>

                  {/* Number Plates Tab */}
                  <TabsContent value="plate" className="mt-4">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {Object.entries(vehicle.numberPlateImages || {}).map(
                        ([side, url]) => (
                          <div
                            key={side}
                            className="overflow-hidden rounded-lg bg-gray-50"
                          >
                            <div className="flex items-center justify-between p-2 bg-gray-100">
                              <div className="flex items-center gap-1">
                                <CreditCard className="w-4 h-4 text-indigo-600" />
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {side} Plate
                                </span>
                              </div>
                            </div>
                            <div className="p-2">
                              <img
                                src={url}
                                alt={`Number plate ${side}`}
                                className="object-cover w-full h-32 rounded-md"
                              />
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </div>

              {/* Delete Section */}
              <div className="mt-6">
                <Button
                  variant="danger"
                  className="font-bold text-white bg-red-600 w-fit"
                  onClick={() => handleDelete(vehicle._id)}
                >
                  Delete Vehicle
                </Button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
