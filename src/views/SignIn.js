import React, { Component } from 'react';
import { AsyncStorage, Dimensions, View, Modal, Text, TextInput, Image, Platform, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';

import PushNotification from 'react-native-push-notification';
// import {initializePushNotifications} from '../Services/NotificationService'

import { Hoshi } from 'react-native-textinput-effects';
import { PacmanIndicator } from 'react-native-indicators';
// import Spinner from 'react-native-spinkit';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {Button} from 'react-native-elements'
//import AwesomeButtonRick from 'react-native-really-awesome-button/src/themes/rick'
//import GeoAttendance from './geoattendance.js';

import firebase from '../cloud/firebase.js';
// import {database} from '../cloud/database';

import {GoogleSignin} from 'react-native-google-signin'
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import { systemWeights, iOSColors } from 'react-native-typography';
import {avenirNextText} from '../constructors/avenirNextText'
import {shadow} from '../constructors/shadow'
// import HomeScreen from './HomeScreen';
// import { SignUpToCreateProfileStack } from '../stackNavigators/signUpToEditProfileStack';

// var provider = new firebase.auth.GoogleAuthProvider();
import {lightGray, treeGreen, highlightGreen, lightGreen, logoGreen, mantisGreen, almostWhite, darkGreen} from '../colors'
import { LoadingIndicator, SignInTextInput, CustomTextInput } from '../localFunctions/visualFunctions.js';
import { filterObjectByKeys } from '../localFunctions/arrayFunctions.js';
import Svg, { Path } from 'react-native-svg';
import config from '../Config/index.js';
import { isUserRegistered } from '../Services/AuthService.js';
// import { withNavigation } from 'react-navigation';
const {width,} = Dimensions.get('window');

const passwordResetText = "Enter your email and we will send you a link to reset your password"

//THIS PAGE: 
//Allows user to sign in or sign up and handles the flow specific to standard sign in, or standard sign up, or google sign in, or google sign up.
//Updates products on firebase db by scouring products from each user's list of products.
//Updates each user's chats on firebase db by identifying what rooms they are in (which products they currently want to buy or sell) and attaching the relevant information.


//var database = firebase.database();

// var googleAuthProvider = new firebase.auth.GoogleAuthProvider();
// var facebookAuthProvider = new firebase.auth.FacebookAuthProvider();

function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
    return Math.floor(seconds/86400);
    
}

class ViewWithChildAtPosition extends Component { 

    constructor(props){
        super(props);
    }

    render() {
        const {flex} = this.props;

        return (
            <View style={{flex: flex, backgroundColor: this.props.color ? this.props.color : null, paddingHorizontal: 2, justifyContent: 'flex-start', alignItems: 'center'}}>
                {this.props.children}
            </View>
        )
        }
}



//currently no barrier to logging in and signing up
class SignIn extends Component {

    constructor(props) {
      super(props);
      this.state = { 
        products: [], email: '', uid: '', pass: '', loading: false, loggedIn: false, 
        googleIconColor: '#db3236', fbIconColor: "#3b5998",
        saveUsernamePass: true,
        showPasswordReset: false
    };
      }

    async componentWillMount () {
        await this.initializePushNotifications(true);

        // let promiseToRetrieveBoolean = AsyncStorage.get('saveUsernamePass');
        // let promiseToSetCredentials = 

        await AsyncStorage.getItem('saveUsernamePass')
        .then( (data) => {
            // console.log(data);
            this.setState({saveUsernamePass: data == "true" ? true : false}, () => {
                if(this.state.saveUsernamePass) {
                    AsyncStorage.multiGet(['previousEmail', 'previousPassword'] ).then((data)=> {
                        this.setState({email: data[0][1] ? data[0][1] : '', pass: data[1][1] ? data[1][1] : '', }) 
                    })
                }
                
            })
        })
        .catch( () => {
            console.log("Error Retrieving Data")
        })

        
        
    }

    componentDidMount() {
        Platform.OS === "ios" ?
            GoogleSignin.configure({
                iosClientId: '791527199565-tcd1e6eak6n5fcis247mg06t37bfig63.apps.googleusercontent.com',
            })
            :
            GoogleSignin.configure();
        

        let i = 0;
        const googleIconColors = ['#3cba54', '#db3236', '#f4c20d', '#4885ed'];
        const fbIconColors = ["#3b5998", "#8a3ab9", "#cd486b", almostWhite];
        this.colorRefreshId = setInterval( () => {
            // i = Math.random() > 0.5 ? Math.random() > 0.5 ? Math.random() > 0.5 ? 1 : 2 : 4 : 3
            i++
            // console.log(googleIconColors[i % 4])
            this.setState({googleIconColor: googleIconColors[i % 4], fbIconColor: fbIconColors[i % 4]})
        }, 3500)
        // .then( () => {console.log('google sign in is now possible')})

    }

    componentWillUnmount() {
        clearInterval(this.colorRefreshId);
    }

