const admin = require('firebase-admin');
const axios = require('axios');

// Initialize Firebase
let serviceAccount;
try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} catch (error) {
    console.error('Error parsing Firebase service account:', error);
}

if (admin.apps.length === 0) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        databaseURL: process.env.FIREBASE_DATABASE_URL
    });
}

const botToken = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.TELEGRAM_CHAT_ID;

async function sendTelegramAlert(type, reading, threshold, timestamp) {
    try {
        const message = `⚠️ *${type.toUpperCase()} Alert* ⚠️\nHigh ${type} level detected!\nValue: ${reading}\nThreshold: ${threshold}\nTimestamp: ${timestamp.replace('_', ' ')}`;
        const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

        await axios.post(url, {
            chat_id: chatId,
            text: message,
            parse_mode: 'Markdown'
        });

        console.log(`${type.toUpperCase()} alert sent successfully`);
        return true;
    } catch (error) {
        console.error(`Error sending ${type} alert:`, error);
        return false;
    }
}

async function getMostRecentSensorReadings() {
    try {
        const db = admin.database();

        const types = ['ldr', 'humi', 'temp'];
        const sensorData = {};
        const thresholds = {};

        for (const type of types) {
            const dataRef = db.ref(`sensor/${type}`);
            const snapshot = await dataRef.orderByKey().limitToLast(1).once('value');
            const data = snapshot.val();

            const thresholdRef = db.ref(`alerts/thresholds/${type}`);
            const thresholdSnapshot = await thresholdRef.once('value');
            const threshold = thresholdSnapshot.val();

            if (data && typeof data === 'object') {
                const timestamp = Object.keys(data)[0];
                const reading = data[timestamp].value;
                sensorData[type] = { timestamp, reading, threshold };
            }
        }

        return sensorData;
    } catch (error) {
        console.error('Error fetching sensor data:', error);
        return null;
    }
}

async function areTelegramAlertsEnabled() {
    try {
        const db = admin.database();
        const alertsRef = db.ref('alerts/enable');
        const snapshot = await alertsRef.once('value');
        return snapshot.val() === true;
    } catch (error) {
        console.error('Error checking Telegram alerts setting:', error);
        return false;
    }
}

exports.handler = async () => {
    try {
        console.log('Checking sensor readings...');

        const sensorData = await getMostRecentSensorReadings();
        if (!sensorData) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: 'No sensor data found' })
            };
        }

        const alertsEnabled = await areTelegramAlertsEnabled();
        if (!alertsEnabled) {
            console.log('Telegram alerts are disabled. No alerts will be sent.');
            return {
                statusCode: 200,
                body: JSON.stringify({ message: 'Alerts are disabled' })
            };
        }

        let alertSent = false;

        for (const [type, { timestamp, reading, threshold }] of Object.entries(sensorData)) {
            console.log(`Checking ${type}: ${reading} (threshold: ${threshold})`);
            if (reading > threshold) {
                console.log(`${type.toUpperCase()} exceeds threshold! Sending alert...`);
                await sendTelegramAlert(type, reading, threshold, timestamp);
                alertSent = true;
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: alertSent ? 'Alerts sent' : 'No alerts needed',
                data: sensorData
            })
        };
    } catch (error) {
        console.error('Lambda execution error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Error executing Lambda function',
                error: error.message
            })
        };
    }
};
