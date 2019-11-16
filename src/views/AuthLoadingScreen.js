import React, { Component } from 'react'
import { SafeAreaView, View, ImageBackground, Text, Platform } from 'react-native'
import { LoadingIndicator } from '../localFunctions/visualFunctions';
import { lightGreen } from '../colors';
import {Images} from '../Theme'
import firebase from '../cloud/firebase';
import VersionNumber from 'react-native-version-number';

export default class AuthLoadingScreen extends Component {
  constructor(props) {
      super(props);
      
  }

  componentDidMount = () => {
    this.showAppOrAuth();
  }

  // updateAppUse = () => {
  //   let updates = {};
  //   updates[`/Users/${this.uid}/appUse/`] 
  //   firebase.database().ref().update(updates);
  // }

  updateOnConnect = () => {
    var connectionRef = firebase.database().ref('.info/connected');
    // var disconnectionRef = firebase.database().ref().onDisconnect();
    connectionRef.on('value', (snap)=>{
      if(snap.val() === true) {
        this.updateStatus('online');
      }
      // else {
      //   this.updateStatus('offline');
      // }
      
    })

    

    // let update = {};
    // update['/Users/' + this.uid + '/status/'] = "offline";
    // disconnectionRef.update(update);


    // firebase.database().ref('/Users/' + this.uid + '/').onDisconnect( (connectionStatus) => {
    //   console.log('CONNECTION STATUS: ' + connectionStatus);
    //   let status = 'online';
    //   this.updateStatus(status);
    // })
  }

  updateStatus = (status) => {
    console.log("CONNECTION STATUS: " + status);
    var statusUpdate = {};
    statusUpdate['/Users/' + this.uid + '/status/'] = status;
    firebase.database().ref().update(statusUpdate);
    // if(!this.uid) {
    //   return
    // }
    // else {
    //   var statusUpdate = {};
    //   statusUpdate['/Users/' + this.uid + '/status/'] = status;
    //   firebase.database().ref().update(statusUpdate);
    // }
  }

  updateAppUsage = () => {
    firebase.database().ref(`/Users/${this.uid}/appUsage/`).once('value', (snapshot) => {
      var appUsage = snapshot.val();
      var updates = {};
      updates['/Users/' + this.uid + '/appUsage/'] = appUsage+1;
      firebase.database().ref().update(updates);
    })
  }

  showAppOrAuth = () => {
    var unsubscribe = firebase.auth().onAuthStateChanged( async ( user ) => {
        unsubscribe();
        // If you want to get back to basic, re-enable this:
        // this.props.navigation.navigate(user ? 'AppStack' : 'AuthStack');
        
        //If you want to re-enable presence checker in future
        if(user) {
          console.log("USER IS: " + user);
          this.uid = await user.uid;
          await this.updateOnConnect();
          await this.updateAppUsage();
          // await this.updateAppUse();
          this.props.navigation.navigate('AppStack');
        }
        else {
          console.log("USER DISCONNECTED")
          await this.updateOnConnect();
          this.props.navigation.navigate('AuthStack');
        }

        


        // if(user) {
          
        //   var unreadCount = false
          
        //   firebase.database().ref(`/Users/${user.uid}/`).once('value', (snap) => {
        //     var d = snap.val();

        //     if(d.notifications.priceReductions) {
        //       console.log("Notifications length: " + Object.keys(d.notifications.priceReductions).length)
        //       // unreadCount = Object.keys(d.notifications.priceReductions).length; 
        //       Object.values(d.notifications.priceReductions).forEach( (n) => {
        //         if(n.unreadCount) {
        //           unreadCount = true //in this case we only care if whether at least one notification has this property
        //         }
        //       })
              
        //     }

        //   })
        //   .then(() => {
        //     this.props.navigation.navigate('Profile', {unreadCount: unreadCount});
        //   })
        //   .catch( (e) => {
        //     console.log(e);
        //   })
          
        // }

        // else {
        //   this.props.navigation.navigate('AuthStack');
        // }
    })
  }

  renderHangerAnimationScreen = () => (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}}>
      <View style={{flex: 0.9, justifyContent: 'center', alignItems: 'center'}}>
        <LoadingIndicator isVisible={true} color={lightGreen} type={'Wordpress'} />
      </View>
      <View style={{flex: 0.1, justifyContent: 'center', alignItems: 'center'}}>
        <Text>Version {VersionNumber.buildVersion}</Text>
      </View>
    </SafeAreaView>
  )

  renderSplashScreen = () => (
    <SafeAreaView style={{flex: 1}}>
      <ImageBackground source={Images.splashScreen} style={{width: '100%', height: '100%'}}>

      </ImageBackground>
    </SafeAreaView>
  )

  render() {
    return this.renderSplashScreen()
  }
}

