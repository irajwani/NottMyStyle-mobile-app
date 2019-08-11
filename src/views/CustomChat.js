import React, {Component} from 'react';
import { Platform, SafeAreaView,View, Text, StyleSheet, Image, TouchableHighlight, KeyboardAvoidingView } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import {withNavigation} from 'react-navigation';
import firebase from '../cloud/firebase';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

// import emojiUtils from 'emoji-utils';

import Chatkit from "@pusher/chatkit-client";
import { CHATKIT_SECRET_KEY, CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT } from '../credentials/keys';
import { treeGreen, mantisGreen, darkGreen, logoGreen } from '../colors';
import { LoadingIndicator, DismissKeyboardView } from '../localFunctions/visualFunctions';
// import { Firebase } from 'react-native-firebase';



//#86bb71
//#94c2ed
class CustomChat extends Component {
  static navigationOptions = {
    header: null
  }
    
  constructor(props){
    super(props);
    this.state = {
      messages: [],
      isGetting: true,
      otherUserPresence: "offline"
    }
  }

  componentDidMount() {
    var username = firebase.auth().currentUser.uid;
    this.uid = username;
    const {params} = this.props.navigation.state;
    const id = params ? params.id : null;
    this.roomId = id;
    const buyerIdentification = params.buyerIdentification;
    const buyerAvatar = params.buyerAvatar;
    const sellerIdentification = params.sellerIdentification;
    const sellerAvatar = params.sellerAvatar;

    const otherUser = username == buyerIdentification ? sellerIdentification : buyerIdentification;
    this.otherUser = otherUser;
    setTimeout(async () => {
      await this.setUserPresenceTo('online');
      await this.getConversation(username, id, buyerIdentification, buyerAvatar, sellerIdentification, sellerAvatar);
      await this.markMessageAs(this.uid,false)
      await this.getOtherUserPresence(otherUser);
      this.conversationTimer = setInterval(async () => {
        await this.getConversation(username, id, buyerIdentification, buyerAvatar, sellerIdentification, sellerAvatar);
        await this.getOtherUserPresence(otherUser);
      }, 20000); //TODO: bad idea possibly?
    }, 1000);
  }

  componentWillUnmount = () => {
    this.setUserPresenceTo('offline');
    clearInterval(this.conversationTimer);
  }

  // markMessagesAsRead = () => {
  //   var readUpdate = {};
  //   readUpdate['/Users/' + this.uid + '/conversations' + this.roomId + '']
  // }

  setUserPresenceTo = (status) => {
    var updates = {};
    updates['/Users/' + this.uid + '/conversations/' + this.roomId + '/presence/'] = status;
    firebase.database().ref().update(updates);
  }

  getOtherUserPresence = (otherUser) => {
    
    firebase.database().ref('/Users/' + otherUser + '/conversations/' + this.roomId + '/presence/' ).on('value', (snap)=>{
      var userStatus = snap.val();
      console.log("OTHER USER STATUS: " + userStatus);
      if(userStatus == "offline") {
        this.setState({otherUserPresence: "offline"});
      }
      else {
        this.setState({otherUserPresence: "online"});
      }
    })
  }

  getConversation(CHATKIT_USER_NAME, id, buyerIdentification, buyerAvatar, sellerIdentification, sellerAvatar) {

    // const CHATKIT_USER_NAME; 
    
    
    // console.log(buyerIdentification, sellerIdentification, id)

    // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
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
    // console.log(chatManager)

    // In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
    chatManager.connect().then(currentUser => {
      this.currentUser = currentUser;

      // console.log(currentUser);
      // this.currentUser.setReadCursor({
      //   roomId: id,
      //   position: ,
      // })
      // const cursor = this.currentUser.readCursor({
      //   roomId: id
      // })
      // console.log(cursor);
      // new Firebase()
      this.currentUser.subscribeToRoom({
        //roomId: this.currentUser.rooms[0].id,
        roomId: id,
        hooks: {
          onNewMessage: this.onReceive.bind(this, buyerIdentification, sellerIdentification)
        }
      })
      .then( () => {
        // console.log('successfully subscribed to room');
        this.currentUser.fetchMessages({roomId: id, direction: 'newer', limit: 60})
        .then((messages) => {
          // console.log(messages);
          messages = messages.reverse();
          messages = messages.map( (message) => {
            return {
              createdAt: new Date(message.createdAt),
              text: message.text,
              user: {
                _id: message.senderId,
                avatar: message.senderId == sellerIdentification ? sellerAvatar : buyerAvatar
              },
              _id: String(message.id)
            }
          })
          // console.log(messages);
          this.setState({messages, isGetting: false})
        })
      })
      .catch( (err) => console.log(err));
    });
  

    // const {params} = this.props.navigation.state
    // const his_uid = params.uid
    
    // this.setState({
    //   messages: [
    //     {
    //       _id: 1,
    //       text: "Hi, If you would like to purchase this product, let me know what place works for you and we'll arrange a meetup",
    //       createdAt: new Date(),
    //       user: {
    //         _id: 1,
    //         name: 'React Native',
    //         avatar: 'https://placeimg.com/140/140/any',
    //       },
    //     },
    //   ],
    // })

  }

