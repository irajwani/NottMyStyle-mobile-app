import React, { Component } from 'react'
import { AsyncStorage, Platform, Dimensions, Text, StyleSheet, ImageBackground, ScrollView, View, Image, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native'

import Svg, { Path } from 'react-native-svg';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';

import rug from 'random-username-generator';

import PushNotification from 'react-native-push-notification';
// import {initializePushNotifications} from '../Services/NotificationService';

// import ActionSheet from 'react-native-actionsheet'
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from 'react-native-popup-dialog';

// import { iOSColors, iOSUIKit, human } from 'react-native-typography';
// import LinearGradient from 'react-native-linear-gradient'
// import ReviewsList from '../components/ReviewsList.js';
// import { PacmanIndicator } from 'react-native-indicators';
// import { avenirNextText } from '../constructors/avenirNextText';

import { highlightGreen, graphiteGray, avenirNext,lightGreen, yellowGreen } from '../colors.js';
import { LoadingIndicator } from '../localFunctions/visualFunctions.js';
import ProgressiveImage from '../components/ProgressiveImage';
import { stampShadow, lowerShadow } from '../styles/shadowStyles.js';
import { textStyles } from '../styles/textStyles.js';
import { Images, Fonts } from '../Theme/index.js';
import Profile from '../components/Profile.js';
const {width, height} = Dimensions.get('window');

const profilePicSize = 0.5*width;

const resizeMode = 'center';

const noReviewsText = "No Reviews have been\n left for you thus far.";

const ButtonContainer = ({children, text, onPress}) => (
  <TouchableOpacity onPress={() => onPress()} style={{flexDirection: 'row', flex: 0.5, justifyContent: 'flex-start', alignItems: 'center', marginHorizontal: 10}}>
    {children}
    <View style={styles.buttonTextContainer}>
      <Text style={{...textStyles.generic, color: '#fff', ...Fonts.big, fontWeight: "300"}}>{text}</Text>
    </View>
  </TouchableOpacity>
)


class ProfilePage extends Component {

  static navigationOptions = {
    header: null
    // headerTitle: 'ProfileMyStyle',
    // headerStyle: {
    //   backgroundColor: 'red',
    // },
    // headerTintColor: '#fff',
    // headerTitleStyle: {
    //   fontWeight: 'bold',
    //   fontFamily: 'Verdana'
    // },
  };

  constructor(props) {
    super(props);
    // this.gradientColors = {
    //   0: ['#7de853','#0baa26', '#064711'],
    //   1: ['#7de853','#0baa26', '#064711'],
    //   2: ['#7de853','#0baa26', '#064711'],
    //   3: ['#7de853','#0baa26', '#064711'],
    // }
    this.state = {
      profileData: false,
      // name: '',
      // email: '',
      // insta: '',
      // uri: '',
      // numberProducts: 0,
      // soldProducts: 0,
      // sellItem: false,
      // products: [],
      isGetting: true,
      noComments: false,
      // gradient: this.gradientColors[0],
      isMenuActive: false,
      backgroundColor: yellowGreen,

    }

    this.uid = firebase.auth().currentUser.uid;

  }

  async componentWillMount() {
    await this.initializePushNotifications();
    this.timerId = setTimeout(() => {
      
      // const uid = firebase.auth().currentUser.uid;
      // this.uid = uid;
      

      this.getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(this.uid);
    }, 200);
    
  }

  componentWillUnmount = () => {
    clearTimeout(this.timerId)
  }

  // componentDidMount = () => {
  //   const messaging = firebase.messaging();
  //   messaging.onMessage((payload) => {
  //     console.log('Message received. ', payload);
      
  //   });
  // }

  initializePushNotifications = (willSaveToken) => {
    console.log('About to ask user for access')
    // PushNotification.requestPermissions(); 
    PushNotification.configure({
  
      // (optional) Called when Token is generated (iOS and Android)
      onRegister: function(token) {
          console.log( 'TOKEN:', token );
          // willSaveToken ? AsyncStorage.setItem('token', token.token) : null;
      },
  
      // (required) Called when a remote or local notification is opened or received
      onNotification: function(notification) {
          const {userInteraction} = notification;
          console.log( 'NOTIFICATION:', notification, userInteraction );
        //   if(userInteraction) {
        //     //this.props.navigation.navigate('YourProducts');
        //     alert("To edit a particular product's details, magnify to show full product details \n Select Edit Item. \n (Be warned, you will have to take new pictures)");
        //   }
          
          //userInteraction ? this.navToEditItem() : console.log('user hasnt pressed notification, so do nothing');
      },
  
      // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
      //senderID: "YOUR GCM SENDER ID",
  
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
          alert: true,
          badge: true,
          sound: true
      },
  
      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
  
      /**
        * (optional) default: true
        * - Specified if permissions (ios) and token (android and ios) will requested or not,
        * - if not, you must call PushNotificationsHandler.requestPermissions() later
        */
      requestPermissions: true,
  });
  
  }

  updatePushToken = async (uid, token) => {
    var updates = {};
    updates[`/Users/${uid}/pushToken`] = token;
    firebase.database().ref().update(updates);
  }

  handlePushToken = async () => {
    var token = await AsyncStorage.getItem('fcmToken');
    if(token) {
      if(currentUser.pushToken == undefined || currentUser.pushToken != token) {
        this.updatePushToken(this.uid, token);
      }
    }
  }

  updateUsername = (username) => {
    var updates = {};
    updates[`/Users/${uid}/profile/username/`] = username;
    firebase.database().ref().update(updates);
  }

  getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(your_uid) {
    console.log(your_uid);
    const keys = [];
    //read the value of refreshed cloud db so a user may seamlessly transition from registration to profile page
    firebase.database().ref('/Users/' + your_uid + '/').on("value", async (snapshot) => {
      let currentUser = snapshot.val();
      // var d = snapshot.val();
      // let currentUser = d.Users[your_uid];
      // console.log(d.val(), d.Users, your_uid);

      //In the scenario where this is the person's first time logging in, update token in the cloud
      //Freer condition for now to update push token based on if whether FCM token is absent in cloud or if there is a new token (device),
      //to send notifs too
      var token = await AsyncStorage.getItem('fcmToken');
      if(token) {
        if(currentUser.pushToken == undefined || currentUser.pushToken != token) {
          this.updatePushToken(your_uid, token);
        }
      }
      
      
      var profileData = currentUser.profile


      // if(!profileData.username) {
      //   var username = rug.generate();
      //   this.updateUsername(username);
      // }

      var comments;
      if(currentUser.comments) {
        comments = currentUser.comments;
        this.setState({ profileData, comments, isGetting: false })
        // this.setState({comments})
      }
      else {
        this.setState({ profileData, noComments: true, isGetting: false })
      }
      
      
      
    })
    
    
  }

  navToSettings = () => {this.props.navigation.navigate('Settings')}

  logOut = () => {
    firebase.auth().signOut().then(() => {
      // var statusUpdate = {};
      // statusUpdate['Users/' + this.uid + '/status/'] = "offline";
      // await firebase.database().ref().update(statusUpdate);
      this.props.navigation.navigate('SignIn');
    })
  }


  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navToEditProfile = () => {
    this.props.navigation.navigate('CreateProfile', {editProfileBoolean: true})
  }

  toggleMenu = () => {
    this.setState({isMenuActive: !this.state.isMenuActive})
  }

  navToYourProducts = () => {this.props.navigation.navigate('YourProducts')}

  navToSoldProducts = () => {this.props.navigation.navigate('SoldProducts')}

  render() {
    var {isGetting, comments, noComments, profileData, isMenuActive} = this.state;
   
    return (
      <Profile
        currentUser={true}
        profileData={profileData}
        isGetting={isGetting}
        navToSettings={this.navToSettings}
        
        logOut={this.logOut}
        navToEditProfile={this.navToEditProfile}
        navToYourProducts={this.navToYourProducts}
        navToSoldProducts={this.navToSoldProducts}
        noComments={noComments}
        comments={comments}
        navToOtherUserProfilePage={this.navToOtherUserProfilePage}
      />
    )


  }

}

