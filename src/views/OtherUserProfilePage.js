import React, { Component } from 'react'
import { Platform, Dimensions, Modal, Text, StyleSheet, ScrollView, View, SafeAreaView, Image, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'

import Svg, { Path } from 'react-native-svg';

import email from 'react-native-email'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Button, Divider} from 'react-native-elements'
// import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import { iOSColors,  } from 'react-native-typography';
// import LinearGradient from 'react-native-linear-gradient'
// import ReviewsList from '../components/ReviewsList.js';
// import { PacmanIndicator } from 'react-native-indicators';
import { highlightGreen, yellowGreen } from '../colors.js';

import {removeFalsyValuesFrom} from '../localFunctions/arrayFunctions.js'
import { LoadingIndicator, ProfileMinutia } from '../localFunctions/visualFunctions.js';
// import { avenirNextText } from '../constructors/avenirNextText.js';
// import { Hoshi, Sae } from 'react-native-textinput-effects';
// import { TextField } from 'react-native-material-textfield';
import ProgressiveImage from '../components/ProgressiveImage';

import { textStyles } from '../styles/textStyles.js';
import Profile from '../components/Profile.js';

const {width} = Dimensions.get('window');

// const resizeMode = 'center';

const DismissKeyboardView = ({children}) => (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        {children}
    </TouchableWithoutFeedback>
)

const ButtonContainer = ({children}) => (
  <View style={{flex: 0.33, alignItems: 'center', justifyContent: 'center'}}>
    {children}
  </View>
)

// const BlackCircleWithCount = ({count, left}) => (
//   <View style={[styles.smallBlackCircle]}>
//     <Text style={{fontFamily: 'Avenir Next', fontWeight: "700", fontSize: 12, color:'#fff'}}>{count}</Text>
//   </View>

// )

class OtherUserProfilePage extends Component {

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
    