  // componentWillUnmount() {
  //   const {params} = this.props.navigation.state;
  //   const id = params ? params.id : null;
  //   // this.currentUser.setReadCursor({
  //   //     roomId: id,
  //   //     position: this.state.newestReadMessageId,
  //   // })
  //   // .then(() => {
  //   //   console.log('Success!')
  //   // })
  //   // .catch(err => {
  //   //   console.log(`Error setting cursor: ${err}`)
  //   // })
  // }

  //onReceive function not supposed to be here?
  //Think he's using renderMessage to produce the UI which receives the messages as props
  onReceive(data, buyerIdentification, sellerIdentification) {
    // console.log(data);
    //...
    const { id, senderId, text, createdAt, sender } = data;
    const {avatarURL, name} = sender;
    const incomingMessage = {
      _id: id,
      text: text,
      createdAt: new Date(createdAt),
      user: {
        _id: senderId,
        name: name,
        avatar: avatarURL,
      }
    };
    this.updateLastMessageInCloud(incomingMessage, buyerIdentification, sellerIdentification, String(incomingMessage._id) );
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, incomingMessage),
    }));
  }
  /////////////////

  onSend([message], id) {
    this.currentUser.sendMessage({
      text: message.text,
      roomId: id,
    });
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, message),
    }), async () => {
      if(this.state.otherUserPresence != "online") {
        await this.markMessageAs(this.otherUser,true);
      }
      const {params} = this.props.navigation.state;
      const buyerIdentification = params.buyerIdentification;
      const sellerIdentification = params.sellerIdentification;
      this.updateLastMessageInCloud(message, buyerIdentification, sellerIdentification, id);
    });
    // console.log(message);
    
  }

  updateLastMessageInCloud = (msg, buyerIdentification, sellerIdentification, roomId) => {
    //for both participants, update the cloud with most recent message for each roomId
    var lastMessageObj = {
      lastMessageText: msg.text,
      lastMessageDate: msg.createdAt.getDay(),
      lastMessageSenderIdentification: msg.user._id,
    }
    var updates = {};
    updates['Users/' + buyerIdentification + '/conversations/' + roomId + '/lastMessage/'] = lastMessageObj;
    firebase.database().ref().update(updates);
    updates['Users/' + sellerIdentification + '/conversations/' + roomId + '/lastMessage/' ] = lastMessageObj;
    firebase.database().ref().update(updates);
  }

  markMessageAs = (uid, isUnread) => {
    //By default, mark any sent message as unread, unless the other person is already in the chat room
    let unreadUpdate = {};
    unreadUpdate['/Users/' + uid + '/conversations/' + this.roomId + '/unread/'] = isUnread; 
    firebase.database().ref().update(unreadUpdate);
  }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  render() {

    const {params} = this.props.navigation.state;
    const id = params ? params.id : null 
    const buyer = params.buyer ? params.buyer : false
    const seller = params.seller ? params.seller : false
    const buyerAvatar = params.buyerAvatar ? params.buyerAvatar : false
    const sellerAvatar = params.sellerAvatar ? params.sellerAvatar : false
    const sellerIdentification = params.sellerIdentification ? params.sellerIdentification : false;
    const buyerIdentification = params.buyerIdentification ? params.buyerIdentification : false;

    const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;

    //determine who it is you're chatting with to display their info in topRow
    var chattingWithPersonIdentification = params.buyerIdentification && params.sellerIdentification ? sellerIdentification == CHATKIT_USER_NAME ? buyerIdentification : sellerIdentification : false
    var chattingWithPersonNamed = buyer && seller ? sellerIdentification == CHATKIT_USER_NAME ? buyer : seller : false
    var chattingWithPersonThatLooksLike = buyer && seller ? sellerIdentification == CHATKIT_USER_NAME ? buyerAvatar : sellerAvatar : false
    // console.log(chattingWithPersonNamed);
    // console.log(this.state.messages);
    //9CubeGrid

    if(this.state.isGetting) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}>
          <LoadingIndicator isVisible={this.state.isGetting} color={logoGreen} type={'Wordpress'}/>
        </View>
      )
    }
    
    else {
      return (
      <SafeAreaView style={styles.mainContainer}>

        <View style={[styles.topRow, {backgroundColor: '#fff'}]}>

          <View style={[styles.topRowItemContainer, {flex: 0.2}]}>
            <FontAwesomeIcon
              name='arrow-left'
              size={30}
              color={'black'}
              onPress = { () => { 
                this.props.navigation.goBack();
                  } }

            />
          </View>

          {chattingWithPersonNamed ? 
          <View style={[styles.topRowItemContainer, {flex: 0.6}]}>
            <Text style={styles.chatInfoText}>{(chattingWithPersonNamed.split(' '))[0]}</Text>
          </View>
          :
          null
          }

          {chattingWithPersonThatLooksLike ?
            <TouchableHighlight 
            onPress={()=>this.navToOtherUserProfilePage(chattingWithPersonIdentification)}
            style={[styles.topRowItemContainer, {flex: 0.2}]} underlayColor={'#fff'} >
              <Image source={ {uri: chattingWithPersonThatLooksLike }} style={styles.profilePic} />
            </TouchableHighlight>
            :
            null
          }



        </View>

        <View style={{backgroundColor: 'black', height: 1.5}}/>
        
        <DismissKeyboardView>
        <View style={{flex: 0.88}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages, id)}
            user={{
              _id: CHATKIT_USER_NAME
            }}
            //renderMessage={this.renderMessage}
            //renderBubble={this.renderBubble}
            showUserAvatar={true}
            showAvatarForEveryMessage={false}
            renderAvatarOnTop={true}
            loadEarlier={false}
          />    
          <KeyboardAvoidingView behavior={Platform.OS == 'android' ? 'padding' : null} keyboardVerticalOffset={110}/>
          
        </View>
        </DismissKeyboardView>

      </SafeAreaView>
    )
  }


  }
}

