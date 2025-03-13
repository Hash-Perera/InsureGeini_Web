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
} from "lucide-react";
import axios from "axios";
import { useEffect, useState } from "react";

const FeedbackDetailsDialog = ({
  selectedFeedback,
  isDialogOpen,
  setIsDialogOpen,
}) => {
  const [userDetails, setUserDetails] = useState(null);
  const [feedbackDetails, setFeedbackDetails] = useState(null);

  const fetchFeedbackData = async () => {
    try {
      const token =
        "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg0NzJlYWUwZmI3Y2RiZjcxOTBmYSIsInJvbGUiOiJDdXN0b21lciIsImlhdCI6MTczOTIwMzY3MCwiZXhwIjoxNzQxNzk1NjcwfQ.v338cBSy53nmwp5DTSUQZqDw49LwKWjwSfCEuQIkZcc";
      const response = await axios.get(
        `http://localhost:8000/v1/feedback/${selectedFeedback._id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setFeedbackDetails(response.data.data);
      setUserDetails(response.data.data.userId);
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
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="backdrop-blur-xl bg-white/90 shadow-2xl rounded-xl p-6 max-w-3xl">
        <DialogHeader className="text-center">
          <DialogTitle className="text-3xl font-semibold text-gray-800">
            Feedback Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* User Information Section */}
          {userDetails && (
            <div className="p-4 bg-blue-50 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <User className="text-indigo-600 w-6 h-6" /> User Information
              </h3>
              <div className="grid grid-cols-2 gap-2 text-gray-700 mt-2">
                <p className="flex items-center gap-2">
                  <Mail className="text-blue-600 w-5 h-5" />{" "}
                  <span className="font-medium">Email:</span>
                </p>
                <p>{userDetails.email}</p>

                <p className="flex items-center gap-2">
                  <Phone className="text-blue-600 w-5 h-5" />{" "}
                  <span className="font-medium">Phone:</span>
                </p>
                <p>{userDetails.mobileNumber}</p>

                <p className="flex items-center gap-2">
                  <Home className="text-blue-600 w-5 h-5" />{" "}
                  <span className="font-medium">Address:</span>
                </p>
                <p>{userDetails.address}</p>
              </div>
            </div>
          )}

          {/* Feedback Details Section */}
          {feedbackDetails && (
            <div className="p-4 bg-gray-50 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <MessageCircle className="text-indigo-600 w-6 h-6" /> Feedback
              </h3>
              <p className="text-gray-700 italic mt-2">
                "{feedbackDetails.feedback || "No feedback available"}"
              </p>

              <div className="grid grid-cols-2 gap-2 text-gray-700 mt-4">
                <p className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                  <Tag className="text-purple-600 w-5 h-5" />{" "}
                  <span className="font-medium">Sentiment:</span>
                </p>
                <p className="px-3 py-1 rounded-md bg-green-100 text-green-600 font-semibold">
                  {feedbackDetails.sentiment || "N/A"}
                </p>

                <p className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                  <Tag className="text-purple-600 w-5 h-5" />{" "}
                  <span className="font-medium">Category:</span>
                </p>
                <p className="px-3 py-1 rounded-md bg-blue-100 text-blue-600 font-semibold">
                  {feedbackDetails.category || "N/A"}
                </p>

                <p className="flex items-center gap-2 bg-gray-100 px-3 py-1 rounded-md">
                  <Calendar className="text-gray-600 w-5 h-5" />{" "}
                  <span className="font-medium">Created At:</span>
                </p>
                <p className="px-3 py-1 rounded-md">
                  {new Date(feedbackDetails.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Close Button */}
        <div className="flex justify-center mt-6">
          <Button
            onClick={() => setIsDialogOpen(false)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 text-lg rounded-lg"
          >
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default FeedbackDetailsDialog;
