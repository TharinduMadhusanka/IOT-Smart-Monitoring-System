import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

interface AlertThresholdsProps {
    temperatureThreshold: number[];
    setTemperatureThreshold: (value: number[]) => void;
    humidityThreshold: number[];
    setHumidityThreshold: (value: number[]) => void;
    lightThreshold: number[];
    setLightThreshold: (value: number[]) => void;
}

export default function AlertThresholds({
    temperatureThreshold,
    setTemperatureThreshold,
    humidityThreshold,
    setHumidityThreshold,
    lightThreshold,
    setLightThreshold
}: AlertThresholdsProps) {
    return (
        <Card>
            <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Alert Thresholds</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="temperature-threshold">Temperature Threshold</Label>
                        <span className="text-sm font-medium">{temperatureThreshold[0]}°C</span>
                    </div>
                    <Slider
                        id="temperature-threshold"
                        min={0}
                        max={50}
                        step={1}
                        value={temperatureThreshold}
                        onValueChange={setTemperatureThreshold}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="humidity-threshold">Humidity Threshold</Label>
                        <span className="text-sm font-medium">{humidityThreshold[0]}%</span>
                    </div>
                    <Slider
                        id="humidity-threshold"
                        min={0}
                        max={100}
                        step={1}
                        value={humidityThreshold}
                        onValueChange={setHumidityThreshold}
                    />
                </div>

                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label htmlFor="light-threshold">Light Threshold</Label>
                        <span className="text-sm font-medium">{lightThreshold[0]} lux</span>
                    </div>
                    <Slider
                        id="light-threshold"
                        min={0}
                        max={2000}
                        step={10}
                        value={lightThreshold}
                        onValueChange={setLightThreshold}
                    />
                </div>

                <div className="pt-2">
                    <Button className="w-full">Save Thresholds</Button>
                </div>
            </CardContent>
        </Card>
    );
}
