"use client";

import { useState } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { 
  LayoutDashboard, 
  BarChart2, 
  Settings, 
  Bell, 
  Users, 
  HelpCircle, 
  LogOut,
  Menu,
  X,
  Gauge,
  Thermometer,
  Droplets,
  SunMedium
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export default function Sidebar({ className }: SidebarProps) {
  const { logout } = useAuth();
  const [expanded, setExpanded] = useState(true);
  const [activeSensor, setActiveSensor] = useState<string | null>(null);
  
  const toggleSidebar = () => {
    setExpanded(!expanded);
  };
  
  const sidebarWidth = expanded ? "w-64" : "w-16";
  
  const navItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/" },
    { icon: BarChart2, label: "Analytics", href: "/analytics" },
    { icon: Bell, label: "Alerts", href: "/alerts" },
    { icon: Settings, label: "Settings", href: "/settings" },
    { icon: Users, label: "User Management", href: "/users" },
    { icon: HelpCircle, label: "Help & Support", href: "/help" },
  ];
  
  const sensorItems = [
    { icon: Thermometer, label: "Temperature", id: "temperature" },
    { icon: Droplets, label: "Humidity", id: "humidity" },
    { icon: SunMedium, label: "Light", id: "light" },
    { icon: Gauge, label: "Pressure", id: "pressure" },
  ];
  
  return (
    <div className={cn("flex flex-col h-screen bg-card border-r transition-all duration-300", sidebarWidth, className)}>
      <div className="flex items-center justify-between p-4 h-16">
        {expanded ? (
          <h2 className="text-lg font-semibold">IoT Dashboard</h2>
        ) : (
          <span className="text-lg font-semibold">IoT</span>
        )}
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          {expanded ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>
      
      <ScrollArea className="flex-1">
        <div className="px-3 py-2">
          <div className="space-y-1">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={item.href === "/" ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    !expanded && "justify-center px-2"
                  )}
                >
                  <item.icon className={cn("h-4 w-4", expanded && "mr-2")} />
                  {expanded && <span>{item.label}</span>}
                </Button>
              </Link>
            ))}
          </div>
          
          {expanded && (
            <div className="mt-6">
              <h3 className="text-sm font-medium px-4 py-2">Sensors</h3>
              <Separator className="mb-2" />
              <div className="space-y-1">
                {sensorItems.map((sensor) => (
                  <Button
                    key={sensor.id}
                    variant={activeSensor === sensor.id ? "secondary" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveSensor(sensor.id)}
                  >
                    <sensor.icon className="h-4 w-4 mr-2" />
                    <span>{sensor.label}</span>
                  </Button>
                ))}
              </div>
            </div>
          )}
          
          {!expanded && (
            <div className="mt-6">
              <Separator className="mb-2" />
              <div className="space-y-1">
                {sensorItems.map((sensor) => (
                  <Button
                    key={sensor.id}
                    variant={activeSensor === sensor.id ? "secondary" : "ghost"}
                    className="w-full justify-center px-2"
                    onClick={() => setActiveSensor(sensor.id)}
                  >
                    <sensor.icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      
      <div className="p-3 mt-auto">
        <Button 
          variant="ghost" 
          className={cn(
            "w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-100",
            !expanded && "justify-center px-2"
          )}
          onClick={logout}
        >
          <LogOut className={cn("h-4 w-4", expanded && "mr-2")} />
          {expanded && <span>Logout</span>}
        </Button>
      </div>
    </div>
  );
}