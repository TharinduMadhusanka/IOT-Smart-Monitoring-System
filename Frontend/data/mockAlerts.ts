export interface Alert {
  id: string;
  type: "warning" | "critical" | "info" | "resolved";
  message: string;
  timestamp: string;
  sensor: string;
  value: number;
  unit: string;
  acknowledged: boolean;
}

export const mockAlerts: Alert[] = [
  {
    id: "alert-1",
    type: "critical",
    message: "Temperature exceeds critical threshold",
    timestamp: "10:45 AM",
    sensor: "Temperature",
    value: 32.5,
    unit: "°C",
    acknowledged: false
  },
  {
    id: "alert-2",
    type: "warning",
    message: "Humidity approaching warning level",
    timestamp: "09:30 AM",
    sensor: "Humidity",
    value: 75.2,
    unit: "%",
    acknowledged: false
  },
  {
    id: "alert-3",
    type: "info",
    message: "Light levels changing rapidly",
    timestamp: "08:15 AM",
    sensor: "Light",
    value: 850,
    unit: "lux",
    acknowledged: true
  },
  {
    id: "alert-4",
    type: "resolved",
    message: "Temperature returned to normal range",
    timestamp: "07:50 AM",
    sensor: "Temperature",
    value: 24.3,
    unit: "°C",
    acknowledged: true
  },
  {
    id: "alert-5",
    type: "warning",
    message: "Battery level low",
    timestamp: "Yesterday",
    sensor: "Battery",
    value: 15,
    unit: "%",
    acknowledged: false
  },
  {
    id: "alert-6",
    type: "critical",
    message: "Connection lost to humidity sensor",
    timestamp: "Yesterday",
    sensor: "Humidity",
    value: 0,
    unit: "",
    acknowledged: true
  },
  {
    id: "alert-7",
    type: "info",
    message: "System update available",
    timestamp: "2 days ago",
    sensor: "System",
    value: 0,
    unit: "",
    acknowledged: false
  },
  {
    id: "alert-8",
    type: "warning",
    message: "Light sensor calibration needed",
    timestamp: "3 days ago",
    sensor: "Light",
    value: 0,
    unit: "",
    acknowledged: true
  },
];