    this.state = {
      profileData: false,
      numberProducts: 0,
      soldProducts: 0,
      sellItem: false,
      products: [],
      showBlockOrReportModal: false,
      report: '',
      showReportUserModal: false,
      isGetting: true,
      uid: firebase.auth().currentUser.uid,
      comments: false,
      noComments: false,

    }

  }

  // componentWillMount() {
  //   //Whenever someone navigates to this page, load the relevant data to render this page.
  //   //We need the current user's uid to extract information about blocked users.
  //   setTimeout(() => {
  //     this.loadRelevantData(this.state.uid, this.props.navigation.state.params.uid);

  //   }, 500);
    
  // }

  componentDidMount() {
    let otherUserUid = this.props.navigation.state.params.uid;
    this.timeoutId = setTimeout(() => {
      this.loadRelevantData(this.state.uid, otherUserUid);
      this.loadReviews(otherUserUid);  
      this.timerId = setInterval(() => {
        this.loadReviews(otherUserUid);  
      }, 20000);
    }, 1);
      
  }

  componentWillUnmount() {
   clearTimeout(this.timeoutId);
   clearInterval(this.timerId); 
  }

  loadRelevantData = (yourUid, otherUserUid) => {
    this.setState({isGetting: true});
    firebase.database().ref('/Users/').on('value', (snap) => {
      var d = snap.val();

      let yourProfile = d[yourUid].profile;

      var rawUsersBlocked = d[yourUid].usersBlocked ? d[yourUid].usersBlocked : {};
      var yourUsersBlocked = removeFalsyValuesFrom(rawUsersBlocked);
      // console.log(yourUsersBlocked);

      let profileData = d[otherUserUid].profile;
      // let color = d[otherUserUid].color ? d[otherUserUid].color : yellowGreen;
      

      //get collection keys of current user
      // var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      // var rawCollection = collection ? collection : {}
      // var collectionKeys = removeFalsyValuesFrom(rawCollection);  

      //TODO: Revive if you need the count again
      // var soldProducts = 0, numberProducts = 0;
      // //get profile data of seller of product
      // if(typeof d[otherUserUid].products === 'object') {
      //   for(var p of Object.values(d[otherUserUid].products)) {
      //     if(p.sold) {
      //       soldProducts++
      //     }
      //   }
        
      //   var numberProducts = Object.keys(d[otherUserUid].products).length;
      // }
      

      // var date = (new Date()).getDate();
      // var month = (new Date()).getMonth();
      // var year = (new Date()).getFullYear();

      this.setState({yourProfile, usersBlocked: yourUsersBlocked, yourUid: yourUid, otherUserUid: otherUserUid, profileData, isGetting: false})
    })
  }

  loadReviews = (otherUserUid) => {
    // this.setState({isGetting: true});
    firebase.database().ref(`/Users/${otherUserUid}/`).on('value', (snap) => { 
      var d = snap.val();
      var comments = false;
      if(d.comments) {
        comments = d.comments;
        this.setState({comments});
      }
      else {
        this.setState({noComments: true});
      }
      //Removed hard code this.state.comments to unhelpful object with one property
      
    })

  }

  // showBlockOrReport = () => {
  //     this.setState({showBlockOrReportModal: true})
  // }

  blockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = true;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may no longer converse with you by choosing to purchase your products on the Market.\nGo Back.");
    // this.setState({showBlockOrReportModal: false});
  }

  unblockUser = (uid) => {
    var blockUserUpdates = {};
    blockUserUpdates['/Users/' + firebase.auth().currentUser.uid + '/usersBlocked/' + uid + '/'] = false;
    firebase.database().ref().update(blockUserUpdates)  
    alert("This individual may now attempt to purchase your products from the market.\nGo back.");
    // this.setState({showBlockOrReportModal: false});
  }

  reportUser = () => {
    this.setState({showBlockOrReportModal: false, showReportUserModal: true});
  }

  handleReportTextChange = (report) => this.setState({report})

  sendReport = (uid, report) => {
    const recipients = ['nottmystyle.help@gmail.com'] // string or array of email addresses
    email(recipients, {
        // Optional additional arguments
        //cc: ['bazzy@moo.com', 'doooo@daaa.com'], // string or array of email addresses
        //bcc: 'mee@mee.com', // string or array of email addresses
        subject: `Report regarding User: ${uid}` ,
        body: report
    })
    .catch(console.error)
  }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navigateTo = (screen) => {
    this.props.navigation.navigate(screen, {otherUser: this.state.otherUserUid });
  }

  navToOtherUserProducts = () => this.navigateTo('OtherUserProducts')

  navToOtherUserSoldProducts = () => this.navigateTo('OtherUserSoldProducts')



  navToUserComments = () => {
    // const {params} = this.props.navigation.state;
    const {otherUserUid, comments, profileData, yourProfile} = this.state;
    this.props.navigation.navigate('UserComments', {yourProfile: yourProfile, theirProfile: profileData, comments: comments['a'] ? false : comments, uid: otherUserUid})
  }

  render() {

    var {report, profileData, usersBlocked, noComments, comments, yourUid, otherUserUid, isGetting} = this.state;
    // const {params} = this.props.navigation.state;
    // const {uid} = params; //otherUserUid
    // console.log(usersBlocked, uid, usersBlocked.includes(uid));

    // const gradientColors = ["#c8f966", "#307206", "#1c3a09"]; 
    // const gradientColors = ['#7de853','#0baa26', '#064711'];
    // const gradientColors2 = ['#0a968f','#6ee5df', ];
    // alert(profileData.name)
    return (
      <Profile
        currentUser={false}
        isGetting={isGetting}
        profileData={profileData}
        navBack={() => this.props.navigation.goBack()}

        navToOtherUserProducts={this.navToOtherUserProducts}
        navToOtherUserSoldProducts={this.navToOtherUserSoldProducts}

        usersBlocked={usersBlocked}
        otherUserUid={otherUserUid}
        blockUser={this.blockUser}
        unblockUser={this.unblockUser}

        handleReportTextChange={this.handleReportTextChange}
        report={report}
        sendReport={this.sendReport}

        noComments={noComments}
        comments={comments}
        navToUserComments={this.navToUserComments}
        navToOtherUserProfilePage={this.navToOtherUserProfilePage}
      />
    )


  }

}