export default ProfilePage;

// line 143 <Icon name="account-multiple" 
// style={styles.users}
// size={30} 
// color={'#189fe2'}
// onPress={() => this.props.navigation.navigate('Users')}

// />

{/* <ActionSheet
            ref={o => this.ActionSheet = o}
            title={'Color Gradient Scheme:'}
            options={['Green', 'Red', 'Blue', 'Black', 'cancel']}
            cancelButtonIndex={4}
            destructiveButtonIndex={4}
            onPress={(index) => { this.setGradient(index) }}
            
            /> */}

const styles = StyleSheet.create({
  
  halfPageScrollContainer: {
    flex: 1,
    width: width,
    backgroundColor: "#fff",
    
  },
  halfPageScroll: {
    backgroundColor: "#fff",
    justifyContent: 'center',
    // alignItems: 'center',
    paddingTop: 5,
    paddingHorizontal: 10,
    justifyContent: 'space-evenly'
  },
  mainContainer: {
    flex: 1,
    flexDirection: 'column',
    padding: 0,
    backgroundColor: '#fff',
    // marginTop: 18
  },
  

  linearGradient: {
    flex: 0.8,
    ...lowerShadow,
    // overflow: 'hidden',
    // position: "relative",
    // backgroundColor: "blue",
    //backgroundColor: 'red',
    // borderWidth:2,
    // borderColor:'black',
    
    // alignSelf: 'center',
    // width: width,
    // overflow: 'hidden', // for hide the not important parts from circle
    // height: 175,
  },

  footerContainer: {
    flex: 0.2,
    flexDirection: 'column',
    backgroundColor: '#fff',
    justifyContent: 'center',
    // alignItems: 'center',
    padding: 10,
    justifyContent: 'space-evenly'
  },

  // bottomCurve: { // this shape is a circle 
  //   borderBottomLeftRadius: width,
  //   borderBottomRightRadius: width, // border borderRadius same as width and height
  //   width: width,
  //   height: width,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   // marginLeft: -250, // reposition the circle inside parent view
  //   position: 'absolute',
  //   // bottom: 0, // show the bottom part of circle
  //   // overflow: 'hidden', // hide not important part of image
  //   backgroundColor: "#c8f966"
  // },

  // topContainer: {
  //   flexDirection: 'row',
  //   flex: 0.65
  // },

  

  // oval: {
  //   // marginTop: "10%",
  //   // marginTop: width/3,
  //   width: width,
  //   height: "100%",
  //   borderBottomLeftRadius: width,
  //   borderBottomRightRadius: width,
  //   //backgroundColor: 'red',
  //   // borderWidth:2,
  //   // borderColor:'black',
  //   position: "absolute",
  //   transform: [
  //     {scaleX: 2}
  //   ],
  //   // top: 10,
  //   // backgroundColor: yellowGreen
  // },

  iconRow: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    paddingHorizontal: 20,
    // marginVertical: 25,
    // backgroundColor: 'red'
    // height: 150,
  },

  profileRow: {
    flex: 0.7,
    // marginTop: 25,
    justifyContent: 'flex-start',
    alignItems: 'center',
    // backgroundColor: 
    // marginVertical: 20
  },

    profilepic: {
      //flex: 1,
      // width: profilePicSize,
      // height: profilePicSize,
      // borderRadius: profilePicSize/2,
      width: 170,
      height: 170,
      alignSelf: 'center',
      borderRadius: 85,
      borderColor: '#fff',
      borderWidth: 0,
      ...stampShadow,
      // opacity: 0.1
    },

  buttonsContainer: {
    flex: 0.2,    
    flexDirection: 'row',
    
    // borderBottomColor: 'black',
    // borderBottomWidth: 1,
    // backgroundColor: 'red',    
    // borderRadius: width/5,
    // width: width,
    // height: width,
    // top: 0, // show the bottom part of circle
    // overflow: 'hidden',
    // marginLeft: -100,
  },

    blackCircle: {
      // marginBottom: 10,
      width: 55,
      height: 55,
      borderRadius: 27.5,
      padding: 4,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'black',
      // borderColor: '#fff',
      // borderWidth: 0.3,
      // ...stampShadow,
    },

  // triangle: {
  //   width: 0,
  //   height: 0,
  //   backgroundColor: 'transparent',
  //   borderStyle: 'solid',
  //   borderLeftWidth: 25,
  //   borderRightWidth: 25,
  //   borderBottomWidth: 50,
  //   borderLeftColor: 'transparent',
  //   borderRightColor: 'transparent',
  //   borderBottomColor: 'white'
  // },

  // popDownMenu: {
  //   width: 55,
  //   height: 35,
  //   borderRadius: 8,
  //   borderWidth: 0.3,
  //   backgroundColor: "white",
  //   justifyContent: 'center',
  //   alignItems: 'center'
  // },

  // gearAndPicColumn: {
  //   flex: 0.6818,
  //   flexDirection: 'column',
  //   // flex: 1.0,
  //   // flexDirection: 'row',
  //   // justifyContent: 'space-evenly',
  //   // alignItems: 'center',
  //   marginTop: 20,
  //   // width: width - 40,
  //   // paddingRight: 0,
  //   // backgroundColor: 'blue',
  //   // width: width
  // },

  // gearRow: {
  //   flex: 0.2,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   // alignContent: 'flex-start',
  //   // backgroundColor: 'white'
  // },

  // picRow: {
  //   width: 250,
  //   flex: 0.8,
  //   // flexDirection: 'row',
  //   justifyContent: 'center',
  //   // alignContent: 'flex-start',
  //   // height: height/5,
  //   // backgroundColor: 'yellow'
  //   // alignItems: 'flex-start',
  // },

  // profileTextColumn: {
  //   flex: 0.318,
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   // paddingTop: 15,
  //   // backgroundColor: 'red'

  // },

  

  // whiteCircle: {
  //   marginTop: 15,
  //   width: 70,
  //   height: 70,
  //   borderRadius: 35,
  //   // padding: 5,
  //   justifyContent: 'center',
  //   alignItems: 'center',
  //   backgroundColor: 'white',
  //   borderColor: 'black',
  //   borderWidth: 4
  // },

  // subText: {
  //   fontFamily: 'Avenir Next',
  //   fontSize: 18,
  //   fontWeight: '400',
  //   color: graphiteGray,
  // },

  // headerBackground: {
  //   flex: 1,
  //   width: null,
  //   alignSelf: 'stretch',
  //   justifyContent: 'space-between'
  // },

  // gear: {
  //   flex: 0,
  //   paddingRight: 60
  // },
  // users: {
  //   flex: 0,
  //   paddingLeft: 60,
  //   paddingRight: 0,
  //   marginLeft: 0
  // },
  
  // profilepicWrap: {
  //   backgroundColor: 'black',
  //   width: 130,
  //   height: 130,
  //   borderRadius: 65,
  //   borderColor: 'rgba(0,0,0,0.4)',
  //   borderWidth: 0,
  // },
  
  
  // numberProducts: {
  //   fontFamily: avenirNext,
  //   fontSize: 28,
  //   color: graphiteGray,
  //   fontWeight: 'normal'
  // },
  // soldProducts: {
  //   fontFamily: avenirNext,
  //   fontSize: 16,
  //   color: '#fff',
  //   fontWeight: 'bold'
  // },

  // name: {
  //   ...textStyles.generic,
  //   marginTop: 10,
  //   ...Fonts.h3,
  //   fontWeight: "700",
  //   // color: 'black'
  // },
  // pos: {
  //   ...textStyles.generic,
  //   fontWeight: "200"
  //   // fontStyle: 'italic'
  // },
  // insta: {
  //   ...textStyles.generic,
  //   fontWeight: "200"
  //   // fontStyle: 'italic'
  // },

  ///////// 
  // On Sale and Sold buttons

  buttonTextContainer: {
    borderBottomRightRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 5,
    width: width/3,
    position: 'absolute',
    zIndex: -1,
    // left: 37,
    left: 30,
  },

  /////////////
  /////////////

//   companyLogoContainer: {
//     justifyContent: 'center',
//     alignContent: 'center',
//     backgroundColor: '#122021',
//   },
//   companyLogo: {
//     //resizeMode: 'container',
//     borderWidth:1,
//     borderColor:'#207011',
//     alignItems:'center',
//     justifyContent:'center',
//     width:40,
//     height:40,
//     backgroundColor:'#fff',
//     borderRadius:0,
//     borderWidth: 2,
//     marginLeft: (width/4)-10,
//     paddingLeft: 25,
//     paddingRight: 25

// }, 
// naam: {
//   ...iOSUIKit.caption2,
//   fontSize: 11,
//   color: '#37a1e8'

// },

// title: {
//   ...human.headline,
//   fontSize: 20,
//   color: '#656565'
// },

reviewsHeader: {
  ...textStyles.generic,
  fontSize: 30,
  fontWeight: "200",
  letterSpacing: 1,
  color: 'black'
},

commentContainer: {
  flexDirection: 'column',
  borderWidth: 0,
  borderRadius: 10,
  // width: width - 15,
  backgroundColor: "#fff",
  // shadowOpacity: 0.5,
  // shadowRadius: 1.3,
  // shadowColor: 'black',
  // shadowOffset: {width: 0, height: 0},
  padding: 5,
  marginVertical: 4

},

commentPicAndTextRow: {
  flexDirection: 'row',
  width: width - 20,
  padding: 10
},

commentPic: {
  //flex: 1,
  width: 70,
  height: 70,
  alignSelf: 'center',
  borderRadius: 35,
  borderColor: '#fff',
  borderWidth: 0
},

commentName: {
  color: highlightGreen,
  fontSize: 16,
  fontWeight: "500",
  textAlign: "left"
},

comment: {
  fontSize: 16,
  color: 'black',
  textAlign: "center",
},  

commentTimeRow: {
  justifyContent: 'flex-end',
  alignContent: 'flex-end',
  alignItems: 'flex-end',
},

commentTime: {
  textAlign: "right",
  fontSize: 16,
  color: 'black'
},

// rowContainer: {
//   flexDirection: 'column',
//   padding: 14
// },

textContainer: {
flex: 1,
flexDirection: 'column',
padding: 5,
},

// separator: {
// width: width,
// height: 2,
// backgroundColor: '#111110'
// },  

});

{/* <TouchableHighlight onPress={() => {firebase.auth().signOut()
                          .then(() => {console.log('sccessfully signed out'); this.props.signOut })
                          .catch((err) => console.log(err)); }}>
              <View>
              <Icon name="exit-to-app" 
                    style={ styles.gear }
                            size={20} 
                            color={'#800000'}

              />
              <Text>Sign Out</Text>
              </View>
            </TouchableHighlight> */}


