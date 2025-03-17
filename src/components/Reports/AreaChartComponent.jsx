import { TrendingUp } from "lucide-react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  XAxis,
  ResponsiveContainer,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSearchParams } from "react-router-dom";

const chartData = [
  { month: "January", estimated: 186, approved: 80 },
  { month: "February", estimated: 305, approved: 200 },
  { month: "March", estimated: 237, approved: 120 },
  { month: "April", estimated: 73, approved: 190 },
  { month: "May", estimated: 209, approved: 130 },
  { month: "June", estimated: 214, approved: 140 },
];
const chartConfig = {
  estimated: {
    label: "estimated",
    color: "#3B82F6",
  },
  approved: {
    label: "approved",
    color: "#10B981",
  },
};
export function AreaChartComponent({ data }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const timeInterval = searchParams.get("timeInterval") || "7days";

  function reverseData(data) {
    if (timeInterval === "6months" || timeInterval === "3months") {
      return data?.slice()?.reverse();
    }
    return data;
  }

  console.log(reverseData(data));
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between ">
        <div className="flex flex-col gap-2 ">
          <CardTitle>Estimated Vs Accepted</CardTitle>
          <CardDescription>
            A comparison of estimated vs accepted claims
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="h-[18rem]">
        {/* Set height for consistency */}
        <ResponsiveContainer width="100%" height="100%">
          <ChartContainer config={chartConfig}>
            <AreaChart
              accessibilityLayer
              data={reverseData(data) || chartData}
              margin={{
                left: 12,
                right: 12,
              }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="timeInterval"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                tickFormatter={(value) => value.slice(0, 10)}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="line" />}
              />
              <Area
                dataKey="approved"
                type="natural"
                fill="var(--color-approved)"
                fillOpacity={0.4}
                stroke="var(--color-approved)"
                stackId="a"
              />
              <Area
                dataKey="estimated"
                type="natural"
                fill="var(--color-estimated)"
                fillOpacity={0.4}
                stroke="var(--color-estimated)"
                stackId="a"
              />
              <ChartLegend content={<ChartLegendContent />} />
            </AreaChart>
          </ChartContainer>
        </ResponsiveContainer>
      </CardContent>
      <CardFooter>
        <div className="flex items-start w-full gap-2 text-sm">
          <div className="grid gap-2">
            <div className="flex items-center gap-2 font-medium leading-none">
              Trending up by 5.2% this month <TrendingUp className="w-4 h-4" />
            </div>
            <div className="flex items-center gap-2 leading-none text-muted-foreground">
              January - June 2024
            </div>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
