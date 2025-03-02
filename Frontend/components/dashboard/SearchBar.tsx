"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  Search, 
  Bell, 
  User, 
  Filter, 
  Download, 
  RefreshCw 
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

export default function SearchBar() {
  const [searchQuery, setSearchQuery] = useState("");
  
  return (
    <div className="flex items-center justify-between w-full mb-6">
      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search sensors, devices, or alerts..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 pr-4"
        />
      </div>
      
      <div className="flex items-center space-x-2 ml-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Filter Options</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <span>Temperature Sensors</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Humidity Sensors</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Light Sensors</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <span>Active Alerts</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <Button variant="outline" size="icon">
          <Download className="h-4 w-4" />
        </Button>
        
        <Button variant="outline" size="icon">
          <RefreshCw className="h-4 w-4" />
        </Button>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="relative">
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 flex items-center justify-center bg-red-500">
                <span className="text-[10px]">3</span>
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-80 overflow-auto">
              {[1, 2, 3].map((i) => (
                <DropdownMenuItem key={i} className="flex flex-col items-start py-2">
                  <div className="flex items-center w-full">
                    <Badge className="bg-red-500 mr-2">Critical</Badge>
                    <span className="font-medium">Temperature Alert</span>
                    <span className="ml-auto text-xs text-muted-foreground">10m ago</span>
                  </div>
                  <span className="text-sm text-muted-foreground mt-1">
                    Temperature exceeded critical threshold (32.5°C)
                  </span>
                </DropdownMenuItem>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon">
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-500">Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}