export default OtherUserProfilePage;

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
  headerContainer: {
    flex: 4,
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    // backgroundColor: 'pink'
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

  topContainer: {
    flexDirection: 'row',
    flex: 0.65
  },

  bottomContainer: {
    flex: 0.35,    
    flexDirection: 'row',
    justifyContent: 'space-between',
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
    // backgroundColor: yellowGreen
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

  smallBlackCircle: {
    position: "absolute",
    top: -15,
    width: 40,
    height: 40,
    borderRadius: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },

  // header: {
  //   flex: 1,
  //   alignItems: 'center',
  //   // justifyContent: 'center',
  //   padding: 20, //maybe not enough padding to lower gear Icon row into view, but that solution would be bad practice
  //   // backgroundColor: 'white',
  //   height: height/1.8,
  // },

  // gearAndPicColumn: {
  //   flex: 3,
  //   flexDirection: 'column',
  //   // flex: 1.0,
  //   // flexDirection: 'row',
  //   // justifyContent: 'space-evenly',
  //   // alignItems: 'center',
  //   marginTop:10,
  //   // width: width - 40,
  //   // paddingRight: 0,
  //   // backgroundColor: 'blue',
  //   // width: width
  // },

  // gearRow: {
  //   // flex: 1,
  //   flexDirection: 'row',
  //   justifyContent: 'space-between',
  //   alignContent: 'flex-start',
  //   margin: 2
  //   // backgroundColor: 'white'
  // },

  // picRow: {
  //   width: 250,
  //   // flex: 3.5,
  //   // flexDirection: 'row',
  //   justifyContent: 'center',
  //   // alignContent: 'flex-start',
  //   // height: height/5,
  //   // backgroundColor: 'yellow'
  //   // alignItems: 'flex-start',
  // },

  // profileTextColumn: {
  //   flex: 1.4,
  //   flexDirection: 'column',
  //   alignItems: 'center',
  //   // paddingTop: 15,
  //   // backgroundColor: 'red'

  // },

  // profileText: new avenirNextText("#fff", 18, "300"),

  // midContainer: {
  //   flex: 1,
  //   flexDirection: 'row',
  //   // width: width,
  //   // height: height/7.5,
  //   backgroundColor: '#cdcdd6',
  //   justifyContent: 'center'
  // },

  // numberCard: {
  //   flex: 79.5,
  //   justifyContent: 'center',
  //   alignContent: 'center',
  //   alignItems: 'center',
  //   // width: width/2 - 20,
  //   // height: 60,
  //   //55
  //   // paddingTop: 20,
  //   // paddingBottom: 5,
  //   // paddingLeft: 30,
  //   // paddingRight: 30,
  //   borderWidth: 0,
  //   borderColor: '#020202',
  //   borderRadius: 0,
  // },

  // subText: {
  //   fontFamily: 'Avenir Next',
  //   fontSize: 18,
  //   fontWeight: '400',
  //   color: graphiteGray,
  // },

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
  header: {
    flex: 1.4,
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    //backgroundColor: 'black'
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
    borderWidth: 0
  },
  name: {
    ...textStyles.generic,
    marginTop: 10,
    fontSize: 18,
    color: 'black'
  },

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

reviewsHeaderContainer: {
  flexDirection: 'row',
  paddingTop: 5,
  width: width-15,
  justifyContent: 'space-between'
},

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

modal: {flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 30},
modalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Iowan Old Style',
    fontWeight: "bold"
},
modalText: {
    textAlign: 'justify',
    fontSize: 15,
    fontFamily: 'Times New Roman',
    fontWeight: "normal"
},
hideModal: {
    paddingTop: 40,
    fontSize: 20,
    color: 'green',
    fontWeight:'bold'
  },

documentOpenerContainer: {
    height: 130,
    flexDirection: 'column',
    justifyContent: 'space-between',
    padding: 10,
    paddingTop: 20,
    paddingBottom: 15,
    alignItems: 'center'
},
blockUser: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Times New Roman'
},
reportUser: {
    color: 'black',
    fontSize: 25,
    fontFamily: 'Times New Roman',
},

reportModal: {flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center', padding: 25, marginTop: 22},
reportModalHeader: {
    textAlign: 'center',
    fontSize: 20,
    fontFamily: 'Iowan Old Style',
    fontWeight: "bold",
    paddingBottom: 20,
},

reportInput: {width: width - 40, height: 120, marginBottom: 50, borderColor: highlightGreen, borderWidth: 1}

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


