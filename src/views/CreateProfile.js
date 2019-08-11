import React, { Component } from 'react'
import { Linking, Dimensions, Text, StyleSheet, SafeAreaView, View, Image, ScrollView, Platform, Modal, TouchableOpacity, Keyboard, KeyboardAvoidingView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import RNFetchBlob from 'react-native-fetch-blob';
import RNFetchBlob from 'rn-fetch-blob';
// import { Sae } from 'react-native-textinput-effects';
import firebase from '../cloud/firebase.js';
import MultipleAddButton from '../components/MultipleAddButton.js';
import { iOSColors } from 'react-native-typography';
import { EulaTop, EulaBottom, TsAndCs, PrivacyPolicy, EulaLink } from '../legal/Documents.js';
import { lightGray, treeGreen, bobbyBlue, mantisGreen, bgBlack, almostWhite, flashOrange, highlightGreen, logoGreen } from '../colors.js';
// import { PacmanIndicator } from 'react-native-indicators';
import {WhiteSpace, GrayLine, LoadingIndicator, CustomTextInput} from '../localFunctions/visualFunctions';
import { shadow } from '../constructors/shadow.js';
import { avenirNextText } from '../constructors/avenirNextText.js';
import { center } from '../constructors/center.js';
import ImageResizer from 'react-native-image-resizer';

const {width, height} = Dimensions.get('window');

// TODO: store these in common file as thumbnail spec for image resizing
const maxWidth = 320, maxHeight = 320, suppressionLevel = 0;
// const inputHeightBoost = 4;
const info = "In order to sign up, ensure that the values you input meet the following conditions:\n1. Take a profile picture of yourself. If you wish to keep your image a secret, just take a picture of your finger pressed against your camera lens to simulate a dark blank photo.\n2. Use a legitimate email address as other buyers and sellers need a way to contact you if the functionality in NottMyStyle is erroneous for some reason.\n3. Your Password's length must be greater than or equal to 6 characters. To add some security, consider using at least one upper case letter and one symbol like !.\n4. Please limit the length of your name to 40 characters.\n5. An Example answer to the 'city, country abbreviation' field is: 'Nottingham, UK' "
const limeGreen = '#2e770f';

// const locations = [{country: "UK", flag: "🇬🇧"},{country: "Pakistan", flag: "🇵🇰"},{country: "USA", flag: "🇺🇸"}]
const locations = [{country: "UK", flag: "uk"},{country: "Pakistan", flag: "pk"},{country: "USA", flag: "usa"}]


const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

// const Fetch = RNFetchBlob.polyfill.Fetch
// // replace built-in fetch
// window.fetch = new Fetch({
//     // enable this option so that the response data conversion handled automatically
//     auto : true,
//     // when receiving response data, the module will match its Content-Type header
//     // with strings in this array. If it contains any one of string in this array, 
//     // the response body will be considered as binary data and the data will be stored
//     // in file system instead of in memory.
//     // By default, it only store response data to file system when Content-Type 
//     // contains string `application/octet`.
//     binaryContentTypes : [
//         'image/',
//         'video/',
//         'audio/',
//         'foo/',
//     ]
// }).build()

// const { State: TextInputState } = TextInput;

// const CustomTextInput = ({placeholder, onChangeText, value, autoCapitalize, maxLength, secureTextEntry}) => (
//     <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start'}}>
//         <TextInput
//         secureTextEntry={secureTextEntry ? true : false}
//         style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
//         placeholder={placeholder}
//         placeholderTextColor={lightGray}
//         onChangeText={onChangeText}
//         value={value}
//         multiline={false}
//         maxLength={maxLength}
//         autoCorrect={false}
//         autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
//         clearButtonMode={'while-editing'}
//         underlineColorAndroid={"transparent"}
        
//         />         
//     </View>
// )

class CreateProfile extends Component {
  constructor(props) {
      super(props);
      var {params} = this.props.navigation.state;
    //   //set values to google account info if they tried to sign up with google 
    //   //(technically they've already signed in to firebase auth but THAT IS IT, 
    //   //now we have to fake the process of them continuing to sign up)
    //   const {user} = params.user ? user : false;
    // If person navigates here to edit their current profile, they should be able to update their profile
      this.editProfileBoolean = this.props.navigation.getParam('editProfileBoolean', false)
      this.state = {
          uid:  this.editProfileBoolean ? firebase.auth().currentUser.uid : '',
          email: params.googleUserBoolean || params.facebookUserBoolean ? params.user.user.email : '',
          pass: '',
          pass2: '',
          firstName: params.googleUserBoolean || params.facebookUserBoolean ? params.user.user.name.split(" ")[0] : '',
          lastName: params.googleUserBoolean || params.facebookUserBoolean ? params.user.user.name.split(" ")[1] : '',
          city: '',    
          country: '',
        //   size: 1,
          uri: undefined,
          insta: '',
          fabActive: true,
          modalVisible: false,
          termsModalVisible: false,
          privacyModalVisible: false,
          infoModalVisible: false,
          createProfileLoading: false,

          //////COUNTRY SELECT STUFF
          showCountrySelect: false,

          ////EDIT PROFILE STUFF
          editProfileBoolean: false,
          previousUri: false,

          //Keyboard Aware View Stuff
          keyboardShown: false,
        //   shift: new Animated.Value(0),
      }
  }

//   componentWillMount = () => {
//     this.keyboardDidShowSubscription = Keyboard.addListener('keyboardDidShow', this.handleKeyboardDidShow);
//     this.keyboardDidHideSubscription = Keyboard.addListener('keyboardDidHide', this.handleKeyboardDidHide);
//   }

  componentDidMount() {

    this.keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      this.keyboardDidShow.bind(this),
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      this.keyboardDidHide.bind(this),
    );
      //If you navigate here for the purpose of editing your profile, 
      //then you should see your current values, be able to edit them and then save your info.
    var editProfileBoolean = this.props.navigation.getParam('editProfileBoolean', false)
    if(editProfileBoolean) {
        this.getProfile(this.state.uid);
    }
    
  }

   keyboardDidShow() {
    this.setState({keyboardShown: true})
  }

  keyboardDidHide() {
    this.setState({keyboardShown: false})
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

//   componentWillUnmount = () => {
//     this.keyboardDidShowSub.remove();
//     this.keyboardDidHideSub.remove();
//   }

//   handleKeyboardDidShow = (event) => {
//     const { height: windowHeight } = Dimensions.get('window');
//     const keyboardHeight = event.endCoordinates.height;
//     const currentlyFocusedField = TextInputState.currentlyFocusedField();
//     UIManager.measure(currentlyFocusedField, (originX, originY, width, height, pageX, pageY) => {
//       const fieldHeight = height;
//       const fieldTop = pageY;
//       const gap = (windowHeight - keyboardHeight) - (fieldTop + fieldHeight);
//       if (gap >= 0) {
//         return;
//       }
//       Animated.timing(
//         this.state.shift,
//         {
//           toValue: gap,
//           duration: 1000,
//           useNativeDriver: true,
//         }
//       ).start();
//     });
//   }

//   handleKeyboardDidHide = () => {
//     Animated.timing(
//       this.state.shift,
//       {
//         toValue: 0,
//         duration: 1000,
//         useNativeDriver: true,
//       }
//     ).start();
//   }

  setModalVisible = (visible) => {
    this.setState({modalVisible: visible});
  }
  //Invoked when you 'Accept' EULA as a Google User trying to sign up
  createProfileForGoogleOrFacebookUser = async (user, pictureuri, socialPlatform) => {
    console.log('Initiate FB or Google Sign Up')
    this.setState({createProfileLoading: true});
    if(socialPlatform == "google") {
        const {idToken, accessToken} = user;
        const credential = await firebase.auth.GoogleAuthProvider.credential(idToken, accessToken);
        const socialUser = await firebase.auth().signInWithCredential(credential);
        const {email, pass} = this.state
        const linkWithEmailCredential = await firebase.auth.EmailAuthProvider.credential(email, pass);
        console.log(credential);
        firebase.auth().currentUser.linkAndRetrieveDataWithCredential(linkWithEmailCredential).then( (usercred) => {
            // console.log(usercred);
            this.updateFirebase(this.state, pictureuri, mime='image/jpg',socialUser.uid, );
            // console.log("Account linking success", usercred.user);
        }, function(error) {
            console.log("Account linking error", error);
        });   
    }
    else {
        const {accessToken} = user;
        const credential = await firebase.auth.FacebookAuthProvider.credential(accessToken);
        const socialUser = await firebase.auth().signInWithCredential(credential);
        const {email, pass} = this.state
        const linkWithEmailCredential = await firebase.auth.EmailAuthProvider.credential(email, pass);
        console.log(credential);
        firebase.auth().currentUser.linkAndRetrieveDataWithCredential(linkWithEmailCredential).then( (usercred) => {
            // console.log(usercred);
            this.updateFirebase(this.state, pictureuri, mime='image/jpg',socialUser.uid, );
            // console.log("Account linking success", usercred.user);
        }, function(error) {
            console.log("Account linking error", error);
        });
    }
       
    
    
    
  }



  //Invoked when you 'Accept' EULA as a User trying to sign up through standard process
  createProfile = (email, pass, pictureuri) => {
      this.setState({createProfileLoading: true});
    //   console.log("Initiate Sign Up");
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(() => {
            var unsubscribe = firebase.auth().onAuthStateChanged( ( user ) => {
                unsubscribe();
                if(user) {
                    // console.log("User Is: " + user)
                    const {uid} = user;
                    this.updateFirebase(this.state, pictureuri, mime = 'image/jpg', uid );
                    // alert('Your account has been created.\nPlease use your credentials to Sign In.');
                    // this.props.navigation.navigate('SignIn'); 
                }
                else {
                    alert('Oops, there was an error with account registration!');
                }
            })
            }
        )
        .catch(() => {
            this.setState({ error: 'You already have a NottMyStyle account. Please use your credentials to Sign In', createProfileLoading: false, email: '', pass: '', pass2: '' });
            alert(this.state.error)
        });
  }

//   addToUsersRoom() {
    
//     const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;

//     const tokenProvider = new Chatkit.TokenProvider({
//         url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
//       });
  
//     // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
//     // For the purpose of this example we will use single room-user pair.
//     const chatManager = new Chatkit.ChatManager({
//     instanceLocator: CHATKIT_INSTANCE_LOCATOR,
//     userId: CHATKIT_USER_NAME,
//     tokenProvider: tokenProvider
//     });

//     chatManager.connect().then(currentUser => {
//         this.currentUser = currentUser;
//         console.log(this.currentUser);
//         var {rooms} = this.currentUser;
//         console.log(rooms); 
//         this.currentUser.joinRoom({
//             roomId: 15868783 //Users
//           })
//             .then(() => {
//               console.log('Added user to room')
//             })
//         }
//     )
//     //otherwise this function does nothing;
//   }

  //Invoked when one creates a profile for the very first time
  updateFirebase(data, uri, mime = 'image/jpg', uid) {
      console.log('Initiate Firebase Update')
    //TODO: size shouldn't be here
    var updates = {};
    var updateEmptyProducts = {};
    
    //In case user enters a handle with an @ preceding it,
    data.insta = data.insta ? data.insta[0] == '@' ? data.insta.replace('@', '') : data.insta : '';

    var postData = {
        name: data.firstName + " " + data.lastName, //data.firstName.concat(" ", data.lastName)
        country: data.city + ", " + data.country,
        // size: data.size,
        insta: data.insta,
        //Boolean to control if whether Upload Item notification should be sent
        isNoob: true

        //TODO: Add user uid here to make navigation to their profile page easier. 
        //Occam's razor affirms the notion: To have it available to append to any branch later, it must exist for the first time at the source.
    }
    //Now we have all information for profile branch of a user

    
    updates['/Users/' + uid + '/profile/'] = postData; 
    // updates['/Users/' + uid + '/status/'] = 'offline';
    updates['/Users/' + uid + '/products/'] = '';
    //Now we have a user who may go through the app without components crashing
    
    let promiseToUploadPhoto = new Promise(async (resolve, reject) => {
        //We want to take a user's uri, resize the photos (necessary when picture is locally taken),
        //and then upload them to cloud storage, and store the url refs on cloud db;

        if(uri.includes('googleusercontent') || uri.includes('platform')) {
            console.log(`We already have a googlePhoto url: ${uri}, so need for interaction with cloud storage`)
            
            // const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            resolve(uri);
        }
        else {
            console.log('user has chosen picture manually through photo lib or camera.')
            let resizedImage = await ImageResizer.createResizedImage(uri,3000, 3000,'JPEG',suppressionLevel);
            const uploadUri = Platform.OS === 'ios' ? resizedImage.uri.replace('file://', '') : resizedImage.uri
            let uploadBlob = null
            const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            fs.readFile(uploadUri, 'base64')
            .then((data) => {
                return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
                console.log('got to blob')
                uploadBlob = blob
                return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
                uploadBlob.close()
                return imageRef.getDownloadURL()
            })
            .then((url) => {
    
                resolve(url)
                
            })
            .catch((error) => {
                reject(error)
            })
        }
    
        
    
    })
    
    

    return {
        databaseProfile: firebase.database().ref().update(updates), 
        storage: promiseToUploadPhoto.then((url) => {
            //update db with profile picture url
            var profileUpdates = {};
            profileUpdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
            firebase.database().ref().update(profileUpdates);
            return url
                
            }).then( (url) => {
                if(url.includes('googleusercontent') || url.includes('facebook')) {
                    this.setState({createProfileLoading: false, modalVisible: false}, 
                        () => {
                            // console.log('DONE DONE DONE');
                            this.props.navigation.navigate('AppStack'); 
                        })
                }
                else {
                    this.successfulProfileCreationCallback(url);
                }
                
            })
            
        } 

  }

  successfulProfileCreationCallback = (url) => {
    // console.log("Profile Picture Cloud URL is: " + url);
    // this.props.navigation.state.params.googleUserBoolean || this.props.navigation.state.params.googleUserBoolean ? alert('Your account has been created.\nPlease enter your credentials to Sign In from now on.\n') : alert('Your account has been created.\nPlease use your credentials to Sign In.\n'); 
    // alert('Your account has been created.\nPlease use your credentials to Sign In.\n'); 
    this.setState({createProfileLoading: false, modalVisible: false});
    this.props.navigation.navigate('AppStack');
  }

  ///////////////////////
  //EDIT PROFILE FUNCTIONS

  getProfile = (uid) => {
      var profile;

      firebase.database().ref().once("value", (snap) => {
        profile = snap.val().Users[uid].profile;

        //pull uri as well and store it in pictureuris, and if there's no uri, MAB doesn't show anything
        var {name, country, insta} = profile;
        this.setState({editProfileBoolean: true, firstName: name.split(" ")[0], lastName: name.split(" ")[1], city: country.split(", ")[0],country: country.split(", ")[1], insta, previousUri: profile.uri ? profile.uri : false })


      })
  }

  editProfile(data, uri, mime = 'image/jpg', uid) {
    
    this.setState({createProfileLoading: true});
    var updates = {};
    // switch(data.size) {
    //     case 0:
    //         data.size = 'Extra Small'
    //         break; 
    //     case 1:
    //         data.size = 'Small'
    //         break;
    //     case 2:
    //         data.size = 'Medium'
    //         break;
    //     case 3:
    //         data.size = 'Large'
    //         break;
    //     case 4:
    //         data.size = 'Extra Large'
    //         break;
    //     case 5:
    //         data.size = 'Extra Extra Large'
    //         break;
    //     default:
    //         data.size = 'Medium'
    //         console.log('no gender was specified')
    // }

    data.insta = data.insta ? data.insta[0] == '@' ? data.insta.replace('@', '') : data.insta : '';

    // var postData = {
    //     name: data.firstName + " " + data.lastName, //data.firstName.concat(" ", data.lastName)
    //     country: data.city + ", " + data.country,
    //     // size: data.size,
    //     insta: data.insta,
        
    // }

    let profileRef = '/Users/' + uid + '/profile/';

    updates[profileRef + 'name/'] = data.firstName + " " + data.lastName; 
    updates[profileRef + 'country/'] = data.city + ", " + data.country;
    updates[profileRef + 'insta/'] = data.insta;
    // updates['/Users/' + uid + '/status/'] = 'online'; //TODO: Leave for later. Originally made to check if a person is in the chat room

    let promiseToUploadPhoto = new Promise(async (resolve, reject) => {

        if(uri.includes('googleusercontent') || uri.includes('platform') || uri.includes('firebasestorage')) {
            console.log(`We already have a url for this image: ${uri}, so need for interaction with cloud storage, just store URL in cloud db`);
            
            // const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            resolve(uri);
        }
        else {
            console.log('user has chosen picture manually through photo lib or camera, store it on cloud and generate a URL for it.')
            let resizedImage = await ImageResizer.createResizedImage(uri,3000, 3000,'JPEG',suppressionLevel);
            const uploadUri = Platform.OS === 'ios' ? resizedImage.uri.replace('file://', '') : resizedImage.uri
            let uploadBlob = null
            const imageRef = firebase.storage().ref().child(`Users/${uid}/profile`);
            fs.readFile(uploadUri, 'base64')
            .then((data) => {
            return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
            console.log('got to blob')
            uploadBlob = blob
            return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
            uploadBlob.close()
            return imageRef.getDownloadURL()
            })
            .then((url) => {
    
                resolve(url)
                
            })
            .catch((error) => {
            reject(error)
            })
        }
    
        
    
    })

    return {database: firebase.database().ref().update(updates), 
            storage: promiseToUploadPhoto.then((url) => {
                //update db with profile picture url
                var profileUpdates = {};
                profileUpdates['/Users/' + uid + '/profile/' + 'uri/'] = url ;
                firebase.database().ref().update(profileUpdates);
                return url
                    
                }).then( (url) => {
                    if(url.includes('googleusercontent') || url.includes('facebook')) {
                        this.setState({createProfileLoading: false}, 
                            () => {
                                // console.log('DONE DONE DONE');
                                this.props.navigation.navigate('ProfilePage'); 
                            })
                    }
                    else {
                        // alert('Your profile has successfully been updated!'); 
                        this.setState({createProfileLoading: false});
                        this.props.navigation.navigate('ProfilePage');
                    }
                    
                })
    }
  }

  toggleShowCountrySelect = () => {
    this.setState({showCountrySelect: !this.state.showCountrySelect});
  }

  renderLocationSelect = () => (
    <View style={[{flexDirection: 'row'}, styles.inputContainer]}>
        <View style={{flex: 0.7}}>
            <TextInput 
            style={styles.inputText}
            placeholder={"City"} 
            placeholderTextColor={lightGray}
            value={this.state.city} 
            onChangeText={city => this.setState({ city })}
            maxLength={16}
            clearButtonMode={'while-editing'}
            underlineColorAndroid={"transparent"}
            returnKeyType={'default'}
            />
            
        </View>

        <TouchableOpacity style={{flex: 0.3, justifyContent: 'center'}} onPress={this.toggleShowCountrySelect}>
            <Text 
            style={styles.inputText}
            >
            {this.state.country ? this.state.country : "Country"}
            </Text>
        </TouchableOpacity>
    
    </View>
  )

  renderLocationSelectModal = () => (
    <Modal
    animationType="slide"
    transparent={false}
    visible={this.state.showCountrySelect}
    >
        <SafeAreaView style={styles.mainContainer}>
            <View style={styles.headerBar}>
                <FontAwesomeIcon
                name='close'
                size={28}
                color={'black'}
                onPress={this.toggleShowCountrySelect}
                />
            </View>

            <View style={styles.locationSelectBody}>
                {locations.map((location, index) => (
                    <TouchableOpacity key={index} onPress={()=>{
                        this.setState({country: location.country}, this.toggleShowCountrySelect)
                    }} 
                    style={[{flexDirection: 'row'}, {borderBottomColor: '#fff', borderBottomWidth: 1}]}>
                        <View style={{margin: 5, ...new center()}}>
                            <Image style={{width: 20, height: 20}} source={ location.flag == "usa" ? require('../images/usa.png') : location.flag == "uk" ? require('../images/uk.png') : require('../images/pk.png') }/>
                        </View>
                        <View style={{margin: 5, ...new center()}}>
                            <Text style={new avenirNextText("#fff", 20, "300")}>{location.country}</Text>
                        </View>
                    </TouchableOpacity>
                ))}
            </View>

        </SafeAreaView>
    </Modal>
  )


  ///////////////


  render() {
    const {navigation} = this.props;
    const {params} = navigation.state

    const {createProfileLoading} = this.state;
    // console.log(params);
    //TODO: navigation.getParam would do wonders here;
    // var googleUserBoolean = params.googleUserBoolean ? params.googleUserBoolean : false;
    var googleUser = params.googleUserBoolean ? true : false
    var facebookUser = params.facebookUserBoolean ? true : false
    //may be reusing booleans here, but this check on isUserGoogleUser? alright logically so far
    
    var user = params.googleUserBoolean || params.facebookUserBoolean ? params.user : null //data for google user
    // var googlePhotoURL = params.user.photoURL ? params.user.photoURL : false ;
    // googleUser && googlePhotoURL ? pictureuris = [googlePhotoURL] : 'nothing here';

    var pictureuris = navigation.getParam('pictureuris', "nothing here");
    // console.log(pictureuris);
    (this.state.previousUri && pictureuris == "nothing here") ? pictureuris = [this.state.previousUri] : null;
    // console.log(pictureuris);
    // console.log(pictureuris[0].includes('googleusercontent'))
    // console.log(googleUser, googleUserBoolean, pictureuris);
    var conditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (this.state.city) && (Array.isArray(pictureuris) && pictureuris.length == 1) && (this.state.pass == this.state.pass2) && (this.state.pass.length >= 6);
    var passwordConditionMet = (this.state.pass == this.state.pass2) && (this.state.pass.length > 0);
    // var googleUserConditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1);
    var editProfileConditionMet = (this.state.firstName) && (this.state.lastName) && (this.state.country) && (Array.isArray(pictureuris) && pictureuris.length == 1);
    
    
    if(pictureuris[0].includes('googleusercontent')) {
        googleUserBoolean = true
    }

    if(createProfileLoading) {
        return (
            <SafeAreaView style={styles.loadingIndicatorContainer}>
                <LoadingIndicator isVisible={createProfileLoading} color={treeGreen} type={'Wordpress'}/>
            </SafeAreaView>
        )
    }

    return (
        <SafeAreaView style={styles.mainContainer}>

            <View style={styles.backIconAndMABAndHelpContainer}>
                <View style={{flex: 0.1, justifyContent: 'flex-start',}}>
                    <FontAwesomeIcon
                    name='arrow-left'
                    size={28}
                    color={'#fff'}
                    onPress = { () => { 
                        this.props.navigation.goBack();
                        } }

                    />
                </View>
                <View style={{flex: 0.80, justifyContent: 'flex-start', alignItems: 'center',  }}>
                    <MultipleAddButton navToComponent={'CreateProfile'} pictureuris={pictureuris} />
                </View>
                <View style={{flex: 0.1, justifyContent: 'flex-start', alignItems: 'center'}}>
                    <Icon
                    name='information-variant'
                    size={28}
                    color={'#fff'}
                    onPress={() => this.setState({infoModalVisible: true}) } 

                    />
                </View>    
            </View>


            <ScrollView style={{flex: 0.375}} contentContainerStyle={[styles.container, {paddingBottom: this.state.keyboardShown ? height/5 : 0}]}>
            
            {/* <Text style={{fontFamily: 'Avenir Next', fontWeight: '300', fontSize: 20, textAlign: 'center'}}>Choose Profile Picture:</Text> */}
            
            


            {
                Platform.OS == 'ios' ?
                    <KeyboardAvoidingView behavior={'padding'} keyboardVerticalOffset={80} enabled={this.state.keyboardShown ? true : false}>
                        {!this.state.editProfileBoolean ?

                        <View>

                            

                            <CustomTextInput 
                            maxLength={40} placeholder={"Email Address"} 
                            value={this.state.email} onChangeText={email => this.setState({ email })}
                                
                            />

                            <CustomTextInput 
                            placeholder={"Password"} 
                            value={this.state.pass} 
                            onChangeText={pass => this.setState({ pass })}
                            maxLength={16}
                            secureTextEntry={true}
                            
                            />

                            <CustomTextInput 
                            placeholder={"Retype Password"} 
                            value={this.state.pass2} 
                            onChangeText={pass2 => this.setState({ pass2 })}
                            maxLength={16}
                            secureTextEntry={true}
                            />
                    
                            {this.state.pass && this.state.pass2 ?
                                passwordConditionMet ?
                                <View style={styles.passwordStatusRow}>
                                    <Text style={[styles.passwordStatusText, {color: mantisGreen}]}>Passwords Match!</Text>
                                    <Icon 
                                        name="verified" 
                                        size={30} 
                                        color={mantisGreen}
                                    />
                                </View> 
                                :
                                <View style={styles.passwordStatusRow}>
                                    <Text style={[styles.passwordStatusText, {color: flashOrange}]}>Passwords Don't Match!</Text>
                                    <Icon 
                                        name="alert-circle" 
                                        size={30} 
                                        color={flashOrange}
                                    />
                                </View>
                            :
                            null
                            
                            }
                        </View>
                        :
                        null
                    }   

                    <CustomTextInput 
                    placeholder={"First Name"} 
                    value={this.state.firstName} 
                    onChangeText={firstName => this.setState({ firstName })}
                    maxLength={13}
                    />

                    <CustomTextInput 
                    placeholder={"Last Name"} 
                    value={this.state.lastName} 
                    onChangeText={lastName => this.setState({ lastName })}
                    maxLength={13}
                    />
                    
                    {this.renderLocationSelect()}

                    <CustomTextInput 
                    placeholder={"Instagram Handle (w/o @)"} 
                    value={this.state.insta} 
                    onChangeText={insta => this.setState({ insta })}
                    maxLength={16}
                    />

                    
                    </KeyboardAvoidingView>
                    :
                    <View>
                    {
                        !this.state.editProfileBoolean ?

                        <View>

                            <CustomTextInput maxLength={40} placeholder={"Email Address"} value={this.state.email} onChangeText={email => this.setState({ email })}/>

                            

                            <GrayLine/>

                            <CustomTextInput 
                            placeholder={"Password"} 
                            value={this.state.pass} 
                            onChangeText={pass => this.setState({ pass })}
                            maxLength={16}
                            secureTextEntry={true}
                            />

                            

                            

                            <CustomTextInput 
                            placeholder={"Retype Password"} 
                            value={this.state.pass2} 
                            onChangeText={pass2 => this.setState({ pass2 })}
                            maxLength={16}
                            secureTextEntry={true}
                            />

                            

                            
                            
                    
                            {this.state.pass && this.state.pass2?
                                passwordConditionMet ?
                                <View style={styles.passwordStatusRow}>
                                <Text style={[styles.passwordStatusText, {color: mantisGreen}]}>Passwords Match!</Text>
                                <Icon 
                                    name="verified" 
                                    size={30} 
                                    color={mantisGreen}
                                />
                                </View> 
                                :
                                <View style={styles.passwordStatusRow}>
                                <Text style={[styles.passwordStatusText, {color: flashOrange}]}>Passwords Don't Match!</Text>
                                <Icon 
                                    name="alert-circle" 
                                    size={30} 
                                    color={flashOrange}
                                />
                                </View>
                            :
                            null
                            }
                        </View>
                        :
                        null
                    }   

                    <CustomTextInput 
                    placeholder={"First Name"} 
                    value={this.state.firstName} 
                    onChangeText={firstName => this.setState({ firstName })}
                    maxLength={13}
                    />

                    <CustomTextInput 
                    placeholder={"Last Name"} 
                    value={this.state.lastName} 
                    onChangeText={lastName => this.setState({ lastName })}
                    maxLength={13}
                    />

                    {this.renderLocationSelect()}

                    <CustomTextInput 
                    placeholder={"Instagram Handle (w/o @)"} 
                    value={this.state.insta} 
                    onChangeText={insta => this.setState({ insta })}
                    maxLength={16}
                    />

                    </View>
            }
    
            
            
            
    
            
            
    
            {/* Modal to show legal docs and agree to them before one can create Profile */}
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}
            >
            <View style={styles.modal}>
                
                <Text style={styles.modalHeader}>End-User License Agreement for NottMyStyle</Text>
                <ScrollView contentContainerStyle={styles.licenseContainer}>
                    <Text>{EulaTop}</Text>
                    <Text style={{color: bobbyBlue}} onPress={() => Linking.openURL(EulaLink)}>{EulaLink}</Text>
                    <Text>{EulaBottom}</Text>
                </ScrollView>
                <View style={styles.documentOpenerContainer}>
                    <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, termsModalVisible: true})}}>
                        Terms & Conditions
                    </Text>
                    <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, privacyModalVisible: true})}}>
                        See Privacy Policy
                    </Text>
                </View>
                <View style={styles.decisionButtons}>
                    <TouchableOpacity
                        style={[styles.decisionButton, {backgroundColor: 'black'}]}
                        onPress={() => {this.setModalVisible(false); }} 
                    >
                        <Text style={new avenirNextText('#fff', 16, "500")}>Reject</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.decisionButton, {backgroundColor: mantisGreen}]}
                        onPress={() => {console.log('Sign Up Initiated') ; googleUser ? this.createProfileForGoogleOrFacebookUser(user, pictureuris[0], 'google') : facebookUser ? this.createProfileForGoogleOrFacebookUser(user, pictureuris[0], 'facebook') : this.createProfile(this.state.email, this.state.pass, pictureuris[0]) ;}} 
                    >
                        <Text style={new avenirNextText('#fff', 16, "500")}>Accept</Text>
                    </TouchableOpacity>
                </View>
    
            </View>
            </Modal>
    
            {/* Modal to show Terms and Conditions */}
            <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.termsModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}
            >
                <View style={styles.modal}>
                    <Text style={styles.modalHeader}>Terms & Conditions of Use</Text>
                    <ScrollView contentContainerStyle={styles.licenseContainer}>
                        <Text>{TsAndCs}</Text>
                    </ScrollView>
                    <Text onPress={() => { this.setState({modalVisible: true, termsModalVisible: false}) }} style={styles.gotIt}>
                        Got It!
                    </Text>
                </View>
            </Modal>
    
            {/* Modal to show Privacy Policy */}
            <Modal
            animationType="fade"
            transparent={false}
            visible={this.state.privacyModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}
            >
                <View style={styles.modal}>
                    <Text style={styles.modalHeader}>Privacy Policy of NottMyStyle</Text>
                    <ScrollView contentContainerStyle={styles.licenseContainer}>
                        <Text>{PrivacyPolicy}</Text>
                    </ScrollView>
                    <Text onPress={() => { this.setState({modalVisible: true, privacyModalVisible: false}) }} style={styles.gotIt}>
                        Got It!
                    </Text>
                </View>
            </Modal>
    
            {/* Modal to explicate details required to sign up */}
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.infoModalVisible}
            onRequestClose={() => {
                Alert.alert('Modal has been closed.');
            }}
            >
                <View style={styles.modal}>
                    <ScrollView contentContainerStyle={styles.licenseContainer}>
                        <Text style={styles.info}>{info}</Text>
                    </ScrollView>
                    <Text onPress={() => { this.setState({infoModalVisible: false}) }} style={styles.gotIt}>
                        Got It!
                    </Text>
                </View>
            </Modal>

            {/* Action Buttons */}

            {this.renderLocationSelectModal()}
            
        </ScrollView>

        
        <TouchableOpacity style={styles.signUpButtonContainer} disabled={this.state.editProfileBoolean ? editProfileConditionMet ? true: false : conditionMet ? true: false} onPress={()=>this.setState({infoModalVisible: true})}>
            <TouchableOpacity
                disabled = { this.state.editProfileBoolean ? editProfileConditionMet ? false : true : conditionMet ? false: true}
                style={styles.signUpButton}
                onPress={
                    () => {
                    if(this.state.editProfileBoolean) {
                        this.editProfile(this.state, pictureuris[0], mime = 'image/jpg', this.state.uid);
                    }
                    else {
                        this.setModalVisible(true);
                    }
                    
                    }} 
            >
                <Text style={new avenirNextText("black", 20, "300")}>{this.state.editProfileBoolean ? "Edit Profile" : "Create Account" }</Text>
            </TouchableOpacity>
        </TouchableOpacity>
        

        </SafeAreaView>
        )
      
    

  }
}

