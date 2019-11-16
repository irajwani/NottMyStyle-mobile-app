import React, { Component } from 'react';
import { Platform, TouchableWithoutFeedback, Keyboard, Animated, ScrollView, SafeAreaView, View, Text, TextInput, Image, TouchableHighlight, TouchableOpacity, Modal, Dimensions, StyleSheet, Linking, WebView } from 'react-native';

import PushNotification from 'react-native-push-notification';
// import {initializePushNotifications} from '../Services/NotificationService'

// import {Button  as RNButton} from 'react-native';
import {Button} from 'react-native-elements';

import { withNavigation } from 'react-navigation';
import firebase from '../cloud/firebase';

import ProgressiveImage from '../components/ProgressiveImage';
import CustomCarousel from '../components/CustomCarousel';
import FullScreenCarousel from '../components/FullScreenCarousel';
// import CustomComments from '../components/CustomComments';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import styles from '../styles.js'
// import { database } from '../cloud/database';
// import { Divider } from 'react-native-elements';

import { iOSColors } from 'react-native-typography';
// import { PacmanIndicator } from 'react-native-indicators';

import Chatkit from "@pusher/chatkit-client";

import {Config} from '../Config';
import { CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT, CHATKIT_SECRET_KEY } from '../credentials/keys.js';
import email from 'react-native-email';
import { almostWhite,lightGreen, highlightGreen, treeGreen, graphiteGray, rejectRed, darkBlue, profoundPink, aquaGreen, bobbyBlue, mantisGreen, logoGreen, lightGray } from '../colors';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import BackButton from '../components/BackButton';
import { avenirNextText, delOpt, deliveryOptions } from '../constructors/avenirNextText';
import { WhiteSpace, LoadingIndicator, CustomTouchableO } from '../localFunctions/visualFunctions';
import NottLogo from '../../nottLogo/ios/NottLogo.js';
import { textStyles } from '../styles/textStyles';

import { ifIphoneX } from 'react-native-iphone-x-helper'


var {height, width} = Dimensions.get('window');

const limeGreen = '#2e770f';
// const profoundPink = '#c64f5f';
const modalAnimationType = "slide";
const paymentScreensIconSize = 45;
const payPalEndpoint = Config.API_URL;
// const payPalEndpoint = "https://localhost:5000";

const inputRange = [0, 160, 280];

const chatIcon = {
  title: 'Chat',
  color: 'black',
  type:{name: 'message-text', type: 'material-community'}
};

const addressFields = [
  {key: "fullName", header: "Full Name", placeholder: "e.g. Angelina Capato"},
  {key: "addressOne" , header: "Address Line 1" , placeholder: "e.g. House 133"},
  {key: "addressTwo" , header: "Address Line 2" , placeholder: "e.g. Raleigh Park"},
  {key: "postCode" , header: "Postcode" , placeholder: "e.g. NG71NY"},
  {key: "city" , header: "City" , placeholder: "e.g. Nottingham"},
];


const paymentText = "Pay with PayPal";
const successfulTransactionText = "Your transaction has been processed successfully.";
const cancelTransactionText = "Transaction Canceled."
const chatButtonWidth = 210;
const paymentButtonWidth = 200;


function removeFalsyValuesFrom(object) {
  const newObject = {};
  Object.keys(object).forEach((property) => {
    if (object[property]) {newObject[property] = object[property]}
  })
  return Object.keys(newObject);
}

const DismissKeyboardView = ({children}) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
  </TouchableWithoutFeedback>
)

const SelectedOptionBullet = () => (
  <View style={{width: 20, height: 20, borderRadius: 10, backgroundColor: 'black'}}/>
)

class ProductDetails extends Component {

  constructor(props){
    super(props);
    this.state = {
      isGetting: true,
      cloudDatabaseUsers: false,
      currency: this.props.navigation.state.params.currency,
      profile: {
        name: '',
        email: '',
      },
      collectionKeys: this.props.navigation.state.params.collectionKeys ? this.props.navigation.state.params.collectionKeys : [3],
      likes: this.props.navigation.state.params.data.text.likes,
      showFullDescription: false,
      productComments: '',
      showPictureModal: false,
      showReportUserModal: false,
      report: '',
      //Purchase Modal Stuff
      showPurchaseModal: false,
      activeScreen: "initial",
      deliveryOptions: [
        {text: "Collection in person", selected: false, options: ["Contact via Chat", "OR",  paymentText], },
        {text: "Postal Delivery", selected:false}
      ],
      fullName: "",
      addressOne: "",
      addressTwo: "",
      postCode: "",
      city: "",
      selectedAddress: "",
      //PayPal Modal stuff
      sku: '',
      price: '',
      name: '',
      description: '',
      paymentStatus: "pending",
      postOrNah: 'post',

      //Ability to chat with individual selling this product
      canChatWithOtherUser: false,

      //stylistic stuff
      scrollY: new Animated.Value(0)
    }
  }

  async componentDidMount() {
    const {params} = this.props.navigation.state;
    await this.initializePushNotifications();
    setTimeout(() => {
      this.getUserAndProductAndOtherUserData(params.data);
    }, 4);

    setInterval(() => {
      this.getUserAndProductAndOtherUserData(params.data);
    }, 10000);

  }

