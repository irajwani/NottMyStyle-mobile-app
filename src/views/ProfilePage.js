import React, { Component } from 'react'
import { AsyncStorage, Platform, Dimensions, Text, StyleSheet, ScrollView, View, Image, TouchableHighlight, TouchableOpacity, SafeAreaView } from 'react-native'

import Svg, { Path } from 'react-native-svg';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';

import PushNotification from 'react-native-push-notification';
// import {initializePushNotifications} from '../Services/NotificationService';

import ActionSheet from 'react-native-actionsheet'

import { iOSColors, iOSUIKit, human } from 'react-native-typography';
import LinearGradient from 'react-native-linear-gradient'
import ReviewsList from '../components/ReviewsList.js';
import { PacmanIndicator } from 'react-native-indicators';
import { avenirNextText } from '../constructors/avenirNextText';

import { highlightGreen, graphiteGray, avenirNext, mantisGreen,darkGreen,lightGreen,treeGreen, limeGreen, lightGray, yellowGreen } from '../colors.js';
import { LoadingIndicator, ProfileMinutia } from '../localFunctions/visualFunctions.js';
import ProgressiveImage from '../components/ProgressiveImage';
import { stampShadow, lowerShadow } from '../styles/shadowStyles.js';
import { textStyles } from '../styles/textStyles.js';
const {width, height} = Dimensions.get('window');

const resizeMode = 'center';

const noReviewsText = "No Reviews have been\n left for you thus far.";

