import React, { Component } from 'react'
import { Platform, Dimensions, Modal, Text, StyleSheet, ScrollView, View, SafeAreaView, Image, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'

import Svg, { Path } from 'react-native-svg';

import email from 'react-native-email'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Button, Divider} from 'react-native-elements'
// import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';
import { iOSColors, iOSUIKit, human,  } from 'react-native-typography';
// import LinearGradient from 'react-native-linear-gradient'
// import ReviewsList from '../components/ReviewsList.js';
// import { PacmanIndicator } from 'react-native-indicators';
import { bobbyBlue, lightGreen, highlightGreen, graphiteGray, flashOrange, avenirNext, coolBlack, yellowGreen } from '../colors.js';

import {removeFalsyValuesFrom} from '../localFunctions/arrayFunctions.js'
import { LoadingIndicator, ProfileMinutia } from '../localFunctions/visualFunctions.js';
import { avenirNextText } from '../constructors/avenirNextText.js';
// import { Hoshi, Sae } from 'react-native-textinput-effects';
// import { TextField } from 'react-native-material-textfield';
import ProgressiveImage from '../components/ProgressiveImage';

import { textStyles } from '../styles/textStyles.js';

const {width, height} = Dimensions.get('window');

const resizeMode = 'center';

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

const BlackCircleWithCount = ({count, left}) => (
  <View style={[styles.smallBlackCircle]}>
    <Text style={{fontFamily: 'Avenir Next', fontWeight: "700", fontSize: 12, color:'#fff'}}>{count}</Text>
  </View>

)

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
      name: '',
      email: '',
      insta: '',
      uri: '',
      numberProducts: 0,
      soldProducts: 0,
      sellItem: false,
      products: [],
      showBlockOrReportModal: false,
      report: '',
      showReportUserModal: false,
      isGetting: true,
      uid: firebase.auth().currentUser.uid,
      comments: false

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

      let profile = d[otherUserUid].profile;
      let {name, country, insta, uri} = profile;

      //get collection keys of current user
      // var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
      // var rawCollection = collection ? collection : {}
      // var collectionKeys = removeFalsyValuesFrom(rawCollection);  

      var soldProducts = 0, numberProducts = 0;
      //get profile data of seller of product
      if(typeof d[otherUserUid].products === 'object') {
        for(var p of Object.values(d[otherUserUid].products)) {
          if(p.sold) {
            soldProducts++
          }
        }
        
        var numberProducts = Object.keys(d[otherUserUid].products).length;
      }
      

      // var date = (new Date()).getDate();
      // var month = (new Date()).getMonth();
      // var year = (new Date()).getFullYear();

      this.setState({yourProfile, usersBlocked: yourUsersBlocked, yourUid: yourUid, otherUserUid: otherUserUid, profile, name, country, insta, uri, soldProducts, numberProducts, isGetting: false})
    })
  }

  loadReviews = (otherUserUid) => {
    this.setState({isGetting: true});
    firebase.database().ref(`/Users/${otherUserUid}/`).on('value', (snap) => { 
      var d = snap.val();
      var comments = false;
      if(d.comments) {
        comments = d.comments;
      }
      //Removed hard code this.state.comments to unhelpful object with one property
      this.setState({comments, isGetting: false});
    })

  }

  showBlockOrReport = () => {
      this.setState({showBlockOrReportModal: true})
  }

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

  navigateTo = (screen) => {
    this.props.navigation.navigate(screen, {otherUser: this.state.otherUserUid });
  }

  navToOtherUserProfilePage = (uid) => {
    this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
  }

  navToUserComments = () => {
    // const {params} = this.props.navigation.state;
    const {otherUserUid, comments, profile, yourProfile} = this.state;
    this.props.navigation.navigate('UserComments', {yourProfile: yourProfile, theirProfile: profile, comments: comments['a'] ? false : comments, uid: otherUserUid})
  }

  render() {

    const {report, name, country, insta, uri, usersBlocked, soldProducts, numberProducts, comments, yourUid, otherUserUid} = this.state;
    // const {params} = this.props.navigation.state;
    // const {uid} = params; //otherUserUid
    // console.log(usersBlocked, uid, usersBlocked.includes(uid));

    const gradientColors = ["#c8f966", "#307206", "#1c3a09"]; 
    // const gradientColors = ['#7de853','#0baa26', '#064711'];
    // const gradientColors2 = ['#0a968f','#6ee5df', ];

    if(this.state.isGetting) {
      return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30, marginTop: 22}}>
          <LoadingIndicator isVisible={this.state.isGetting} color={'#1c3a09'} type={'Wordpress'}/>
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
                  name="arrow-left"   
                  size={30} 
                  color={'black'}
                  onPress={() => this.props.navigation.goBack()}
              />

          </View>
            

          <View style={styles.profileColumn}>
            {uri ? 
              <ProgressiveImage 
              style= {styles.profilepic} 
              thumbnailSource={ require('../images/blank.jpg') }
              source={ {uri: this.state.uri} }
              
              />
              : 
              <Image style= {styles.profilepic} source={require('../images/blank.jpg')}/>
            } 

            <Text style={[styles.name, {textAlign: 'center'}]}>{name}</Text>

            <ProfileMinutia icon={'city'} text={country} />

            {this.state.insta ? <ProfileMinutia icon={'instagram'} text={`@${insta}`} /> : null}

          </View>

          <View style={styles.iconColumn}>
            <Icon 
              name="account-alert"      
              size={30} 
              color={'#020002'}
              onPress={() => {this.showBlockOrReport()}}
              />
          </View>

          

        </View>

        <View style={styles.bottomContainer}>
              <ButtonContainer>
                <TouchableOpacity style={[styles.blackCircle]} onPress={()=>this.navigateTo('OtherUserProducts')}>
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
                <TouchableOpacity style={styles.blackCircle} onPress={()=>this.navigateTo('OtherUserSoldProducts')}>
                  <Text style={{fontFamily: 'Avenir Next', fontWeight: "700", fontSize: 16, color:'#fff'}}>SOLD</Text>
                </TouchableOpacity>
              </ButtonContainer>

          </View>
      
      </View>

      {/* Number of Products on Market and Sold Cards */}
      
      {/* Other User's Reviews */}
      <View style={styles.footerContainer} >

      <ScrollView style={styles.halfPageScrollContainer} contentContainerStyle={styles.halfPageScroll}>
          <View style={ {backgroundColor: '#fff'} }>

          <View style={styles.reviewsHeaderContainer}>
            <Text style={styles.reviewsHeader}>REVIEWS</Text>
            <FontAwesomeIcon 
              name="edit" 
              style={styles.users}
              size={35} 
              color={iOSColors.black}
              onPress={() => {this.navToUserComments()}}
            /> 
          </View>  
          {!comments ? null : Object.keys(comments).map(
                  (comment) => (
                  <View key={comment} style={styles.commentContainer}>

                      <View style={styles.commentPicAndTextRow}>

                        {comments[comment].uri ?
                        <TouchableHighlight style={styles.commentPic} onPress={()=>{yourUid == comments[comment].uid ? this.props.navigation.navigate('Profile') : this.loadRelevantData(yourUid, comments[comment].uid)} }>
                          <Image style= {styles.commentPic} source={ {uri: comments[comment].uri} }/>
                        </TouchableHighlight>  
                        :
                          <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
                        }
                          
                        <TouchableOpacity onPress={()=>{yourUid == comments[comment].uid ? this.props.navigation.navigate('Profile') : this.loadRelevantData(yourUid, comments[comment].uid)} } style={styles.textContainer}>
                            <Text style={ styles.commentName }> {comments[comment].name} </Text>
                            <Text style={styles.comment}> {comments[comment].text}  </Text>
                        </TouchableOpacity>

                      </View>

                      <View style={styles.commentTimeRow}>

                        <Text style={ styles.commentTime }> {comments[comment].time} </Text>

                      </View>

                      
                  </View>
                  
              )
                      
              )}
          </View>
        </ScrollView>  

      </View>

      {/* Modal to select if whether you wish to block or report user */}
      <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showBlockOrReportModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
       >
          <View style={[styles.modal, {marginTop: Platform.OS == "ios" ? 22 : 0}]}>
            <Text style={styles.modalHeader}>Block or Report This User</Text>
            <Text style={styles.modalText}>If you block this user, then they cannot initiate a chat with you regarding one of your products.</Text>
            <Text style={styles.modalText}>This will delete all chats you have with this individual, so if you decide to unblock this user later, they will have to initiate new chats with you.</Text>
            <Text style={styles.modalText}>If you believe this user has breached the Terms and Conditions for usage of NottMyStyle (for example, through proliferation of malicious content, or improper language), then please explain this to the NottMyStyle Team through email by selecting Report User.</Text>
            <View style={styles.documentOpenerContainer}>
                {usersBlocked.includes(otherUserUid) ?
                    <Text style={styles.blockUser} 
                    onPress={() => {
                      this.unblockUser(otherUserUid); 
                      //this.setState({showBlockOrReportModal: false});
                      }}>
                        Unblock User
                    </Text>
                :
                    <Text style={styles.blockUser} 
                    onPress={() => {
                      this.blockUser(otherUserUid);
                      //this.setState({showBlockOrReportModal: false});
                      }}>
                        Block User
                    </Text>
                }
                
                <Text style={styles.reportUser} onPress={() => {this.reportUser()}}>
                    Report User
                </Text>
            </View>
            <TouchableHighlight
                onPress={() => {
                  this.setState( {showBlockOrReportModal: false} )
                }}>
                <Text style={styles.hideModal}>Back</Text>
            </TouchableHighlight>
          </View>
       </Modal>

       {/* Modal to input Report to User */}
       <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.showReportUserModal}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}
       >
        <DismissKeyboardView>
            <View style={styles.reportModal}>
                <Text style={styles.reportModalHeader}>Please Explain What You Wish To Report About This User</Text>
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
                    width: (width)*0.40,
                    height: 40,
                    borderColor: "#226b13",
                    borderWidth: 0,
                    borderRadius: 20,
                    
                    }}
                    containerStyle={{ marginTop: 0, marginBottom: 0 }}
                    onPress={() => {this.sendReport(otherUserUid, report);}} 
                />
                
                <TouchableHighlight
                    onPress={() => {
                        this.setState( {showReportUserModal: false} )
                    }}>
                    <Text style={styles.hideModal}>Back</Text>
                </TouchableHighlight>
            </View>
          </DismissKeyboardView>
        </Modal>  

      </SafeAreaView>
        
      


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


