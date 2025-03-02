"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Download, Maximize2, AlertTriangle } from "lucide-react";

// Register Chart.js components
ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export interface SensorData {
  timestamp: string;
  value: number;
}

interface Props {
  title: string;
  data: SensorData[];
  unit: string;
  color: string;
  thresholds?: {
    warning: number;
    critical: number;
  };
  onExport?: () => void;
  onExpand?: () => void;
}

export default function SensorCard({
  title,
  data,
  unit,
  color,
  thresholds,
  onExport,
  onExpand
}: Props) {
  const [timeRange, setTimeRange] = useState<"1h" | "6h" | "24h">("1h");

  // Get the latest value
  const latestValue = data.length > 0 ? data[data.length - 1].value : 0;

  // Determine status based on thresholds
  let status = "normal";
  let statusColor = "bg-green-500";

  if (thresholds) {
    if (latestValue >= thresholds.critical) {
      status = "critical";
      statusColor = "bg-red-500";
    } else if (latestValue >= thresholds.warning) {
      status = "warning";
      statusColor = "bg-yellow-500";
    }
  }

  // Filter data based on selected time range
  const filteredData = data.slice(-getDataPointsForRange(timeRange));

  // Chart.js data
  const chartData = {
    labels: filteredData.map(item => item.timestamp),
    datasets: [
      {
        label: title,
        data: filteredData.map(item => item.value),
        borderColor: color,
        backgroundColor: `${color}33`, // Add transparency
        fill: false,
        tension: 0.3,
        pointRadius: 2,
        pointHoverRadius: 5,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          maxTicksLimit: 5,
          maxRotation: 0,
        },
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function (value: any) {
            return `${value} ${unit}`;
          },
        },
      },
    },
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">{title}</CardTitle>
        <div className="flex items-center gap-2">
          {status !== "normal" && (
            <div className="flex items-center">
              <AlertTriangle className={`h-4 w-4 ${status === "critical" ? "text-red-500" : "text-yellow-500"} mr-1`} />
              <span className={`text-xs ${status === "critical" ? "text-red-500" : "text-yellow-500"}`}>
                {status === "critical" ? "Critical" : "Warning"}
              </span>
            </div>
          )}
          <Badge className={statusColor}>
            {Number(latestValue).toFixed(1)} {unit}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <div className="text-xs text-muted-foreground mb-1">
            Last updated: {data.length > 0 ? data[data.length - 1].timestamp : "N/A"}
          </div>
          <div className="h-[180px]">
            {data.length > 0 ? (
              <Line data={chartData} options={chartOptions} />
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                No data available
              </div>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between">
          <div className="flex space-x-1">
            <Button
              variant={timeRange === "1h" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("1h")}
              className="text-xs h-7"
            >
              1h
            </Button>
            <Button
              variant={timeRange === "6h" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("6h")}
              className="text-xs h-7"
            >
              6h
            </Button>
            <Button
              variant={timeRange === "24h" ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange("24h")}
              className="text-xs h-7"
            >
              24h
            </Button>
          </div>
          <div className="flex space-x-1">
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={onExport}
            >
              <Download className="h-3.5 w-3.5" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-7 w-7"
              onClick={onExpand}
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Helper function to determine how many data points to show based on time range
function getDataPointsForRange(range: "1h" | "6h" | "24h"): number {
  switch (range) {
    case "1h": return 12; // 5-minute intervals
    case "6h": return 36; // 10-minute intervals
    case "24h": return 30; // 48-minute intervals (for demo)
    default: return 12;
  }
}