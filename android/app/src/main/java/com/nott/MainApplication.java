package com.nott;

import android.app.Application;

import com.facebook.react.ReactApplication;
import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.facebook.react.shell.MainReactPackage;
import com.facebook.soloader.SoLoader;

import java.util.Arrays;
import java.util.List;

//import com.facebook.react.BuildConfig;

import co.apptailor.googlesignin.RNGoogleSigninPackage;
import com.facebook.reactnative.androidsdk.FBSDKPackage;
//import com.oblador.vectoricons.VectorIconsPackage; dont need to manually link because we use gradle to accomplish this
import com.BV.LinearGradient.LinearGradientPackage;
import org.reactnative.camera.RNCameraPackage;
import com.RNFetchBlob.RNFetchBlobPackage;

import com.pusher.pushnotifications.PushNotifications;
import com.reactnative.ivpusic.imagepicker.PickerPackage;
import fr.bamlab.rnimageresizer.ImageResizerPackage;

import com.imagepicker.ImagePickerPackage;

import com.facebook.FacebookSdk;
import com.facebook.CallbackManager;
import com.facebook.appevents.AppEventsLogger;

import com.horcrux.svg.SvgPackage;

import com.dieam.reactnativepushnotification.ReactNativePushNotificationPackage;
import com.pusher.pushnotifications.PushNotifications;

import com.react.rnspinkit.RNSpinkitPackage;

import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.messaging.RNFirebaseMessagingPackage;
import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;
//import io.invertase.firebase.notifications.RNFirebaseNotificationsPackage;



public class MainApplication extends Application implements ReactApplication {

  private static CallbackManager mCallbackManager = CallbackManager.Factory.create();

  protected static CallbackManager getCallbackManager() {
    return mCallbackManager;
  }

  private final ReactNativeHost mReactNativeHost = new ReactNativeHost(this) {
    @Override
    public boolean getUseDeveloperSupport() {
      return BuildConfig.DEBUG;
    }

    @Override
    protected List<ReactPackage> getPackages() {
      return Arrays.<ReactPackage>asList(
          new MainReactPackage(),
          new PickerPackage(),
          new RNGoogleSigninPackage(),
          new FBSDKPackage(mCallbackManager),
          new LinearGradientPackage(),
          new RNCameraPackage(),
          new RNFetchBlobPackage(),
          new SvgPackage(),
          new ReactNativePushNotificationPackage(),
          new RNSpinkitPackage(),
          new ImageResizerPackage(),
          new ImagePickerPackage(),
          new RNFirebasePackage(),
          new RNFirebaseMessagingPackage(),
          new RNFirebaseNotificationsPackage()
//          new RNFirebaseNotificationsPackage()
      );
    }

    @Override
    protected String getJSMainModuleName() {
      return "index";
    }
  };

  @Override
  public ReactNativeHost getReactNativeHost() {
    return mReactNativeHost;
  }

  @Override
  public void onCreate() {
    super.onCreate();
    FacebookSdk.setApplicationId("775950776083601");
    FacebookSdk.sdkInitialize(this);
    AppEventsLogger.activateApp(this);
    PushNotifications.start(getApplicationContext(), "9c23a8e4-a4f1-4e41-ab34-e627e7d23d2c");
    PushNotifications.addDeviceInterest("hello");

    SoLoader.init(this, /* native exopackage */ false);
  }
}
