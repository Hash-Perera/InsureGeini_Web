import { z } from "zod";

// Vehicle Registration Schema
export const vehicleRegistrationSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  insurancePolicy: z.string().min(1, "Insurance policy number is required"),
  policyAdOns: z.object({
    generaProtection: z.array(z.string()),
    vehicleSpecific: z.array(z.string()),
    usageSpecific: z.array(z.string()),
    workRelated: z.array(z.string()),
  }),
  insuranceCardImageFront: z
    .instanceof(File, "Insurance card front image is required") // Validates that the file is provided
    .refine((file) => file?.size > 0, "Insurance card front image is required"),
  insuranceCardImageBack: z
    .instanceof(File, "Insurance card back image is required") // Validates that the file is provided
    .refine((file) => file?.size > 0, "Insurance card back image is required"),
  vehicleModel: z.string().min(1, "Vehicle model is required"),
  vehiclePhotosFront: z
    .instanceof(File, "Vehicle front photo is required")
    .refine((file) => file?.size > 0, "Vehicle front photo is required"),
  vehiclePhotosBack: z
    .instanceof(File, "Vehicle back photo is required")
    .refine((file) => file?.size > 0, "Vehicle back photo is required"),
  vehiclePhotosLeft: z
    .instanceof(File, "Vehicle left photo is required")
    .refine((file) => file?.size > 0, "Vehicle left photo is required"),
  vehiclePhotosRight: z
    .instanceof(File, "Vehicle right photo is required")
    .refine((file) => file?.size > 0, "Vehicle right photo is required"),
  engineNo: z.string().min(1, "Engine number is required"),
  chassisNo: z.string().min(1, "Chassis number is required"),
  vinNumber: z.string().min(1, "VIN number is required"),
  vehicleColor: z.string().min(1, "Vehicle color is required"),
  vehicleNumberPlate: z.string().min(1, "Vehicle number plate is required"),
  numberPlateImageFront: z
    .instanceof(File, "Number plate front image is required")
    .refine((file) => file?.size > 0, "Number plate front image is required"),
  numberPlateImageBack: z
    .instanceof(File, "Number plate back image is required")
    .refine((file) => file?.size > 0, "Number plate back image is required"),
});

export const staffRegistrationSchema = z.object({
  name: z.string().min(1, "Name field cannot be empty"),
  email: z
    .string()
    .min(1, "Email field cannot be empty")
    .email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
  mobileNumber: z.string().min(10, "Please enter a valid mobile number"),
  address: z.string().min(1, "Address field cannot be empty"),
  role: z.string().min(["staff", "value"], "Please select a staff type"),
});

const imageFileSchema = z
  .instanceof(File)
  .refine((file) => file.size > 0, "File cannot be empty")
  .refine(
    (file) => ["image/jpeg", "image/png", "image/gif"].includes(file.type),
    "Invalid file type"
  )
  .refine(
    (file) => file.size <= 5 * 1024 * 1024,
    "File size must be less than 5MB"
  );

// Define Zod Schema
export const clientRegistrationSchema = z.object({
  name: z.string().min(1, "First name cannot be empty"),
  email: z
    .string()
    .min(1, "Email cannot be empty")
    .email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  nicNo: z.string().min(1, "NIC cannot be empty"),
  insuranceId: z.string().min(1, "Insurance ID cannot be empty"),
  mobileNumber: z.string().min(10, "Invalid mobile number"),
  address: z.string().min(1, "Address cannot be empty"),
  role: z.string().min(["client", "value"], "Please select a client type"),
  dob: z.string().min(1, "Date of birth cannot be empty"),
  drivingLicenseNo: z.string().min(1, "Driving license number cannot be empty"),
  inusrancePolicy: z.string().min(1, "Insurance policy cannot be empty"),
  drivingLicenseImage: imageFileSchema,
  nicImage: imageFileSchema,
});