const ButtonContainer = ({children}) => (
  <View style={{flex: 0.33, alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </View>
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
    this.gradientColors = {
      0: ['#7de853','#0baa26', '#064711'],
      1: ['#7de853','#0baa26', '#064711'],
      2: ['#7de853','#0baa26', '#064711'],
      3: ['#7de853','#0baa26', '#064711'],
    }
    this.state = {
      name: '',
      email: '',
      insta: '',
      uri: '',
      numberProducts: 0,
      soldProducts: 0,
      sellItem: false,
      products: [],
      isGetting: true,
      noComments: false,
      gradient: this.gradientColors[0],
      isMenuActive: false

    }

    // this.uid = ''

  }

  async componentWillMount() {
    await this.initializePushNotifications();
    this.timerId = setTimeout(() => {
      
      const uid = firebase.auth().currentUser.uid;
      this.uid = uid;
      

      this.getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(uid);
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

  getProfileAndCountOfProductsOnSaleAndSoldAndCommentsAndUpdatePushToken(your_uid) {
    console.log(your_uid);
    const keys = [];
    //read the value of refreshed cloud db so a user may seamlessly transition from registration to profile page
    firebase.database().ref().on("value", async (snapshot) => {
      var d = snapshot.val();
      let currentUser = d.Users[your_uid];
      // console.log(d.val(), d.Users, your_uid);

      //In the scenario where this is the person's first time logging in, update token in the cloud
      var token = await AsyncStorage.getItem('token');
      if(currentUser.pushToken == undefined && token) {
        this.updatePushToken(your_uid, token);
      }

      
      //check if whether this person deserves Upload Item notification
      if(token && currentUser.profile.isNoob == true) {
        console.log('Send Upload item Notification')
        let message = `Hey ${currentUser.profile.name},\nStill haven't uploaded any items on the NottMyStyle Marketplace? Take the first step to detox your closet and making money by uploading something on the Marketplace today.`;
        let notificationDate = new Date()
        notificationDate.setMinutes(notificationDate.getMinutes() + 3);
        PushNotification.localNotificationSchedule({
            message: message,// (required)
            date: notificationDate,
            vibrate: true,
        });
        
      }
      

      if(currentUser.notifications && token) {
        //PriceReduction Notifications
        this.shouldSendNotifications(currentUser.notifications);
      }

      var soldProducts = 0;
      var numberProducts=0;
      //relies on fact that when user profile was initially created,
      //we appended a products: '' entry under a particular uid's branch
      //TODO: Make these values a part of the person's profile in case they delete products they've earlier sold.
      if(currentUser.products) {
        for(var p of Object.values(currentUser.products)) {
          if(p.sold) {
            soldProducts++
          }
        }
        
        numberProducts = Object.keys(currentUser.products).length
      }

      // else {
      //   soldProducts = 0;
      //   numberProducts = 0;
      // }
      
      
      var {country, insta, name, size, uri} = currentUser.profile

      var comments;
      if(currentUser.comments) {
        comments = currentUser.comments;
        this.setState({ name, country, uri, insta, numberProducts, soldProducts, comments, isGetting: false })
        // this.setState({comments})
      }
      else {
        this.setState({ name, country, uri, insta, numberProducts, soldProducts, noComments: true, isGetting: false })
      }
      
      // console.log(comments);
      
      // var name = d.Users[your_uid].profile.name;
      // var email = d.Users[your_uid].profile.email;
      // var insta = d.Users[your_uid].profile.insta;

      // console.log(name);
      
    })
    //TODO: line below is Major removal from NMS, uncommenting it may prove unwise
    // .then(() => this.setState({isGetting: false}))

    // ////////////////

    // database.then( (d) => {
      
    //   var soldProducts = 0;
    //   //relies on fact that when user profile was initially created,
    //   //we appended a products: '' entry under a particular uid's branch
    //   for(var p of Object.values(d.Users[your_uid].products)) {
    //     if(p.sold) {
    //       soldProducts++
    //     }
    //   }
      
    //   var numberProducts = Object.keys(d.Users[your_uid].products).length
      
    //   var {country, insta, name, size, uri} = d.Users[your_uid].profile
      
    //   // var name = d.Users[your_uid].profile.name;
    //   // var email = d.Users[your_uid].profile.email;
    //   // var insta = d.Users[your_uid].profile.insta;

    //   console.log(name);
    //   this.setState({ name, country, uri, insta, numberProducts, soldProducts })
    // })
    // .catch( (err) => {console.log(err) })


    //////
    
  }

  shouldSendNotifications(notificationsObj) {
    // var tasks = Object.keys(notificationsObj)
    // tasks.forEach
    var message;
    var notificationDate;
    // var notificationData;
    if(notificationsObj.priceReductions) {
        for(var specificNotification of Object.values(notificationsObj.priceReductions)) {
            if(specificNotification.localNotificationSent == false) {
                let localNotificationProperty = {};
                localNotificationProperty[`/Users/${specificNotification.uid}/notifications/priceReductions/${specificNotification.key}/localNotificationSent/`] = true;
                let promiseToScheduleNotification = firebase.database().ref().update(localNotificationProperty);
                promiseToScheduleNotification.then( () => {
                    // var month = new Date().getMonth() + 1;
                    // var date= new Date().getDate();
                    // var year = new Date().getFullYear();
                    
                    //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
                    // notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                    let d = new Date();
                    // notificationDate = d.setDate(d.getDate() + 4)
                    notificationDate = d.setMinutes(d.getMinutes() + 1);
                    // console.log(month, date)
    
                    //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                    // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                    // console.log(message);
                    PushNotification.localNotificationSchedule({
                        message: specificNotification.message,// (required)
                        date: notificationDate,
                        vibrate: true,
                    });
                })
                    
            }

            else {
                console.log('doing nothing')
            }
            
        }
    }

    if(notificationsObj.itemsSold) {
      for(var specificNotification of Object.values(notificationsObj.itemsSold)) {
          if(specificNotification.localNotificationSent == false) {
              let localNotificationProperty = {};
              localNotificationProperty[`/Users/${specificNotification.uid}/notifications/itemsSold/${specificNotification.key}/localNotificationSent/`] = true;
              let promiseToScheduleNotification = firebase.database().ref().update(localNotificationProperty);
              promiseToScheduleNotification.then( () => {
                  // var month = new Date().getMonth() + 1;
                  // var date= new Date().getDate();
                  // var year = new Date().getFullYear();
                  
                  //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
                  // notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                  let d = new Date();
                  // notificationDate = d.setDate(d.getDate() + 4)
                  notificationDate = d.setMinutes(d.getMinutes() + 1);
                  // console.log(month, date)
                  message =  `${specificNotification.buyerName} has purchased ${specificNotification.name} for ${specificNotification.price} from your closet.${specificNotification.postOrNah == 'post' ? "Please use the in-app notification to mark when the item has been shipped." : "The buyer has chosen to collect this item in person. Please use the in-app chats feature to get in touch with the buyer."}`;
                  //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                  // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                  // console.log(message);
                  PushNotification.localNotificationSchedule({
                      message: message,// (required)
                      date: notificationDate,
                      vibrate: true,
                  });
              })
                  
          }

          else {
              console.log('doing nothing')
          }
          
      }
  }

  if(notificationsObj.purchaseReceipts) {
    for(var specificNotification of Object.values(notificationsObj.purchaseReceipts)) {
        if(specificNotification.localNotificationSent == false) {
            let localNotificationProperty = {};
            localNotificationProperty[`/Users/${specificNotification.uid}/notifications/purchaseReceipts/${specificNotification.key}/localNotificationSent/`] = true;
            let promiseToScheduleNotification = firebase.database().ref().update(localNotificationProperty);
            promiseToScheduleNotification.then( () => {
                // var month = new Date().getMonth() + 1;
                // var date= new Date().getDate();
                // var year = new Date().getFullYear();
                
                //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
                // notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                let d = new Date();
                // notificationDate = d.setDate(d.getDate() + 4)
                notificationDate = d.setMinutes(d.getMinutes() + 1);
                // console.log(month, date)
                message =  specificNotification.postOrNah == 'post' ? `Your product: ${specificNotification.name} is being posted over by ${specificNotification.sellerName}. Please contact us at nottmystyle.help@gmail.com if it does not arrive within 2 weeks.` : `Please get in touch with ${specificNotification.sellerName} regarding your acquisition of their ${specificNotification.name}.`
                //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                // console.log(message);
                PushNotification.localNotificationSchedule({
                    message: message,// (required)
                    date: notificationDate,
                    vibrate: true,
                });
            })
                
        }

        else {
            console.log('doing nothing')
        }
        
    }
}

    //TODO: Mirror this for itemSold notification


}

  logOut = () => {
    firebase.auth().signOut().then(() => {
      // var statusUpdate = {};
      // statusUpdate['Users/' + this.uid + '/status/'] = "offline";
      // await firebase.database().ref().update(statusUpdate);
      this.props.navigation.navigate('SignIn');
    })
  }

//   getComments(uid) {
//     console.log(uid);
//     const keys = [];
//     database.then( (d) => {
//       //get name of current user to track who left comments on this persons UserComments component  
//       // var insaanKaNaam = d.Users[firebase.auth().currentUser.uid].profile.name;  
//       // console.log(insaanKaNaam);
//       //get list of comments for specific product
//       // var date = (new Date()).getDate();
//       // var month = (new Date()).getMonth();
//       // var year = (new Date()).getFullYear();
//       // var comments = d.Users[uid].comments ? d.Users[uid].comments : {a: {text: noReviewsText, name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
//       // console.log(comments, typeof month, month);

//     })
//     .then( () => { console.log('here');this.setState( {isGetting: false} );  } )
//     .catch( (err) => {console.log(err) })
    
// }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  showActionSheet = () => {
    // console.log('adding Item')
    this.ActionSheet.show()

  }

  setGradient = (index) => {
    this.setState({gradient: this.gradientColors[index]})
  }

  navToEditProfile = () => {
    this.props.navigation.navigate('CreateProfile', {editProfileBoolean: true})
  }

  toggleMenu = () => {
    this.setState({isMenuActive: !this.state.isMenuActive})
  }

  render() {
    var {isGetting, comments, gradient} = this.state;
    // console.log(comments, 'the user has no comments, perfectly harmless');
    // const gradientColors = ["#a2f76c", "#1c3a09"]
    //kinda like this one
    // const gradientColors = ["#c8f966", "#307206", "#1c3a09"]; 
    const gradientColors = ["#c8f966", "#307206", highlightGreen]; 

    
    // const gradientColors = [limeGreen,lightGreen, treeGreen];
    // const gradientColors2 = ['#0a968f','#6ee5df', ];

    if(isGetting){
      return(
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}>
          <LoadingIndicator isVisible={isGetting} color={lightGreen} type={'Wordpress'}/>
        </View>
      )
    }
 

    return (
      <SafeAreaView style={styles.mainContainer}>
      

        <View style={styles.linearGradient}>
          
          <View style={styles.oval}/>
          
          
        
          <View style={styles.topContainer}>
            
          
            <View style={styles.iconColumn}>
              <Icon 
                name="settings" 
                size={30} 
                color={'black'}
                onPress={() => this.props.navigation.navigate('Settings')}

              />
              
            </View>  

            <View style={styles.profileColumn}>
              {this.state.uri ?
              <TouchableOpacity style={{...stampShadow}} onPress={this.navToEditProfile}>
                <ProgressiveImage 
                style= {styles.profilepic} 
                thumbnailSource={ require('../images/blank.jpg') }
                source={ {uri: this.state.uri} }
                
                />
              </TouchableOpacity> 
                : 
                <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>
              }
              
              <Text style={[styles.name, {textAlign: 'center'}]}>{this.state.name}</Text>

              <ProfileMinutia icon={'city'} text={this.state.country} />

              {this.state.insta ? <ProfileMinutia icon={'instagram'} text={`@${this.state.insta}`} /> : null}

              
            </View>  

            <View style={styles.iconColumn}>

              {this.state.isMenuActive ?
                <Icon 
                name={"chevron-down"} 
                size={40} 
                color={'#fff'}
                onPress={this.toggleMenu}
                
                />
              :
                <Icon 
                  name={"logout"} 
                  size={30} 
                  color={'#020002'}
                  onPress={this.toggleMenu}
                  
                />
              }
              
              {this.state.isMenuActive ? 
                
                <TouchableOpacity
                underlayColor={'transparent'} 
                onPress={this.logOut}  
                style={styles.popDownMenu}>
                <Text
                    
                  style={new avenirNextText('black', 13, "300")}>Log Out</Text>
                  
                  
                </TouchableOpacity>
                :
                null
                }
            </View>
                

          </View>
          
          
          <View style={styles.bottomContainer}>
              <ButtonContainer>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('YourProducts')}} style={[styles.blackCircle]}>
                  <Svg height={"60%"} width={"60%"} fill={'#fff'} viewBox="0 0 47.023 47.023">
                      <Path d="M45.405,25.804L21.185,1.61c-1.069-1.067-2.539-1.639-4.048-1.603L4.414,0.334C2.162,0.39,0.349,2.205,0.296,4.455
        L0.001,17.162c-0.037,1.51,0.558,2.958,1.627,4.026L25.848,45.38c2.156,2.154,5.646,2.197,7.8,0.042l11.761-11.774
        C47.563,31.494,47.561,27.958,45.405,25.804z M8.646,14.811c-1.695-1.692-1.696-4.435-0.005-6.13
        c1.692-1.693,4.437-1.693,6.13-0.003c1.693,1.692,1.694,4.437,0.003,6.129C13.082,16.501,10.338,16.501,8.646,14.811z
        M16.824,22.216c-0.603-0.596-1.043-1.339-1.177-1.797l1.216-0.747c0.157,0.48,0.488,1.132,0.997,1.634
        c0.548,0.541,1.061,0.6,1.403,0.256c0.324-0.329,0.26-0.764-0.152-1.618c-0.575-1.17-0.667-2.219,0.091-2.987
        c0.888-0.9,2.32-0.848,3.565,0.38c0.594,0.588,0.908,1.146,1.083,1.596l-1.216,0.701c-0.111-0.309-0.34-0.831-0.857-1.341
        c-0.518-0.51-0.999-0.522-1.269-0.247c-0.333,0.336-0.182,0.778,0.246,1.708c0.59,1.265,0.549,2.183-0.183,2.928
        C19.696,23.566,18.272,23.645,16.824,22.216z M22.596,27.758l0.929-1.756l-1.512-1.493l-1.711,0.985l-1.238-1.223l6.82-3.686
        l1.566,1.547l-3.572,6.891L22.596,27.758z M24.197,29.337l5.207-5.277l1.2,1.183l-4.221,4.273l2.099,2.072l-0.989,1.002
        L24.197,29.337z M35.307,31.818l-2.059-2.032l-1.083,1.096l1.942,1.917l-0.959,0.972l-1.941-1.917l-1.235,1.251l2.168,2.142
        l-0.965,0.979l-3.366-3.322l5.209-5.276l3.255,3.215L35.307,31.818z" stroke="#fff" strokeWidth="0.8"/>
                      <Path d="M23.068,23.788l1.166,1.151l1.499-2.741C25.347,22.434,23.068,23.788,23.068,23.788z" stroke="#fff" strokeWidth="0.8"/>
                  </Svg>
                </TouchableOpacity>
              </ButtonContainer>

              <ButtonContainer>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('Sell')}} style={styles.whiteCircle}>
                  <Icon name={'plus'} size={60} color='black'/>
                </TouchableOpacity>
              </ButtonContainer>

              <ButtonContainer>
                <TouchableOpacity onPress={() => {this.props.navigation.navigate('SoldProducts')}} style={styles.blackCircle}>
                  <Text style={{fontFamily: 'Avenir Next', fontWeight: "700", fontSize: 16, color:'#fff'}}>SOLD</Text>
                </TouchableOpacity>
              </ButtonContainer>

          </View>

          


      </View>
      
      {/* <Svg height="50%" width="50%" viewBox="0 0 100 100">
          <Circle
            cx={width}
            cy={400}
            r="30"
            fill="green"
            stroke="#C5CACD"
            strokeWidth="2"
          />
        </Svg> */}

      
      {/* <View style={styles.midContainer}>
        
          <View style={[styles.numberCard, {borderRightWidth: 1}]}>
            <Text onPress={() => {this.props.navigation.navigate('YourProducts')}} style={styles.numberProducts}>{this.state.numberProducts}</Text>
            <Text onPress={() => {this.props.navigation.navigate('YourProducts')}} style={styles.subText}>ON SALE</Text>
          </View>

          

          <View style={[styles.numberCard, {borderLeftWidth: 1}]}>
            <Text onPress={() => {this.props.navigation.navigate('SoldProducts')}} style={styles.numberProducts}>{this.state.soldProducts} </Text>
            <Text onPress={() => {this.props.navigation.navigate('SoldProducts')}} style={styles.subText}>SOLD</Text>
          </View>    
        
      </View> */}
      
      
      <View style={styles.footerContainer} >
      {/* Reviews Section contained within this flex-box */}
      <ScrollView style={styles.halfPageScrollContainer} contentContainerStyle={styles.halfPageScroll}>
          <View style={ {backgroundColor: '#fff'} }>
          <Text style={styles.reviewsHeader}>REVIEWS</Text>
          {this.state.noComments ? null : Object.keys(comments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>

                      <View style={styles.commentPicAndTextRow}>

                        {comments[comment].uri ?
                        <TouchableHighlight
                        onPress={()=>this.navToOtherUserProfilePage(comments[comment].uid)}
                        style={styles.commentPic}
                        >
                          <ProgressiveImage 
                            style= {styles.commentPic} 
                            thumbnailSource={ require('../images/blank.jpg') }
                            source={ {uri: comments[comment].uri} }
                          />
                        </TouchableHighlight>                          
                        :
                          <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
                        }
                          
                        <TouchableOpacity onPress={()=>this.navToOtherUserProfilePage(comments[comment].uid)} style={styles.textContainer}>
                            <Text style={ styles.commentName }> {comments[comment].name} </Text>
                            <Text style={styles.comment}> {comments[comment].text}  </Text>
                        </TouchableOpacity>

                      </View>

                      <View style={styles.commentTimeRow}>

                        <Text style={ styles.commentTime }> {comments[comment].time} </Text>

                      </View>

                      

                      {/* {comments[comment].uri ? <View style={styles.separator}/> : null} */}
                      
                  </View>
                  
              )
                      
              )}
          </View>
        </ScrollView> 

      </View>

            

      </SafeAreaView>
      


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
    padding: 10,
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
    flex: 0.7,
    // overflow: 'hidden',
    // position: "relative",
    // backgroundColor: "#c8f966",
    //backgroundColor: 'red',
    // borderWidth:2,
    // borderColor:'black',
    
    // alignSelf: 'center',
    // width: width,
    // overflow: 'hidden', // for hide the not important parts from circle
    // height: 175,
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

  topContainer: {
    flexDirection: 'row',
    flex: 0.65
  },

  bottomContainer: {
    flex: 0.35,    
    flexDirection: 'row'
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

  oval: {
    // marginTop: "10%",
    // marginTop: width/3,
    width: width,
    height: "100%",
    borderBottomLeftRadius: width,
    borderBottomRightRadius: width,
    //backgroundColor: 'red',
    // borderWidth:2,
    // borderColor:'black',
    position: "absolute",
    transform: [
      {scaleX: 2}
    ],
    // top: 10,
    backgroundColor: yellowGreen
  },

  iconColumn: {
    flex: 0.25,
    // justifyContent: 'flex-start',
    alignItems: 'center',
    margin: 10,
    // marginVertical: 25,
    // backgroundColor: 'red'
    // height: 150,
  },

  profileColumn: {
    flex: 0.5,
    marginTop: 25,
    justifyContent: 'center',
    alignItems: 'center',
    // marginVertical: 20
  },

  triangle: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 25,
    borderRightWidth: 25,
    borderBottomWidth: 50,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: 'white'
  },

  popDownMenu: {
    width: 55,
    height: 35,
    borderRadius: 8,
    borderWidth: 0.3,
    backgroundColor: "white",
    justifyContent: 'center',
    alignItems: 'center'
  },

  gearAndPicColumn: {
    flex: 0.6818,
    flexDirection: 'column',
    // flex: 1.0,
    // flexDirection: 'row',
    // justifyContent: 'space-evenly',
    // alignItems: 'center',
    marginTop: 20,
    // width: width - 40,
    // paddingRight: 0,
    // backgroundColor: 'blue',
    // width: width
  },

  gearRow: {
    flex: 0.2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    // alignContent: 'flex-start',
    // backgroundColor: 'white'
  },

  picRow: {
    width: 250,
    flex: 0.8,
    // flexDirection: 'row',
    justifyContent: 'center',
    // alignContent: 'flex-start',
    // height: height/5,
    // backgroundColor: 'yellow'
    // alignItems: 'flex-start',
  },

  profileTextColumn: {
    flex: 0.318,
    flexDirection: 'column',
    alignItems: 'center',
    // paddingTop: 15,
    // backgroundColor: 'red'

  },

  blackCircle: {
    marginBottom: 10,
    width: 65,
    height: 65,
    borderRadius: 32.5,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    // ...stampShadow,
  },

  whiteCircle: {
    marginTop: 15,
    width: 70,
    height: 70,
    borderRadius: 35,
    // padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderColor: 'black',
    borderWidth: 4
  },

  subText: {
    fontFamily: 'Avenir Next',
    fontSize: 18,
    fontWeight: '400',
    color: graphiteGray,
  },

  footerContainer: {
    flex: 0.3,
    flexDirection: 'column',
    padding: 2,
    backgroundColor: '#fff'
  },

  headerBackground: {
    flex: 1,
    width: null,
    alignSelf: 'stretch',
    justifyContent: 'space-between'
  },

  gear: {
    flex: 0,
    paddingRight: 60
  },
  users: {
    flex: 0,
    paddingLeft: 60,
    paddingRight: 0,
    marginLeft: 0
  },
  
  profilepicWrap: {
    backgroundColor: 'black',
    width: 130,
    height: 130,
    borderRadius: 65,
    borderColor: 'rgba(0,0,0,0.4)',
    borderWidth: 0,
  },
  profilepic: {
    //flex: 1,
    width: 130,
    height: 130,
    alignSelf: 'center',
    borderRadius: 65,
    borderColor: '#fff',
    borderWidth: 0,
    ...stampShadow,
    // opacity: 0.1
  },
  
  numberProducts: {
    fontFamily: avenirNext,
    fontSize: 28,
    color: graphiteGray,
    fontWeight: 'normal'
  },
  soldProducts: {
    fontFamily: avenirNext,
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold'
  },

  name: {
    ...textStyles.generic,
    marginTop: 10,
    fontSize: 18,
    color: 'black'
  },
  pos: {
    ...textStyles.generic,
    fontWeight: "200"
    // fontStyle: 'italic'
  },
  insta: {
    ...textStyles.generic,
    fontWeight: "200"
    // fontStyle: 'italic'
  },

  companyLogoContainer: {
    justifyContent: 'center',
    alignContent: 'center',
    backgroundColor: '#122021',
  },
  companyLogo: {
    //resizeMode: 'container',
    borderWidth:1,
    borderColor:'#207011',
    alignItems:'center',
    justifyContent:'center',
    width:40,
    height:40,
    backgroundColor:'#fff',
    borderRadius:0,
    borderWidth: 2,
    marginLeft: (width/4)-10,
    paddingLeft: 25,
    paddingRight: 25

}, 
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
  shadowOpacity: 0.5,
  shadowRadius: 1.3,
  shadowColor: 'black',
  shadowOffset: {width: 0, height: 0},
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

rowContainer: {
  flexDirection: 'column',
  padding: 14
},

textContainer: {
flex: 1,
flexDirection: 'column',
padding: 5,
},

separator: {
width: width,
height: 2,
backgroundColor: '#111110'
},  

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