  initializePushNotifications = () => {
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

  // componentDidUpdate = () => {
  //   const {...state} = this.state;
  //   if(state.paymentStatus == "success") {
  //     const {params} = this.props.navigation.state;
  //     this.getUsersAndProductAndOtherUserData(params.data);
  //   }
      
  // }


  getUserAndProductAndOtherUserData(data) {
    firebase.database().ref().once("value", (snapshot) => {
      console.log('Preparing Product Details')
      var d = snapshot.val();
      var cloudDatabaseUsers = d.Users;
      // console.log("OVER HEREEEE:" + cloudDatabaseUsers[data.uid].products[data.key].uris.thumbnail);
      const uid = firebase.auth().currentUser.uid;
      const otherUserUid = data.uid;
      
      var seller = cloudDatabaseUsers[otherUserUid], views = 0;

      //get current user's profile info
      const yourProfile = d.Users[uid].profile;

      //get profile info of seller of product
      const profile = d.Users[data.uid].profile;

      var chats = d.Users[uid].conversations ? d.Users[uid].conversations : false;
      chats ? chats = Object.values(chats) : null;
      var chat = chats ? chats.find( (chat) => {return chat.name == `${data.key}.${uid}`} ) : false;
      //In case, the conversation for this particular product between these particular buyers and sellers
      //has not begun yet, we move on.
      chat = chat == undefined ? false : chat
      // console.log(chat);
      //get keys of current user's products
      // var productKeys = d.Users[uid].products ? Object.keys(d.Users[uid].products) : [];

      /////BELIEVE THESE TO BE UNNECESSARY AS OTHER_USER_PROFILE_PAGE LOADS THEM INDEPENDENTLY A PARTICULAR UID.
      //get usersBlocked for current user
      var rawUsersBlocked = d.Users[uid].usersBlocked ? d.Users[uid].usersBlocked : false;
      var usersBlocked = rawUsersBlocked ? removeFalsyValuesFrom(rawUsersBlocked) : [];
      var canChatWithOtherUser = usersBlocked.includes(data.uid) ? false : true;
      // console.log(yourUsersBlocked);

      //get collection keys of current user
      // var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      // var rawCollection = collection ? collection : {}
      // var collectionKeys = removeFalsyValuesFrom(rawCollection);  

      // var soldProducts = 0;

      // //get profile data of seller of product
      // for(var p of Object.values(d.Users[data.uid].products)) {
      //   if(p.sold) {
      //     soldProducts++
      //   }
      // }
      
      // var numberProducts = Object.keys(d.Users[data.uid].products).length

      var date = (new Date()).getDate();
      var month = (new Date()).getMonth();
      var year = (new Date()).getFullYear();


      //TODO: Need to possibly unmute; muted as comments are not set in state
      // var comments;
      // if(d.Users[data.uid].comments) {
      //   comments = d.Users[data.uid].comments;
      // }
      // else {
      //   comments = {a: {text: 'Write a review for this seller using the comment field below.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
      // }


      //  = d.Users[data.uid].comments ? d.Users[data.uid].comments : {a: {text: 'No Reviews have been left for this seller.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
      
      // var productComments = d.Users[data.uid].products[data.key].comments ? d.Users[data.uid].products[data.key].comments : {a: {text: 'No Reviews have been left for this product yet.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' } };
      if(seller.products[data.key] != undefined) {
        var productComments = seller.products[data.key].text.comments ? seller.products[data.key].text.comments : {a: "nothing"};

        //TODO: iOS
        //check if usersVisited array deserves an addition
        if(seller.products[data.key].usersVisited == '') {
          let update = {};
          update[`/Users/${otherUserUid}/products/${data.key}/usersVisited/${uid}/`] = true;
          firebase.database().ref().update(update);
        }

        else {

          views = Object.values(seller.products[data.key].usersVisited).filter((u)=> {return u == true }).length;

          if(!Object.keys(seller.products[data.key].usersVisited).includes(uid)) {
            let update = {};
            update[`/Users/${otherUserUid}/products/${data.key}/usersVisited/${uid}/`] = true;
            firebase.database().ref().update(update);
          }
          
        }
        //TODO: iOS
        
      }
      
      //When this component launches for the first time, we want to retrieve the person's addresses from the cloud (if they have any)
      //When this function is run everytime after
      var addresses = false;
      addresses = this.state.addresses ? d.Users[uid].addresses.length != this.state.addresses.length ? d.Users[uid].addresses : this.state.addresses : d.Users[uid].addresses ? d.Users[uid].addresses : false
      // !this.state.addresses && d.Users[uid].addresses ?
      //   addresses = d.Users[uid].addresses
      //   :
      //   null
      // console.log(addresses, typeof addresses);
      // console.log("KEY IS:", data.key)
      // console.log("Picture Is: " + cloudDatabaseUsers[data.uid].products[data.key].uris.thumbnail[0]);
      this.setState( {
        isGetting: false,
        cloudDatabaseUsers,
        yourProfile, uid, otherUserUid, profile, productComments, addresses,
        productPictureURLs: cloudDatabaseUsers[data.uid].products[data.key].uris.thumbnail,
        sold: data.text.sold,
        price: data.text.price, name: data.text.name, sku: data.key, description: data.text.description.replace(/ +/g, " ").substring(0,124),
        views, //TODO: iOS
        chat,
        totalPrice: Number(data.text.price) + Number(data.text.post_price),
        canChatWithOtherUser,
      } )
    })
    
  }

  incrementLikes = (likes, key) => {
    
    //here uid refers to uid of seller so the number of likes for their product may be affected
    //func applies to scenario when heart icon is gray
    //add like to product, and add this product to user's collection; if already in collection, modal shows user
    //theyve already liked the product
      //add to current users WishList
      //add a like to the sellers likes count for this particular product
      //unless users already liked this product, in which case, dont do anything
      // if(this.state.collectionKeys.includes(key) == true) {
      //   // console.log('show modal that users already liked this product')
      //   alert("This product is already in your Wish List.")
      // } 
      // else {
        // this.setState({isGetting: true});
        var userCollectionUpdates = {};
        userCollectionUpdates['/Users/' + this.state.uid + '/collection/' + key + '/'] = true;
        let promiseToUpdateCollection = firebase.database().ref().update(userCollectionUpdates);
        //since we don't want the user to add another like to the product,
        //tack on his unique contribution to the seller's product's total number of likes
        var updates = {};
        likes += 1;
        var postData = likes;
        updates['/Users/' + this.state.otherUserUid + '/products/' + key + '/text/likes/'] = postData;
        let promiseToUpdateProductLikes = firebase.database().ref().update(updates);
        Promise.all([promiseToUpdateCollection, promiseToUpdateProductLikes])
        .then( () => {
          const {...state} = this.state;
          
          //for a little time simulate the goal of this function having been achieved,
          //by locally changing the state to reflect as such
          state.likes += 1;
          // state[specificArrayOfProducts][key].text.likes += 1;
          state.collectionKeys.push(key);
          this.setState(state);
          // setTimeout(() => {
          //   this.getMarketPlace(this.state.uid);  
          // }, timeToRefreshAfterLikeOrUnlike);
          
          // alert("This product has been added to your WishList 💕.");
        })
        //locally reflect the updated number of likes and updated collection of the user,
        // by re-pulling data from the cloud
        // setTimeout(() => {
        //   this.getPageSpecificProducts();  
        // }, timeToRefresh);
        
        

        ////
        // const {productsl, productsr} = this.state;
        
        // productsl.forEach( (product) => {
        //   if(product.key == key) {
        //     product.text.likes += 1;
        //   } 
        //   return null;
        // })

        // productsr.forEach( (product) => {
        //   if(product.key == key) {
        //     product.text.likes += 1;
        //   }
        //   return null;
        // })
        // //need to also append it to your list of collection keys

        // this.setState({ productsl, productsr } );
        //////
        


      
      
    
  }

  decrementLikes = (likes, key) => {
    //this func applies when heart icon is red
    // console.log('decrement number of likes');
    // if(this.state.collectionKeys.includes(key) == true) {
      var userCollectionUpdates = {};
      // let promiseToUpdateCollection = firebase.database().ref().update(userCollectionUpdates);
      userCollectionUpdates['/Users/' + this.state.uid + '/collection/' + key + '/'] = false;
      let promiseToUpdateCollection = firebase.database().ref().update(userCollectionUpdates);
      //ask user to confirm if they'd like to unlike this product
      var updates = {};
      likes -= 1;
      var postData = likes;
      updates['/Users/' + this.state.otherUserUid + '/products/' + key + '/text/likes/'] = postData;
      let promiseToUpdateProductLikes = firebase.database().ref().update(updates);
      Promise.all([promiseToUpdateCollection, promiseToUpdateProductLikes])
      .then( () => {
        const {...state} = this.state;
        
        //for a little time simulate the goal of this function having been achieved,
        //by locally changing the state to reflect as such
        state.likes -= 1;
        state.collectionKeys = state.collectionKeys.filter( collectionKey => collectionKey != key );
        this.setState(state);
        // setTimeout(() => {
        //   this.getMarketPlace(this.state.uid);  
        // }, timeToRefreshAfterLikeOrUnlike);
        
        // alert("This product has been added to your WishList 💕.");
      })
    

    // else {
    //   alert('One sec, the marketplace is probably refreshing\n. Like, basically you cannot unlike a product you have not liked yet, you know.' );
    // }

  }

  setSaleTo(soldStatus, uid, productKey, isBuyer = false) {
    var updates={};
    // var postData = {soldStatus: soldStatus, dateSold: Date.now()}
    updates['/Users/' + uid + '/products/' + productKey + '/text/sold/'] = soldStatus;
    updates['/Users/' + uid + '/products/' + productKey + '/text/dateSold/'] = new Date;
    // updates['Users/' + uid + '/products/' + productKey + '/sold/'] = soldStatus;
    firebase.database().ref().update(updates);
    //just alert user this product has been marked as sold, and will show as such on their next visit to the app.
    var status = soldStatus ? 'sold' : 'available for purchase'
    isBuyer ? null : alert(`Product has been marked as ${status}.\n If you wish to see the effects of this change immediately,\n please go back to the Market`)

  }

  // navToComments(uid, productKey, text, name, uri) {
  //   console.log('navigating to Comments section')
  //   this.props.navigation.navigate('Comments', {likes: text.likes, uid: uid, productKey: productKey, uri: uri, text: text, time: text.time, name: name})
  // }

  findRoomId(rooms, desiredRoomsName) {
    for(var room of rooms ) {
      
      if(room.name === desiredRoomsName) {return room.id}
    }
  }

  navToEditItem(item) {
    this.props.navigation.navigate('CreateItem', {
      data: item, //possibly unnecessary
      pictureuris: item.uris.source, 
      price: item.text.price, 
      original_price: item.text.original_price, 
      post_price: item.text.post_price > 0 ? item.text.post_price : 0,
      condition: item.text.condition,
      type: item.text.type,
      size: item.text.size,
      editItemBoolean: true,
      isComingFrom: 'productDetails',
    });
    // alert('Please take brand new pictures');
  }

  navToChat(uid, key) {
    
    this.setState({navToChatLoading: true});
    console.log('ATTEMPTING TO NAVIGATE TO CHAT');

    const {chat} = this.state;

    // console.log(key);
    //create separate Chats branch
    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;

    const tokenProvider = new Chatkit.TokenProvider({
      url: CHATKIT_TOKEN_PROVIDER_ENDPOINT,
      // query: {
      //   user_id: CHATKIT_USER_NAME
      // }
    });
  
    // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
    // For the purpose of this example we will use single room-user pair.
    const chatManager = new Chatkit.ChatManager({
      instanceLocator: CHATKIT_INSTANCE_LOCATOR,
      userId: CHATKIT_USER_NAME,
      tokenProvider: tokenProvider
    });
  
    chatManager.connect().then(currentUser => {
      
      this.currentUser = currentUser;
      this.currentUser.joinRoom({
        roomId: "15868783" //Users
      })
      .then(() => {
        console.log('Added user to room')
      })
      .catch(err => {
        console.log(`Couldn't join room because: ${err}`)
      })

      // if(!this.state.chat) {

      // }
      // console.log(this.currentUser.rooms);
      
      //create a new room for specifically for this buyer, seller and product & navigate to the chat room
      //unless the room already exists, in which case, just navigate to it

      //old condition: this.currentUser.rooms.length > 0 && roomExists.length > 0
      
      // var roomExists = this.currentUser.rooms.filter(room => (room.name == desiredRoomsName));

      if(this.state.chat) {
        // console.log('no need to create a brand new room');
        const {productSellerId, id, buyer, seller, buyerAvatar, sellerAvatar, buyerIdentification, sellerIdentification} = this.state.chat;
        this.setState({navToChatLoading: false});
        // this.props.navigation.navigate( 'CustomChat', {id: this.findRoomId(this.currentUser.rooms, desiredRoomsName)} )
        this.props.navigation.navigate('CustomChat', {productSellerId, id, buyer, buyerAvatar, seller, sellerAvatar, buyerIdentification, sellerIdentification })

      }
      else {
        //TODO: account for navigation transition
        var desiredRoomsName = key + '.' + CHATKIT_USER_NAME
        this.currentUser.createRoom({
          //base the room name on the following pattern: product key + dot + buyers uid
          name: desiredRoomsName,
          private: false,
          addUserIds: [uid]
        })
        .then(room => {

          // var {cloudDatabaseUsers} = this.state;
          var lastMessageText = false, lastMessageSenderIdentification = false, lastMessageDate = false;
          // var buyerIdentification = CHATKIT_USER_NAME;
          // var buyer = cloudDatabaseUsers[buyerIdentification].profile.name;
          // var buyerAvatar = cloudDatabaseUsers[buyerIdentification].profile.uri;
          // var sellerIdentification = uid;
          // var seller = cloudDatabaseUsers[sellerIdentification].profile.name;
          // var sellerAvatar = cloudDatabaseUsers[sellerIdentification].profile.uri;
          // var productIdentification = room.name.split(".")[0];
          // var productImageURL = cloudDatabaseUsers[sellerIdentification].products[productIdentification].uris[0]

          var newConversationUpdate = {};
          var newConversation = { 
                  productSellerId: uid, productImageURL: this.props.navigation.state.params.data.uris.thumbnail[0], 
                  createdByUserId: CHATKIT_USER_NAME, name: room.name, id: room.id, 
                  buyerIdentification: CHATKIT_USER_NAME, sellerIdentification: uid,
                  seller: this.state.profile.name, sellerAvatar: this.state.profile.uri, 
                  buyer: this.state.yourProfile.name, buyerAvatar: this.state.yourProfile.uri,
                  lastMessage: {lastMessageText, lastMessageDate, lastMessageSenderIdentification},
                  unread: false,
                  presence: "offline", //isUserInChatRoom
                };
          newConversationUpdate['/Users/' + CHATKIT_USER_NAME + '/conversations/' + room.id + '/'] = newConversation; 
          firebase.database().ref().update(newConversationUpdate);
          
          newConversationUpdate['/Users/' + uid + '/conversations/' + room.id + '/'] = newConversation; 
          firebase.database().ref().update(newConversationUpdate);
          // console.log(`Created room called ${room.name}`)
          this.setState({navToChatLoading: false});
          //TODO: next line is untested
          this.props.navigation.navigate('CustomChat', {productSellerId: this.state.otherUserUid, id: room.id, buyer: this.state.yourProfile.name, buyerAvatar: this.state.yourProfile.uri, seller: this.state.profile.name, sellerAvatar: this.state.profile.uri, buyerIdentification: this.state.uid, sellerIdentification: this.state.otherUserUid })
          // this.props.navigation.navigate( 'CustomChat', {id: this.findRoomId(this.currentUser.rooms, desiredRoomsName)} )
        })
        .catch(err => {
          console.log(`Error creating room ${err}`)
        })
      }
      
      
    });
  }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navToProductComments = (productInformation) => {
    const {yourProfile, profile, productComments, otherUserUid, sku} = this.state;
    // console.log("SKU IS", sku);
    this.props.navigation.navigate('ProductComments', {
      productInformation: productInformation, 
      key: sku,
      // key: productInformation.key, 
      comments: productComments['a'] ? false : productComments, 
      yourProfile: yourProfile, theirProfile: profile, uid: productInformation.uid 
    });
  }



  reportItem = (yourInformation, productInformation) => {
    const recipients = ['nottmystyle.help@gmail.com'] // string or array of email addresses
    const {report} = this.state
    const {uid, key, text,} = productInformation
    const {name} = text
    email(recipients, {
        // Optional additional arguments
        //cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
        //bcc: 'mee@mee.com', // string or array of email addresses
        subject: `Report regarding product: ${key} from User: ${uid}` ,
        body: report + '\n' + 'Cheers!\n' + yourInformation.name
    })
    .catch(console.error)
  }

  renderReportUserModal = () => {
    {/* Modal to input Report about product */}
    return (
      <Modal
      animationType="slide"
      transparent={false}
      visible={this.state.showReportUserModal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}
      >
        <DismissKeyboardView>
            <View style={{flex: 1, marginTop: Platform.OS == "ios" ? 22 : 0}}>
                <View style={styles.deliveryOptionHeader}>
                  <FontAwesomeIcon
                  name='arrow-left'
                  size={28}
                  color={'black'}
                  onPress = {() => { 
                    this.setState( {showReportUserModal: false} )
                  }}
                  />
              
                  <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
                  
      
                  <FontAwesomeIcon
                    name='close'
                    size={28}
                    color={logoGreen}
                    
                    />
                </View>
                <View style={[styles.reportModal, {flex: 0.9}]}>
                  <Text style={styles.reportModalHeader}>Please Explain What You Wish To Report About This Product</Text>
                  <TextInput
                      style={styles.reportInput}
                      onChangeText={(report) => this.setState({report})}
                      value={this.state.report}
                      multiline={true}
                      numberOfLines={4}
                      underlineColorAndroid={"transparent"}
                  />
                  <Button
                      title='Send' 
                      titleStyle={{ fontWeight: "300" }}
                      buttonStyle={{
                      backgroundColor: highlightGreen,
                      //#2ac40f
                      width: 90,
                      height: 40,
                      borderColor: "#fff",
                      borderWidth: 1,
                      borderRadius: 20,
                      }}
                      containerStyle={{ marginTop: 0, marginBottom: 0 }}
                      onPress={() => {this.reportItem(this.state.yourProfile, data)}} 
                  />
                  
                  
                </View>
            </View>
          </DismissKeyboardView>
      </Modal>
    )
  }

  onChange = (text, key) => {
    //For address fields in addAddress
    this.state[key] = text;
    this.setState(this.state);
  }

  addAddress = () => {
    const {fullName, addressOne, addressTwo, postCode, city} = this.state;
    var postData = {
      fullName,
      addressOne,
      addressTwo,
      postCode,
      city,
      selected: false
    };
    var updates = {};
    
    updates['/Users/' + this.state.uid + '/addresses/' + Date.now() + '/'] = postData;
    firebase.database().ref().update(updates);
    this.goToPreviousPage();
    // this.getUserAndProductAndOtherUserData();
    // this.setState({isGetting: true});
  }

  proceedToPayment = (postOrNah) => {
    this.setState({activeScreen: 'paypalModal', postOrNah: postOrNah});
  }

  handleResponse = (data) => {
    if(data.title == "success") {
      // console.log('Payment was successful. React Native knows we are viewing index.ejs page');
      // this.initializePushNotifications();
      let productAcquisitionPostData = {
        name: this.state.name, uri: this.props.navigation.state.params.data.uris.thumbnail[0],
        price: this.state.postOrNah == 'post' ? this.state.totalPrice : this.state.price,
        sellerId: this.state.otherUserUid,
        sellerName: this.state.profile.name,
        buyerId: this.state.uid,
        buyerName: this.state.yourProfile.name,
        address: this.state.selectedAddress,  
        // TODO: address: this.state.postOrNah == 'post' ? this.state.selectedAddress : false,
        //the message should be different for buyer and seller, so we handle that in SignIn.js

        //deliveryStatus
        deliveryStatus: 'pending',

        //as this is a new notification, mark it as unread

        //check if this notification will at least contribute to being unread
        unreadCount: true,

        //boolean to later handle notification
        localNotificationSent: false,
        
        //boolean to control what the notification message will look for buyer and seller
        postOrNah: this.state.postOrNah,

        //handleLongPress property
        selected: false

      };
      // console.log(productAcquisitionPostData);
      let productAcquisitionUpdate = {};
      let buyerRef = `/Users/${this.state.uid}/notifications/purchaseReceipts/${this.state.sku}/`;
      let sellerRef = `/Users/${this.state.otherUserUid}/notifications/itemsSold/${this.state.sku}/`;
      productAcquisitionUpdate[buyerRef] = productAcquisitionPostData;
      productAcquisitionUpdate[sellerRef] = productAcquisitionPostData;
      
      // let promiseToUpdateSeller = firebase.database().ref().update(productAcquisitionNotificationUpdate);

      
    // var postData = {soldStatus: soldStatus, dateSold: Date.now()}
      productAcquisitionUpdate['Users/' + this.state.otherUserUid + '/products/' + this.state.sku + '/text/sold/'] = true;
      productAcquisitionUpdate['Users/' + this.state.otherUserUid + '/products/' + this.state.sku + '/text/dateSold/'] = new Date;
      // updates['Users/' + uid + '/products/' + productKey + '/sold/'] = soldStatus;
      // let promiseToSetProductAsSold = firebase.database().ref().update(updates);
    //just alert user this product has been marked as sold, and will show as such on their next visit to the app.
      let promiseToUpdateBuyerAndSellerAndSetProductAsSold = firebase.database().ref().update(productAcquisitionUpdate);
      promiseToUpdateBuyerAndSellerAndSetProductAsSold
      .then( () => {
        this.setState({activeScreen: "afterPaymentScreen", paymentStatus: "success"}, ()=> {
          
          const {params} = this.props.navigation.state;
          // console.log("OVER HEREEEEE, Rendering After Payment Screen" + params.data);
          this.getUserAndProductAndOtherUserData(params.data);

          // console.log("Notifications updated for buyer and seller")
          // send notification 1 hour later
          let notificationDate = new Date();
          notificationDate.setMinutes(notificationDate.getMinutes() + 2);
  
          //         //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
          //         // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
          //         // console.log(message);
          let message = this.state.postOrNah == 'post' ? `Your product: ${this.state.name} is being posted over by ${this.state.profile.name}. Please contact us at nottmystyle.help@gmail.com if it does not arrive in 2 weeks.` : `Please get in touch with ${this.state.profile.name} regarding your acquisition of their ${this.state.name}.`
          PushNotification.localNotificationSchedule({
              message: message,// (required)
              date: notificationDate,
              vibrate: false,
          });
        });
        

        // console.log("Payment successfully went through");
        

        // this.setSaleTo(true, this.state.otherUserUid, this.state.sku, true);
        
      })
      .catch( (e) => {
        console.log('failed to update references because' + e);
      })
        
    }

    else if(data.title == "cancel") {
        this.setState({showModal: "afterPaymentScreen", paymentStatus: "canceled"}, () => this.getUserAndProductAndOtherUserData(this.props.navigation.state.params.data));
    }
    else {
        return;
    }
  }

  goToNextPage = () => {
    switch(this.state.activeScreen) {
      case "postalDelivery":
        this.setState({activeScreen: "visaCheckoutScreen"});
        break;
      default:
        this.setState({activeScreen: this.state.deliveryOptions[0].selected ? 'collectionInPerson' : 'postalDelivery'});
        break;

    }
    
    // this.props.navigation.navigate()
  }

  goToAddDeliveryAddress = () => {
    this.setState({activeScreen: 'addDeliveryAddress'});
  }

  goToPreviousPage = () => {
    //Depending on the active screen, navigate to the previous page accordingly
    switch(this.state.activeScreen) {
      case ("collectionInPerson" || "postalDelivery"):
        this.setState({activeScreen: "initial"});
        break;
      case "addDeliveryAddress":
        this.setState({activeScreen: "postalDelivery"});
        break;
      default:
        this.setState({activeScreen: "initial"})
    }
  }

  closePurchaseModal = () => {
    //TODO: clear selected options in deliveryOptions
    this.setState({showPurchaseModal: false });
  }

  // renderPictureModal = () => {
  //   return (
  //     <Modal 
  //     animationType="slide"
  //     transparent={false}
  //     visible={this.state.showPictureModal}
      
  //     >
  //     <View style={styles.pictureModal}>

  //       <View style={styles.pictureModalHeader}>
  //         <FontAwesomeIcon
  //         name='close'
  //         size={28}
  //         color={'black'}
  //         onPress = { () => { 
  //             this.setState({showPictureModal: false })
  //             } }
  //         />
  //       </View>

  //       <View style={[styles.pictureModalBody, {alignItems: 'center'}]}>
  //         <FullScreenCarousel data={this.props.navigation.state.params.data.uris.source}/>
  //       </View>

  //     </View>
  //     </Modal>
  //   )
  // }

  renderPurchaseModal = () => {
    const {deliveryOptionModal, deliveryOptionHeader, backIconContainer, logoContainer, logo, deliveryOptionBody, deliveryOptionContainer, radioButton } = styles;
    const {activeScreen} = this.state;

    

    if(activeScreen == "initial") {
      return (
        <Modal 
        animationType="slide"
        transparent={false}
        visible={this.state.showPurchaseModal}
        
        >
          <SafeAreaView style={deliveryOptionModal}>
  
            <View style={deliveryOptionHeader}>
  
              
              <FontAwesomeIcon
                name='arrow-left'
                size={28}
                color={'black'}
                onPress = { () => { 
                    this.setState({showPurchaseModal: false })
                    } }
                />
            
              <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
              
  
              <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress = { () => { 
                    this.setState({showPurchaseModal: false })
                    } }
                />
  
            </View>
  
            <View style={deliveryOptionBody}>
  
                <Text style={new avenirNextText('black', 24, "400")}>
                  Delivery:
                </Text>
  
                <Text style={new avenirNextText(graphiteGray, 24, "200")}>
                  Choose how you would like your product delivered:
                </Text>

                <WhiteSpace height={40}/>
  
                
                  {this.state.deliveryOptions.map( (option, index) => (
                    <TouchableOpacity 
                    onPress={() => {
                          //Select this option and if another option is selected, deselect it
                          this.state.deliveryOptions[index].selected = !this.state.deliveryOptions[index].selected;
                          if(index == 0) {
                            this.state.deliveryOptions[1].selected == true ?
                              this.state.deliveryOptions[1].selected = false
                              :
                              null
                          }
  
                          else {
                            this.state.deliveryOptions[0].selected == true ?
                              this.state.deliveryOptions[0].selected = false
                              :
                              null
                          }
                          
                          this.setState({deliveryOptions: this.state.deliveryOptions});
                        }}
                    style={deliveryOptionContainer} key={index}>
  
                      <View style={styles.radioButtonContainer}>
                        <View 
                        style={radioButton} 
                        >
                        {option.selected ? <SelectedOptionBullet/> : null}
                        </View>
                      </View>
                      
                      <View style={styles.deliveryOptionTextContainer}>
                        <Text style={new avenirNextText('black', 20, "400")}>{option.text}</Text>
                      </View>
                    </TouchableOpacity>
                  ))}
                
  
            </View>
  
            <CustomTouchableO 
            onPress={this.goToNextPage}
            disabled={this.state.deliveryOptions[0].selected || this.state.deliveryOptions[1].selected ? false : true } 
            flex={0.15} color={'#39b729'} text={'Next'} textColor={'#fff'} textSize={25}
            />
            
           
  
           </SafeAreaView>
  
        </Modal>
      )
    }

    else if(activeScreen == "collectionInPerson") {
      return (
        <Modal 
        animationType="slide"
        transparent={false}
        visible={this.state.showPurchaseModal}
        
        >
          <SafeAreaView style={deliveryOptionModal}>
  
            <View style={deliveryOptionHeader}>
  
              
              <FontAwesomeIcon
                name='arrow-left'
                size={28}
                color={'black'}
                onPress = { () => { 
                    this.goToPreviousPage()
                    // this.setState({showPurchaseModal: false })
                    } }
                />
            
              <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
              
              <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress = { () => { 
                  //TODO: clear selected options in deliveryOptions
                    this.setState({showPurchaseModal: false })
                    } }
                />
  
            </View>
  
            <View style={[deliveryOptionBody, {flex: 0.9}]}>
  
                <Text style={new avenirNextText('black', 24, "400")}>
                  Collection in Person
                </Text>
  
                <Text style={new avenirNextText(graphiteGray, 24, "300")}>
                  Let the seller know when and where you will be meeting via chat.
                </Text>

                <WhiteSpace height={30}/>
  
                
                  {this.state.deliveryOptions[0].options.map( (option, index) => (

                    index != 1 ?
                    <View key={index} style={styles.collectionInPersonContainer}>

                      <TouchableOpacity 
                      style={[styles.collectionInPersonButton, {width: index == 0 ? chatButtonWidth : paymentButtonWidth}]}
                      onPress = { () => { 
                        // console.log('going to chat');
                        //subscribe to room key
                        if(index == 0) {
                          if(this.state.canChatWithOtherUser) {
                            this.setState({showPurchaseModal: false});
                            this.navToChat(this.props.navigation.state.params.data.uid, this.props.navigation.state.params.data.key);
                          }
                          else {
                            alert('You cannot create a chat with an individual that you have blocked.\n Please unblock them to proceed. ');
                          }
                        } 
                        else {
                          this.proceedToPayment('noPost')
                        }
                          
                      } }
                      >

                        <View style={styles.collectionInPersonOptionsContainer}>

                          <Icon
                            name={index == 0 ? 'message-text-outline' : "credit-card"}
                            size={paymentScreensIconSize}
                            color={chatIcon.color}
                            

                          />
                          <Text style={new avenirNextText('black', 20, "300")}>
                            {option}
                          </Text>
                          
                        </View>

                      </TouchableOpacity>

                    </View>

                    :

                    <View style={styles.collectionInPersonContainer}>

                      <Text style={new avenirNextText(graphiteGray, 28, "300")}>OR</Text>

                    </View>



                  ))}
                
  
            </View>
            
           
  
           </SafeAreaView>
  
        </Modal>
      )
    }

    else if(activeScreen == "postalDelivery") {
      return (
      <Modal 
      animationType={modalAnimationType}
      transparent={false}
      visible={this.state.showPurchaseModal}
      
      >
        <SafeAreaView style={deliveryOptionModal}>

          <View style={deliveryOptionHeader}>

            
            <FontAwesomeIcon
              name='arrow-left'
              size={28}
              color={'black'}
              onPress = { () => { 
                  this.goToPreviousPage()
                  // this.setState({showPurchaseModal: false })
                  } }
              />
          
            <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
            
            <FontAwesomeIcon
              name='close'
              size={28}
              color={'black'}
              onPress = { () => { 
                //TODO: clear selected options in deliveryOptions
                  this.setState({showPurchaseModal: false })
                  } }
              />

          </View>

          <View style={deliveryOptionBody}>

              <View style={{flex: 0.3}}>
                <Text style={new avenirNextText('black', 24, "400")}>
                  Postal Delivery
                </Text>

                <Text style={new avenirNextText(graphiteGray, 24, "300")}>
                  Address:
                </Text>
              </View>  

              
              
              {this.state.addresses ?
                <ScrollView style={{flex: 0.35}} contentContainerStyle={styles.addressesContainer}>
                  {Object.keys(this.state.addresses).map( (key, index) => (
                    <View>
                    <TouchableOpacity 
                    onPress={ () => {
                      // console.log(this.state.addresses)
                      const {...state} = this.state;

                      Object.keys(state.addresses).forEach( (k) => {
                        state.addresses[k].selected = false
                      });
                      state.addresses[key].selected = !state.addresses[key].selected;
                      state.selectedAddress = state.addresses[key];
                      this.setState(state); 
                    }}
                    style={[styles.addressContainerButton, {backgroundColor: this.state.addresses[key].selected ? lightGray : '#fff' }]}
                    >
                      <View style={styles.addressContainer}>

                        <View style={{flex: 0.2, padding: 3}}>
                          <View style={styles.radioButton}>
                            {this.state.addresses[key].selected ? <SelectedOptionBullet/> : null}
                          </View>
                        </View>

                        <View style={{flex: 0.8, padding: 5}}>
                          <Text style={styles.addressText}>{this.state.addresses[key].addressOne + ", " + this.state.addresses[key].addressTwo + ", " + this.state.addresses[key].city + ", " + this.state.addresses[key].postCode}</Text>
                        </View>

                        {/* <Text style={styles.addressText}>{this.state.addresses[key].postCode}</Text> */}
                      </View>
                    </TouchableOpacity>
                    <WhiteSpace height={10}/>
                    </View>
                  ))}
                </ScrollView>
              :
                null
              }

              
              
              <View style={{flex: this.state.addresses ? 0.35 : 0.7, alignItems: 'center'}}>
                <TouchableOpacity onPress={this.goToAddDeliveryAddress} style={styles.addDeliveryAddressButton}>
                    <View style={[styles.collectionInPersonOptionsContainer, {justifyContent: 'space-evenly'}]}>
                     <Text style={new avenirNextText("black", 20, "300")}>
                        Add your delivery address
                      </Text>
                      <Icon
                        name="plus"
                        size={22}
                        color={mantisGreen}
                      />
                    </View>
                </TouchableOpacity>
              </View>
              

          </View>

          <View style={[styles.collectionInPersonContainer, {flex: 0.15}]}>

                <TouchableOpacity 
                disabled={this.state.selectedAddress ? false : true}
                onPress={() => this.proceedToPayment('post')} 
                // onPress={()=>this.handleResponse({title: 'success'})}
                style={[styles.collectionInPersonButton, {width: paymentButtonWidth }]}
                >
                
                  <View style={styles.collectionInPersonOptionsContainer}>

                    <Icon
                      name="credit-card"
                      size={paymentScreensIconSize}
                      color={chatIcon.color}

                    />
                    <Text style={new avenirNextText('black', 20, "300")}>
                      {paymentText}
                    </Text>
                    
                  </View>

                </TouchableOpacity>

          </View>
          
         

         </SafeAreaView>

      </Modal>
    )

    }

    else if(activeScreen == "addDeliveryAddress") {
      var filledOutAddress = (this.state.fullName && this.state.addressOne && this.state.postCode && this.state.city);
      return (
      <Modal 
      animationType={modalAnimationType}
      transparent={false}
      visible={this.state.showPurchaseModal}
      
      >
        <SafeAreaView style={deliveryOptionModal}>

          <View style={deliveryOptionHeader}>

            
            <FontAwesomeIcon
              name='arrow-left'
              size={28}
              color={'black'}
              onPress = { () => { 
                  this.goToPreviousPage()
                  // this.setState({showPurchaseModal: false })
                  } }
            />
          
            <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
            
            <FontAwesomeIcon
              name='close'
              size={28}
              color={'black'}
              onPress={this.closePurchaseModal}
              />

          </View>

          <View style={[deliveryOptionBody, {flex: 0.9}]}>

              <View style={{flex: 0.1}}>
                <Text style={new avenirNextText('black', 17, "400")}>
                  Address:
                </Text>
              </View>

              <WhiteSpace height={10}/>

              <ScrollView style={{flex: 0.25}} contentContainerStyle={styles.addressForm}>
                  {addressFields.map( (field, index) => (
                    <View style={styles.addressField}>
                      <Text style={new avenirNextText("black", 14, "400")}>{field.header}</Text>
                      <TextInput
                      onChangeText={(text) => this.onChange(text, field.key)}
                      value={this.state[field.key]}
                      style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 13, color: treeGreen}}
                      placeholder={field.placeholder}
                      placeholderTextColor={graphiteGray}
                      multiline={false}
                      maxLength={index == 1 || index == 2 ? 50 : 24}
                      autoCorrect={false}
                      clearButtonMode={'while-editing'}
                      />
                    </View>
                  ))}
              </ScrollView>

              <View style={[styles.collectionInPersonContainer, {flex: 0.65}]}>

                <TouchableOpacity
                disabled={filledOutAddress ? false : true} 
                onPress={this.addAddress} 
                style={styles.collectionInPersonButton}>

                  <View style={[styles.collectionInPersonOptionsContainer, {width: 180}]}>

                    <FontAwesomeIcon
                      name="address-book"
                      size={paymentScreensIconSize}
                      color={'black'}

                    />
                    <Text style={new avenirNextText('black', 20, "300")}>
                      Add Address
                    </Text>
                    
                  </View>

                </TouchableOpacity>

              </View>
                
              

          </View>
          
         

         </SafeAreaView>

      </Modal>
    )

    }

