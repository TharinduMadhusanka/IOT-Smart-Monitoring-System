"use client";

import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { database, ref, onValue, set } from "@/lib/firebase";
import Sidebar from "@/components/dashboard/Sidebar";
import SearchBar from "@/components/dashboard/SearchBar";
import SensorCard, { SensorData } from "@/components/dashboard/SensorCard";
import ControlPanel from "@/components/dashboard/ControlPanel";
import AlertsPanel from "@/components/dashboard/AlertsPanel";
import DraggableGrid from "@/components/dashboard/DraggableGrid";
import ExpandedSensorView from "@/components/dashboard/ExpandedSensorView";
import { useToast } from "@/hooks/use-toast";


export default function Home() {
  const [ldrData, setLdrData] = useState<SensorData[]>([]);
  const [temperatureData, setTemperatureData] = useState<SensorData[]>([]);
  const [humidityData, setHumidityData] = useState<SensorData[]>([]);
  const [ledState, setLedState] = useState(false);
  const [expandedSensor, setExpandedSensor] = useState<{
    open: boolean;
    type: string;
    title: string;
    data: SensorData[];
    unit: string;
    color: string;
  }>({
    open: false,
    type: "",
    title: "",
    data: [],
    unit: "",
    color: "",
  });


  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!user) return;

    const ldrRef = ref(database, "/sensor/ldr");
    const temperatureRef = ref(database, "sensor/temp");
    const humidityRef = ref(database, "sensor/humi");
    const ledRef = ref(database, "led/value");

    // Listen for LDR value changes
    const ldrUnsubscribe = onValue(ldrRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chartData = Object.keys(data).map((key) => {
          // Convert "YYYY-MM-DD_HH-MM-SS" to "YYYY-MM-DDTHH:MM:SS" for Date constructor
          const formattedTimestamp = key.replace("_", "T");
          // const formattedTimestamp = key.replace("_", " ").replace(/-/g, ":");

          const dateObj = new Date(formattedTimestamp);

          return {
            timestamp: isNaN(dateObj.getTime()) ? key : dateObj.toLocaleTimeString(),
            value: data[key].value,
          };
        });

        setLdrData(chartData);
      }
    });

    // Listen for Temperature value changes
    const tempUnsubscribe = onValue(temperatureRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chartData = Object.keys(data).map((key) => {
          // Convert "YYYY-MM-DD_HH-MM-SS" to "YYYY-MM-DDTHH:MM:SS" for Date constructor
          const formattedTimestamp = key.replace("_", "T");
          const dateObj = new Date(formattedTimestamp);

          return {
            timestamp: isNaN(dateObj.getTime()) ? key : dateObj.toLocaleTimeString(),
            value: data[key].value,
          };
        });
        setTemperatureData(chartData);

        // Check for temperature alerts
        const latestValue = chartData[chartData.length - 1]?.value;
        if (latestValue && latestValue > 30) {
          toast({
            title: "Temperature Alert",
            description: `Temperature has reached ${latestValue.toFixed(1)}°C`,
            variant: "destructive",
          });
        }
      }
    });

    // Listen for Humidity value changes
    const humidityUnsubscribe = onValue(humidityRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const chartData = Object.keys(data).map((key) => {
          // Convert "YYYY-MM-DD_HH-MM-SS" to "YYYY-MM-DDTHH:MM:SS" for Date constructor
          const formattedTimestamp = key.replace("_", "T");
          const dateObj = new Date(formattedTimestamp);

          return {
            timestamp: isNaN(dateObj.getTime()) ? key : dateObj.toLocaleTimeString(),
            value: data[key].value,
          };
        });
        setHumidityData(chartData);
      }
    });

    // Listen for LED state changes
    const ledUnsubscribe = onValue(ledRef, (snapshot) => {
      const value = snapshot.val();
      setLedState(value);
    });


    // Cleanup function
    return () => {
      // clearInterval(mockTemperatureInterval);
      ldrUnsubscribe();
      tempUnsubscribe();
      humidityUnsubscribe();
      ledUnsubscribe();
      // fanSpeedUnsubscribe();
    };
  }, [user, toast]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-lg">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Toggle LED state
  const toggleLed = () => {
    set(ref(database, "led/value"), !ledState);
  };

  // Handle sensor expansion
  const handleExpandSensor = (type: string) => {
    let data: SensorData[] = [];
    let title = "";
    let unit = "";
    let color = "";

    switch (type) {
      case "light":
        data = ldrData;
        title = "Light Intensity";
        unit = "lux";
        color = "rgb(234, 179, 8)";
        break;
      case "temperature":
        data = temperatureData;
        title = "Temperature";
        unit = "°C";
        color = "rgb(239, 68, 68)";
        break;
      case "humidity":
        data = humidityData;
        title = "Humidity";
        unit = "%";
        color = "rgb(59, 130, 246)";
        break;
    }

    setExpandedSensor({
      open: true,
      type,
      title,
      data,
      unit,
      color,
    });
  };

  // Handle data export
  const handleExportData = (type: string) => {
    toast({
      title: "Export Started",
      description: `Exporting ${type} data as CSV...`,
    });

    // In a real app, you would implement the actual export functionality
  };

  return (
    <div className="flex h-screen bg-background">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-y-auto p-6">
          <SearchBar />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <SensorCard
              title="Temperature"
              data={temperatureData}
              unit="°C"
              color="rgb(239, 68, 68)"
              thresholds={{ warning: 25, critical: 30 }}
              onExport={() => handleExportData("temperature")}
              onExpand={() => handleExpandSensor("temperature")}
            />
            <SensorCard
              title="Humidity"
              data={humidityData}
              unit="%"
              color="rgb(59, 130, 246)"
              thresholds={{ warning: 70, critical: 85 }}
              onExport={() => handleExportData("humidity")}
              onExpand={() => handleExpandSensor("humidity")}
            />
            <SensorCard
              title="Light Intensity"
              data={ldrData}
              unit="lux"
              color="rgb(234, 179, 8)"
              thresholds={{ warning: 3000, critical: 4000 }}
              onExport={() => handleExportData("light")}
              onExpand={() => handleExpandSensor("light")}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <AlertsPanel />
            </div>
            <div>
              <ControlPanel
                ledState={ledState}
                onToggleLed={toggleLed}
              />
            </div>
          </div>
        </main>
      </div>

      <ExpandedSensorView
        open={expandedSensor.open}
        onClose={() => setExpandedSensor({ ...expandedSensor, open: false })}
        title={expandedSensor.title}
        data={expandedSensor.data}
        unit={expandedSensor.unit}
        color={expandedSensor.color}
      />
    </div>
  );
}
