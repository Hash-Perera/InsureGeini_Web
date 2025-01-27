import React from "react";
import { DataTable } from "@/components/ui/data-table";

const data = [
  {
    id: "728ed52f",
    amount: 100,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52g",
    amount: 200,
    status: "pending",
    email: "m@example.com",
  },
  {
    id: "728ed52h",
    amount: 300,
    status: "pending",
    email: "m@example.com",
  },
];

const columns = [
  {
    accessorKey: "status",
    header: "Status",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
];

const Started = () => {
  return (
    <div>
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default Started;
