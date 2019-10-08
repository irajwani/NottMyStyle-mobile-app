import React, {Component} from 'react';
import {AsyncStorage} from 'react-native';
import firebase from 'react-native-firebase';
// import Test from './src/views/Test';
import AuthOrAppSwitch from './src/switchNavigators/AuthOrAppSwitch';

export default class App extends Component {

  async componentDidMount() {
    this.checkPermission();
    this.createNotificationChannel();
    this.createNotificationListeners();
  }

  createNotificationChannel = async () => {
    const channel = new firebase.notifications.Android.Channel('test-channel', 'Test Channel', firebase.notifications.Android.Importance.Max)
      .setDescription('My apps test channel');

      // Create the channel
    await firebase.notifications().android.createChannel(channel);
  }

  createNotificationListeners = async () => {

    this.removeNotificationDisplayedListener = firebase.notifications().onNotificationDisplayed((notification) => {
      // Process your notification as required
      //iOS Only
      // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
      // this.setState({notification: "rNDL"})
      console.log('Notification: ', notification)
    });

    this.removeNotificationListener = firebase.notifications().onNotification((notification) => {
      // this.setState({notification: "rNL"})
      // console.log("Standard Notification + Optional Data Notification");
      console.log('Notification: ', notification)
    });

    /*
    * If your app is in background, you can listen for when a notification is clicked / tapped / opened as follows:
    * */
    this.removeNotificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        const { title, body } = notificationOpen.notification;
        // this.setState({notification: "rNOL"})
        console.log(title, body);
        // this.showAlert(title, body);
    });


    const notificationOpen = await firebase.notifications().getInitialNotification();
    if (notificationOpen) {
        const { title, body } = notificationOpen.notification;
        // console.log("App was closed and user interacted with it through notif.");
        console.log(title, body);
        // this.showAlert(title, body);
    }

    this.messageListener = firebase.messaging().onMessage((message) => {
      //process data message
      console.log(JSON.stringify(message));
    });
          
        
      

  }


  async checkPermission() {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
        this.getToken();
    } else {
        this.requestPermission();
    }
  }

    //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log(fcmToken);
    if (!fcmToken) {
        fcmToken = await firebase.messaging().getToken();
        if (fcmToken) {
            // user has a device token
            await AsyncStorage.setItem('fcmToken', fcmToken);
        }
    }
  }

    //2
  async requestPermission() {
    try {
        await firebase.messaging().requestPermission();
        // User has authorised
        this.getToken();
    } catch (error) {
        // User has rejected permissions
        console.log('permission rejected');
    }
  }

  componentWillUnmount() {
    this.removeNotificationDisplayedListener();
    this.removeNotificationOpenedListener();
    this.removeNotificationListener();
  }

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
// import androidx.annotation.Keep;
// import androidx.core.app.NotificationManagerCompat;
// import androidx.localbroadcastmanager.content.LocalBroadcastManager;
// import androidx.core.app.RemoteInput
// import androidx.annotation.RequiresPermission;
// place in place of vanilla android support android

//To make a release build

//Android crash fix followed thus far: https://medium.com/@impaachu/react-native-android-release-build-crash-on-device-14f2c9eacf18:

// react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
// ./gradlew clean && ./gradlew assembleRelease