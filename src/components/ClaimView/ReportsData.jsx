import React from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchReportsByClaimId } from "@/services/reports";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ArrowDownToLine, FileText } from "lucide-react";
import clsx from "clsx";

const ReportDetails = () => {
  const { id: claimId } = useParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["reports", claimId],
    queryFn: () => fetchReportsByClaimId(claimId),
    staleTime: Infinity,
    retry: false,
  });

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="px-4 mt-4">
      <div className="flex gap-2 items-center px-5 py-3 mb-5 text-white bg-gradient-to-r from-blue-900 to-blue-600 rounded-md shadow-md">
        <FileText size={24} />
        <h2 className="text-2xl font-bold tracking-wide uppercase">
          Reports Details
        </h2>
      </div>

      {data?.map((claim) => (
        <div className="mx-auto space-y-6">
          {/* Claim Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Claim Record by Policy Holder</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 w-full">
              <p className="text-gray-600">
                {claim?.audioToTextConvertedContext}
              </p>

              <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <Badge
                    variant={
                      claim?.status === "Approved" ? "success" : "warning"
                    }
                  >
                    {claim?.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimation Requested</p>
                  <p className="font-semibold">
                    Rs {claim?.estimation_requested}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Estimation Approved</p>
                  <p className="font-semibold">
                    Rs {claim?.estimation_approved}
                  </p>
                </div>
              </div>

              <div className="flex gap-4 mt-3">
                <a
                  href={claim?.incidentReport}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <FileText className="mr-2 w-4 h-4" />
                    View Incident Report
                  </Button>
                </a>
                <a
                  href={claim?.decisionReport}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="outline">
                    <ArrowDownToLine className="mr-2 w-4 h-4" />
                    Download Decision Report
                  </Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Evaluation Table */}
          <Card>
            <CardHeader>
              <CardTitle>Damage Evaluations</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Part Damaged</TableHead>
                    <TableHead>Damage Type</TableHead>
                    <TableHead>Severity</TableHead>
                    <TableHead>Decision</TableHead>
                    <TableHead>Estimated Cost</TableHead>
                    <TableHead>Evaluation decision</TableHead>
                    <TableHead>Accepted Cost</TableHead>
                    <TableHead>Evaluation Remarks</TableHead>
                    <TableHead>Evaluation Status</TableHead>
                    <TableHead>Evaluation By</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {claim?.evaluation?.map((item) => (
                    <TableRow key={item?.damage_id}>
                      <TableCell>{item?.part_damaged}</TableCell>
                      <TableCell>{item?.damage_type}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            item?.severity === "severe"
                              ? "destructive"
                              : "default"
                          }
                        >
                          {item?.severity}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">{item.decision}</span>
                      </TableCell>
                      <TableCell>Rs {item.cost.toLocaleString()}</TableCell>
                      <TableCell>{item?.evaluation?.decision}</TableCell>
                      <TableCell>Rs. {item?.evaluation?.cost}</TableCell>
                      <TableCell>{item?.evaluation?.reason}</TableCell>
                      <TableCell>
                        <Badge
                          className={clsx(
                            "text-white",
                            item?.evaluation?.approved
                              ? " bg-green-400"
                              : " bg-red-500"
                          )}
                        >
                          {item?.evaluation?.status}
                        </Badge>
                      </TableCell>
                      <TableCell>System</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default ReportDetails;
