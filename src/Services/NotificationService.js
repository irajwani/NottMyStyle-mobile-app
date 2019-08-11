// import {AsyncStorage} from 'react-native';
// import PushNotification from 'react-native-push-notification';

// export default {
//   initializePushNotifications: (willSaveToken) => {
//     console.log('About to ask user for access')
//     // PushNotification.requestPermissions(); 
//     PushNotification.configure({
  
//       // (optional) Called when Token is generated (iOS and Android)
//       onRegister: function(token) {
//           console.log( 'TOKEN:', token );
//           willSaveToken ? AsyncStorage.setItem('token', token.token) : null;
//       },
  
//       // (required) Called when a remote or local notification is opened or received
//       onNotification: function(notification) {
//           const {userInteraction} = notification;
//           console.log( 'NOTIFICATION:', notification, userInteraction );
//         //   if(userInteraction) {
//         //     //this.props.navigation.navigate('YourProducts');
//         //     alert("To edit a particular product's details, magnify to show full product details \n Select Edit Item. \n (Be warned, you will have to take new pictures)");
//         //   }
          
//           //userInteraction ? this.navToEditItem() : console.log('user hasnt pressed notification, so do nothing');
//       },
  
//       // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
//       //senderID: "YOUR GCM SENDER ID",
  
//       // IOS ONLY (optional): default: all - Permissions to register.
//       permissions: {
//           alert: true,
//           badge: true,
//           sound: true
//       },
  
//       // Should the initial notification be popped automatically
//       // default: true
//       popInitialNotification: true,
  
//       /**
//         * (optional) default: true
//         * - Specified if permissions (ios) and token (android and ios) will requested or not,
//         * - if not, you must call PushNotificationsHandler.requestPermissions() later
//         */
//       requestPermissions: true,
//   });
  
//   }
// }