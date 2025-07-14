import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/app/components/ui/chart";
import { TrendingUp } from "lucide-react";
import {
  CartesianGrid,
  LabelList,
  Line,
  LineChart,
  ResponsiveContainer,
  XAxis,
} from "recharts";
import { LastSevenCallsDto } from "../../chat/_actions/dtos/lastSevenCalls.dto";

type LineChartProps = {
  lastSevenCall: LastSevenCallsDto[] | null;
};

export function LineChartCalls({ lastSevenCall }: LineChartProps) {
  const chartConfig = {
    desktop: {
      label: "Desktop",
      color: "blue",
    },
    mobile: {
      label: "Mobile",
      color: "blue",
    },
  } satisfies ChartConfig;

  function getFirstAndLastDate(): string {
    if (!lastSevenCall || lastSevenCall.length === 0) return "";

    const firstDay = lastSevenCall[0].data;
    const lastDay = lastSevenCall[lastSevenCall.length - 1].data;

    return `${firstDay} - ${lastDay}`;
  }
  return (
    <Card className="flex flex-col flex-1 min-h-0 dark:bg-neutral-700">
      <CardHeader>
        <CardTitle>Chamados</CardTitle>
        <CardDescription>{getFirstAndLastDate()}</CardDescription>
      </CardHeader>

      <CardContent className="flex-1 min-h-0">
        <div className="w-full h-full">
          <ResponsiveContainer width="100%" height="100%">
            <ChartContainer config={chartConfig}>
              <LineChart
                data={lastSevenCall ?? []}
                margin={{ top: 30, left: 34, right: 24 }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="data"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  tickFormatter={(value) => value}
                />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent indicator="line" />}
                />
                <Line
                  dataKey="total"
                  type="monotone"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: "white" }}
                  activeDot={{ r: 6 }}
                >
                  <LabelList
                    position="top"
                    offset={12}
                    className="fill-foreground"
                    fontSize={12}
                  />
                </Line>
              </LineChart>
            </ChartContainer>
          </ResponsiveContainer>
        </div>
      </CardContent>

      <CardFooter className="flex-col items-start gap-2 text-sm">
        <div className="flex gap-2 leading-none font-medium">
          Chamados nos últimos 7 dias <TrendingUp className="h-4 w-4" />
        </div>
      </CardFooter>
    </Card>
  );
}
