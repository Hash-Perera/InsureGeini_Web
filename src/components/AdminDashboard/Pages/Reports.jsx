import React from "react";
import SharedDataTable from "../components/SharedDataTable";
import { useQuery } from "@tanstack/react-query";
import { fetchAllReports, fetchReportStats } from "@/services/reports";
import { AreaChartComponent } from "@/components/Reports/AreaChartComponent";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { columns } from "@/components/Reports/columns";
import Filters from "@/components/Reports/Filters";
import { useSearchParams } from "react-router-dom";

const Reports = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const timeInterval = searchParams.get("timeInterval") || "7days";
  const { data: reportData } = useQuery({
    queryKey: ["Reports"],
    queryFn: async () => {
      try {
        const response = await fetchAllReports();
        return response;
      } catch (error) {
        console.error("Error fetching all reports:", error.message);
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  const { data: reportStats } = useQuery({
    queryKey: ["basicStats", timeInterval],
    queryFn: async () => {
      try {
        const response = await fetchReportStats({ filters: { timeInterval } });
        return response;
      } catch (error) {
        console.error("Error fetching all reports:", error.message);
        throw error;
      }
    },
    staleTime: Infinity,
    retry: false,
  });

  return (
    <main className="flex flex-col gap-3">
      <Filters />
      <div className="grid grid-cols-4 gap-3 ">
        <Card>
          <CardHeader>
            <CardTitle>Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">
              {reportStats?.data?.approvedReports}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-600">
              {reportStats?.data?.rejectedReports}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Pending</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-600">
              {reportStats?.data?.pendingReports}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-blue-600">
              {reportStats?.data?.totalReports}
            </div>
          </CardContent>
        </Card>
      </div>
      <AreaChartComponent data={reportStats?.data?.chartData} />
      <SharedDataTable
        data={reportData || []}
        columns={columns}
        searchBy={["date", "clientId", "status"]}
      />
    </main>
  );
};

export default Reports;
