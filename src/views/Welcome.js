import React, { Component, Fragment } from 'react'
import { Image, AsyncStorage, SafeAreaView, ImageBackground,Text, View, TouchableOpacity, StyleSheet, Platform } from 'react-native' 

import PushNotification from 'react-native-push-notification';
import {GoogleSignin} from 'react-native-google-signin'
import {LoginManager, AccessToken, GraphRequest, GraphRequestManager} from 'react-native-fbsdk';

import {geocodeKey} from '../credentials/keys';
import { isUserRegistered } from '../Services/AuthService.js';

import { Images, Metrics, Fonts } from '../Theme';
import { textStyles } from '../styles/textStyles';
import { mantisGreen, limeGreen, fbBlue } from '../colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { evenShadow } from '../styles/shadowStyles';

const {platform,screenWidth} = Metrics;

const WelcomeButton = ({backgroundColor, text, color, icon = false, onPress}) => (
    <TouchableOpacity underlayColorr={'transparent'} style={[styles.welcomeButton, {backgroundColor}, platform == "ios" ? evenShadow : null]} onPress={onPress}>
        {icon &&
        <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10,}}>
            {icon == "facebook" ?
            <Icon
            name={icon} 
            size={35} 
            color={'white'}
            />
            :
            <Image
            source={Images.google}
            style={{width: 35, height: 35}}    
            />
            }
        </View>
        }
        <View style={{flex: icon ? 0.85 : 1, justifyContent: 'center', alignItems: icon ? 'flex-start' : 'center', paddingVertical: 15, paddingHorizontal: 2,}}>
            <Text style={{...textStyles.generic, ...Fonts.big, color, letterSpacing: 1.2, fontWeight: "200"}}>{text}</Text>
        </View>
    </TouchableOpacity>
)

class Welcome extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            currentLocation: false,
        }
    }

    async componentWillMount () {
        await this.initializePushNotifications(true);
        

        
        
    }

    componentDidMount() {
        Platform.OS === "ios" ?
            GoogleSignin.configure({
                iosClientId: '791527199565-tcd1e6eak6n5fcis247mg06t37bfig63.apps.googleusercontent.com',
            })
            :
            GoogleSignin.configure();
        

        // let i = 0;
        // const googleIconColors = ['#3cba54', '#db3236', '#f4c20d', '#4885ed'];
        // const fbIconColors = ["#3b5998", "#8a3ab9", "#cd486b", almostWhite];
        // this.colorRefreshId = setInterval( () => {
        //     i++
            
        //     this.setState({googleIconColor: googleIconColors[i % 4], fbIconColor: fbIconColors[i % 4]})
        // }, 3500)
        // .then( () => {console.log('google sign in is now possible')})

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
        // console.log('attempting to sign up', socialUser);
        let {currentLocation} = this.state;
        this.setState({loading: false});
        !socialUser ? 
            this.props.navigation.navigate('CreateProfile', {user: false, googleUserBoolean: false, facebookUserBoolean: false, currentLocation})
        :
            googleUserBoolean && !facebookUserBoolean ? 
                this.props.navigation.navigate('CreateProfile', {user: socialUser, googleUserBoolean: true, facebookUserBoolean: false, pictureuris: [socialUser.user.photo], currentLocation})
            :
                this.props.navigation.navigate('CreateProfile', {user: socialUser, googleUserBoolean: false, facebookUserBoolean: true, pictureuris: [socialUser.user.picture.data.url], currentLocation})
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
                alert('here')
                this.setState({loading: false}, () => {this.attemptSignUp(socialInformation, true, false)})
            }
            
            
            // console.log("STATUS:" + JSON.stringify(isRegistered));
            // this.successfulLoginCallback(currentUser, googleUserBoolean = true, facebookUserBoolean = false);
            // console.log('successfully signed in:', currentUser);
            // console.log(JSON.stringify(currentUser.toJSON()))
        })
        .catch( (err) => {alert("Whoops! Here's what happened: " + err); this.setState({loading: false})})
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
                                    // alert('here')
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

    renderButtons = () => {
        return (
            <Fragment>

                <WelcomeButton 
                onPress={()=>{this.props.navigation.navigate('SignIn')}}
                backgroundColor={limeGreen} text={"Log in to your account"} color={'black'}

                />

                <WelcomeButton 
                onPress={()=>{
                    this.signInWithFacebook()
                }}
                backgroundColor={fbBlue} text={"Sign up with Facebook"} color={'#fff'} icon={'facebook'}
                    
                />

                <WelcomeButton 
                onPress={() => this.signInWithGoogle()}
                backgroundColor={"#fff"} text={"Sign up with Google"} color={'black'} icon={'google'}
                />    
                

                <WelcomeButton 
                onPress={()=>{
                    this.attemptSignUp(user = false, googleUserBoolean = false, facebookUserBoolean = false)
                }}
                backgroundColor={'black'} text={"Create New Account"} color={'#fff'}
                    
                />

            </Fragment>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
            <ImageBackground source={Images.loginBg} style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25}}>
                {this.renderButtons()}
            </ImageBackground>
            </SafeAreaView>
        )
    }
}

export default Welcome

const styles = StyleSheet.create({
    welcomeButton: {
        width: 0.8*screenWidth, flexDirection: 'row', borderRadius: 25, margin: 10, 
         
    },
})
