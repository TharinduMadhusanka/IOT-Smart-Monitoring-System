import { AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface Alert {
    id: string;
    type: "warning" | "critical" | "info" | "resolved";
    message: string;
    timestamp: string;
    sensor: string;
    value: number;
    unit: string;
    acknowledged: boolean;
}

interface AlertCardProps {
    alert: Alert;
}

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

export default function AlertCard({ alert }: AlertCardProps) {
    return (
        <div className="flex items-start space-x-3 p-4 rounded-md bg-muted/50 border border-border">
            <div className="mt-0.5">{getAlertIcon(alert.type)}</div>
            <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <div className="flex items-center space-x-2">
                        {!alert.acknowledged && (
                            <Button variant="outline" size="sm" className="h-7 text-xs">
                                Acknowledge
                            </Button>
                        )}
                        {getAlertBadge(alert.type)}
                    </div>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>
                        {alert.sensor}
                        {alert.value > 0 && alert.unit && (
                            <>: {alert.value} {alert.unit}</>
                        )}
                    </span>
                    <span className="flex items-center">
                        {alert.acknowledged && (
                            <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                        )}
                        {alert.timestamp}
                    </span>
                </div>
            </div>
        </div>
    );
}