    else if(activeScreen == "paypalModal") {
      var finalPrice = this.state.postOrNah == 'post' ? this.state.totalPrice : this.state.price;
      return (
        <Modal
        animationType={modalAnimationType}
        transparent={false}
        visible={this.state.showPurchaseModal}
        >
          <WebView 
            source={{uri: payPalEndpoint + `?price=${finalPrice}&name=${this.state.name}&description=${this.state.description}&sku=${this.state.sku}&currency=${this.state.currency}`}} 
            onNavigationStateChange={data => this.handleResponse(data)}
            injectedJavaScript={`document.f1.submit()`}
          />
        </Modal>
      )
    }

    else if(activeScreen == "afterPaymentScreen") {
      return (
        <Modal
        animationType={modalAnimationType}
        transparent={false}
        visible={this.state.showPurchaseModal}
        >
          <SafeAreaView style={deliveryOptionModal}>

            <View style={deliveryOptionHeader}>

              <FontAwesomeIcon
                name='arrow-left'
                size={28}
                color={logoGreen}
              />
              <Image style={styles.logo} source={require("../images/nottmystyleLogo.png")}/>
              
              <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress={this.closePurchaseModal}
              />
            </View>

            

            
              {this.state.paymentStatus == "success" ? 
              <View style={[deliveryOptionBody, {padding: 10, alignItems: 'center'}]}>

                <View style={{flex: 0.4, justifyContent: 'center', alignItems: 'center'}}>
                  <ProgressiveImage 
                  style= {styles.successProductImage} 
                  thumbnailSource={ require('../images/blur.png') }
                  source={{uri: this.state.productPictureURLs[0]}}
                  />
                </View>

                <View style={{flex: 0.6, alignItems: 'center'}}>
                  <Text style={styles.successText}>
                  Congratulations! You have successfully bought {this.state.name} for £{this.state.postOrNah == 'post' ? this.state.totalPrice : this.state.price}.
                  </Text>
                  <WhiteSpace height={10}/>
                  {this.state.postOrNah == 'post' ?
                    <Text style={styles.successText}>
                    Your item will be delivered to:
                    {this.state.selectedAddress.addressOne + ", " + this.state.selectedAddress.addressTwo + ", " + this.state.selectedAddress.city + ", " + this.state.selectedAddress.postCode}.
                    Please note that it may take up to 2 weeks for the item to arrive via postal delivery. In case your item doesn't arrive, send us an email at nottmystyle.help@gmail.com.
                    </Text>
                    :
                    <Text style={styles.successText}>
                      You have chosen to collect this item in person.
                    </Text>
                  }
                  
                  
                </View>

              </View>    
              :
              <View style={[deliveryOptionBody, {alignItems: 'center', justifyContent: 'center', padding: 40}]}>
                <Text style={[new avenirNextText('black', 24, "300"), {textAlign: 'center'}]}>{cancelTransactionText}</Text>
              </View>
              }
              
            
          </SafeAreaView>  
        </Modal>
      )
    }
    
    
  }

   _getHeaderColor = () => {
    const {scrollY} = this.state;

    return scrollY.interpolate({
        inputRange,
        outputRange: ['transparent', 'transparent', logoGreen],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  }

  _getArrowColor = () => {
    const {scrollY} = this.state;

    return scrollY.interpolate({
        inputRange,
        outputRange: ['#fff', almostWhite, 'black'],
        extrapolate: 'clamp',
        useNativeDriver: true
    });
  }

  _getHeaderLogoOpacity = () => {
      const {scrollY} = this.state;

      return scrollY.interpolate({
          inputRange,
          outputRange: [0, 0.1, 1],
          extrapolate: 'clamp',
          useNativeDriver: true
      });

  };

  render() {
    const headerLogoOpacity = this._getHeaderLogoOpacity();
    const headerColor = this._getHeaderColor();
    // const arrowColor = this._getArrowColor();

    const { params } = this.props.navigation.state, { data, productKeys } = params, 
    { 
      isGetting, profile, navToChatLoading, productComments, uid, collectionKeys, 
      views //TODO: iOS
    } = this.state,
    {text} = data,
    details = {
      brand: text.brand,
      category: text.gender,
      size: text.size ? text.size : "N/A",
      type: text.type,
      condition: text.condition,
      post_price: text.post_price,
      views, //TODO: iOS
      
      // original_price: text.original_price
    };
    // console.log(this.state.showPictureModal);
    let isProductSold = this.state.sold || this.state.paymentStatus == "success";
    
    if(isGetting) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
          <LoadingIndicator isVisible={isGetting} color={treeGreen} type={'Wordpress'}/>
        </View>
      )
    }

    if(navToChatLoading) {
      return(
        <SafeAreaView style={{flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
          <View style={{height: 200, justifyContent: 'center', alignItems: 'center', padding: 10}}>
            <LoadingIndicator isVisible={navToChatLoading} color={logoGreen} type={'Wordpress'}/>
          </View>  
        </SafeAreaView>
      )
    }

    return (
      <SafeAreaView style={styles.mainContainer}>
      {/* Header Bar */}
      <Animated.View style={[styles.deliveryOptionHeader, {position: "absolute",zIndex: 1,width: "100%",backgroundColor: headerColor,
      marginTop: Platform.OS == 'ios' ? ifIphoneX(44, 22) : 0
      }]}>
        <FontAwesomeIcon
        name='arrow-left'
        size={30}
        color={"#fff"}
        onPress = { () => { 
            this.props.navigation.goBack();
            } }
        />

        <Animated.Image style={{width: 45, height: 45, opacity: headerLogoOpacity}} source={require("../images/nottmystyleLogo.png")}/>
            
        <FontAwesomeIcon
          name='close'
          size={30}
          color={'transparent'}
        />
      </Animated.View>

      <Animated.ScrollView 
      onScroll={Animated.event(
        [
          {
            nativeEvent: {contentOffset: {y: this.state.scrollY}}
          }
        ]
      )}
      style={styles.scrollContainer} 
      contentContainerStyle={styles.contentContainer}
      >
        
        {/* image carousel in center with back button on its left */}
        
          
        <View style={styles.carouselContainer}>        
          <CustomCarousel data={params.data.uris.pd} />
          {/* <View style={{position: 'absolute', right: 10, top: 10}}>
            <Icon 
            name={'arrow-expand'}
            size={35} 
            color={'#fff'} 
            onPress={() => this.setState({showPictureModal: true})}
            />
          </View> */}
        </View>
        
          {/* Product Name (Not Brand) and Price Row */}
        <View style={styles.nameAndPriceRow}>
          <View style={styles.nameContainer}>
            <Text style={new avenirNextText('black', 18, "300")}>{text.name.toUpperCase().replace(/ +/g, " ")}</Text>
          </View>
          <View style={styles.likesContainer}>
            
            <Icon name={collectionKeys.includes(params.data.key) ? "heart" : "heart-outline" }
            size={37} 
            color='#800000'
            onPress={() => {collectionKeys.includes(params.data.key) ? 
              this.decrementLikes(this.state.likes, params.data.key)
            : 
              this.incrementLikes(this.state.likes, params.data.key)
            }}
            />
            {/* <View style={{justifyContent: 'center', position: 'absolute', paddingBottom: 5}}>
              <Text style={[styles.likes, {color: collectionKeys.includes(params.data.key) ? 'black' : rejectRed} ]}>{params.data.text.likes}</Text>
            </View> */}
          
          </View> 
          
            {text.original_price > 0 ?
              <View style={[styles.priceContainer]}>
                <Text style={[styles.original_price, {color: 'black', textDecorationLine: 'line-through', fontSize: String(text.original_price).length > 3 ? 11 : 17}]} >
                  {this.state.currency + text.original_price}
                </Text>
                <Text style={[styles.original_price, {color: limeGreen, fontSize: String(text.original_price).length > 3 ? 11 : 17}]} >
                  {this.state.currency + text.price}
                </Text>
              </View>
            :
              <View style={[styles.priceContainer]}>
                <Text style={[styles.original_price, {fontSize: String(text.price).length > 3 ? 11 : 17, color: limeGreen}]} >
                  {this.state.currency + text.price}
                </Text>
              </View>
            }
          
        </View>
        <View style={{backgroundColor: 'black', height: 1.5}} />
            {/* Profile And Actions Row */}
        <View style={styles.sellerProfileAndActionsRow}>
            
          <TouchableOpacity style={styles.profilePictureContainer} onPress={() => {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(data.uid)}}>
            <ProgressiveImage 
              style= {styles.profilePicture} 
              thumbnailSource={ require('../images/blank.jpg') }
              source={profile.uri ? {uri: profile.uri} : require('../images/blank.jpg')}
            />
          </TouchableOpacity>
          <View style={styles.profileTextContainer}>
            <Text onPress={() => 
            {this.state.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(data.uid)}}
            style={styles.profileText}>
              {profile.name}
            </Text>
            <Text style={styles.profileText}>
              {profile.country}
            </Text>
            {profile.insta ? 
              <Text onPress={()=>Linking.openURL(`https://instagram.com/${profile.insta}`)} style={[styles.profileText, {color: "black"}]}>@{profile.insta.length > 12 ? profile.insta.substring(0,12) + '...' : profile.insta}</Text>
             : 
              null
            }
          </View>
          {productKeys.includes(data.key) ?
            <View style={styles.actionIconContainer}>
              {isProductSold ?
                <View
                  style={[styles.purchaseButton, {backgroundColor: graphiteGray}]}
                >
                  <Text style={new avenirNextText("#fff",16,"400")}>Sold</Text>
                </View>
              :
                <Icon
                  name='wrench'
                  size={32}
                  color={'black'}
                  onPress = { () => { 
                      // console.log('going to edit item details');
                      //subscribe to room key
                      this.navToEditItem(data);
                      } }
                />
              
              }
            </View>
            :
            <View style={styles.actionIconContainer}>
              <Icon
                name='message-text-outline'
                size={38}
                color={chatIcon.color}
                onPress = {
                  this.state.sold ? 
                    () => alert('This product is no longer in stock. Chatting with the seller is redundant.')
                    :
                    this.state.canChatWithOtherUser ? 
                      () => { 
                          // console.log('going to chat');
                          //subscribe to room key
                          this.navToChat(data.uid, data.key);
                          } 
                      :
                      () => {
                        alert('You cannot create a chat with an individual that you have blocked.\n Please unblock them to proceed. ');
                      }    
                  }
              />
              <TouchableOpacity
                disabled={isProductSold ? true : false} 
                style={[styles.purchaseButton, {backgroundColor: isProductSold ? graphiteGray : mantisGreen}]}
                onPress={() => {this.setState({showPurchaseModal: true})}} 
              >
                <Text style={new avenirNextText("#fff",16,"400")}>{isProductSold ? "Sold":"Buy"}</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
        <View style={{backgroundColor: 'black', height: 1.5}} />
        {/* Details and Report Item Row */}
        <View style={styles.detailsAndReportItemRow}>
            <View style={styles.detailsColumn}>
              <Text style={styles.descriptionHeader}>DETAILS</Text>
              {/* Specific Details */}
              { Object.keys(details).map( (key, index) => ( 
                <Text style={[styles.detailsText]} key={index}>
                {/* {key.replace(key.charAt(0), key.charAt(0).toUpperCase())}: {details[key]} */}
                {index == 5 ? details[key] > 0 ? `Price of Post: ${this.state.currency + details[key]}` : null : `${key.replace(key.charAt(0), key.charAt(0).toUpperCase())}: ${details[key]}`}
                {/* {key === 'post_price' ? 'Retail Price' : key.replace(key.charAt(0), key.charAt(0).toUpperCase())}: {key === 'original_price' ? `£${details[key]}` : details[key]} */}
                </Text>
              ) ) }
              {/* Optional Product Description Row */}
              {/* {text.description !== "Seller did not specify a description" ?
                text.description.replace(/ +/g, " ").length >= 131 ?
                    <Text 
                    onPress={()=>{this.setState({showFullDescription: !this.state.showFullDescription})}} 
                    style={styles.detailsText}>
                    Description: {this.state.showFullDescription ? text.description : text.description.replace(/ +/g, " ").substring(0,124) + "...." + "  " +  "(Show More?)"}
                    </Text>
                  :
                    <Text style={styles.detailsText}>Description: {text.description}</Text>
              :
                null} */}
            </View>
            <View style={styles.secondaryActionsColumn}>
            {productKeys.includes(data.key) ?
              null
            :
              <View style={styles.buyOrReportActionContainer}>
                <Icon
                  name="flag-variant-outline" 
                  size={40}  
                  color={'#800'}
                  onPress = { () => { 
                    this.setState({showReportUserModal: true})
                  } }
                />
              </View>
              
            }
              
            </View>
        </View>
        <View style={{backgroundColor: 'black', height: 1.5}} />
        {/* Optional Product Description Row */}
        { text.description !== "Seller did not specify a description" ?
            <View>
            <View style={styles.optionalDescriptionRow}>
                <View style={styles.descriptionHeaderContainer}>
                    <Text style={styles.descriptionHeader}>DESCRIPTION</Text>
                </View>
                <View style={styles.descriptionContainer}>
                  {text.description.replace(/ +/g, " ").length >= 131 ?
                    <Text 
                    onPress={()=>{this.setState({showFullDescription: !this.state.showFullDescription})}} 
                    style={styles.description}>
                    {this.state.showFullDescription ? text.description.replace(/ +/g, " ") : text.description.replace(/ +/g, " ").substring(0,124) + "...." + "  " +  "(Show More?)"}
                    </Text>
                  :
                    <Text style={styles.description}>{text.description}</Text>
                  }
                </View>
                <WhiteSpace height={3}/>
              
            </View>
            <View style={{backgroundColor: 'black', height: 1.5}} />
            </View>
          :
          null
        }
        
        {/* comments */}
        
          
          <View style={styles.reviewsHeaderContainer}>
            <Text style={styles.reviewsHeader}>REVIEWS</Text>
            <FontAwesomeIcon 
              name="edit" 
              style={styles.users}
              size={35} 
              color={iOSColors.black}
              onPress={() => {this.navToProductComments(data)}}
            /> 
          </View>
          
          {productComments['a'] ? <WhiteSpace height={20}/> : Object.keys(productComments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>
                      <View style={styles.commentPicAndTextRow}>
                        {productComments[comment].uri ?
                          <TouchableHighlight 
                            onPress={() => this.state.uid == productComments[comment].uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(productComments[comment].uid)} 
                            style={styles.commentPic}
                          >
                            <ProgressiveImage 
                              style= {styles.commentPic} 
                              thumbnailSource={ require('../images/blank.jpg') }
                              source={ {uri: productComments[comment].uri} }
                            />
                          </TouchableHighlight>  
                        :
                          <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
                        }
                          
                        <View style={styles.textContainer}>
                            <Text style={ styles.commentName }> {productComments[comment].name} </Text>
                            <Text style={styles.comment}> {productComments[comment].text}  </Text>
                        </View>
                      </View>
                      <View style={styles.commentTimeRow}>
                        <Text style={ styles.commentTime }> {productComments[comment].time} </Text>
                      </View>
                      {productComments[comment].uri ? <View style={styles.separator}/> : null}
                      
                  </View>
                  
              )
                      
              )}
          
        {/* {this.renderPictureModal()} */}
        {this.renderReportUserModal()}
        {this.renderPurchaseModal()}
        {/* {this.r()} */}
      </Animated.ScrollView> 
      </SafeAreaView>
    );
  }
}
export default withNavigation(ProductDetails);
{/* <View style={{flex: 2, alignItems: 'center'}}>
          <CustomCarousel data={params.data.uris} />
        </View> */}
const styles = StyleSheet.create( {
  mainContainer: {
    flex: 1,
    // flexDirection: 'column',
    // marginTop: 20,
    marginBottom: 3,
    backgroundColor: '#fff'
  },
  headerBar: {
    flex: 0.1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: logoGreen,
    paddingHorizontal: 5,
  },
  scrollContainer: {
    flex: 0.9,
    // marginTop: 10
  },
  contentContainer: {
    
    flexGrow: 1, 
    backgroundColor: '#fff',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    paddingHorizontal: 2,
    // marginTop: 5,
    // marginBottom: 5
  },
  carouselContainer: {
    flex: 2,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green',
    width: "100%"
  },
  backIconAndCarouselContainer: {marginTop: 5, flex: 2, flexDirection: 'row', paddingVertical: 5, paddingRight: 2, paddingLeft: 1 },
  nameAndPriceRow: {
    flexDirection: 'row',
    // backgroundColor: 'red',
    padding: 5,
    // margin: 5
  },
  nameContainer: {
    justifyContent: 'center',
    // align
    flex: 0.6,
  },
  likesContainer: {flex: 0.15, justifyContent: 'center', alignItems: 'center', 
    // backgroundColor: 'red'
},
  priceContainer: {
    flexDirection: 'row',
    flex: 0.25,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'blue'
  },
  sellerProfileAndActionsRow: {
    height: 90,
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5
  },
  profilePicture: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderColor: 'black',
    borderWidth: 1,
  },
  profilePictureContainer: {
    flex: 0.2,
    padding: 0,
    // height:100,
    // width: 150,
    justifyContent: 'center',
    // backgroundColor: 'yellow'
  },
  profileTextContainer: {
    flex: 0.4,
    flexDirection: 'column',
    justifyContent: 'center',
    alignContent: 'flex-end',
    alignItems: 'center',
    // backgroundColor: 'red'
  },
  profileText: {
    ...textStyles.generic,
    fontSize: 14,
    color: 'black'
  },
  likeIconContainer: {
    padding: 5
  },
  original_price: {
    fontFamily: 'Avenir Next',
    fontWeight: '400',
    fontSize: 17
  },
  price: {
    fontFamily: 'Avenir Next',
    fontSize: 16,
    
  },
  actionIconContainer: {
    flex: 0.4,
    flexDirection: 'row',
    // backgroundColor: 'brown',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    padding: 0
  },
  detailsAndReportItemRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 5,
  },
  detailsColumn: {
    flex: 4,
    flexDirection: 'column',
    paddingBottom: 3,
    paddingTop: 1,
    paddingHorizontal: 0
  },
  detailsText: {
    textAlign: 'left',
    fontSize: 14,
    fontFamily: 'Avenir Next',
    fontWeight: '300',
    color: graphiteGray
  },
  secondaryActionsColumn: {
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
    flexDirection: 'column',
    flex: 2,
    // backgroundColor: 'green'
  },
  confirmSaleActionContainer: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center'
  },
  confirmSaleText: {color: '#0e4406', fontSize: 10, textAlign: 'center' },
  infoAndButtonsColumn: {
    flex: 1,
    flexDirection: 'column',
  },
  buyOrReportActionContainer: {
    // justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  purchaseButton: {
    width: 60,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center'
    // borderWidth: 1,
    // borderColor: '#fff',
  },
  brandText: {
    fontFamily: 'Avenir Next',
    fontSize: 22,
  },
  headerPriceMagnifyingGlassRow: {
    flex: 1.5,
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0,
  },
  
  nameAndLikeRow: {
    flex: 1,
    flexDirection: 'row'
  },
  nameText: {
    flex: 2,
    fontStyle: 'normal',
    fontWeight: 'normal',
    fontSize: 20,
    padding: 10,
    // backgroundColor: 'red'
  },
  likesRow: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    padding: 5,
    // backgroundColor: iOSColors.white,
    marginLeft: 0,
    // backgroundColor: 'blue'
  },
  likes: {
    fontSize: 14,
  },
  priceRow: { flex: 1, flexDirection: 'row', justifyContent: 'flex-start', },
  buttonsRow: {flex: 4, flexDirection: 'row', paddingRight: 10, justifyContent: 'flex-end', },
  numberProducts: {
    flex: 5,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
  soldProducts: {
    flex: 5,
    fontSize: 16,
    color: 'black',
    fontWeight: 'bold'
  },
//   dalmationContainer: {
//     flexDirection: 'row',
//     padding: 5,
//     justifyContent: 'space-evenly'
// },
// keyContainer: {
//     width: (width/2) - 30,
//     height: 40,
//     padding: 5,
//     justifyContent: 'center',
// },
// valueContainer: {
//     width: (width/2),
//     height: 40,
//     padding: 5,
//     justifyContent: 'center',
// },
// keyText: {
//     color: iOSColors.black,
//     fontFamily: 'TrebuchetMS-Bold',
//     fontSize: 15,
//     fontWeight: '400'
// },
// valueText: {
//     color: iOSColors.white,
//     fontFamily: 'Al Nile',
//     fontSize: 18,
//     fontWeight: '300'
// },
reportModal: {justifyContent: 'flex-start', alignItems: 'center', padding: 25},
reportModalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Avenir Next',
    fontWeight: "bold",
    paddingBottom: 20,
},
hideModal: {
  paddingTop: 40,
  fontSize: 20,
  color: 'green',
  fontWeight:'bold'
},
reportInput: {
  width: 200, height: 140,
  // flex: 0.33,
  marginBottom: 50, borderColor: highlightGreen, borderWidth: 2
},
halfPageScroll: {
    
},
reviewsHeaderContainer: {
  flexDirection: 'row',
  paddingTop: 5,
  width: width-15,
  justifyContent: 'space-between'
},
users: {
  flex: 0,
  paddingLeft: 60,
  paddingRight: 0,
  marginLeft: 0
},
reviewsHeader: {
  fontFamily: 'Avenir Next',
  fontSize: 24,
  fontWeight: "normal",
  paddingLeft: 5,
  color: 'black'
},
commentContainer: {
  flexDirection: 'column',
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
textContainer: {
  flex: 1,
  flexDirection: 'column',
  padding: 5,
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
  color: iOSColors.black
},
numberOfProductsSoldRow: {
  flex: 1,
  flexDirection: 'row'
},
optionalDescriptionRow: {
  // alignItems: 'center'
  paddingVertical: 5,
  paddingHorizontal: 5
},
descriptionHeaderContainer: {flex: 0.2,justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 0},
descriptionHeader: {
  ...textStyles.generic,
  fontSize: 24,
  color: 'black'
},
descriptionContainer: {
  justifyContent: 'flex-start'
},
description: {textAlign: 'justify', ...textStyles.generic, color: graphiteGray},
////Picture Modal Stuff
pictureModal: {
  flex: 1,
  marginTop: 18,
  backgroundColor: '#fff',
  flexDirection: 'column'
},

pictureModalHeader: {
  flex: 0.15,
  flexDirection: 'row',
  justifyContent: 'flex-start',
  padding: 10,
},

pictureModalBody: {
  flex: 0.85,
  // marginVertical: 10,

  // justifyContent: 'center',
  // alignItems: 'center',
},
////Purchase Modal Stuff
///////////////////////////
///////////////////////////
///////////////////////////
//Initial Screen
////////////
////////////
///////////
///////////
///////////
deliveryOptionModal: {
  backgroundColor: "#fff",
  flex: 1,
  // marginTop: Platform.OS == "ios" ? 22 : 0
},
deliveryOptionHeader: {
  flex: 0.1,
  //TODO: find nottGreen hex code
  backgroundColor: logoGreen,
  justifyContent: 'space-between',
  alignItems: 'center',
  flexDirection: 'row',
  paddingHorizontal: 12,
  
},
backIconContainer: {
  flex: 0.4,
  // justifyContent: 'flex-start',
  // alignItems: 'center'
},
logoContainer: {
  flex: 0.6,
  // justifyContent: 'flex-start',
  // alignItems: 'center',
  // backgroundColor: 'red'
  // width: 40,
  // height: 40
},
logo: {
  width: 45,
  height: 45,
},
deliveryOptionBody: {
  flex: 0.75,
  padding: 10,
  // alignItems: 'center'
  // backgroundColor: ''
},
deliveryOptionContainer: {
  flexDirection: 'row',
  
  padding: 10
},
radioButtonContainer: {
  paddingHorizontal: 10,
  // justifyContent: 'space',
  alignItems: 'center',
},
radioButton: {
  width: 30,
  height: 30,
  borderRadius: 15,
  borderWidth: 0.5,
  borderColor: 'black',
  backgroundColor: '#fff',
  justifyContent: 'center',
  alignItems: 'center'
},
deliveryOptionTextContainer: {
  paddingHorizontal: 10,
  alignItems: 'flex-start'
},
///////////////////////////
///////////////////////////
///////////////////////////
//collectionInPerson Screen
////////////
////////////
///////////
///////////
///////////
///////////////////////////
///////////////////////////
///////////////////////////
//postalDeliveryScreen
collectionInPersonContainer: {
  justifyContent: 'center',
  alignItems: 'center',
  paddingVertical: 10
},
collectionInPersonButton: {
  // width: 230,
  height: 60,
  borderRadius: 15,
  backgroundColor: '#99e265',
  justifyContent: 'center',
  alignItems: 'center'
},
collectionInPersonOptionsContainer: {
  flexDirection: 'row',
  padding: 5,
  justifyContent: 'space-evenly',
  alignItems: 'center'
},
addressesContainer: {
  paddingHorizontal: 10,
  justifyContent: 'space-evenly',
},
addressContainerButton: {
  width: 270,
  // height: 50,
  borderRadius: 5,
},
addressContainer: {
  flexDirection: 'row',
  alignItems: 'center',
  // justifyContent: 'space-evenly',
  padding: 3,
},
addressText: {
  ...textStyles.generic,
  color: 'black',
},
addDeliveryAddressButton: {
  width: 270,
  height: 40,
  borderRadius: 15,
  backgroundColor: '#fff',
},
addressForm: {
  paddingHorizontal: 10,
  // justifyContent: '',
  
},
addressField: {
  alignItems: 'flex-start',
},
////////////
////////////
///////////
///////////
/////////// afterPaymentScreen
//////////
/////////
successProductImage: {
  width: 135,
  height: 135,
},

successText: {
  ...textStyles.generic,
  color: 'black',
  textAlign: 'left',
  fontSize: 15,

},
////////////
////////////
////////////
///////////
} )
/////////////////
// const profileRowStyles = StyleSheet.create( {
//   rowContainer: {
//     flexDirection: 'row',
//     padding: 20,
//     justifyContent: 'center'
//   },
//   profilepic: {
//     borderWidth:0,
//     // borderColor:'#207011',
//     // alignItems:'center',
//     // justifyContent:'center',
//     // width:70,
//     height:80,
//     backgroundColor:'#fff',
//     borderRadius:80/2,
// },
// textContainer: {
//   flex: 1,
//   flexDirection: 'column',
//   alignContent: 'center',
//   padding: 5,
// },
// name: {
//   fontSize: 14,
//   fontFamily: 'Avenir Next',
//   fontWeight: '400'
// },
// email: {
//   //actually this is for your country location value
//     fontSize: 14,
//     fontFamily: 'Avenir Next',
//     fontWeight: '200',
//     fontStyle: 'italic'
//   },
  
// insta: {
//     fontSize: 12,
//     fontFamily: 'Avenir Next',
//     color: '#800000',
//     fontWeight: '600',
//     fontStyle: 'normal'
//   },  
// separator: {
//   height: 1,
//   backgroundColor: 'black',
//   padding: 2,
// },
// } )


//OLD RESET SALE UI AND FUNCTIONALITY. Put within productKeys.includes(section.key) as alternative to Report Item feature.

{/* this.state.sold ?
                <View style={styles.confirmSaleActionContainer}>
                    <Text style={styles.confirmSaleText}>Reset</Text>
                    <Text style={styles.confirmSaleText}>Sale</Text>
                    <Icon
                        name="check-circle" 
                        size={30}  
                        color={'#0e4406'}
                        onPress = {() => {this.setSaleTo(false, data.uid, data.key, false)}}
                    />
                </View>
              :
                <View style={styles.confirmSaleActionContainer}>
                  <Text style={styles.confirmSaleText}>Confirm</Text>
                  <Text style={styles.confirmSaleText}>Sale</Text>
                  <Icon
                    name="check-circle" 
                    size={30}  
                    color={'gray'}
                    onPress = {() => {this.setSaleTo(true, data.uid, data.key, false)}}
                  />
                </View>  */}