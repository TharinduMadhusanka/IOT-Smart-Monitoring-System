"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
// import { set, ref } from "@/lib/firebase";
import { Power, RefreshCw, Settings } from "lucide-react";
import { database, ref, onValue, set } from "@/lib/firebase";

interface ControlPanelProps {
  ledState: boolean;
  onToggleLed: () => void;
}

export default function ControlPanel({ ledState, onToggleLed }: ControlPanelProps) {
  const [fanSpeed, setFanSpeed] = useState(50);
  const [autoMode, setAutoMode] = useState(true);
  
  const handleFanSpeedChange = (value: number[]) => {
    setFanSpeed(value[0]);
    // In a real app, you would update this in your database
    set(ref(database, "fan/speed"), value[0]);
    
  };
  
  const handleAutoModeChange = (checked: boolean) => {
    setAutoMode(checked);
    // In a real app, you would update this in your database
    set(ref(null, "settings/autoMode"), checked);
  };
  
  const handleRefresh = () => {
    // Simulate refreshing device status
    console.log("Refreshing device status...");
  };
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-lg font-medium">Device Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Power className="h-4 w-4" />
            <Label htmlFor="led-switch" className="font-medium">LED Light</Label>
          </div>
          <Switch
            id="led-switch"
            checked={ledState}
            onCheckedChange={onToggleLed}
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fan-speed" className="font-medium">Fan Speed</Label>
            <span className="text-sm font-medium">{fanSpeed}%</span>
          </div>
          <Slider
            id="fan-speed"
            min={0}
            max={100}
            step={1}
            value={[fanSpeed]}
            onValueChange={handleFanSpeedChange}
            disabled={autoMode}
          />
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <Label htmlFor="auto-mode" className="font-medium">Auto Mode</Label>
          </div>
          <Switch
            id="auto-mode"
            checked={autoMode}
            onCheckedChange={handleAutoModeChange}
          />
        </div>
        
        <Button 
          variant="outline" 
          size="sm" 
          className="w-full" 
          onClick={handleRefresh}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh Status
        </Button>
      </CardContent>
    </Card>
  );
}