    initializePushNotifications = (willSaveToken) => {
        console.log('About to ask user for access')
        // PushNotification.requestPermissions(); 
        PushNotification.configure({
      
          // (optional) Called when Token is generated (iOS and Android)
          onRegister: function(token) {
              console.log( 'TOKEN:', token );
              willSaveToken ? AsyncStorage.setItem('token', token.token) : null;
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

    // saveEmailForFuture = async email => {
    //     try {
    //       await AsyncStorage.setItem('previousEmail', email);
    //     } catch (error) {
    //       // Error retrieving data
    //       console.log(error.message);
    //     }
    //   };

    // getPreviousEmail = async () => {
    //     let email = 'none';
    //     try {
    //       email = await AsyncStorage.getItem('previousEmail');
    //       if (email !== null) {
    //         // We have data!!
    //         console.log(email);
    //         return email;
    //       }

    //       else {
    //           email = 'none';
    //           return email;
    //       }
    //     } catch (error) {
    //       // Error retrieving data
    //       console.log(error.message);
    //     }
        
    //   }

    // Invoked when onSignInPress() AND signInWithGoogle()  are pressed: 
    // that is when user presses Sign In Button, or when they choose to sign up or sign in through Google 
    //The G and F UserBooleans are used only in the attemptSignUp function to determine what data to navigate with to the CreateProfile Screen.
    successfulLoginCallback = () => {
        this.setState({loading: false}, () => {this.props.navigation.navigate('AppStack')});
        // let {data} = await isUserRegistered(this.state.email);
        // if(data.isRegistered) {
        //     this.setState({loading: false}, () => {this.props.navigation.navigate('AppStack')});
        // }
        // else {
        //     this.attemptSignUp(user, googleUserBoolean, facebookUserBoolean)
        // }

        // firebase.database().ref('/Users').once('value', (snapshot) => {
        //     var Users = snapshot.val();
        //     // var all = d.Products;
        //     //If NottMyStyle does not know you yet, prompt them to enter details:
        //     // - Location
        //     // - Insta
        //     // - Show Image

        //     //retrieve database and list of users and check if this users's uid is in that list of users
        //     //if the user is a new user (trying to sign up with google
        //     // or
        //     // TODO: trying to sign in with google
        //     // or
        //     // just doesn't exist in the database yet):
        //     // var {Users} = d
        //     // console.log(`${!Object.keys(Users).includes(user.uid)} that user is NOT in database, and needs to Sign Up`)
        //     if(!Object.keys(Users).includes(user.uid)) {
        //         this.attemptSignUp(user, googleUserBoolean, facebookUserBoolean)
        //     } 
        //     else {
                
        //     //if the user isn't new, then re update their notifications (if any)
            
        //         // if(Users[user.uid].products) {
        //         //     // console.log('updating notifications a person should receive based on their products', d.Users[user.uid].products )

        //         //     // var productKeys = d.Users[user.uid].products ? Object.keys(d.Users[user.uid].products) : [];
        //         //     // console.log("Maybe we need a new method to find subset of Products Here: " + JSON.stringify(all), typeof all)
        //         //     // var yourProducts = filterObjectByKeys(all, productKeys);
        //         //     // console.log(yourProducts);
        //         //     // var yourProducts = all.filter((product) => productKeys.includes(product.key) );
        //         //     // console.log(yourProducts)
                    
        //         //     //TODO: move notification count functionality to server side
        //         //     // const notifications = d.Users[user.uid].notifications ? d.Users[user.uid].notifications : false
        //         //     // if(notifications) {
        //         //     //     this.shouldSendNotifications(user.uid, notifications);
        //         //     // }
                    
        //         // }
        //         // this.setState({loading: false});
        //         this.setState({loading: false}, () => {this.props.navigation.navigate('AppStack')});
        //         // this.props.navigation.navigate('HomeScreen');
                
        //     }

            
        // } )
    }

    //Invoked when user tries to sign in even though they don't exist in the system yet
    attemptSignUp = (socialUser, googleUserBoolean, facebookUserBoolean) => {
        //check if user wishes to sign up through standard process (the former) or through google or through facebook so 3 cases
        //
        console.log('attempting to sign up', socialUser);
        this.setState({loading: false});
        !socialUser ? 
            this.props.navigation.navigate('CreateProfile', {user: false, googleUserBoolean: false, facebookUserBoolean: false})
        :
            googleUserBoolean && !facebookUserBoolean ? 
                this.props.navigation.navigate('CreateProfile', {user: socialUser, googleUserBoolean: true, facebookUserBoolean: false, pictureuris: [socialUser.user.photo],})
            :
                this.props.navigation.navigate('CreateProfile', {user: socialUser, googleUserBoolean: false, facebookUserBoolean: true, pictureuris: [socialUser.user.picture.data.url],})
                //this.props.navigation.navigate('CreateProfile', {user, googleUserBoolean, pictureuris: [user.photoURL],})
    }

    //onPress Google Icon
    signInWithGoogle = () => {
        !this.state.loading ? this.setState({loading: true}) : null;
        // console.log('trying to sign with google')
        GoogleSignin.signIn()
        .then((data) => {
            //TODO: Since "google sign in with account" pop up does not show after person selects an account, 
            //need a way to unlink google account and revive original chain fully so user may use another google account to sign up
            //maybe look at other apps
            console.log(data);
            
            let {idToken, accessToken, user} = data;
            let socialInformation = {
                idToken, accessToken, user
            }
            return socialInformation;
            
        })
        .then(async (socialInformation) => {
            // console.log(socialInformation.user.email)
            let {data} = await isUserRegistered(socialInformation.user.email);
            if(data.isRegistered) {
                this.setState({loading: false}, () => {this.props.navigation.navigate('AppStack')});
            }
            else {
                this.setState({loading: false}, () => {this.attemptSignUp(socialInformation, true, false)})
            }
            
            
            // console.log("STATUS:" + JSON.stringify(isRegistered));
            // this.successfulLoginCallback(currentUser, googleUserBoolean = true, facebookUserBoolean = false);
            // console.log('successfully signed in:', currentUser);
            // console.log(JSON.stringify(currentUser.toJSON()))
        })
        .catch( (err) => {alert("Error is that: " + err); this.setState({loading: false})})
    }

    signInWithFacebook = () => {
        this.setState({loading: true});

        //Neat Trick: Define two functions (one for success, one for error), with a thenable based on the object returned from the Promise.
        LoginManager.logOut();
        LoginManager.logInWithReadPermissions(['email']).then(
            (result) => {
              
              if (result.isCancelled) {
                this.setState({loading: false});
              } 
              else {
                
                AccessToken.getCurrentAccessToken().then( (token) => {
                    // console.log(data)
                    const infoRequest = new GraphRequest(
                        '/me?fields=name,picture,email',
                        null,
                        async (error, result) => {
                            if(error) {
                                alert('Error fetching data: ' + error.toString());
                            }
                            else {
                                // console.log("GraphRequest was successful", result.picture.data.url);
                                let {data} = await isUserRegistered(result.email);
                                if(data.isRegistered) {
                                    this.setState({loading: false}, () => {this.props.navigation.navigate('AppStack')});
                                }
                                else {
                                    let socialInformation = {
                                        accessToken: token.accessToken,
                                        user: result
                                    }
                                    this.setState({loading: false}, () => {this.attemptSignUp(socialInformation, false, true)})
                                }
                            }
                        }
                    );
                    // Start the graph request.
                    new GraphRequestManager().addRequest(infoRequest).start();


                    // console.log("access token retrieved: " + data + data.accessToken);
                    //Credential below throws an error if the associated email address already has an account within firebase auth

                    // var credential = firebase.auth.FacebookAuthProvider.credential(data.accessToken);
                    // console.log("the credential is:" + credential)
                    // return firebase.auth().signInWithCredential(credential);

                    

                } )
                
                // .then( (currentUser) => {
                //     console.log("Firebase User Is:" + currentUser);
                //     this.successfulLoginCallback(currentUser, googleUserBoolean = false, facebookUserBoolean = true);
                // })
                // .catch( err => {
                //     alert("The login failed because: " + err);
                //     this.setState({loading: false});
                // })


                // .catch( (err) => alert('Login failed with error: ' + err))
                // alert('Login was successful with permissions: '
                //   + result.grantedPermissions.toString());
              }
            },
            (error) => {
              alert('Login failed because: ' + error);
            }
          );
    }

    onSignInPress = () => {
        this.setState({ error: '', loading: true });
        const { email, pass } = this.state;

        if (!email || !pass) {
            alert("You cannot Sign In if your email and/or password fields are blank.");
            this.setState({loading: false});
        }
        else if (!pass.length >= 6) {
            alert("Your password's length must be greater or equal to 6 characters.");
            this.setState({loading: false});
        }
        else {
//now that person has input text, their email and password are here
        
        firebase.auth().signInWithEmailAndPassword(email, pass)
            .then(() => {
                // console.log("Have I affected auth behavior?")
                //This function behaves as an authentication listener for user. 
                //If user signs in, we only use properties about the user to:
                //1. notifications update on cloud & local push notification scheduled notifications 4 days from now for each product that deserves a price reduction.
                firebase.auth().onAuthStateChanged( (user) => {
                    if(user) {
                        // console.log(`User's Particular Identification: ${user.uid}`);
                        //could potentially navigate with user properties like uid, name, etc.
                        //TODO: once you sign out and nav back to this page, last entered
                        //password and email are still there

                        // this.saveEmailForFuture(email);
                        // AsyncStorage.setItem('previousEmail', email);
                        this.state.saveUsernamePass ? AsyncStorage.multiSet([ ['previousEmail', email], ['previousPassword', pass] ]) : null;

                        this.successfulLoginCallback();
                        
                        // this.setState({loading: false, loggedIn: true})
                        
                    }
                })
                          //this.authChangeListener();
                          //cant do these things:
                          //firebase.database().ref('Users/7j2AnQgioWTXP7vhiJzjwXPOdLC3/').set({name: 'Imad Rajwani', attended: 1});
            })
            .catch( () => {
                let err = 'Authentication failed, please sign up or enter correct credentials.';
                this.setState( { loading: false } );
                alert(err);
            })

            //TODO:unmute
            // .catch( () => {
            //     //if user fails to sign in with email, try to sign them in with google?
            //     this.signInWithGoogle();
            // })

        }

        
            

    }

    arrayToObject(arr, keyField) {
        Object.assign({}, ...arr.map(item => ({[item[keyField]]: item})))
    }

    shouldSendNotifications(your_uid, notificationsObj) {
        // var tasks = Object.keys(notificationsObj)
        // tasks.forEach
        var message;
        var notificationData;
        if(notificationsObj.priceReductions) {
            for(var specificNotification of Object.values(notificationsObj.priceReductions)) {
                if(!specificNotification.localNotificationSent) {
                    let localNotificationProperty = {};
                    localNotificationProperty[`/Users/${specificNotification.uid}/notifications/priceReductions/${specificNotification.key}/localNotificationSent/`] = true;
                    let promiseToScheduleNotification = firebase.database().ref().update(localNotificationProperty);
                    promiseToScheduleNotification.then( () => {
                        var month = new Date().getMonth() + 1;
                        var date= new Date().getDate();
                        var year = new Date().getFullYear();
                        
                        //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
                        notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                        
                        // console.log(month, date)
        
                        //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                        // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                        // console.log(message);
                        PushNotification.localNotificationSchedule({
                            message: specificNotification.message,// (required)
                            date: notificationDate,
                            vibrate: false,
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
                
                
                //send notification 1 hour later
                notificationDate = new Date();
                notificationDate.setHours(notificationDate.getHours() + 1); 
                
                // console.log(month, date)

                //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                // console.log(message);
                message = `Your product: ${specificNotification.name} is being posted over by ${specificNotification.sellerName}. Please contact us at nottmystyle.help@gmail.com if it does not arrive in 2 weeks.`
                PushNotification.localNotificationSchedule({
                    message: message,// (required)
                    date: notificationDate,
                    vibrate: false,
                });
            }
        }

        if(notificationsObj.itemsSold) {
            for(var specificNotification of Object.values(notificationsObj.itemsSold)) {
                notificationDate = new Date();
                notificationDate.setHours(notificationDate.getHours() + 1); 
                
                // console.log(month, date)

                //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
                // var specificNotificatimessage = `Nobody has initiated a chat about, ${specificNotification.name} from ${specificNotification.brand} yet, since its submission on the market ${specificNotification.daysElapsed} days ago 🤔. Consider a price reduction from £${specificNotification.price} \u2192 £${Math.floor(0.80*specificNotification.price)}?`;
                // console.log(message);
                message = `Please deliver ${specificNotification.name} to ${specificNotification.buyerName} so we may transfer funds to your PayPal account.`
                PushNotification.localNotificationSchedule({
                    message: message,// (required)
                    date: notificationDate,
                    vibrate: false,
                });
            }
        }

        // for(var product of arrayOfProducts) {
        //     if(product.shouldReducePrice) {
        //         console.log('should reduce price');

        //         var month = new Date().getMonth() + 1;
        //         var date= new Date().getDate();
        //         var year = new Date().getFullYear();
                
        //         //send notification four days after NottMyStyle recognizes this product warrants a price reduction.
        //         var notificationDate = new Date( `${date + 4 > 31 ? month + 1 > 12 ? 1 : month + 1 : month}/${date + 4 > 31 ? 1 : date + 4}/${date + 4 > 31 && month + 1 > 12 ? year + 1 : year}`)
                
        //         // console.log(month, date)

        //         //TODO: in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
        //         var message = `Nobody has initiated a chat about, ${product.text.name} from ${product.text.brand} yet, since its submission on the market ${product.daysElapsed} days ago 🤔. Consider a price reduction from £${product.text.price} \u2192 £${Math.floor(0.80*product.text.price)}?`;
        //         // console.log(message);
        //         PushNotification.localNotificationSchedule({
        //             message: message,// (required)
        //             date: notificationDate,
        //             vibrate: false,
        //         });

        //         // var postData = {
        //         //     name: product.text.name,
        //         //     price: product.text.price,
        //         //     uri: product.uris[0],
        //         //     daysElapsed: product.daysElapsed,
        //         //     message: message,
        //         //     date: notificationDate,
        //         // }
        //         // var notificationUpdates = {};
        //         // notificationUpdates['/Users/' + your_uid + '/notifications/' + product.key + '/'] = postData;
        //         // firebase.database().ref().update(notificationUpdates);
        //     }
        // }


    }

    toggleSaveUsernamePass = () => {
        this.setState({saveUsernamePass: !this.state.saveUsernamePass}, () => {
            AsyncStorage.setItem('saveUsernamePass', this.state.saveUsernamePass ? "true" : "false");
        });
    }

    toggleShowPasswordReset = () => {
        this.setState({showPasswordReset: !this.state.showPasswordReset});
    }

    renderPasswordResetModal = () => {
        return (
            <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.showPasswordReset}
            >
                <View style={[styles.signInContainer, {padding: 0, marginHorizontal: 0, marginTop: Platform.OS == 'ios' ? 22 : 0}]}>
                    <View style={styles.headerBar}>
                        <FontAwesomeIcon
                        name='close'
                        size={28}
                        color={'black'}
                        onPress={this.toggleShowPasswordReset}
                        />
                    </View>
                    <View style={styles.passwordResetContainer}>

                        <View style={{flex: 0.2, margin: 5, alignItems: 'center'}}>
                            <Text style={new avenirNextText("#fff", 18, "300")}>{passwordResetText}</Text>
                        </View>

                        <View style={{flex: 0.2, margin: 5}}>
                            <TextInput 
                            maxLength={40} 
                            placeholder={"Email Address"} 
                            placeholderTextColor={lightGray}
                            value={this.state.email} onChangeText={email => this.setState({ email })}
                            clearButtonMode={'while-editing'}
                            underlineColorAndroid={"transparent"}
                            style={[{height: 50, width: 280 }, new avenirNextText('#fff', 20, "300")]}
                            
                            />
                        </View>
                        
                        
                        <TouchableOpacity 
                        onPress={()=> {
                            firebase.auth().sendPasswordResetEmail(this.state.email)
                            .then( async () => {
                                await this.toggleShowPasswordReset;
                                alert('Password Reset Email successfully sent! Please check your inbox for instructions on how to reset your password');
                            })
                            .catch( () => {
                                alert('Please input a valid email address');
                            })
                        }}
                        style={{backgroundColor: "#fff", margin: 10, height: 50, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={new avenirNextText('black', 18, "300", 'center')}>SEND</Text>
                        </TouchableOpacity>
                        

                    </View>
                </View>
            </Modal>
        )
    }


    render() {

        const {loading} = this.state;
        // console.log("Hello Sign In Page");
        // AsyncStorage.getItem('previousEmail').then((d)=>console.log(d + 'getItem'))
        
        
        return (
            <SafeAreaView style={[{flex: 1, backgroundColor: "#122021"}]}>
            <View style={styles.signInContainer}>

                
                    <View style={styles.companyLogoContainer}>
                        <Svg height={"80%"} width={"80%"} viewBox="0 0 400 400">
                            <Path d="M176.987 71.667 C 175.607 71.824,171.088 72.399,166.946 72.943 C 162.803 73.488,158.661 74.008,157.741 74.098 C 156.820 74.188,155.502 74.473,154.812 74.730 C 152.417 75.625,143.508 78.067,142.152 78.201 C 141.402 78.275,139.896 78.880,138.804 79.544 C 137.713 80.209,135.482 81.431,133.848 82.260 C 130.007 84.207,126.014 87.729,124.648 90.374 C 117.773 103.689,144.787 128.855,174.217 136.553 C 182.189 138.639,182.390 138.738,180.729 139.762 C 179.757 140.361,179.440 143.110,179.225 152.796 C 178.904 167.268,179.225 169.253,181.829 168.883 C 183.663 168.622,183.682 168.463,183.682 153.724 L 183.682 138.829 189.958 139.080 L 196.234 139.331 196.064 136.934 C 195.125 123.742,170.796 103.119,148.587 96.689 C 139.484 94.054,139.667 94.226,143.761 92.138 C 164.727 81.442,229.212 81.380,253.294 92.033 C 257.957 94.096,257.911 94.158,250.119 96.308 C 231.687 101.395,215.371 112.855,206.435 126.991 C 198.756 139.138,198.873 140.234,207.758 139.428 L 213.808 138.879 213.808 153.736 C 213.808 167.611,213.911 168.613,215.381 168.898 C 217.967 169.399,218.384 167.502,218.386 155.230 C 218.387 142.257,218.047 139.995,216.023 139.505 C 214.250 139.076,214.792 138.865,224.898 136.060 C 243.936 130.776,262.771 117.650,271.787 103.384 C 274.094 99.733,274.668 88.806,272.482 90.157 C 272.027 90.438,271.912 90.051,272.216 89.259 C 272.510 88.493,272.409 87.866,271.992 87.866 C 271.575 87.866,270.098 86.831,268.711 85.565 C 257.191 75.053,210.004 67.903,176.987 71.667 M229.707 77.368 C 247.465 80.029,261.230 84.778,266.404 90.029 L 268.792 92.451 266.823 93.004 C 262.785 94.138,260.251 93.814,260.251 92.164 C 260.251 83.500,203.103 76.874,169.038 81.589 C 152.122 83.930,137.238 88.870,137.238 92.142 C 137.238 93.818,134.731 94.144,130.645 92.999 C 128.682 92.449,128.701 92.398,131.953 89.460 C 144.508 78.117,193.923 72.005,229.707 77.368 M144.770 100.093 C 162.578 104.671,178.149 115.087,187.147 128.441 C 191.706 135.207,190.896 135.797,180.180 133.512 C 158.770 128.946,141.726 118.383,131.287 103.211 C 126.521 96.284,128.330 95.866,144.770 100.093 M268.614 98.536 C 268.606 100.924,259.409 112.137,253.553 116.899 C 244.244 124.468,230.781 130.639,217.309 133.512 C 206.521 135.813,205.770 135.230,210.491 128.219 C 220.706 113.050,240.124 101.595,261.857 97.917 C 267.931 96.889,268.620 96.952,268.614 98.536 M270.473 106.913 C 267.447 107.922,269.558 110.969,274.895 113.294 C 285.602 117.959,293.691 126.911,297.063 137.829 C 298.696 143.114,298.745 145.518,298.745 220.590 L 298.745 297.908 286.192 297.908 L 273.640 297.908 273.640 232.385 C 273.640 165.739,273.575 164.289,270.609 165.427 C 269.646 165.796,269.456 174.557,269.456 218.500 C 269.456 252.832,269.167 271.130,268.624 271.130 C 268.166 271.130,264.602 264.758,260.703 256.971 C 253.189 241.962,252.438 240.927,250.485 242.880 C 249.191 244.175,264.001 275.764,267.881 279.984 C 269.394 281.629,269.469 283.098,269.260 306.762 L 269.038 331.799 234.937 332.018 L 200.837 332.236 200.837 246.453 C 200.837 160.786,200.839 160.669,202.537 160.669 C 205.117 160.669,205.341 158.707,203.220 154.684 C 202.051 152.465,201.131 148.924,200.861 145.607 C 200.467 140.762,200.213 140.138,198.536 139.900 L 196.653 139.633 196.653 235.934 L 196.653 332.236 162.552 332.018 L 128.452 331.799 128.259 305.021 C 128.153 290.293,128.059 252.892,128.050 221.908 L 128.033 165.574 126.151 165.841 L 124.268 166.109 124.054 232.008 L 123.839 297.908 111.292 297.908 C 101.814 297.908,98.744 297.652,98.741 296.862 C 98.351 182.988,98.769 143.196,100.411 137.878 C 103.851 126.741,112.378 117.478,123.393 112.913 C 129.299 110.465,130.456 106.501,125.007 107.385 C 121.317 107.984,114.156 111.591,111.251 114.314 C 109.009 116.416,107.429 117.001,108.448 115.352 C 108.821 114.748,108.677 114.613,108.065 114.991 C 107.527 115.324,107.259 115.877,107.470 116.219 C 107.682 116.561,106.413 118.418,104.652 120.345 C 102.890 122.273,101.599 123.849,101.782 123.849 C 101.966 123.849,101.181 125.262,100.038 126.989 C 98.896 128.715,97.102 132.387,96.053 135.148 L 94.145 140.167 93.911 221.130 L 93.676 302.092 95.836 302.092 C 97.972 302.092,97.994 302.159,97.823 308.030 C 97.600 315.654,97.399 315.551,111.965 315.283 L 123.931 315.063 123.790 325.523 L 123.648 335.983 125.900 336.254 C 128.003 336.506,128.137 336.768,127.926 340.201 C 127.802 342.224,127.909 344.088,128.165 344.343 C 128.420 344.599,160.221 344.803,198.833 344.798 L 269.038 344.788 269.289 340.646 C 269.516 336.902,269.746 336.480,271.691 336.244 L 273.841 335.983 273.700 325.523 L 273.559 315.063 285.632 315.314 C 300.283 315.619,300.261 315.631,299.590 307.631 C 299.197 302.954,299.328 302.070,300.398 302.168 C 301.099 302.232,302.158 302.241,302.751 302.188 C 303.623 302.110,303.782 286.604,303.588 220.711 L 303.347 139.331 300.707 133.235 C 296.696 123.972,289.025 114.911,282.194 111.366 C 281.137 110.817,280.542 109.964,280.859 109.452 C 281.192 108.914,281.049 108.764,280.517 109.092 C 280.015 109.403,277.778 108.963,275.547 108.115 C 273.316 107.268,271.033 106.727,270.473 106.913 M148.428 242.499 C 146.974 243.418,129.900 278.101,130.317 279.289 C 130.518 279.864,131.410 280.335,132.299 280.335 C 134.805 280.335,152.236 244.764,150.554 243.082 C 149.904 242.433,148.947 242.170,148.428 242.499 M123.849 306.366 C 123.849 310.682,123.644 311.397,122.526 310.968 C 121.798 310.689,120.900 310.460,120.531 310.460 C 120.162 310.460,119.664 309.707,119.423 308.787 C 119.182 307.866,118.350 307.113,117.573 307.113 C 116.797 307.113,115.964 307.866,115.724 308.787 C 115.069 311.288,111.466 311.012,110.466 308.384 C 109.553 305.981,107.113 306.339,107.113 308.876 C 107.113 310.078,106.508 310.460,104.603 310.460 C 102.150 310.460,102.092 310.364,102.092 306.302 L 102.092 302.144 112.343 301.880 C 117.981 301.736,122.877 301.536,123.222 301.436 C 123.567 301.337,123.849 303.555,123.849 306.366 M295.069 303.416 C 294.789 304.144,294.561 306.027,294.561 307.600 C 294.561 311.133,290.712 312.001,290.226 308.577 C 290.050 307.342,289.383 306.695,288.285 306.695 C 287.186 306.695,286.519 307.342,286.343 308.577 C 286.152 309.923,285.512 310.460,284.100 310.460 C 282.689 310.460,282.048 309.923,281.857 308.577 C 281.499 306.057,278.344 305.984,277.987 308.489 C 277.340 313.025,273.640 311.399,273.640 306.579 L 273.640 302.092 284.608 302.092 C 294.266 302.092,295.516 302.250,295.069 303.416 M158.181 336.656 C 158.169 336.976,158.159 337.992,158.159 338.912 C 158.159 341.345,154.336 341.221,153.694 338.767 C 153.433 337.767,153.417 336.628,153.659 336.236 C 154.169 335.411,158.214 335.787,158.181 336.656 M175.732 338.583 C 175.732 341.556,171.084 341.513,170.515 338.536 C 170.210 336.942,170.514 336.421,171.881 336.197 C 174.644 335.744,175.732 336.418,175.732 338.583 M141.423 338.494 C 141.423 340.472,141.172 340.586,136.820 340.586 C 132.469 340.586,132.218 340.472,132.218 338.494 C 132.218 336.516,132.469 336.402,136.820 336.402 C 141.172 336.402,141.423 336.516,141.423 338.494 M149.791 338.494 C 149.791 340.167,149.372 340.586,147.699 340.586 C 146.548 340.586,145.607 340.240,145.607 339.817 C 145.607 339.395,145.378 338.453,145.099 337.725 C 144.703 336.693,145.164 336.402,147.191 336.402 C 149.406 336.402,149.791 336.711,149.791 338.494 M167.035 337.725 C 166.756 338.453,166.527 339.395,166.527 339.817 C 166.527 341.737,162.528 340.530,162.138 338.494 C 161.774 336.587,161.996 336.402,164.641 336.402 C 166.943 336.402,167.438 336.675,167.035 337.725 M184.100 338.549 C 184.100 341.486,179.651 341.244,179.231 338.285 C 179.003 336.683,179.347 336.402,181.532 336.402 C 183.732 336.402,184.100 336.710,184.100 338.549 M192.469 338.494 C 192.469 340.140,192.044 340.586,190.474 340.586 C 189.011 340.586,188.373 340.028,188.080 338.494 C 187.728 336.656,187.971 336.402,190.074 336.402 C 192.070 336.402,192.469 336.750,192.469 338.494 M200.686 338.285 C 200.510 339.520,199.843 340.167,198.745 340.167 C 197.646 340.167,196.979 339.520,196.804 338.285 C 196.584 336.740,196.933 336.402,198.745 336.402 C 200.556 336.402,200.905 336.740,200.686 338.285 M209.713 337.725 C 209.434 338.453,209.205 339.395,209.205 339.817 C 209.205 340.240,208.264 340.586,207.113 340.586 C 205.439 340.586,205.021 340.167,205.021 338.494 C 205.021 336.711,205.405 336.402,207.621 336.402 C 209.648 336.402,210.109 336.693,209.713 337.725 M218.259 338.285 C 217.839 341.244,213.389 341.486,213.389 338.549 C 213.389 336.710,213.758 336.402,215.958 336.402 C 218.143 336.402,218.487 336.683,218.259 338.285 M226.778 338.494 C 226.778 340.167,226.360 340.586,224.686 340.586 C 223.536 340.586,222.594 340.240,222.594 339.817 C 222.594 339.395,222.366 338.453,222.086 337.725 C 221.690 336.693,222.151 336.402,224.178 336.402 C 226.394 336.402,226.778 336.711,226.778 338.494 M235.146 338.494 C 235.146 340.140,234.722 340.586,233.152 340.586 C 231.689 340.586,231.051 340.028,230.758 338.494 C 230.406 336.656,230.649 336.402,232.752 336.402 C 234.748 336.402,235.146 336.750,235.146 338.494 M244.023 337.725 C 243.743 338.453,243.515 339.395,243.515 339.817 C 243.515 341.737,239.515 340.530,239.126 338.494 C 238.761 336.587,238.984 336.402,241.628 336.402 C 243.931 336.402,244.426 336.675,244.023 337.725 M252.391 337.725 C 252.111 338.453,251.883 339.395,251.883 339.817 C 251.883 340.240,250.941 340.586,249.791 340.586 C 248.117 340.586,247.699 340.167,247.699 338.494 C 247.699 336.711,248.083 336.402,250.299 336.402 C 252.326 336.402,252.787 336.693,252.391 337.725 M265.121 338.285 C 264.842 340.250,256.904 341.775,256.904 339.863 C 256.904 339.415,256.675 338.453,256.396 337.725 C 255.969 336.614,256.650 336.402,260.638 336.402 C 265.086 336.402,265.371 336.522,265.121 338.285" 
                            stroke="#fff" 
                            strokeWidth="3"/>
                        </Svg>
                        {/* <Image source={Platform.OS == 'ios' ? require('../images/companyLogo2.jpg') : {uri: 'asset:/companyLogo2.jpg'}} style={styles.companyLogo}/> */}

                    </View>
                    
                    <View style={styles.twoTextInputsContainer}>
                        
                        {/* <View style={styles.inputContainer}>

                            <View style={styles.input}>
                                <TextInput
                                secureTextEntry={false}
                                style={styles.inputText}
                                placeholder={'Email Address'}
                                placeholderTextColor={lightGray}
                                onChangeText={email => this.setState({ email })}
                                value={this.state.email}
                                multiline={false}
                                autoCorrect={false}
                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={"transparent"}
                                keyboardType={'email-address'}
                                returnKeyType={'next'}
                                onSubmitEditing={()=>{this.passInput.focus()}}
                                />         
                            </View>
                            
                        </View>

                        <View style={styles.inputContainer}>
                            <View style={styles.input}>
                                <TextInput
                                secureTextEntry={true}
                                style={styles.inputText}
                                placeholder={'Password'}
                                placeholderTextColor={lightGray}
                                onChangeText={pass => this.setState({ pass })}
                                value={this.state.pass}
                                multiline={false}
                                
                                autoCorrect={false}
                                
                                clearButtonMode={'while-editing'}
                                underlineColorAndroid={"transparent"}
                                returnKeyType={'done'}
                                ref={ref => this.passInput = ref}
                                
                                
                                />         
                            </View>
                        </View> */}

                        <View style={{paddingVertical: 2}}>
                            <Hoshi
                                label={'Email Address'}
                                
                                labelStyle={ new avenirNextText(lightGray, 15, "500") }
                                value={this.state.email}
                                onChangeText={email => this.setState({ email })}
                                autoCorrect={false}
                                // this is used as active border color
                                borderColor={'#122021'}
                                // this is used to set backgroundColor of label mask.
                                // please pass the backgroundColor of your TextInput container.
                                // maskColor={"#120221"}
                                inputStyle={new avenirNextText(lightGreen, 15, "300")}
                                keyboardType={'email-address'}
                                returnKeyType={'next'}
                                onSubmitEditing={() => this.passInput.focus()}
                            />
                        </View>    
                        <View style={{ paddingVertical: 2}}>
                            <Hoshi
                                label={'Password'}
                                labelStyle={ new avenirNextText(lightGray, 15, "500") }
                                value={this.state.pass}
                                onChangeText={pass => this.setState({ pass })}
                                autoCorrect={false}
                                secureTextEntry
                                // this is used as active border color
                                borderColor={'#122021'}
                                // this is used to set backgroundColor of label mask.
                                // maskColor={"#120221"}
                                // please pass the backgroundColor of your TextInput container.
                                inputStyle={new avenirNextText('#fff', 15, "300")}
                                ref={ref => this.passInput = ref}
                                // onSubmitEditing={this.onSignInPress}
                            />
                        </View>

                        <View style={{ flexDirection: 'row', justifyContent: 'flex-start', marginVertical: 15, marginHorizontal: 5}}>
                            <View style={{ justifyContent: 'center', alignItems: 'flex-start', marginHorizontal: 5}}>
                                <TouchableOpacity onPress={this.toggleSaveUsernamePass} style={{height: 25, width: 25, borderWidth: 2, borderColor: '#fff', justifyContent: 'center', alignItems: 'center'}}>
                                    {this.state.saveUsernamePass ?
                                        <Icon
                                        name="check"
                                        size={22}
                                        color={"#fff"} 
                                        />
                                    :
                                        null
                                    }
                                </TouchableOpacity>
                            </View>
                            <View style={{ justifyContent: 'center', alignItems: 'center', marginHorizontal: 5}}>
                                <Text onPress={this.toggleSaveUsernamePass} style={new avenirNextText("#fff", 14, "300")}>Remember Username & Password</Text>
                            </View>
                        </View>

                        {loading ? 
                            null
                        :
                            <TouchableOpacity 
                            onPress={this.toggleShowPasswordReset}
                            style={styles.forgotPasswordContainer}>
                                <Text style={new avenirNextText('#fff', 14, "300")}>Forgot Password?</Text>
                            </TouchableOpacity>
                        }

                        

                    </View>
                
                {loading ? 
                    <View style={styles.allAuthButtonsContainer}>
                        <LoadingIndicator isVisible={loading} color={lightGreen} type={'Wordpress'}/>
                    </View>
                :
                    
                        
                <View style={[styles.allAuthButtonsContainer]}>

                    <ViewWithChildAtPosition flex={1/7}  >
                        {Platform.OS == "ios" ? 
                            <Icon
                                name="google" 
                                size={30} 
                                color={this.state.googleIconColor}
                                onPress={() => this.signInWithGoogle()}
                            />
                        :
                            null
                        }
                    </ViewWithChildAtPosition>

                    <View style={styles.twoAuthButtonsContainer}>
                        
                            <View style={{ paddingVertical: 10 }}>
                            <Button
                                title='Sign In' 
                                titleStyle={{ fontWeight: "700" }}
                                buttonStyle={{
                                backgroundColor: darkGreen,
                                //#2ac40f
                                //#45bc53
                                //#16994f
                                borderColor: "#37a1e8",
                                borderWidth: 0,
                                borderRadius: 5,
                                
                                }}
                                
                                onPress={() => {this.onSignInPress()} } 
                            />
                            </View>

                            <View style={{ paddingVertical:10 }}>
                            <Button
                                title='Create Account' 
                                titleStyle={styles.authButtonText}
                                buttonStyle={{
                                backgroundColor: darkGreen,
                                //#2ac40f
                                borderColor: "#226b13",
                                borderWidth: 0,
                                borderRadius: 5
                                }}
                                
                                onPress={
                                    () => {
                                        // this.props.navigation.navigate('CreateProfile')
                                        this.attemptSignUp(user = false, googleUserBoolean = false, facebookUserBoolean = false)
                                        } 
                                    }
                            />
                            </View>
                        
                    </View>

                    <ViewWithChildAtPosition flex={1/7} >

                        <Icon
                            name="facebook-box" 
                            size={33} 
                            color={this.state.fbIconColor}
                            onPress={() => this.signInWithFacebook()}
                        />
                            
                    </ViewWithChildAtPosition>

                </View>
                }

                
                
                
                
                    
                    

                    
                    
            {this.renderPasswordResetModal()}
            </View>
            
            </SafeAreaView>
                    )


                    

            
        }

}

export default SignIn;


const styles = StyleSheet.create({

  //SIGNIN OR SIGNUP Page
    firstContainer: {
      flex: 1,
      // marginTop: 5,
      //marginBottom: 5,
      padding: 40,
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      //alignContent
      backgroundColor: '#122021',
      //#fff
    },

  //SIGN IN PAGE
    signInContainer: {
      flex: 1,
      marginHorizontal: 15,
    //   marginTop: 20,
      //marginBottom: 5,
    //   padding: 15,
      flexDirection: 'column',
      // justifyContent: 'space-between',
      // alignContent: 'center',
      backgroundColor: '#122021',
      //#fff
    },
    companyLogoContainer: {
      flex: 0.25,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#122021',
      paddingBottom: 10
    },
    companyLogo: {
      //resizeMode: 'container',
      borderColor:'#207011',
      // alignItems:'center',
      // justifyContent:'center',
      width:90,
      height:100,
      backgroundColor:'#122021',
      borderRadius:45,
      borderWidth: 1,
      //marginLeft: (width/4)-10,
      // paddingLeft: 25,
      // paddingRight: 25
  
  },

  twoTextInputsContainer: {
    flex: 0.4,
    // justifyContent: 'flex-start',
    // backgroundColor: 'red',
    // alignItems: 'center',
    // paddingHorizontal: 10
    // backgroundColor: 'red'
  },

  inputContainer: {
      marginVertical: 7,
      marginHorizontal: 5,
      justifyContent: 'center'
    //   alignItems: 'center'
  },

//   placeholderContainer: {
//     position: 'absolute', flex: 1, justifyContent: 'flex-start', alignItems: 'center'
//   },

  input: {
    height: 45, borderRadius: 22.5, backgroundColor: '#fff', 
    padding: 10, 
    // justifyContent: 'center', alignItems: 'flex-start',
    ...new shadow(2,2, color = mantisGreen, -1, 1)
},

  inputText: { fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500", color: highlightGreen},

  allAuthButtonsContainer: {
    flex: 0.30,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'yellow'
  },

  twoAuthButtonsContainer: {
    flex: 5/7,
    // backgroundColor: 'white',
    // justifyContent: 'flex-end',
    // alignItems: 'center'
  },

  forgotPasswordContainer: {
    //   flex: 0.05,
      flexDirection: 'row',
      justifyContent: 'center',
    //   marginLeft: 15,
      alignItems: 'center',
      
  },

  headerBar: {
      flex: 0.07,
      flexDirection: 'row',
      padding: 10,
      justifyContent: 'flex-start',
      alignItems: 'center',
      backgroundColor: logoGreen
  },

  passwordResetContainer: {
    flex: 0.93,
    paddingVertical: 5,
    paddingHorizontal: 10
  },

    authButtonText: { fontWeight: "bold" },
    container: {
      alignItems: 'stretch',
      flex: 1
    },
    body: {
      flex: 9,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'center',
      backgroundColor: '#F5FCFF',
    },
    inputStyle: {
         paddingRight: 5,
         paddingLeft: 5,
         paddingBottom: 2,
         color: 'blue',
         fontSize: 18,
         fontWeight: '200',
         flex: 2,
         height: 100,
         width: 300,
         borderColor: 'gray',
         borderWidth: 1,
  },
  
  
     containerStyle: {
         height: 45,
         flexDirection: 'column',
          alignItems: 'flex-start',
          width: '75%',
          borderColor: 'gray',
         borderBottomWidth: 1,
     },
    aicontainer: {
      flex: 1,
      justifyContent: 'center'
    }
    ,
    horizontal: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      padding: 10
    }
    ,
    toolbar: {
          height: 56,
      backgroundColor: '#e9eaed',
    },
    textInput: {
      height: 40,
      width: 200,
      borderColor: 'red',
      borderWidth: 1
    },
    transparentButton: {
      marginTop: 10,
      padding: 15
    },
    transparentButtonText: {
      color: '#0485A9',
      textAlign: 'center',
      fontSize: 16
    },
    primaryButton: {
      margin: 10,
      padding: 15,
      backgroundColor: '#529ecc'
    },
    primaryButtonText: {
      color: '#FFF',
      textAlign: 'center',
      fontSize: 18
    },
    image: {
      width: 100,
      height: 100
    },


    





  });
// if(loggedIn) {
//     return <HomeScreen/>
// }

//TODO:unmute
{/* <GoogleSigninButton
                            style={{ width: 200, height: 48 }}
                            size={GoogleSigninButton.Size.Standard}
                            color={GoogleSigninButton.Color.Light}
                            onPress={ () => this.signInWithGoogle() }

                        /> */}