export default withNavigation(CustomChat);

const styles = StyleSheet.create({
  mainContainer: {flex: 1,},

  topRow: { 
    flex: 0.12, flexDirection: 'row', paddingHorizontal: 10, 
    // alignItems: 'center', justifyContent: 'space-evenly' 
  },
  
  topRowItemContainer: {
    justifyContent: 'center',
    alignItems: 'center'
  },

  chatInfoText: {
    fontFamily: 'Avenir Next',
    fontSize: 14,
    textAlign: 'left',
    fontWeight: 'bold',
    color: 'black'
  },

  profilePic: {
    width: 40,
    height: 40,
    borderRadius: 20
},

})

{/* <Text style={styles.chatInfoText}>{(seller.split(' '))[0]} & {(buyer.split(' '))[0]}</Text> */}

// this.currentUser keys => ["setReadCursor", "readCursor", "isTypingIn", "createRoom", "getJoinableRooms", 
// "joinRoom", "leaveRoom", "addUserToRoom", "removeUserFromRoom", "sendMessage", "fetchMessages", 
// "subscribeToRoom", "fetchAttachment", "updateRoom", "deleteRoom", "setReadCursorRequest", 
// "uploadDataAttachment", "isMemberOf", "decorateMessage", "establishUserSubscription", 
// "establishPresenceSubscription", "establishCursorSubscription", "initializeUserStore", "disconnect", 
// "hooks", "id", "encodedId", "apiInstance", "filesInstance", "cursorsInstance", "connectionTimeout", 
// "presenceInstance", "logger", "presenceStore", "userStore", "roomStore", "cursorStore", "typingIndicators", 
// "roomSubscriptions", "readCursorBuffer", "userSubscription", "presenceSubscription", "cursorSubscription", 
// "avatarURL", "createdAt", "customData", "name", "updatedAt"]