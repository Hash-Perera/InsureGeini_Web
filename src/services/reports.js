import axiosInstance from "@/hooks/axios";

/**
 * Fetches all reports from the server.
 * @returns {Promise<Object>} The response data containing all reports.
 * @throws Will throw an error if the request fails.
 */
export const fetchAllReports = async () => {
  try {
    const response = await axiosInstance.get("/reports/all");
    return response?.data?.data;
  } catch (error) {
    console.error("Error fetching all reports:", error.message);
    throw error;
  }
};

export const fetchReportStats = async ({
  filters = { timeInterval: "7days" }, // Default value of 7days if not provided
}) => {
  try {
    const response = await axiosInstance.get("/reports/stats", {
      params: filters,
    });
    return response?.data;
  } catch (error) {
    console.error("Error fetching report statistics:", error.message);
    throw error;
  }
};

export const fetchEstimationApprovalRate = async () => {
  try {
    const response = await axiosInstance.get(
      "/reports/estimation-approval-rate"
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching estimation approval rate:", error.message);
    throw error;
  }
};
