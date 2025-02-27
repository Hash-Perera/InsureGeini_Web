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

/**
 * Fetches report statistics from the server.
 * @param {Object} filters - Optional filters for the statistics.
 * @param {string} [filters.startDate] - The start date for the filter (YYYY-MM-DD).
 * @param {string} [filters.endDate] - The end date for the filter (YYYY-MM-DD).
 * @param {string} [filters.status] - The status to filter by (e.g., "Approved", "Rejected", "Pending").
 * @returns {Promise<Object>} The response data containing report statistics.
 * @throws Will throw an error if the request fails.
 */
export const fetchReportStats = async (filters = {}) => {
  try {
    const response = await axiosInstance.get("/reports/stats", {
      params: filters,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching report statistics:", error.message);
    throw error;
  }
};

/**
 * Fetches the estimation approval rate from the server.
 * @returns {Promise<Object>} The response data containing the approval rate.
 * @throws Will throw an error if the request fails.
 */
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
