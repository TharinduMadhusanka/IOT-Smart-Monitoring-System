"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Download, BarChart2, LineChart, PieChart, ArrowDownToLine } from "lucide-react";
import { Line, Bar, Pie } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    ArcElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

export default function Analytics() {
    const [dateRange, setDateRange] = useState<{
        from: Date | undefined;
        to: Date | undefined;
    }>({
        from: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        to: new Date(),
    });

    const [selectedSensor, setSelectedSensor] = useState("all");
    const [selectedTimeframe, setSelectedTimeframe] = useState("week");
    const [selectedChartType, setSelectedChartType] = useState("line");

    // Generate mock data for charts
    const generateMockData = (dataPoints: number, min: number, max: number) => {
        return Array.from({ length: dataPoints }, () =>
            min + Math.random() * (max - min)
        );
    };

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}:00`);

    // Get labels based on selected timeframe
    const getLabels = () => {
        switch (selectedTimeframe) {
            case "day":
                return hours;
            case "week":
                return days;
            case "month":
                return Array.from({ length: 30 }, (_, i) => `${i + 1}`);
            case "year":
                return months;
            default:
                return days;
        }
    };

    // Get data points based on selected timeframe
    const getDataPoints = () => {
        switch (selectedTimeframe) {
            case "day":
                return 24;
            case "week":
                return 7;
            case "month":
                return 30;
            case "year":
                return 12;
            default:
                return 7;
        }
    };

    // Line chart data
    const lineChartData = {
        labels: getLabels(),
        datasets: [
            {
                label: "Temperature (°C)",
                data: generateMockData(getDataPoints(), 18, 32),
                borderColor: "rgb(239, 68, 68)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                fill: true,
                tension: 0.3,
            },
            {
                label: "Humidity (%)",
                data: generateMockData(getDataPoints(), 40, 80),
                borderColor: "rgb(59, 130, 246)",
                backgroundColor: "rgba(59, 130, 246, 0.1)",
                fill: true,
                tension: 0.3,
            },
            {
                label: "Light (lux)",
                data: generateMockData(getDataPoints(), 200, 1000),
                borderColor: "rgb(234, 179, 8)",
                backgroundColor: "rgba(234, 179, 8, 0.1)",
                fill: true,
                tension: 0.3,
            },
        ],
    };

    // Bar chart data
    const barChartData = {
        labels: getLabels(),
        datasets: [
            {
                label: "Temperature (°C)",
                data: generateMockData(getDataPoints(), 18, 32),
                backgroundColor: "rgba(239, 68, 68, 0.7)",
            },
            {
                label: "Humidity (%)",
                data: generateMockData(getDataPoints(), 40, 80),
                backgroundColor: "rgba(59, 130, 246, 0.7)",
            },
            {
                label: "Light (lux)",
                data: generateMockData(getDataPoints(), 200, 1000).map(val => val / 10), // Scale down for better visualization
                backgroundColor: "rgba(234, 179, 8, 0.7)",
            },
        ],
    };

    // Pie chart data
    const pieChartData = {
        labels: ["Temperature Alerts", "Humidity Alerts", "Light Alerts", "Normal Readings"],
        datasets: [
            {
                data: [12, 8, 5, 75],
                backgroundColor: [
                    "rgba(239, 68, 68, 0.7)",
                    "rgba(59, 130, 246, 0.7)",
                    "rgba(234, 179, 8, 0.7)",
                    "rgba(75, 85, 99, 0.7)",
                ],
                borderColor: [
                    "rgb(239, 68, 68)",
                    "rgb(59, 130, 246)",
                    "rgb(234, 179, 8)",
                    "rgb(75, 85, 99)",
                ],
                borderWidth: 1,
            },
        ],
    };

    // Chart options
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
            },
        },
    };

    // Render the appropriate chart based on selection
    const renderChart = () => {
        switch (selectedChartType) {
            case "line":
                return <Line data={lineChartData} options={chartOptions} />;
            case "bar":
                return <Bar data={barChartData} options={chartOptions} />;
            case "pie":
                return <Pie data={pieChartData} />;
            default:
                return <Line data={lineChartData} options={chartOptions} />;
        }
    };

    // Statistics cards data
    const statsCards = [
        {
            title: "Average Temperature",
            value: "24.8°C",
            change: "+2.1%",
            increasing: true,
        },
        {
            title: "Average Humidity",
            value: "62.3%",
            change: "-3.5%",
            increasing: false,
        },
        {
            title: "Average Light",
            value: "645 lux",
            change: "+12.7%",
            increasing: true,
        },
        {
            title: "Alert Frequency",
            value: "8/week",
            change: "-2.3%",
            increasing: false,
        },
    ];

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
                            <p className="text-muted-foreground">Analyze sensor data and identify trends</p>
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4 md:mt-0">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline" className="justify-start">
                                        <CalendarIcon className="mr-2 h-4 w-4" />
                                        {dateRange.from ? (
                                            dateRange.to ? (
                                                <>
                                                    {format(dateRange.from, "LLL dd, y")} - {format(dateRange.to, "LLL dd, y")}
                                                </>
                                            ) : (
                                                format(dateRange.from, "LLL dd, y")
                                            )
                                        ) : (
                                            <span>Pick a date range</span>
                                        )}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="end">
                                    <Calendar
                                        initialFocus
                                        mode="range"
                                        defaultMonth={dateRange.from}
                                        selected={dateRange}
                                        onSelect={setDateRange as any}
                                        numberOfMonths={2}
                                    />
                                </PopoverContent>
                            </Popover>

                            <Select value={selectedSensor} onValueChange={setSelectedSensor}>
                                <SelectTrigger className="w-[180px]">
                                    <SelectValue placeholder="Select sensor" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sensors</SelectItem>
                                    <SelectItem value="temperature">Temperature</SelectItem>
                                    <SelectItem value="humidity">Humidity</SelectItem>
                                    <SelectItem value="light">Light</SelectItem>
                                </SelectContent>
                            </Select>

                            <Button variant="outline">
                                <Download className="mr-2 h-4 w-4" />
                                Export Data
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                        {statsCards.map((card, index) => (
                            <Card key={index}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col space-y-1.5">
                                        <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-2xl font-bold">{card.value}</p>
                                            <span className={`text-xs font-medium flex items-center ${card.increasing ? "text-green-500" : "text-red-500"
                                                }`}>
                                                {card.increasing ? "↑" : "↓"} {card.change}
                                            </span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>

                    <Card className="mb-6">
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg font-medium">Sensor Data Analysis</CardTitle>
                            <div className="flex items-center space-x-2">
                                <div className="flex border rounded-md overflow-hidden">
                                    <Button
                                        variant={selectedChartType === "line" ? "default" : "ghost"}
                                        size="sm"
                                        className="rounded-none"
                                        onClick={() => setSelectedChartType("line")}
                                    >
                                        <LineChart className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={selectedChartType === "bar" ? "default" : "ghost"}
                                        size="sm"
                                        className="rounded-none"
                                        onClick={() => setSelectedChartType("bar")}
                                    >
                                        <BarChart2 className="h-4 w-4" />
                                    </Button>
                                    <Button
                                        variant={selectedChartType === "pie" ? "default" : "ghost"}
                                        size="sm"
                                        className="rounded-none"
                                        onClick={() => setSelectedChartType("pie")}
                                    >
                                        <PieChart className="h-4 w-4" />
                                    </Button>
                                </div>

                                <Select value={selectedTimeframe} onValueChange={setSelectedTimeframe}>
                                    <SelectTrigger className="w-[120px]">
                                        <SelectValue placeholder="Timeframe" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="day">Day</SelectItem>
                                        <SelectItem value="week">Week</SelectItem>
                                        <SelectItem value="month">Month</SelectItem>
                                        <SelectItem value="year">Year</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="h-[400px]">
                                {renderChart()}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">Sensor Correlation Analysis</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Temperature vs. Humidity</span>
                                        <span className="text-sm font-medium">Correlation: -0.72</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "72%" }}></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Temperature vs. Light</span>
                                        <span className="text-sm font-medium">Correlation: 0.58</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "58%" }}></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Humidity vs. Light</span>
                                        <span className="text-sm font-medium">Correlation: -0.45</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-green-500 h-2.5 rounded-full" style={{ width: "45%" }}></div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg font-medium">Data Quality</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Temperature Sensor</span>
                                        <span className="text-sm font-medium">99.8% Uptime</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: "99.8%" }}></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Humidity Sensor</span>
                                        <span className="text-sm font-medium">98.5% Uptime</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-blue-500 h-2.5 rounded-full" style={{ width: "98.5%" }}></div>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">Light Sensor</span>
                                        <span className="text-sm font-medium">97.2% Uptime</span>
                                    </div>
                                    <div className="w-full bg-muted rounded-full h-2.5">
                                        <div className="bg-yellow-500 h-2.5 rounded-full" style={{ width: "97.2%" }}></div>
                                    </div>

                                    <div className="flex items-center justify-between mt-4">
                                        <span className="text-sm font-medium">Missing Data Points</span>
                                        <span className="text-sm font-medium text-red-500">42 gaps</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </main>
            </div>
        </div>
    );
}