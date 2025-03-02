#include <Arduino.h>
#include <WiFi.h>
#include <Firebase_ESP_Client.h>
#include <HTTPClient.h>
#include <time.h>
#include "secrets.h"
#include <DHT.h>

#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;

unsigned long sendDataPrevMillis = 0;
bool signupOK = false;
const int ldrPin = 34;
const int ledpin = 2;
const int dhtpin = 21;

const char *ntpServer = "pool.ntp.org";
const long gmtOffset_sec = 19800; //  (5 hours 30 minutes)
const int daylightOffset_sec = 0;

void connectToWiFi();
void connectToFirebase();
// void sendLDRAlert(int value);
void setupTime();

DHT dht11(dhtpin, DHT11);

float convertLDRToLux(int ldrValue)
{

    float voltage = ldrValue * (3.3 / 4095.0);
    // Avoid division by zero
    if (voltage < 0.01)
    {
        return 10000; // bright light
    }

    float knownResistor = 10000; // 10kΩ resistor
    float ldrResistance = (3.3 - voltage) * knownResistor / voltage;

    float lux = pow(ldrResistance / 1000, -1.4) * 500; // Adjust -1.4 and 500

    // Prevent negative lux values
    return (lux > 0) ? lux : 0;

    /*
    float voltage = ldrValue * (3.3 / 4095.0);
    
    // Prevent division by zero
    if (voltage < 0.01)
    return 0;
    
    // Known fixed resistor value (from LDR module)
    float knownResistor = 10000; // 10kΩ pull-down resistor
    
    // Calculate LDR resistance
    float ldrResistance = (3.3 - voltage) * knownResistor / voltage;
    
    // Convert resistance to lux using a proper model
    float lux = 5000 * pow(ldrResistance / 1000, -1.2);
    
    // Ensure non-negative lux
    return (lux > 0) ? lux : 0;
    */
}

void setup()
{
    Serial.begin(115200);
    pinMode(ldrPin, INPUT);
    pinMode(ledpin, OUTPUT);

    connectToWiFi();
    dht11.begin();

    setupTime();

    connectToFirebase();
}

void loop()
{
    if (Firebase.ready() && signupOK && (millis() - sendDataPrevMillis > 5000 || sendDataPrevMillis == 0))
    {
        sendDataPrevMillis = millis();

        // Read LDR value
        int ldrValue = analogRead(ldrPin);
        float luxValue = convertLDRToLux(ldrValue);
        Serial.println("LDR Value: " + String(ldrValue) + " (Lux: " + String(luxValue) + ")");

        // Read DHT11 sensor values
        float humi = dht11.readHumidity();
        float tempC = dht11.readTemperature();

        // Get current time
        time_t now;
        struct tm timeinfo;
        time(&now);
        localtime_r(&now, &timeinfo);
        char timestamp[20];
        strftime(timestamp, sizeof(timestamp), "%Y-%m-%d_%H-%M-%S", &timeinfo);

        // write ldr value to firebase ldr/data/timestamp
        String ldr_path = "sensor/ldr/" + String(timestamp);
        if (Firebase.RTDB.setFloat(&fbdo, ldr_path + "/value", luxValue))
        {
            Serial.println("LUX value written to Firebase: " + String(luxValue));
        }
        else
        {
            Serial.println("Failed to write LUX value: " + fbdo.errorReason());
            Serial.println("HTTP response code: " + String(fbdo.httpCode()));
            Serial.println("Error message: " + fbdo.errorReason());
        }

        // write the temperature value to firebase
        String temp_path = "sensor/temp/" + String(timestamp);
        if (Firebase.RTDB.setFloat(&fbdo, temp_path + "/value", tempC))
        {
            Serial.println("Temperature value written to Firebase: " + String(tempC));
        }
        else
        {
            Serial.println("Failed to write temperature value: " + fbdo.errorReason());
            Serial.println("HTTP response code: " + String(fbdo.httpCode()));
            Serial.println("Error message: " + fbdo.errorReason());
        }

        // write the humidity value to firebase
        String humi_path = "sensor/humi/" + String(timestamp);
        if (Firebase.RTDB.setFloat(&fbdo, humi_path + "/value", humi))
        {
            Serial.println("Humidity value written to Firebase: " + String(humi));
        }
        else
        {
            Serial.println("Failed to write humidity value: " + fbdo.errorReason());
            Serial.println("HTTP response code: " + String(fbdo.httpCode()));
            Serial.println("Error message: " + fbdo.errorReason());
        }

        // write led state from firebase led/value
        if (Firebase.RTDB.getBool(&fbdo, "led/value"))
        {
            bool ledState = fbdo.boolData();
            digitalWrite(ledpin, ledState ? HIGH : LOW);
            Serial.println("LED value read from Firebase: " + String(ledState));
        }
        else
        {
            Serial.println("Failed to read LED value from Firebase: " + fbdo.errorReason());
        }

        /*
        get threshold value from firebase
        if (Firebase.RTDB.getInt(&fbdo, "ldrthreshold/value"))
        {
        int threshold = fbdo.intData();
        Serial.println("Threshold value read from Firebase: " + String(threshold));
        
        // compare ldr value with threshold
            if (ldrValue > threshold)
            {
                Serial.println("LDR value is greater than threshold");
                sendLDRAlert(ldrValue);
                delay(5000);
            }
            else
            {
                Serial.println("LDR value is okay");
            }
        }
        else
        {
            Serial.println("Failed to read threshold value from Firebase: " + fbdo.errorReason());
        }
        */
    }
}

void connectToWiFi()
{
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.print("Connecting to Wi-Fi");
    while (WiFi.status() != WL_CONNECTED)
    {
        Serial.print(".");
        delay(300);
    }
    Serial.println();
    Serial.print("Connected with IP: ");
    Serial.println(WiFi.localIP());
    Serial.println();
}

void connectToFirebase()
{
    config.api_key = API_KEY;
    config.database_url = DATABASE_URL;

    /* Sign up */
    if (Firebase.signUp(&config, &auth, "" , ""))
    {
        Serial.println("ok");
        signupOK = true;
    }
    else
    {
        Serial.printf("%s\n", config.signer.signupError.message.c_str());
    }

    config.token_status_callback = tokenStatusCallback;

    Firebase.begin(&config, &auth);
    Firebase.reconnectWiFi(true);
}

/*
void sendLDRAlert(int value)
{
    if (WiFi.status() == WL_CONNECTED)
    {
        HTTPClient http;
        http.begin(LAMBDA_API_ENDPOINT);
        http.addHeader("Content-Type", "application/json");

        String payload = "{\"ldrValue\":" + String(value) + "}";
        int httpResponseCode = http.POST(payload);
        
        if (httpResponseCode == 200)
        {
            Serial.println("✅ Alert sent successfully!");
        }
        else
        {
            Serial.println("❌ Failed to send alert. HTTP code: " + String(httpResponseCode));
        }
        
        http.end();
    }
    else
    {
        Serial.println("⚠️ Not connected to WiFi.");
    }
}
*/

void setupTime()
{
    configTime(gmtOffset_sec, daylightOffset_sec, ntpServer);
    Serial.print("Waiting for NTP time sync: ");
    time_t now = time(nullptr);
    while (now < 8 * 3600 * 2)
    {
        delay(500);
        Serial.print(".");
        now = time(nullptr);
    }
    Serial.println("");
    struct tm timeinfo;
    gmtime_r(&now, &timeinfo);
    Serial.printf("Current time: %s", asctime(&timeinfo));
}