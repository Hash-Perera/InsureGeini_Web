import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Download } from "lucide-react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import jsPDF from "jspdf"; 
import autoTable from "jspdf-autotable"; 
import { CalendarIcon } from "lucide-react";
import Swal from "sweetalert2";
import FeedbackDetailsDialog from "./FeedbackDetailDialog"; 

import {
  PieChart,
  Pie,
  Label,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ComposedChart,
  AreaChart,
  Area,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import {
  MessageSquareQuote,
  MessageSquareHeart,
  Meh,
  ThumbsDown,
} from "lucide-react";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import SharedDataTable from "../components/SharedDataTable";
import axios from "axios";
import { Progress } from "@/components/ui/progress";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const chartConfig = {
  positive: { label: "Positive", color: "#4caf50" },
  neutral: { label: "Neutral", color: "#ffeb3b" },
  negative: { label: "Negative", color: "#f44336" },
};

const columns = [
  {
    accessorKey: "userId",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("userId")}</div>
    ),
  },
  {
    accessorKey: "feedback",
    header: "Feedback",
    cell: ({ row }) => <div>{row.getValue("feedback")}</div>,
  },
  {
    accessorKey: "sentiment",
    header: "Sentiment",
    cell: ({ row }) => {
      const sentiment = row.getValue("sentiment");
      const color =
        sentiment === "Positive"
          ? "text-green-600"
          : sentiment === "Negative"
          ? "text-red-600"
          : "text-yellow-600";
      return <div className={`font-semibold ${color}`}>{sentiment}</div>;
    },
  },
  {
    accessorKey: "category",
    header: "Category",
    cell: ({ row }) => (
      <div className="font-medium text-blue-600">
        {row.getValue("category")}
      </div>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const feedback = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="w-8 h-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(feedback._id)}
            >
              Copy Feedback ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View Details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

/*   // Download Button Component
  const DownloadButton = ({ data, filename, title }) => {
    const [open, setOpen] = useState(false);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    console.log("sentimentdata",data);
    console.log("start date", startDate);
    console.log("end date", endDate);
  
    const handleDownload = () => {
      if (!startDate || !endDate) {
        alert("Please select a date range.");
        return;
      }
  
      // Filter data based on selected date range
      const filteredData = data.filter((item) => {
        const itemDate = new Date(item.createdAt); // Ensure each data item has a 'createdAt' field
        return itemDate >= new Date(startDate) && itemDate <= new Date(endDate);
      });
  
      if (filteredData.length === 0) {
        alert("No data found for the selected time range.");
        return;
      }
  
      // Convert data to CSV format
      const csvContent =
        "data:text/csv;charset=utf-8," +
        Object.keys(filteredData[0]).join(",") + "\n" + // Headers
        filteredData.map((row) => Object.values(row).join(",")).join("\n");
  
      // Create a Blob and trigger the download
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      saveAs(blob, `${filename}-${format(new Date(), "yyyy-MM-dd")}.csv`);
  
      setOpen(false);
    };
    return (
      <>
        <Button variant="outline" className="mt-2" onClick={() => setOpen(true)}>
          <Download className="mr-2" size={16} /> Download Report
        </Button>
  
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Select Time Range for {title}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4">
              <label>
                Start Date:
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </label>
              <label>
                End Date:
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="border p-2 w-full rounded"
                />
              </label>
              <Button className="mt-4" onClick={handleDownload}>
                Generate Report
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }; */
export const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [sentimentStats, setSentimentStats] = useState({});
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredSentimentData, setFilteredSentimentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoryStats, setCategoryStats] = useState({});
  const [chartLoading, setChartLoading] = useState(false);
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Open feedback details dialog
  const openFeedbackDetails = (feedback) => {
    setSelectedFeedback(feedback);
    setIsDialogOpen(true);
  };

  const columns = [
    {
      accessorKey: "InsuranceId", 
      header: " name",
      cell: ({ row }) => (
        <div className="font-medium">
          {row.original.userId?.insuranceId || "Unknown"}
        </div>
      ),
    },
    {
      accessorKey: "feedback",
      header: "Feedback",
      cell: ({ row }) => <div>{row.getValue("feedback")}</div>,
    },
    {
      accessorKey: "sentiment",
      header: "Sentiment",
      cell: ({ row }) => {
        const sentiment = row.getValue("sentiment");
        const color =
          sentiment === "Positive"
            ? "text-green-600"
            : sentiment === "Negative"
            ? "text-red-600"
            : "text-yellow-600";
        return <div className={`font-semibold ${color}`}>{sentiment}</div>;
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => (
        <div className="font-medium text-blue-600">
          {row.getValue("category")}
        </div>
      ),
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const feedback = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="w-8 h-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(feedback._id)}
              >
                Copy Feedback ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => openFeedbackDetails(feedback)}>
                View Details
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
  /*   const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null); */

  // Yup Validation Schema
  const dateRangeSchema = yup.object().shape({
    startDate: yup
      .date()
      .typeError("Start date is required")
      .required("Start date is required"),
    endDate: yup
      .date()
      .typeError("End date is required")
      .required("End date is required")
      .min(yup.ref("startDate"), "End date must be after the start date"),
  });

  const {
    register,
    handleSubmit,
    watch,
    clearErrors,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(dateRangeSchema),
  });

  // Watch selected dates
  const startDate = watch("startDate");
  const endDate = watch("endDate");

  console.log("feedbackData", feedbackData);
  console.log("sentimentStats", sentimentStats);

  const monthOrder = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  const fetchfeedbackData = async () => {
    setLoading(true);
    const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg0NzJlYWUwZmI3Y2RiZjcxOTBmYSIsInJvbGUiOiJDdXN0b21lciIsImlhdCI6MTczOTIwMzY3MCwiZXhwIjoxNzQxNzk1NjcwfQ.v338cBSy53nmwp5DTSUQZqDw49LwKWjwSfCEuQIkZcc";
    try {
      const response = await axios.get(
        "http://localhost:8000/v1/feedback/all",
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const feedbackList = response.data.data;
      const updatedFeedbackData = feedbackList.map((feedback) => ({
        ...feedback,
        InsuranceId: feedback.userId?.insuranceId || "Unknown", 
      }));

      setTimeout(() => {
        setLoading(false), setFeedbackData(updatedFeedbackData);
      }, 500);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchfeedbackData();
  }, []);

  // Function to filter data based on global date range
  const filterDataByDate = (data) => {
    if (!startDate || !endDate) return data;
    return data.filter((feedback) => {
      const feedbackDate = new Date(feedback.createdAt);
      return feedbackDate >= startDate && feedbackDate <= endDate;
    });
  };

  // Update sentiment and category statistics based on selected date range
  useEffect(() => {
    if (feedbackData.length > 0) {
      setChartLoading(true);
      setTimeout(() => {
        const filteredData = filterDataByDate(feedbackData);
        calculateSentimentStats(filteredData);
        calculateCategoryStats(filteredData);
        setChartLoading(false);
      }, 500);
    }
  }, [startDate, endDate, feedbackData, selectedCategory]);

  // Download unique PDF reports
  const downloadReportAsPDF = (data, title, reportType, startDate, endDate) => {
    if (data.length === 0) {
      alert("No data available in the selected date range!");
      return;
    }

    const doc = new jsPDF("p", "mm", "a4");

    const companyName = "InsureGeini";
    const logo = new Image();
    logo.src = "/images/logo.jpeg";
    doc.addImage(logo, "JPEG", 150, 10, 50, 30);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text(companyName, 14, 15);
    doc.text(`${title} Report`, 14, 25);

    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 35);

    const formattedStartDate = startDate
      ? new Date(startDate).toLocaleDateString()
      : "N/A";
    const formattedEndDate = endDate
      ? new Date(endDate).toLocaleDateString()
      : "N/A";
    doc.text(`Date Range: ${formattedStartDate} - ${formattedEndDate}`, 14, 42);

    doc.setLineWidth(0.5);
    doc.line(14, 46, 196, 46);

    let startY = 60;

    let summaryData = [];
    if (reportType === "sentiment") {
      summaryData = [
        ["Total Feedback", data.length],
        ["Report Type", "Sentiment report"],
      ];
    } else if (reportType === "category") {
      summaryData = [
        ["Total Feedback", data.length],
        ["Report Type", "Category report"],
      ];
    } else if (reportType === "sentiment-category") {
      summaryData = [
        ["Total Feedback", data.length],
        ["Report Type", "Sentiment & Category report"],
      ];
    } else if (reportType === "sentiment-trends") {
      summaryData = [
        ["Total Feedback", data.length],
        ["Report Type", "Sentiment Trends report"],
      ];
    }
    // Summary Table
    autoTable(doc, {
      startY: startY,
      body: summaryData,
      theme: "grid",
      styles: { fontSize: 11, cellPadding: 6, fontStyle: "bold" },
      columnStyles: {
        0: { fillColor: [41, 128, 185], textColor: 255 },
        1: { fillColor: [236, 240, 241], fontStyle: "bold" },
      },
    });

    startY = doc.lastAutoTable.finalY + 10;

    //Data Table
    let columns = [];
    let rows = [];

    if (reportType === "sentiment") {
      columns = ["Sentiment", "Count"];
      const sentimentCounts = data.reduce((acc, item) => {
        acc[item.sentiment] = (acc[item.sentiment] || 0) + 1;
        return acc;
      }, {});
      rows = Object.keys(sentimentCounts).map((key) => [
        key,
        sentimentCounts[key],
      ]);
    } else if (reportType === "category") {
      columns = ["Category", "Count"];
      const categoryCounts = data.reduce((acc, item) => {
        acc[item.category] = (acc[item.category] || 0) + 1;
        return acc;
      }, {});
      rows = Object.keys(categoryCounts).map((key) => [
        key,
        categoryCounts[key],
      ]);
    } else if (reportType === "sentiment-category") {
      columns = ["Category", "Positive", "Neutral", "Negative"];
      const categorySentiments = data.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = { positive: 0, neutral: 0, negative: 0 };
        }
        acc[item.category][item.sentiment]++;
        return acc;
      }, {});
      rows = Object.keys(categorySentiments).map((category) => [
        category,
        categorySentiments[category].positive || 0,
        categorySentiments[category].neutral || 0,
        categorySentiments[category].negative || 0,
      ]);
    } else if (reportType === "sentiment-trends") {
      columns = ["Month", "Positive", "Neutral", "Negative"];
      const trends = {};
      data.forEach((item) => {
        const month = new Date(item.createdAt).toLocaleString("en-US", {
          month: "short",
        });
        if (!trends[month]) {
          trends[month] = { positive: 0, neutral: 0, negative: 0 };
        }
        trends[month][item.sentiment]++;
      });
      rows = Object.keys(trends).map((month) => [
        month,
        trends[month].positive || 0,
        trends[month].neutral || 0,
        trends[month].negative || 0,
      ]);
    }

    autoTable(doc, {
      startY: startY,
      head: [columns],
      body: rows,
      theme: "grid",
      styles: {
        fontSize: 10,
        cellPadding: 5,
      },
      headStyles: {
        fillColor: [52, 152, 219],
        textColor: [255, 255, 255],
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
    });

    //
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(10);
      doc.setFont("helvetica", "italic");
      doc.text(`Page ${i} of ${pageCount}`, 180, 285);
      doc.text("InsureGeini - Data Insights Report", 14, 285);
    }

    // Save and Download the PDF
    doc.save(`${title}__Report_${formattedStartDate}-${formattedEndDate}.pdf`);
  };

  // Calculate category statistics
  const calculateCategoryStats = (data) => {
    const categoryCounts = {};
    data.forEach((feedback) => {
      categoryCounts[feedback.category] =
        (categoryCounts[feedback.category] || 0) + 1;
    });
    setCategoryStats(categoryCounts);
  };

  const calculateSentimentStats = (data) => {
    const sentimentCounts = { positive: 0, neutral: 0, negative: 0 };
    const categorySentimentCounts = {};
    const sentimentTrend = {};
    const categoryCounts = {};

    data.forEach((feedback) => {
      const sentiment = feedback.sentiment.toLowerCase();
      const category = feedback.category;

      // Extract month from createdAt
      const date = new Date(feedback.createdAt);
      const month = date.toLocaleString("en-US", { month: "short" });

      if (sentimentCounts.hasOwnProperty(sentiment)) {
        sentimentCounts[sentiment] += 1;
      }

      if (category) {
        if (!categoryCounts[category]) {
          categoryCounts[category] = 0;
        }
        categoryCounts[category] += 1;

        if (!categorySentimentCounts[category]) {
          categorySentimentCounts[category] = {
            positive: 0,
            neutral: 0,
            negative: 0,
          };
        }
        categorySentimentCounts[category][sentiment] += 1;
      }

      // Group data by category & month
      if (!sentimentTrend[category]) {
        sentimentTrend[category] = {};
      }
      if (!sentimentTrend[category][month]) {
        sentimentTrend[category][month] = {
          positive: 0,
          neutral: 0,
          negative: 0,
        };
      }
      sentimentTrend[category][month][sentiment] += 1;
    });

    setSentimentStats({
      sentimentCounts,
      categorySentimentCounts,
      sentimentTrend,
      categoryCounts,
    });

    // Prepare data for the Sentiment Trends chart
    let selectedTrend;
    if (selectedCategory === "All") {
      const mergedTrend = {};
      Object.values(sentimentTrend).forEach((trend) => {
        Object.keys(trend).forEach((month) => {
          if (!mergedTrend[month]) {
            mergedTrend[month] = { positive: 0, neutral: 0, negative: 0 };
          }
          mergedTrend[month].positive += trend[month].positive || 0;
          mergedTrend[month].neutral += trend[month].neutral || 0;
          mergedTrend[month].negative += trend[month].negative || 0;
        });
      });

      selectedTrend = Object.keys(mergedTrend).map((month) => ({
        month,
        Positive: mergedTrend[month].positive || 0,
        Neutral: mergedTrend[month].neutral || 0,
        Negative: mergedTrend[month].negative || 0,
      }));
    } else {
      selectedTrend = Object.keys(sentimentTrend[selectedCategory] || {}).map(
        (month) => ({
          month,
          Positive: sentimentTrend[selectedCategory][month].positive || 0,
          Neutral: sentimentTrend[selectedCategory][month].neutral || 0,
          Negative: sentimentTrend[selectedCategory][month].negative || 0,
        })
      );
    }

    selectedTrend.sort(
      (a, b) => monthOrder.indexOf(a.month) - monthOrder.indexOf(b.month)
    );
    setFilteredSentimentData(selectedTrend);
  };

  const sentimentPieData = Object.keys(
    sentimentStats.sentimentCounts || {}
  ).map((key) => ({
    name: key,
    value: sentimentStats.sentimentCounts[key] || 0,
    fill: chartConfig[key].color,
  }));

  //Calculate total sentiments before using it in Label
  const totalSentiments = sentimentPieData.reduce(
    (acc, curr) => acc + curr.value,
    0
  );

  const categoryBarData = Object.keys(sentimentStats.categoryCounts || {}).map(
    (key) => ({
      category: key,
      count: sentimentStats.categoryCounts[key] || 0,
    })
  );

  const categorySentimentChartData = Object.keys(
    sentimentStats.categorySentimentCounts || {}
  ).map((category) => ({
    category,
    Positive: sentimentStats.categorySentimentCounts[category].positive,
    Neutral: sentimentStats.categorySentimentCounts[category].neutral,
    Negative: sentimentStats.categorySentimentCounts[category].negative,
  }));

  if (sentimentPieData.length === 0) {
    sentimentPieData.push({ name: "No Data", value: 0 });
  }

  if (categoryBarData.length === 0) {
    categoryBarData.push({ category: "No Data", count: 0 });
  }

  return (
    <div className="flex flex-col gap-4 pr-4 bg-gray-100 min-h-screen p-6 rounded-lg">
      {loading ? (
        <div className="w-full fixed top-0 left-0">
          <Progress value={100} className="mb-4" />
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center justify-center bg-gray-800 shadow-md p-4 rounded-lg mb-4 gap-4">
            <h2 className="text-lg font-semibold text-white flex items-center mb-2">
              <CalendarIcon className="w-5 h-5 mr-2 text-white" /> Select a Date
              Range
            </h2>

            {/* Date Range */}
            <div className="flex items-center gap-4 w-full md:w-auto">
              <div className="relative w-full">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => {
                    setValue("startDate", date);
                    clearErrors("startDate");
                  }}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  className="border rounded-md p-2 pl-10 w-full focus:ring focus:ring-blue-300"
                  placeholderText="Start Date"
                />
                {errors.startDate && (
                  <p className="text-red-500">{errors.startDate.message}</p>
                )}
                <CalendarIcon className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              </div>

              <span className="text-white">to</span>

              <div className="relative w-full">
                <DatePicker
                  selected={endDate}
                  onChange={(date) => {
                    setValue("endDate", date);
                    clearErrors("endDate");
                  }}
                  selectsEnd
                  startDate={startDate}
                  endDate={endDate}
                  minDate={startDate}
                  className="border rounded-md p-2 pl-10 w-full focus:ring focus:ring-blue-300"
                  placeholderText="End Date"
                />
                {errors.endDate && (
                  <p className="text-red-500">{errors.endDate.message}</p>
                )}
                <CalendarIcon className="absolute left-3 top-3 text-gray-500 w-5 h-5" />
              </div>
            </div>
          </div>

          {/* KPI Cards */}
          <div className="grid grid-flow-col gap-4 py-2 overflow-hidden ">
            {[
              {
                title: "Total Feedback",
                value: feedbackData.length,
                color: "bg-gradient-to-r from-blue-400 to-blue-600",
              },

              {
                title: "Positive",
                value: sentimentStats.sentimentCounts?.positive || 0,
                color: "bg-gradient-to-r from-green-400 to-green-600",
              },
              {
                title: "Neutral",
                value: sentimentStats.sentimentCounts?.neutral || 0,
                color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
              },
              {
                title: "Negative",
                value: sentimentStats.sentimentCounts?.negative || 0,
                color: "bg-gradient-to-r from-red-400 to-red-600",
              },
            ].map((item, index) => (
              <Card
                className={`${item.color} shadow-lg rounded-2xl hover:scale-105 transition-transform duration-100 text-white`}
              >
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="flex items-center gap-2 font-medium text-md">
                    {index === 0 && (
                      <span className="bg-blue-500 rounded-full size-2 "></span>
                    )}
                    {index === 1 && (
                      <span className="bg-green-500 rounded-full size-2 "></span>
                    )}
                    {index === 2 && (
                      <span className="bg-yellow-500 rounded-full size-2 "></span>
                    )}
                    {index === 3 && (
                      <span className="bg-red-500 rounded-full size-2 "></span>
                    )}
                    <span>{item.title}</span>
                  </CardTitle>
                  {index === 0 && (
                    <MessageSquareQuote size={24} className="text-white" />
                  )}
                  {index === 1 && (
                    <MessageSquareHeart size={24} className="text-white" />
                  )}
                  {index === 2 && <Meh size={24} className="text-white" />}
                  {index === 3 && (
                    <ThumbsDown size={24} className="text-white" />
                  )}
                </CardHeader>
                <CardContent>
                  <div className="pl-1 text-3xl font-bold "> {item.value}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-2 gap-4 overflow-hidden ">
            <Card className="bg-gradient-to-b from-white to-gray-100 shadow-md p-4 rounded-2xl">
              <CardHeader className="flex flex-wrap flex-row justify-between">
                <h2 className="mb-4 text-xl font-semibold text-gray-800">
                  Feedback by Sentiment
                </h2>
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                  onClick={handleSubmit(() => {
                    try {
                      // Call the function to generate the PDF
                      downloadReportAsPDF(
                        filterDataByDate(feedbackData),
                        "Sentiment",
                        "sentiment",
                        startDate,
                        endDate
                      );

                      // Show success message
                      Swal.fire({
                        title: "✅ Download Complete!",
                        text: "Your feedback by sentiment report has been successfully generated and saved.",
                        icon: "success",
                        background: "#fff",
                        color: "#065f46",
                        confirmButtonColor: "#059669",
                        confirmButtonText: "Great!",
                        showClass: {
                          popup: "animate__animated animate__zoomIn",
                        },
                        hideClass: {
                          popup: "animate__animated animate__fadeOutUp",
                        },
                      });
                    } catch (error) {
                      // Show error message
                      Swal.fire({
                        title: "❌ Validation Error",
                        text: error.message,
                        icon: "error",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        confirmButtonColor: "#dc2626",
                        confirmButtonText: "Try Again",
                        showClass: {
                          popup: "animate__animated animate__shakeX",
                        },
                      });
                    }
                  })}
                >
                  <Download className="inline-block" size={18} /> Download PDF
                </button>
              </CardHeader>
              <CardContent className="h-[300px] flex justify-center items-center">
                {sentimentPieData.length === 0 ||
                sentimentPieData[0].value === 0 ? (
                  <p className="text-gray-500 text-lg">
                    No sentiment data available.
                  </p>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer
                      className="overflow-hidden"
                      config={chartConfig}
                    >
                      <PieChart>
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Pie
                          data={sentimentPieData}
                          dataKey="value"
                          label
                          nameKey="name"
                          innerRadius={60}
                          strokeWidth={5}
                          animationDuration={2000}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                "cx" in viewBox &&
                                "cy" in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                    dominantBaseline="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={viewBox.cy}
                                      className="fill-foreground text-3xl font-bold"
                                    >
                                      {totalSentiments.toLocaleString()}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy || 0) + 24}
                                      className="fill-muted-foreground"
                                    >
                                      Feedbacks
                                    </tspan>
                                  </text>
                                );
                              }
                            }}
                          />
                        </Pie>
                      </PieChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-white to-gray-100 shadow-md p-4 rounded-2xl ">
              <CardHeader className="flex flex-wrap flex-row justify-between">
                <h2 className="mb-4 text-xl font-semibold text-gray-800 w-full md:w-auto">
                  Feedback by Category
                </h2>
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                  onClick={handleSubmit(() => {
                    try {
                      // Call the function to generate the PDF
                      downloadReportAsPDF(
                        filterDataByDate(feedbackData),
                        "Category",
                        "category",
                        startDate,
                        endDate
                      );

                      // Show success message
                      Swal.fire({
                        title: "✅ Download Complete!",
                        text: "Your feedback by category report has been successfully generated and saved.",
                        icon: "success",
                        background: "#fff",
                        color: "#065f46",
                        confirmButtonColor: "#059669",
                        confirmButtonText: "Great!",
                        showClass: {
                          popup: "animate__animated animate__zoomIn",
                        },
                        hideClass: {
                          popup: "animate__animated animate__fadeOutUp",
                        },
                      });
                    } catch (error) {
                      // Show error message
                      Swal.fire({
                        title: "❌ Validation Error",
                        text: error.message,
                        icon: "error",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        confirmButtonColor: "#dc2626",
                        confirmButtonText: "Try Again",
                        showClass: {
                          popup: "animate__animated animate__shakeX",
                        },
                      });
                    }
                  })}
                >
                  <Download className="inline-block" size={18} /> Download PDF
                </button>
              </CardHeader>
              <CardContent className="h-[300px] flex justify-center items-center">
                {categoryBarData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <ChartContainer
                      className="overflow-hidden"
                      config={chartConfig}
                    >
                      <BarChart
                        data={categoryBarData}
                        margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                        barCategoryGap={categoryBarData.length === 1 ? 0 : 30} 
                        barGap={categoryBarData.length === 1 ? 0 : 10}
                      >
                        <CartesianGrid vertical={false} />
                        <XAxis
                          dataKey="category"
                          tickLine={false}
                          tickMargin={5}
                          tick={{ fontWeight: "bold" }}
                          axisLine={false}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" fill="#65b0ef" radius={10} />
                      </BarChart>
                    </ChartContainer>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-lg">
                    No category data available.
                  </p>
                )}
              </CardContent>
            </Card>
            <Card className="bg-white shadow-lg p-6 rounded-2xl transition-all">
              <CardHeader className="flex flex-wrap flex-row justify-between items-center">
                <h2 className="mb-4 text-xl font-bold text-gray-800 ">
                  Feedback by Sentiment & Category
                </h2>
                <button
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                  onClick={handleSubmit(() => {
                    try {
                      // Call the function to generate the PDF
                      downloadReportAsPDF(
                        filterDataByDate(feedbackData),
                        "Sentiment & Category",
                        "sentiment-category",
                        startDate,
                        endDate
                      );

                      // Show success message
                      Swal.fire({
                        title: "✅ Download Complete!",
                        text: "Your Sentiment & Category report has been successfully generated and saved.",
                        icon: "success",
                        background: "#fff",
                        color: "#065f46",
                        confirmButtonColor: "#059669",
                        confirmButtonText: "Great!",
                        showClass: {
                          popup: "animate__animated animate__zoomIn",
                        },
                        hideClass: {
                          popup: "animate__animated animate__fadeOutUp",
                        },
                      });
                    } catch (error) {
                      // Show error message
                      Swal.fire({
                        title: "❌ Validation Error",
                        text: error.message,
                        icon: "error",
                        background: "#fee2e2",
                        color: "#b91c1c",
                        confirmButtonColor: "#dc2626",
                        confirmButtonText: "Try Again",
                        showClass: {
                          popup: "animate__animated animate__shakeX",
                        },
                      });
                    }
                  })}
                >
                  <Download className="inline-block mr-2" size={18} /> Download
                  Report
                </button>
              </CardHeader>

              <CardContent className="h-[400px] flex justify-center items-center">
                {categorySentimentChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={categorySentimentChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
                      barCategoryGap={20}
                      barGap={8}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="category"
                        tick={{ fontSize: 14, fontWeight: "bold" }}
                        tickLine={false}
                        axisLine={false}
                      />
                      <YAxis />
                      <Tooltip
                        cursor={{ fill: "#f5f5f5" }}
                        contentStyle={{
                          borderRadius: "8px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          color: "#fff",
                          padding: "10px",
                        }}
                      />
                      <Legend verticalAlign="top" iconSize={16} />

                      {/* Custom Gradients */}
                      <defs>
                        <linearGradient
                          id="positiveGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#4caf50"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#4caf50"
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                        <linearGradient
                          id="neutralGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ffeb3b"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ffeb3b"
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                        <linearGradient
                          id="negativeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#f44336"
                            stopOpacity={0.9}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f44336"
                            stopOpacity={0.5}
                          />
                        </linearGradient>
                      </defs>

                      <Bar
                        dataKey="Positive"
                        fill="url(#positiveGradient)"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1200}
                        barSize={30}
                      />
                      <Bar
                        dataKey="Neutral"
                        fill="url(#neutralGradient)"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1400}
                        barSize={30}
                      />
                      <Bar
                        dataKey="Negative"
                        fill="url(#negativeGradient)"
                        radius={[8, 8, 0, 0]}
                        animationDuration={1600}
                        barSize={30}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-lg">
                    No sentiment-category data available.
                  </p>
                )}
              </CardContent>
            </Card>

            <Card className="bg-white shadow-lg p-6 rounded-2xl transition-all">
              <CardHeader className="flex flex-wrap flex-row justify-between items-center">
                <h2 className="md-4 text-xl font-bold text-gray-800">
                  Sentiment Trends by Category
                </h2>
                <div className="flex items-center gap-2">
                  <button
                    className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-4 py-2 rounded-lg hover:scale-105 transition-transform"
                    onClick={handleSubmit(() => {
                      try {
                        downloadReportAsPDF(
                          filterDataByDate(feedbackData),
                          "Sentiment Trends",
                          "sentiment-trends",
                          startDate,
                          endDate
                        );

                        // Show success message
                        Swal.fire({
                          title: "✅ Download Complete!",
                          text: "Your sentiment trends report has been successfully generated and saved.",
                          icon: "success",
                          background: "#fff",
                          color: "#065f46",
                          confirmButtonColor: "#059669",
                          confirmButtonText: "Great!",
                          showClass: {
                            popup: "animate__animated animate__zoomIn",
                          },
                          hideClass: {
                            popup: "animate__animated animate__fadeOutUp",
                          },
                        });
                      } catch (error) {
                        // Show error message
                        Swal.fire({
                          title: "❌ Validation Error",
                          text: error.message,
                          icon: "error",
                          background: "#fee2e2",
                          color: "#b91c1c",
                          confirmButtonColor: "#dc2626",
                          confirmButtonText: "Try Again",
                          showClass: {
                            popup: "animate__animated animate__shakeX",
                          },
                        });
                      }
                    })}
                  >
                    <Download className="inline-block mr-2" size={18} />{" "}
                    Download Report
                  </button>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="bg-gray-800 text-white"
                      >
                        {selectedCategory}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Select Category</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => setSelectedCategory("All")}
                      >
                        All
                      </DropdownMenuItem>
                      {Object.keys(
                        sentimentStats.categorySentimentCounts || {}
                      ).map((category) => (
                        <DropdownMenuItem
                          key={category}
                          onClick={() => setSelectedCategory(category)}
                        >
                          {category}
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>

              <CardContent className="h-[400px] flex justify-center items-center">
                {filteredSentimentData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={filteredSentimentData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
                    >
                      <defs>
                        <linearGradient
                          id="positiveGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#4caf50"
                            stopOpacity={0.7}
                          />
                          <stop
                            offset="100%"
                            stopColor="#4caf50"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                        <linearGradient
                          id="neutralGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#ffeb3b"
                            stopOpacity={0.7}
                          />
                          <stop
                            offset="100%"
                            stopColor="#ffeb3b"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                        <linearGradient
                          id="negativeGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="0%"
                            stopColor="#f44336"
                            stopOpacity={0.7}
                          />
                          <stop
                            offset="100%"
                            stopColor="#f44336"
                            stopOpacity={0.3}
                          />
                        </linearGradient>
                      </defs>

                      <CartesianGrid
                        strokeDasharray="3 3"
                        strokeOpacity={0.3}
                      />
                      <XAxis
                        dataKey="month"
                        tickMargin={15}
                        tick={{ fontWeight: "bold", fontSize: 14 }}
                      />
                      <YAxis domain={[0, "auto"]} allowDecimals={false} />
                      <Tooltip
                        cursor={{ stroke: "#ccc", strokeWidth: 1 }}
                        contentStyle={{
                          borderRadius: "8px",
                          backgroundColor: "rgba(0, 0, 0, 0.7)",
                          color: "#fff",
                          padding: "10px",
                        }}
                      />
                      <Legend verticalAlign="top" iconSize={16} />

                      <Area
                        type="monotone"
                        dataKey="Positive"
                        stroke="#4caf50"
                        fill="url(#positiveGradient)"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#4caf50",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                        animationDuration={1200}
                      />
                      <Area
                        type="monotone"
                        dataKey="Neutral"
                        stroke="#ffeb3b"
                        fill="url(#neutralGradient)"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#ffeb3b",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                        animationDuration={1400}
                      />
                      <Area
                        type="monotone"
                        dataKey="Negative"
                        stroke="#f44336"
                        fill="url(#negativeGradient)"
                        strokeWidth={3}
                        dot={{
                          r: 5,
                          fill: "#f44336",
                          stroke: "#fff",
                          strokeWidth: 2,
                        }}
                        animationDuration={1600}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-500 text-lg">
                    No trend data available.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
          {/* Feedback Details Dialog */}
          <FeedbackDetailsDialog
            selectedFeedback={selectedFeedback}
            isDialogOpen={isDialogOpen}
            setIsDialogOpen={setIsDialogOpen}
          />

          {/* Recent Feedback Table */}
          <div className="pt-3 bg-gradient-to-b from-white to-gray-100 shadow-md rounded-xl p-4">
            <h2 className="mb-4 text-xl font-semibold text-gray-700 ">
              Recent Feedback
            </h2>

            <SharedDataTable
              data={filterDataByDate(feedbackData)}
              columns={columns}
              searchBy={["InsuranceId", "category", "sentiment", "feedback"]}
            />
          </div>
        </>
      )}
    </div>
  );
};
