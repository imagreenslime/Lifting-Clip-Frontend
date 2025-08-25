This is the React Native app for my Lifting Clip project — a small ESP32 device I built that clips to a barbell and streams live data over Bluetooth. The app connects to the clip, tracks bar speed, and gives lifters instant feedback on their sets.

I built it because I was tired of guessing whether I was moving the bar fast enough — now I can see it.

What it looks like
-Scan → connect to the lifting chip
-Press record and start the lift
-Rep counter with duration and velocity per set
-Session history so you can track progress

screenshots here

🚀 How to run it
You’ll need Node + React Native setup on your machine (Xcode for iOS, Android Studio for Android).

git clone https://github.com/imagreenslime/Lifting-Clip-Frontend.git
cd Lifting-Clip-Frontend

# set Node version
nvm install
nvm use

# install dependencies
npm ci

# iOS only
cd ios && pod install && cd ..

# start the packager
npm start -- --reset-cache

# run on simulator
npm run ios   # iOS
npm run android   # Android


To run on your iPhone: open ios/LiftingClip.xcworkspace in Xcode, select your device, and press go. You’ll need to sign the app with your Apple ID.

📡 How it talks to the clip
The ESP32 sends data over BLE:
Rep event – when a lift completes, with stats


Tech used:
-React Native + React Navigation
-BLE (react-native-ble-plx)
-Firebase + Firestroage

iOS: CocoaPods / Xcode 15


Project structure
src/

  auth/            // main firebase structure
  components/      // UI building blocks
  screens/         // Home, Live Session, History
  services/        // Bluetooth + data storage
  hooks/           // custom React hooks
  navigation/      // main navigation
  context/           // React context

What’s done
-Connects to BLE device and streams data
-Gets JSON filled with set/rep information
-Rep detection + per-set summary
-Local session log

What’s next
-Auto-calibration
-Export training data as CSV
-Smarter fatigue tracking
