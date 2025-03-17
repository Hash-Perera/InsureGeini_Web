import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  User,
  Mail,
  Phone,
  Home,
  MessageCircle,
  Calendar,
  Tag,
  FileText,
  Download,
} from "lucide-react";
import axiosInstance from "@/hooks/axios";
import { useEffect, useState } from "react";

const FeedbackDetailsDialog = ({ selectedFeedback, isDialogOpen, onClose }) => {
  const [userDetails, setUserDetails] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);
  const [reportDetails, setReportDetails] = useState(null);

  const fetchFeedbackData = async () => {
    try {
      const response = await axiosInstance.get(
        `/feedback/${selectedFeedback._id}`
      );
      setFeedbackDetails(response.data.data);
      setUserDetails(response.data.data.userId);
      setReportDetails(response.data.data.reportId);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };

  useEffect(() => {
    if (selectedFeedback?._id) {
      fetchFeedbackData();
    }
  }, [selectedFeedback]);

  return (
    <Dialog open={isDialogOpen} onOpenChange={onClose}>
      <DialogContent className="backdrop-blur-xl bg-white/90 shadow-2xl rounded-3xl p-8 max-w-2xl border border-gray-200">
        <DialogHeader className="text-center mb-6">
          <DialogTitle className="text-3xl font-extrabold text-gray-900">
            Feedback Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-3">
          {/* User Information Section */}
          {userDetails && (
            <div className="p-6 bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <User className="text-indigo-600 w-8 h-8" /> User Information
              </h3>
              <div className="grid grid-cols-2 gap-5 text-gray-800 text-base">
                <p className="flex items-center gap-2">
                  <Mail className="text-blue-600 w-6 h-6" />{" "}
                  <span className="font-semibold">Email:</span>
                </p>
                <p>{userDetails.email}</p>
                <p className="flex items-center gap-2">
                  <Phone className="text-blue-600 w-6 h-6" />{" "}
                  <span className="font-semibold">Phone:</span>
                </p>
                <p>{userDetails.mobileNumber}</p>
                <p className="flex items-center gap-2">
                  <Home className="text-blue-600 w-6 h-6" />{" "}
                  <span className="font-semibold">Address:</span>
                </p>
                <p>{userDetails.address}</p>
              </div>
            </div>
          )}

          {/* Feedback Details Section */}
          {feedbackDetails && (
            <div className="p-6 bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <MessageCircle className="text-indigo-600 w-8 h-8" /> Feedback
              </h3>
              <p className="text-gray-700 italic text-lg">
                "{feedbackDetails.feedback || "No feedback available"}"
              </p>
              <div className="grid grid-cols-2 gap-3 text-gray-800 text-base mt-4">
                <p className="flex items-center gap-2 font-semibold">
                  <Tag className="text-purple-600 w-6 h-6" /> Sentiment:
                </p>
                <p
                  className={`px-4 py-2 rounded-full font-semibold ${
                    feedbackDetails.sentiment === "positive"
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {feedbackDetails.sentiment || "N/A"}
                </p>
                <p className="flex items-center gap-3 font-semibold">
                  <Tag className="text-purple-600 w-6 h-6" /> Category:
                </p>
                <p className="px-4 py-2 rounded-full bg-blue-200 text-blue-800 font-semibold">
                  {feedbackDetails.category || "N/A"}
                </p>
              </div>
            </div>
          )}

          {/* Report Details Section */}
          {reportDetails && (
            <div className="p-6 bg-white/70 backdrop-blur-lg rounded-2xl shadow-md border border-gray-300">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <FileText className="text-yellow-600 w-8 h-8" /> Report Details
              </h3>

              <div className="text-gray-800 text-base space-y-2">
                <p>
                  Status:{" "}
                  <span className="font-semibold">{reportDetails.status}</span>
                </p>
                <p>Reason: {reportDetails.reason}</p>
              </div>

              <div className="grid grid-cols-2 gap-6 text-gray-800 text-base mt-4">
                <p className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
                  Estimation Approved:{" "}
                  <span className="font-semibold">
                    ${reportDetails.estimation_approved}
                  </span>
                </p>
                <p className="bg-gray-100 px-4 py-2 rounded-lg shadow-sm">
                  Estimation Requested:{" "}
                  <span className="font-semibold">
                    ${reportDetails.estimation_requested}
                  </span>
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 mt-6">
                <a
                  href={reportDetails.decisionReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 text-base font-medium flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <Download className="w-5 h-5" /> Download Decision Report
                </a>
                <a
                  href={reportDetails.incidentReport}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-700 hover:text-blue-900 text-base font-medium flex items-center gap-2 bg-blue-100 px-4 py-2 rounded-lg shadow-md hover:shadow-lg transition"
                >
                  <Download className="w-5 h-5" /> Download Incident Report
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDetailsDialog;
