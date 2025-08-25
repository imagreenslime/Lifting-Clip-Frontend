# Lifting Clip App (ESP32 Connection)

This is the React Native app I’m using to connect to my ESP32-S3 “lifting clip” over Bluetooth.  
The idea is simple: the firmware streams bar speed, acceleration, and range of motion → the app connects and shows it live.

## What works right now
- Scans for my ESP32 and connects over BLE
- Subscribes to a metrics characteristic
- Parses incoming bytes into numbers
- Displays live values in the app (basic UI)

## What I’m adding next
- Session logging (save reps to CSV)
- Share/export option
- A simple summary screen (rep count, best rep, average velocity)

## Tech
- React Native (TypeScript)
- BLE via `react-native-ble-plx`
- Just using hooks/state for now, nothing fancy

## How to run
- `npm install`
- `npm run android` (for Android testing)
- `npm run ios` (needs Mac for iOS build)

Don’t forget BLE permissions:
- iOS → add Bluetooth keys in Info.plist
- Android → add `BLUETOOTH_*` + `ACCESS_FINE_LOCATION` (older SDKs)

## BLE details
- Service UUID: `<fill in>`
- Metrics characteristic (notify): `{ vel, acc, rom, rep_id }`
- Config characteristic (write): JSON for things like sample rate/filtering

The full spec lives in the [firmware repo](https://github.com/imagreenslime/Lifting-Clip-Backend).

## Screens / Demo
- Screenshot of the connect screen
- Screenshot of live metrics
- Short screen recording (coming soon)

## Roadmap
- CSV logger + export
- Session summary view
- Better error handling (disconnect/retry)
