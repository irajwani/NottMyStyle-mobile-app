import React, {Component} from 'react';
import Test from './src/views/Test';
import AuthOrAppSwitch from './src/switchNavigators/AuthOrAppSwitch';

export default class App extends Component {
  render() {
    console.disableYellowBox = true;
    return (
      <AuthOrAppSwitch />
    );
  }
}

// Pre-build fix for Android
// implementation "androidx.appcompat:appcompat:1.0.+"
//in build.gradle for dependency

// import androidx.annotation.NonNull;
// import androidx.annotation.Nullable;
// import androidx.annotation.StyleRes;
// import androidx.core.app.ActivityCompat;
// import androidx.core.content.FileProvider;
// import androidx.appcompat.app.AlertDialog;
// import androidx.core.app.NotificationCompat;
// place in place of vanilla android support android

//To make a release build

//Android crash fix followed thus far: https://medium.com/@impaachu/react-native-android-release-build-crash-on-device-14f2c9eacf18:

// react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
// ./gradlew clean && ./gradlew assembleRelease