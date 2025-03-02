"use client";

import { useState } from "react";
import Sidebar from "@/components/dashboard/Sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Filter, Plus, BellOff } from "lucide-react";
import AlertCard from "@/components/dashboard/AlertCard";
import AlertThresholds from "@/components/dashboard/AlertThresholds";
import NotificationSettings from "@/components/dashboard/NotificationSettings";
import { mockAlerts, Alert } from "@/data/mockAlerts";
import { database, ref, onValue, set } from "@/lib/firebase";

export default function Alerts() {
    const [activeTab, setActiveTab] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const [temperatureThreshold, setTemperatureThreshold] = useState([30]);
    const [humidityThreshold, setHumidityThreshold] = useState([75]);
    const [lightThreshold, setLightThreshold] = useState([900]);

    const [emailNotifications, setEmailNotifications] = useState(true);
    const [smsNotifications, setSmsNotifications] = useState(false);
    const [pushNotifications, setPushNotifications] = useState(true);

    const handleTempThresholdChange = (value: number[]) => {
        setTemperatureThreshold(value);
        set(ref(database, "/alerts/thresholds/temp"), value[0]);
    };

    const handleHumidityThresholdChange = (value: number[]) => {
        setHumidityThreshold(value);
        set(ref(database, "/alerts/thresholds/humi"), value[0]);
    }

    const handleLightThresholdChange = (value: number[]) => {
        setLightThreshold(value);
        set(ref(database, "/alerts/thresholds/ldr"), value[0]);
    }

    // Filter alerts based on active tab and search query
    const filteredAlerts = mockAlerts.filter(alert => {
        const matchesTab =
            activeTab === "all" ||
            (activeTab === "critical" && alert.type === "critical") ||
            (activeTab === "warning" && alert.type === "warning") ||
            (activeTab === "info" && alert.type === "info") ||
            (activeTab === "resolved" && alert.type === "resolved") ||
            (activeTab === "unacknowledged" && !alert.acknowledged);

        const matchesSearch =
            alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
            alert.sensor.toLowerCase().includes(searchQuery.toLowerCase());

        return matchesTab && matchesSearch;
    });

    // Mock contacts for notifications
    const contacts = [
        { id: "1", name: "John Doe", email: "john.doe@example.com", phone: "+1 (555) 123-4567" },
        { id: "2", name: "Jane Smith", email: "jane.smith@example.com", phone: "+1 (555) 987-6543" },
        { id: "3", name: "Operations Team", email: "ops@example.com", phone: "+1 (555) 555-5555" },
    ];

    return (
        <div className="flex h-screen bg-background">
            <Sidebar />

            <div className="flex-1 flex flex-col overflow-hidden">
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold">Alerts & Notifications</h1>
                            <p className="text-muted-foreground">Manage system alerts and notification preferences</p>
                        </div>

                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search alerts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10 w-[200px]"
                                />
                            </div>
                            <Button variant="outline" size="icon">
                                <Filter className="h-4 w-4" />
                            </Button>
                            <Button>
                                <Plus className="h-4 w-4 mr-2" />
                                New Rule
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card>
                                <CardHeader className="pb-2">
                                    <CardTitle className="text-lg font-medium">Alert History</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="w-full">
                                        <TabsList className="grid grid-cols-3 md:grid-cols-6 mb-4">
                                            <TabsTrigger value="all">All</TabsTrigger>
                                            <TabsTrigger value="critical">Critical</TabsTrigger>
                                            <TabsTrigger value="warning">Warning</TabsTrigger>
                                            <TabsTrigger value="info">Info</TabsTrigger>
                                            <TabsTrigger value="resolved">Resolved</TabsTrigger>
                                            <TabsTrigger value="unacknowledged">Unacknowledged</TabsTrigger>
                                        </TabsList>

                                        <TabsContent value={activeTab} className="mt-0">
                                            <ScrollArea className="h-[500px] pr-4">
                                                <div className="space-y-4">
                                                    {filteredAlerts.length > 0 ? (
                                                        filteredAlerts.map((alert) => (
                                                            <AlertCard key={alert.id} alert={alert} />
                                                        ))
                                                    ) : (
                                                        <div className="flex flex-col items-center justify-center py-8 text-center">
                                                            <BellOff className="h-12 w-12 text-muted-foreground mb-4" />
                                                            <h3 className="text-lg font-medium">No alerts found</h3>
                                                            <p className="text-sm text-muted-foreground mt-1">
                                                                {searchQuery
                                                                    ? "Try adjusting your search query"
                                                                    : "There are no alerts in this category"}
                                                            </p>
                                                        </div>
                                                    )}
                                                </div>
                                            </ScrollArea>
                                        </TabsContent>
                                    </Tabs>
                                </CardContent>
                            </Card>
                        </div>

                        <div className="space-y-6">
                            <AlertThresholds
                                temperatureThreshold={temperatureThreshold}
                                setTemperatureThreshold={handleTempThresholdChange}
                                humidityThreshold={humidityThreshold}
                                setHumidityThreshold={handleHumidityThresholdChange}
                                lightThreshold={lightThreshold}
                                setLightThreshold={handleLightThresholdChange}
                            />

                            <NotificationSettings
                                emailNotifications={emailNotifications}
                                setEmailNotifications={setEmailNotifications}
                                smsNotifications={smsNotifications}
                                setSmsNotifications={setSmsNotifications}
                                pushNotifications={pushNotifications}
                                setPushNotifications={setPushNotifications}
                                contacts={contacts}
                            />
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}