export default CreateProfile;

const styles = StyleSheet.create({

    loadingIndicatorContainer: {
        flex: 1, 
        // height: "100%",
        // width: "100%",
        // left: 0,
        justifyContent: 'center', 
        alignItems: 'center', 
        padding: 15, 
        backgroundColor: bgBlack
    },

    mainContainer: {
        flex: 1,
        backgroundColor: bgBlack,
        // height: '100%',
        // justifyContent: 'space-around',
        // left: 0,
        // position: 'absolute',
        // top: 0,
        // width: '100%'
    },
    // mainContainer: {
    //     marginTop: 22,
    //     // borderTopWidth: 1,
    //     // borderTopColor: treeGreen,
    //     paddingTop: 5,
    // },
    container: {
        
        flexGrow: 1, 
        flexDirection: 'column',
        justifyContent: 'center',
        // paddingBottom: 30,
        //alignItems: 'center'
        // marginTop: 20,
        paddingLeft: 10,
        paddingRight: 10,

        

    },

    backIconAndMABAndHelpContainer: {
        flex: 0.4,flexDirection: 'row', 
        // backgroundColor: 'red',
        margin: 5,
        paddingVertical: 3, paddingRight: 2, paddingLeft: 1 
    },

    inputContainer: {
        marginVertical: 7,
        marginHorizontal: 5,
        // padding: 10,
        // justifyContent: 'space-between',
        alignItems: 'stretch'
    },
    
    //   placeholderContainer: {
    //     position: 'absolute', flex: 1, justifyContent: 'flex-start', alignItems: 'center'
    //   },
    
    input: {
      height: 38, borderRadius: 4, backgroundColor: '#fff', 
      padding: 10, 
      // justifyContent: 'center', alignItems: 'flex-start',
      ...new shadow(2,2, color = mantisGreen, -1, 1)
    },
    
    inputText: { fontFamily: 'Avenir Next', fontSize: 16, fontWeight: "500", color: "#fff"},

    signUpButtonContainer: {flex: 0.225,justifyContent: 'center', alignItems: 'center', marginBottom: 4},

    signUpButton: {
        width: 175,
        height: 60,
        borderRadius: 10,
        backgroundColor: "#fff",
        justifyContent: 'center', alignItems: 'center',
        ...new shadow(4,2,'black', -4,4)
    },

    headerBar: {
        flex: 0.07,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: logoGreen
    },

    locationSelectBody: {
        flex: 0.93,
        margin: 5
        // paddingVertical: 5,
        // paddingHorizontal: 10
    },

    modal: {flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, marginTop: 22},
    modalHeader: {
        textAlign: 'center',
        fontSize: 20,
        fontFamily: 'Iowan Old Style',
        fontWeight: "bold"
    },
    acceptText: {
        fontSize: 20,
        color: 'blue'
    },
    rejectText: {
        fontSize: 20,
        color: 'red'
    },
    hideModal: {
      fontSize: 20,
      color: 'green',
      fontWeight:'bold'
    },
    licenseContainer: {
        flexGrow: 0.8, 
        backgroundColor: '#fff',
        flexDirection: 'column',
        justifyContent: 'space-between',
        paddingTop: 5
    },
    documentOpenerContainer: {
        height: 100,
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: 10,
        paddingBottom: 15,
        alignItems: 'center'
    },
    documentOpener: {
        color: limeGreen,
        fontSize: 25,
        fontFamily: 'Times New Roman'
    },
    decisionButtons: {
        width: width - 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    decisionButton: {
        width: 70,
        height: 40,
        borderRadius: 10,
        ...new center(),
        ...new shadow(2,2,'black', -1,1)
    },

    gotIt: {
        fontWeight: "bold",
        color: limeGreen,
        fontSize: 20
    },

    passwordStatusRow: {
        flexDirection: 'row',
        // width: width - 30,
        height: 35,
        marginVertical: 5,
        paddingHorizontal: 10,
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },

    passwordStatusText: {
        fontSize: 20,
        fontWeight: "300",
        fontFamily: "Avenir Next"
    },

    buttonGroupText: {
        fontFamily: 'Iowan Old Style',
        fontSize: 17,
        fontWeight: '300',
    },

    buttonGroupSelectedText: {
        color: 'black'
    },

    buttonGroupContainer: {
        height: 40,
        backgroundColor: iOSColors.lightGray,
        marginBottom: 10,
    },
    
    buttonGroupSelectedContainer: {
        backgroundColor: limeGreen
    },

    info: {
        fontFamily: 'Iowan Old Style',
        fontSize: 15,
        textAlign: 'auto',
        letterSpacing: 1.5
    }
})

{/* <View style={ {flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', padding: 5 } }>
                <Button  
                    buttonStyle={ {
                        backgroundColor: 'black',
                        // width: width/3 +20,
                        // height: height/15,
                        borderRadius: 5,
                    }}
                    icon={{name: 'chevron-left', type: 'material-community'}}
                    title='Back'
                    onPress={() => this.props.navigation.goBack() } 
                />
                <Button  
                    buttonStyle={ {
                        backgroundColor: treeGreen,
                        // width: width/3 +20,
                        // height: height/15,
                        borderRadius: 5,
                    }}
                    icon={{name: 'help', type: 'material-community'}}
                    title='Help'
                    onPress={() => this.setState({infoModalVisible: true}) } 
                />
            </View> */}

// if(googleUserBoolean) {
//     return (
//         <ScrollView style={styles.mainContainer} contentContainerStyle={styles.container}>
//           <View style={ {flexDirection: 'row', backgroundColor: '#fff', justifyContent: 'space-between', padding: 5 } }>
//               <Button  
//                   buttonStyle={ {
//                       backgroundColor: 'black',
//                       // width: width/3 +20,
//                       // height: height/15,
//                       borderRadius: 5,
//                   }}
//                   icon={{name: 'chevron-left', type: 'material-community'}}
//                   title='Back'
//                   onPress={() => this.props.navigation.navigate('SignIn') } 
//               />
//               <Button  
//                   buttonStyle={ {
//                       backgroundColor: treeGreen,
//                       // width: width/3 +20,
//                       // height: height/15,
//                       borderRadius: 5,
//                   }}
//                   icon={{name: 'help', type: 'material-community'}}
//                   title='Help'
//                   onPress={() => this.setState({infoModalVisible: true}) } 
//               />
//           </View>
//           <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center'}}>Choose Profile Picture:</Text>
          
//           <MultipleAddButton navToComponent = {'CreateProfile'} pictureuris={pictureuris} />
  
//           <Sae
//                 style={styles.nameInput}
//                 label={'First Name'}
//                 iconClass={Icon}
//                 iconName={'account'}
//                 iconColor={'black'}
//                 value={this.state.firstName}
//                 onChangeText={firstName => this.setState({ firstName })}
//                 autoCorrect={false}
//                 inputStyle={{ color: 'black' }}
//           />

//           <Sae
//                 style={styles.nameInput}
//                 label={'Last Name'}
//                 iconClass={FontAwesomeIcon}
//                 iconName={'users'}
//                 iconColor={'black'}
//                 value={this.state.lastName}
//                 onChangeText={lastName => this.setState({ lastName })}
//                 autoCorrect={false}
//                 inputStyle={{ color: 'black' }}
//            />
          
//           <Sae
//               label={'City, Country Abbreviation'}
//               iconClass={FontAwesomeIcon}
//               iconName={'globe'}
//               iconColor={highlightGreen}
//               value={this.state.country}
//               onChangeText={country => this.setState({ country })}
//               autoCorrect={false}
//               inputStyle={{ color: highlightGreen }}
//           />
  
//           <Sae
//               label={'@instagram_handle'}
//               iconClass={FontAwesomeIcon}
//               iconName={'instagram'}
//               iconColor={profoundPink}
//               value={this.state.insta}
//               onChangeText={insta => this.setState({ insta })}
//               autoCorrect={false}
//               inputStyle={{ color: profoundPink }}
//           />
  
          
//           <Text style={{fontFamily: 'Cochin', fontWeight: '800', fontSize: 20, textAlign: 'center', marginTop: 10}}>What size clothes do you wear?</Text>
//           <ButtonGroup
//               onPress={ (index) => {this.setState({size: index})}}
//               selectedIndex={this.state.size}
//               buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
//               containerStyle={styles.buttonGroupContainer}
//               buttonStyle={styles.buttonGroup}
//               textStyle={styles.buttonGroupText}
//               selectedTextStyle={styles.buttonGroupSelectedText}
//               selectedButtonStyle={styles.buttonGroupSelectedContainer}
//           />
  
//           {/* Modal to show legal docs and agree to them before one can create Profile */}
//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={this.state.modalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//             <View style={styles.modal}>
              
//               <Text style={styles.modalHeader}>End-User License Agreement for NottMyStyle</Text>
//               <ScrollView contentContainerStyle={styles.licenseContainer}>
//                   <Text style={{fontFamily: 'Avenir Next'}}>{EulaTop}</Text>
//                   <Text style={{color: bobbyBlue}} onPress={() => Linking.openURL(EulaLink)}>{EulaLink}</Text>
//                   <Text style={{fontFamily: 'Avenir Next'}}>{EulaBottom}</Text>
//               </ScrollView>
//               <View style={styles.documentOpenerContainer}>
//                   <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, termsModalVisible: true})}}>
//                       Terms & Conditions
//                   </Text>
//                   <Text style={styles.documentOpener} onPress={() => {this.setState({modalVisible: false, privacyModalVisible: true})}}>
//                       See Privacy Policy
//                   </Text>
//               </View>
//               <View style={styles.decisionButtons}>
//                   <Button
//                       title='Reject' 
//                       titleStyle={{ fontWeight: "300" }}
//                       buttonStyle={{
//                       backgroundColor: rejectRed,
//                       //#2ac40f
//                       width: (width)*0.40,
//                       height: 45,
//                       borderColor: "#226b13",
//                       borderWidth: 0,
//                       borderRadius: 10,
//                       }}
//                       containerStyle={{ marginTop: 0, marginBottom: 0 }}
//                       onPress={() => {this.setModalVisible(false); }} 
//                   />
//                   <Button
//                       title='Accept' 
//                       titleStyle={{ fontWeight: "300" }}
//                       buttonStyle={{
//                       backgroundColor: confirmBlue,
//                       //#2ac40f
//                       width: (width)*0.40,
//                       height: 45,
//                       borderColor: "#226b13",
//                       borderWidth: 0,
//                       borderRadius: 10,
//                       }}
//                       containerStyle={{ marginTop: 0, marginBottom: 0 }}
//                       onPress={() => {console.log('Sign Up Initiated'); googleUser ? this.createProfileForGoogleUser(user, pictureuris[0]) : this.createProfile(this.state.email, this.state.pass, pictureuris[0]) ;}} 
//                   />
//               </View>
  
//             </View>
//           </Modal>
  
//           {/* Modal to show Terms and Conditions */}
//           <Modal
//             animationType="fade"
//             transparent={false}
//             visible={this.state.termsModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <Text style={styles.modalHeader}>Terms & Conditions of Use</Text>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text>{TsAndCs}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({modalVisible: true, termsModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
  
//           {/* Modal to show Privacy Policy */}
//           <Modal
//             animationType="fade"
//             transparent={false}
//             visible={this.state.privacyModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <Text style={styles.modalHeader}>Privacy Policy of NottMyStyle</Text>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text>{PrivacyPolicy}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({modalVisible: true, privacyModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
  
//           {/* Modal to explicate details required to sign up */}
//           <Modal
//             animationType="slide"
//             transparent={false}
//             visible={this.state.infoModalVisible}
//             onRequestClose={() => {
//               Alert.alert('Modal has been closed.');
//             }}
//           >
//               <View style={styles.modal}>
//                   <ScrollView contentContainerStyle={styles.licenseContainer}>
//                       <Text style={styles.info}>{info}</Text>
//                   </ScrollView>
//                   <Text onPress={() => { this.setState({infoModalVisible: false}) }} style={styles.gotIt}>
//                       Got It!
//                   </Text>
//               </View>
//           </Modal>
          
//           <TouchableOpacity disabled = {googleUserConditionMet ? true: false} onPress={()=>this.setState({infoModalVisible: true})}>
//               <Button
//                   disabled = {googleUserConditionMet ? false: true}
//                   large
//                   buttonStyle={{
//                       backgroundColor: treeGreen,
//                       width: width - 50,
//                       height: 85,
//                       borderColor: "transparent",
//                       borderWidth: 0,
//                       borderRadius: 5
//                   }}
//                   icon={{name: 'save', type: 'font-awesome'}}
//                   title='SAVE'
//                   onPress={
//                       () => {
//                       this.setModalVisible(true);
//                       }} 
//               />
//           </TouchableOpacity>
          
//         </ScrollView>
//       )

// }

