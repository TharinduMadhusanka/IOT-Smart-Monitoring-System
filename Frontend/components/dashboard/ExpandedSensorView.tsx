"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Line } from "react-chartjs-2";
import { SensorData } from "./SensorCard";
import { Download, X } from "lucide-react";

interface ExpandedSensorViewProps {
  open: boolean;
  onClose: () => void;
  title: string;
  data: SensorData[];
  unit: string;
  color: string;
}

export default function ExpandedSensorView({
  open,
  onClose,
  title,
  data,
  unit,
  color,
}: ExpandedSensorViewProps) {
  // Chart.js data for different time periods
  const createChartData = (period: "day" | "week" | "month") => {
    // In a real app, you would filter data based on the period
    // For demo, we'll just use different subsets of the data
    let filteredData;
    switch (period) {
      case "day":
        filteredData = data.slice(-24);
        break;
      case "week":
        filteredData = data;
        break;
      case "month":
        filteredData = data;
        break;
      default:
        filteredData = data;
    }
    
    return {
      labels: filteredData.map(item => item.timestamp),
      datasets: [
        {
          label: title,
          data: filteredData.map(item => item.value),
          borderColor: color,
          backgroundColor: `${color}33`,
          fill: true,
          tension: 0.3,
        },
      ],
    };
  };
  
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
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
      },
      y: {
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
        ticks: {
          callback: function(value: any) {
            return `${value} ${unit}`;
          },
        },
      },
    },
  };
  
  const handleExport = () => {
    // In a real app, you would implement CSV export functionality
    console.log("Exporting data...");
    
    // Example of how you might format the data for export
    const csvContent = [
      ["Timestamp", `${title} (${unit})`],
      ...data.map(item => [item.timestamp, item.value.toString()])
    ].map(row => row.join(",")).join("\n");
    
    console.log(csvContent);
    
    // Create and download a CSV file
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${title.toLowerCase()}_data.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  
  return (
    <Dialog open={open} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl">
        <DialogHeader className="flex flex-row items-center justify-between">
          <DialogTitle>{title} Sensor Data</DialogTitle>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        <Tabs defaultValue="day" className="w-full">
          <div className="flex items-center justify-between mb-4">
            <TabsList>
              <TabsTrigger value="day">24 Hours</TabsTrigger>
              <TabsTrigger value="week">Week</TabsTrigger>
              <TabsTrigger value="month">Month</TabsTrigger>
            </TabsList>
            
            <Button variant="outline" size="sm" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export Data
            </Button>
          </div>
          
          <TabsContent value="day" className="mt-0">
            <div className="h-[400px]">
              <Line data={createChartData("day")} options={chartOptions} />
            </div>
          </TabsContent>
          
          <TabsContent value="week" className="mt-0">
            <div className="h-[400px]">
              <Line data={createChartData("week")} options={chartOptions} />
            </div>
          </TabsContent>
          
          <TabsContent value="month" className="mt-0">
            <div className="h-[400px]">
              <Line data={createChartData("month")} options={chartOptions} />
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-4">
          <h3 className="text-lg font-medium mb-2">Statistics</h3>
          <div className="grid grid-cols-4 gap-4">
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Average</div>
              <div className="text-lg font-medium">
                {data.length > 0 
                  ? (data.reduce((sum, item) => sum + item.value, 0) / data.length).toFixed(1)
                  : "N/A"} {unit}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Minimum</div>
              <div className="text-lg font-medium">
                {data.length > 0 
                  ? Math.min(...data.map(item => item.value)).toFixed(1)
                  : "N/A"} {unit}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Maximum</div>
              <div className="text-lg font-medium">
                {data.length > 0 
                  ? Math.max(...data.map(item => item.value)).toFixed(1)
                  : "N/A"} {unit}
              </div>
            </div>
            <div className="bg-muted p-3 rounded-md">
              <div className="text-sm text-muted-foreground">Current</div>
              <div className="text-lg font-medium">
                {data.length > 0 
                  ? data[data.length - 1].value.toFixed(1)
                  : "N/A"} {unit}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}