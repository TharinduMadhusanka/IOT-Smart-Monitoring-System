"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { AlertTriangle, CheckCircle, Clock, Bell, BellOff } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { useEffect, useState } from "react";
import { database, ref, onValue, set } from "@/lib/firebase";

interface Alert {
  id: string;
  type: "warning" | "critical" | "info" | "resolved";
  message: string;
  timestamp: string;
  sensor: string;
  value: number;
  unit: string;
}

export default function AlertsPanel() {
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  useEffect(() => {
    const alertsRef = ref(database, "alerts/telegram");

    // Subscribe to changes in the Firebase Realtime Database
    const unsubscribe = onValue(alertsRef, (snapshot) => {
      const value = snapshot.val();
      setAlertsEnabled(value);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleToggleAlerts = (enabled: boolean) => {
    setAlertsEnabled(enabled);
    set(ref(database, "alerts/enable"), enabled);
  };

  // Mock alerts data
  const alerts: Alert[] = [
    {
      id: "alert-1",
      type: "critical",
      message: "Temperature exceeds critical threshold",
      timestamp: "10:45 AM",
      sensor: "Temperature",
      value: 32.5,
      unit: "°C"
    },
    {
      id: "alert-2",
      type: "warning",
      message: "Humidity approaching warning level",
      timestamp: "09:30 AM",
      sensor: "Humidity",
      value: 75.2,
      unit: "%"
    },
    {
      id: "alert-3",
      type: "info",
      message: "Light levels changing rapidly",
      timestamp: "08:15 AM",
      sensor: "Light",
      value: 850,
      unit: "lux"
    },
    {
      id: "alert-4",
      type: "resolved",
      message: "Temperature returned to normal range",
      timestamp: "07:50 AM",
      sensor: "Temperature",
      value: 24.3,
      unit: "°C"
    },
    {
      id: "alert-5",
      type: "warning",
      message: "Battery level low",
      timestamp: "Yesterday",
      sensor: "Battery",
      value: 15,
      unit: "%"
    }
  ];

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case "warning":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "info":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
    }
  };

  const getAlertBadge = (type: Alert["type"]) => {
    switch (type) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return <Badge className="bg-yellow-500">Warning</Badge>;
      case "info":
        return <Badge className="bg-blue-500">Info</Badge>;
      case "resolved":
        return <Badge className="bg-green-500">Resolved</Badge>;
    }
  };

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg font-medium">Alerts & Notifications</CardTitle>
        <div className="flex items-center space-x-2">
          {alertsEnabled ? (
            <Bell className="h-4 w-4 text-primary" />
          ) : (
            <BellOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Switch
            checked={alertsEnabled}
            onCheckedChange={handleToggleAlerts}
            aria-label="Toggle alerts"
          />
        </div>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-4">
            {alerts.map((alert) => (
              <div
                key={alert.id}
                className="flex items-start space-x-3 p-3 rounded-md bg-muted/50"
              >
                <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.message}</p>
                    {getAlertBadge(alert.type)}
                  </div>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{alert.sensor}: {alert.value} {alert.unit}</span>
                    <span>{alert.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}