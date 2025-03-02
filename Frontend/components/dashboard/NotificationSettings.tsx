import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MailWarning, MessageSquare, Smartphone } from "lucide-react";

interface Contact {
    id: string;
    name: string;
    email: string;
    phone: string;
}

interface NotificationSettingsProps {
    emailNotifications: boolean;
    setEmailNotifications: (value: boolean) => void;
    smsNotifications: boolean;
    setSmsNotifications: (value: boolean) => void;
    pushNotifications: boolean;
    setPushNotifications: (value: boolean) => void;
    contacts: Contact[];
}

export default function NotificationSettings({
    emailNotifications,
    setEmailNotifications,
    smsNotifications,
    setSmsNotifications,
    pushNotifications,
    setPushNotifications,
    contacts
}: NotificationSettingsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Notification Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <MailWarning className="h-4 w-4" />
                            <Label htmlFor="email-notifications">Email Notifications</Label>
                        </div>
                        <Switch
                            id="email-notifications"
                            checked={emailNotifications}
                            onCheckedChange={setEmailNotifications}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <MessageSquare className="h-4 w-4" />
                            <Label htmlFor="sms-notifications">SMS Notifications</Label>
                        </div>
                        <Switch
                            id="sms-notifications"
                            checked={smsNotifications}
                            onCheckedChange={setSmsNotifications}
                        />
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Smartphone className="h-4 w-4" />
                            <Label htmlFor="push-notifications">Push Notifications</Label>
                        </div>
                        <Switch
                            id="push-notifications"
                            checked={pushNotifications}
                            onCheckedChange={setPushNotifications}
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Alert Recipients</Label>
                    <Select defaultValue="1">
                        <SelectTrigger>
                            <SelectValue placeholder="Select recipient" />
                        </SelectTrigger>
                        <SelectContent>
                            {contacts.map(contact => (
                                <SelectItem key={contact.id} value={contact.id}>
                                    {contact.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Notification Schedule</Label>
                        <Button variant="outline" size="sm">
                            Configure
                        </Button>
                    </div>
                    <div className="text-sm text-muted-foreground">
                        Notifications active 24/7 for critical alerts
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
