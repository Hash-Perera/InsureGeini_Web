import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
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


const chartConfig = {
  value: {
    label: "Value",
  },
  neutral: {
    label: "Neutral",
    color: "#ffeb3b",
  },
  positive: {
    label: "Positve",
    color: "#4caf50",
  },
  negative: {
    label: "Negative",
    color: "#f44336",
  },
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
export const Feedback = () => {
  const [feedbackData, setFeedbackData] = useState([]);
  const [sentimentStats, setSentimentStats] = useState({});
 

  const fetchFeedbackData = async () => {
    try {
      const token =
      "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3NDg0NzJlYWUwZmI3Y2RiZjcxOTBmYSIsInJvbGUiOiJDdXN0b21lciIsImlhdCI6MTczOTIwMzY3MCwiZXhwIjoxNzQxNzk1NjcwfQ.v338cBSy53nmwp5DTSUQZqDw49LwKWjwSfCEuQIkZcc";
      const response = await axios.get("http://localhost:8000/v1/feedback/all", {
        headers: {
          contentType: "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      setFeedbackData(response.data.data);
    } catch (error) {
      console.error("Error fetching feedback data:", error);
    }
  };
  
  useEffect(() => {
    fetchFeedbackData();
  }, []);

  useEffect(() => {
    if (feedbackData.length > 0) {
      calculateSentimentStats(feedbackData);
    }
  }, [feedbackData]); // Runs when feedbackData changes

  const calculateSentimentStats = (data) => {
    const sentimentCounts = { Positive: 0, Neutral: 0, Negative: 0 };
    const categoryCounts = { Claim: 0, Policy: 0, CustomerService: 0 };

    if (!data || data.length === 0) return; // Ensure data exists

    data.forEach((feedback) => {
      if (
        feedback.sentiment &&
        sentimentCounts.hasOwnProperty(feedback.sentiment)
      ) {
        sentimentCounts[feedback.sentiment] += 1;
      }
      if (
        feedback.category &&
        categoryCounts.hasOwnProperty(feedback.category)
      ) {
        categoryCounts[feedback.category] += 1;
      }
    });
    setSentimentStats({ sentimentCounts, categoryCounts });
  };

  const sentimentPieData = Object.keys(
    sentimentStats.sentimentCounts || {}
  ).map((key) => ({
    name: key,
    value: sentimentStats.sentimentCounts[key] || 0,
  }));

  const categoryBarData = Object.keys(sentimentStats.categoryCounts || {}).map(
    (key) => ({
      category: key,
      count: sentimentStats.categoryCounts[key] || 0,
    })
  );

  // If data is still empty, add a placeholder to prevent Recharts errors
  if (sentimentPieData.length === 0) {
    sentimentPieData.push({ name: "No Data", value: 1 });
  }

  if (categoryBarData.length === 0) {
    categoryBarData.push({ category: "No Data", count: 1 });
  }

  return (
    <div className="flex flex-col gap-4 pr-4 ">
      {/* KPI Cards */}
      <div className="grid grid-flow-col gap-4 py-2 overflow-hidden ">
        {[
          { title: "Total Feedback", value: feedbackData.length },
          {
            title: "Positive",
            value: sentimentStats.sentimentCounts?.Positive || 0,
          },
          {
            title: "Neutral",
            value: sentimentStats.sentimentCounts?.Neutral || 0,
          },
          {
            title: "Negative",
            value: sentimentStats.sentimentCounts?.Negative || 0,
          },
        ].map((item, index) => (
          <Card className="transition-transform duration-75 transform rounded-2xl hover:scale-105">
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
                <MessageSquareQuote size={24} className="text-blue-500" />
              )}
              {index === 1 && (
                <MessageSquareHeart size={24} className="text-green-500" />
              )}
              {index === 2 && <Meh size={24} className="text-yellow-500" />}
              {index === 3 && <ThumbsDown size={24} className="text-red-500" />}
            </CardHeader>
            <CardContent>
              <div className="pl-1 text-3xl font-bold "> {item.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-2 gap-4 overflow-hidden ">
        <Card className="flex flex-col px-2 rounded-2xl hover:shadow-lg ">
          <CardHeader>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Feedback by Sentiment
            </h2>
          </CardHeader>
          <CardContent className="h-[300px]">
            {" "}
            {/* Set height for consistency */}
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer className="overflow-hidden" config={chartConfig}>
                <PieChart>
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Pie
                    data={sentimentPieData}
                    dataKey="value"
                    label
                    nameKey="name"
                    innerRadius={40}
                    outerRadius={80}
                  >
                    <Cell key="Positive" fill="#4caf50" />
                    <Cell key="Neutral" fill="#ffeb3b" />
                    <Cell key="Negative" fill="#f44336" />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="px-2 hover:shadow-lg rounded-2xl ">
          <CardHeader>
            <h2 className="mb-4 text-xl font-semibold text-gray-700">
              Feedback by Category
            </h2>
          </CardHeader>
          <CardContent className="h-[300px]">
            {" "}
            {/* Set height for consistency */}
            <ResponsiveContainer width="100%" height="100%">
              <ChartContainer className="overflow-hidden" config={chartConfig}>
                <BarChart data={categoryBarData}>
                  <CartesianGrid vertical={false} />
                  <XAxis
                    dataKey="category"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    tickFormatter={(value) => value.slice(0, 6)}
                  />
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Bar dataKey="count" fill="#65b0ef" radius={10} />
                </BarChart>
              </ChartContainer>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Recent Feedback Table */}
      <div className="pt-3 rounded-xl">
        <h2 className="mb-4 text-xl font-semibold text-gray-700 ">
          Recent Feedback
        </h2>

        <SharedDataTable
          data={feedbackData}
          columns={columns}
          searchBy={["userId", "category"]}
        />
      </div>
    </div>
  );
};
