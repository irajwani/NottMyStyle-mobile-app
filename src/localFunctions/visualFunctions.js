import React from 'react';
import { Animated, Easing, View, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Text, TextInput, Platform, StyleSheet } from 'react-native';
import Svg, { G, Path } from 'react-native-svg';
import { darkGray, lightGray, rejectRed, almostWhite, flagRed, highlightGreen, mantisGreen, treeGreen } from '../colors';
import Spinner from 'react-native-spinkit';
import { avenirNextText } from '../constructors/avenirNextText';
import {shadow} from '../constructors/shadow';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import firebase from '../cloud/firebase';
import { center } from '../constructors/center';
import { textStyles } from '../styles/textStyles';

const GrayLine = () => (
    <View style={{backgroundColor: darkGray, height: 0.5}}/>
)

const WhiteSpace = ({height}) => (
    <View style={{backgroundColor: '#fff', height: height}}/>
)

const DismissKeyboardView = ({children}) => (
    <TouchableWithoutFeedback 
    onPress={() => {
        Keyboard.dismiss();
        console.log('dismiss keyboard');
        }}>
        {children}
    </TouchableWithoutFeedback>
  )

const CustomTouchableO = ({onPress, disabled, flex, color, text, textSize, textColor, extraStyles}) => {
    return(
        <TouchableOpacity onPress={onPress} disabled={disabled} style={[{justifyContent: 'center', alignItems: 'center', backgroundColor: color, flex: flex}, extraStyles]}>
            <Text style={new avenirNextText(textColor, textSize, "300")}>{text}</Text>
        </TouchableOpacity>
    )
    
}

const CustomTextInput = ({placeholder, onChangeText, value, autoCapitalize, maxLength, secureTextEntry}) => (
    <View style={styles.inputContainer}>
      
          <TextInput
          secureTextEntry={secureTextEntry ? true : false}
          style={styles.inputText}
          placeholder={placeholder}
          placeholderTextColor={lightGray}
          onChangeText={onChangeText}
          value={value}
          multiline={false}
          maxLength={maxLength}
          autoCorrect={false}
          autoCapitalize={autoCapitalize ? autoCapitalize : 'none'}
          clearButtonMode={'while-editing'}
          underlineColorAndroid={"transparent"}
          
          returnKeyType={'default'}
          
          />         
      
    </View>
)

const SignInTextInput = ({width, placeholder, onChangeText, value, secureTextEntry, keyboardType, returnKeyType, onSubmitEditing, ref}) => (
    <View style={{width: width, height: 40, borderRadius: 30, backgroundColor: '#fff', }}>
        <View style={{position: 'absolute', flex: 1, justifyContent: 'center', alignItems: 'flex-start'}}>
            <Text style={new avenirNextText(lightGray, 20, "200")}>{placeholder}</Text>
        </View>
        <TextInput
        secureTextEntry={secureTextEntry ? true : false}
        style={{height: 50, width: 280, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
        placeholder={''}
        placeholderTextColor={'#fff'}
        onChangeText={onChangeText}
        value={value}
        multiline={false}
        
        autoCorrect={false}
        
        clearButtonMode={'while-editing'}
        underlineColorAndroid={"transparent"}
        keyboardType={keyboardType ? 'email-address' : 'default'}
        ref={ref ? ref : null}
        returnKeyType={returnKeyType}
        onSubmitEditing={onSubmitEditing ? onSubmitEditing : null}
        />         
    </View>
)

const minutiaContainer = {marginHorizontal: 2, justifyContent: 'center', alignItems: 'center'};

const ProfileMinutia = ({icon, text}) => (
  <View style={{flexDirection: 'row', margin: 0}}>
    <View style={minutiaContainer}>
      <Icon name={icon} size={20} color={'black'}/>
    </View>
    <View style={minutiaContainer}>
      <Text style={[textStyles.generic, {fontSize: 14, color: 'black'}]}>{text}</Text>
    </View>
  </View>

)

const BasicLoadingIndicator = ({isVisible, type, color}) => (
  <Spinner style={{}} isVisible={isVisible} size={50} type={type} color={color}/>    
)

class LoadingIndicator extends React.Component {
  constructor(props) {
    super(props);
    this.RotateValueHolder = new Animated.Value(0);
  }
  componentDidMount() {
    this.StartImageRotateFunction();
  }
  StartImageRotateFunction() {
    this.RotateValueHolder.setValue(0);
    Animated.timing(this.RotateValueHolder, {
      toValue: 1,
      duration: 1000,
      easing: Easing.linear,
    }).start(() => this.StartImageRotateFunction());
  }
  render() {
    
    const RotateData = this.RotateValueHolder.interpolate({
      inputRange: [0, 1],
      outputRange: ['0deg', '360deg'],
    });
    const strokeWidth = 5;
    // const {color} = this.props;
    const color = highlightGreen;

    return (
      <Animated.View style={[styles.loadingIndicatorContainer, {transform: [{ rotate: RotateData }],}]}>
        <View style={styles.shiftPointOfOriginForLoadingIndicator}>
          <Svg height={"100%"} width={"100%"} fill={color} viewBox="0 0 511.99905 511">
            
            <Path 
            d="m491.410156 251.382812-167.914062-96.941406c-8.011719-26.425781-30.480469-45.433594-57.496094-49.234375v-2.484375c23.679688-4.671875 41.597656-25.597656 41.597656-50.625 0-28.453125-23.148437-51.597656-51.597656-51.597656-23.3125 0-43.808594 15.726562-49.839844 38.242188-1.429687 5.335937 1.734375 10.816406 7.070313 12.246093 5.335937 1.433594 10.816406-1.734375 12.246093-7.070312 3.695313-13.789063 16.246094-23.417969 30.519532-23.417969 17.425781 0 31.601562 14.171875 31.601562 31.597656 0 17.421875-14.175781 31.597656-31.601562 31.597656-5.519532 0-9.996094 4.476563-9.996094 10v11.511719c-27.019531 3.800781-49.484375 22.808594-57.496094 49.234375l-15.988281 9.226563c-4.78125 2.761719-6.421875 8.875-3.660156 13.660156 2.761719 4.78125 8.875 6.421875 13.660156 3.660156l19.558594-11.292969c2.386719-1.375 4.097656-3.675781 4.730469-6.351562 5.421874-22.875 25.648437-38.851562 49.191406-38.851562 23.546875 0 43.773437 15.976562 49.195312 38.851562.632813 2.675781 2.34375 4.976562 4.730469 6.351562l171.484375 99.007813c10.125 5.84375 13.605469 18.835937 7.761719 28.957031l-.203125.347656-227.964844-131.617187c-3.09375-1.785156-6.90625-1.785156-10 0l-227.96875 131.617187-.203125-.347656c-5.84375-10.121094-2.359375-23.113281 7.761719-28.957031l82.648437-47.71875c4.785157-2.761719 6.421875-8.875 3.660157-13.65625-2.757813-4.785156-8.875-6.421875-13.65625-3.660156l-82.652344 47.714843c-19.671875 11.359376-26.4375 36.605469-15.078125 56.277344l5.199219 9.007813c2.761718 4.78125 8.878906 6.421875 13.660156 3.660156l15-8.660156h305.191406c5.523438 0 10-4.476563 10-10 0-5.523438-4.476562-10-10-10h-270.554688l181.992188-105.070313 181.988281 105.070313h-13.429687c-5.519532 0-10 4.476562-10 10 0 5.523437 4.480468 10 10 10h48.070312l15 8.660156c1.574219.910156 3.292969 1.339844 4.988282 1.339844 3.457031 0 6.816406-1.792969 8.671874-5l5.199219-9.007813c11.359375-19.671875 4.59375-44.917968-15.078125-56.277344zm0 0"
            stroke={color}
            strokeWidth={strokeWidth}
            />
            <Path 
            d="m142.882812 202.332031c1.503907 0 3.027344-.339843 4.464844-1.058593l.007813-.003907c4.9375-2.46875 6.9375-8.472656 4.46875-13.414062-2.472657-4.941407-8.484375-6.941407-13.417969-4.472657-4.941406 2.472657-6.945312 8.476563-4.472656 13.417969 1.75 3.503907 5.28125 5.53125 8.949218 5.53125zm0 0"
            stroke={color}
            strokeWidth={strokeWidth}
            />
            <Path 
            d="m384.566406 291.667969h-.007812c-5.523438 0-9.996094 4.476562-9.996094 10 0 5.523437 4.480469 10 10.003906 10 5.523438 0 10-4.476563 10-10 0-5.523438-4.480468-10-10-10zm0 0"
            stroke={color}
            strokeWidth={strokeWidth}
            />
            
          </Svg>
        </View>
      </Animated.View>
    );
  }

}

const MarketplaceIcon = ({strokeWidth, focused}) => (
  <View style={{width: 30, height: 30, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 3}}>
    <Svg height={"100%"} width={"100%"} fill={!focused ? "black" : treeGreen} viewBox={"0 0 400 400"}>
        
        <Path 
        d="M71.967 0.400 C 58.991 0.685,58.422 0.809,52.763 4.589 C 46.732 8.617,47.929 6.695,17.842 60.685 L 0.647 91.539 0.629 123.547 C 0.608 162.621,0.659 163.156,5.321 172.590 C 7.793 177.591,10.158 181.156,13.769 185.321 L 16.597 188.583 16.855 282.773 L 17.114 376.962 19.668 379.326 L 22.222 381.690 197.961 381.504 C 383.252 381.306,378.872 381.358,380.865 379.363 C 383.532 376.695,383.661 371.755,383.677 271.623 L 383.690 188.710 386.823 184.977 C 399.341 170.061,399.801 167.886,399.782 123.751 L 399.768 91.539 382.409 60.347 C 352.709 6.978,352.583 6.789,343.672 2.230 L 339.311 0.000 211.348 0.075 C 140.968 0.116,78.247 0.263,71.967 0.400 M334.885 17.007 C 339.799 18.020,339.943 18.243,364.403 62.589 C 377.410 86.171,379.328 89.718,379.158 89.874 C 379.072 89.953,362.297 90.183,341.881 90.384 L 304.761 90.750 303.252 92.368 C 299.996 95.858,299.397 98.974,301.274 102.652 C 303.169 106.364,300.940 106.174,350.018 106.811 C 368.165 107.046,383.094 107.321,383.195 107.422 C 383.801 108.028,383.418 154.497,382.782 157.460 C 375.285 192.401,328.001 190.549,323.743 155.148 C 322.897 148.113,320.489 145.124,315.447 144.852 C 310.222 144.570,307.883 147.240,306.606 154.944 C 303.702 172.456,292.742 182.687,276.860 182.711 C 261.109 182.735,249.978 172.444,247.079 155.179 C 245.672 146.800,243.650 144.487,238.061 144.862 C 232.882 145.209,231.244 147.256,229.940 155.011 C 227.820 167.625,222.712 175.129,213.048 179.829 C 194.184 189.002,173.439 176.987,170.433 155.148 C 169.219 146.326,165.214 142.913,158.818 145.248 C 155.512 146.454,154.232 148.903,153.130 156.126 C 149.871 177.496,129.108 188.892,110.296 179.636 C 100.940 175.033,96.130 167.701,93.559 154.128 C 92.179 146.841,88.968 143.722,83.953 144.798 C 79.892 145.668,77.843 148.138,77.063 153.100 C 74.912 166.776,69.744 174.939,60.347 179.501 C 41.988 188.414,22.078 178.143,17.623 157.460 C 16.976 154.453,16.612 108.023,17.231 107.403 C 17.340 107.295,64.196 107.021,121.355 106.795 L 225.280 106.384 226.431 105.078 C 229.864 101.181,229.708 94.276,226.134 91.934 C 224.833 91.082,191.083 90.658,93.884 90.273 C 53.909 90.114,21.203 89.833,21.203 89.647 C 21.203 89.033,49.918 37.249,56.783 25.484 C 61.686 17.081,61.335 17.239,76.249 16.716 C 89.330 16.258,332.578 16.531,334.885 17.007 M90.322 185.107 C 111.019 204.903,136.946 204.614,157.897 184.356 L 161.870 180.515 166.256 184.592 C 187.255 204.109,212.721 204.797,232.211 186.373 C 234.230 184.464,236.471 182.363,237.191 181.703 L 238.501 180.502 242.521 184.361 C 263.624 204.615,289.885 204.897,310.092 185.085 L 315.026 180.247 318.471 183.733 C 322.778 188.089,327.004 191.531,330.690 193.684 L 333.537 195.347 333.537 251.394 L 333.537 307.441 200.204 307.441 L 66.871 307.441 66.871 251.422 L 66.871 195.402 71.662 192.231 C 75.153 189.921,77.614 187.870,80.734 184.667 C 83.089 182.250,85.061 180.261,85.116 180.248 C 85.171 180.235,87.514 182.421,90.322 185.107 M38.562 198.754 C 40.788 199.078,44.307 199.469,46.381 199.622 L 50.153 199.901 50.176 237.260 C 50.189 257.807,50.346 282.984,50.526 293.210 L 50.852 311.803 51.907 314.108 C 55.144 321.178,58.687 322.911,70.832 323.366 C 82.705 323.810,317.712 323.822,329.685 323.379 C 341.514 322.940,344.995 321.238,348.419 314.217 L 349.588 311.818 349.892 293.218 C 350.059 282.988,350.209 257.807,350.225 237.260 L 350.255 199.901 354.027 199.618 C 356.101 199.462,359.711 199.072,362.049 198.750 C 364.386 198.428,366.359 198.165,366.432 198.165 C 366.505 198.165,366.565 235.780,366.565 281.753 L 366.565 365.341 200.204 365.341 L 33.843 365.341 33.843 281.753 C 33.843 235.780,33.994 198.165,34.179 198.165 C 34.364 198.165,36.336 198.430,38.562 198.754 M240.853 204.048 C 235.529 205.479,233.353 211.680,236.591 216.193 C 238.305 218.582,250.919 231.331,253.320 233.101 C 257.351 236.073,263.316 234.955,265.419 230.834 C 267.935 225.901,267.024 224.160,256.285 213.372 C 246.327 203.370,245.418 202.821,240.853 204.048 M285.943 206.048 L 283.588 208.311 283.442 211.853 L 283.296 215.396 289.151 221.292 C 298.912 231.123,314.932 246.467,317.307 248.260 C 321.728 251.598,327.840 249.401,329.494 243.879 C 330.719 239.791,329.315 237.926,311.954 220.565 C 296.077 204.689,295.411 204.154,291.243 203.938 L 288.297 203.785 285.943 206.048 M271.735 236.450 C 268.319 238.001,266.078 242.298,267.029 245.474 C 267.862 248.255,308.064 289.164,311.624 290.853 C 316.081 292.969,321.394 290.037,322.562 284.818 C 323.521 280.535,322.587 279.405,297.601 254.588 C 277.547 234.670,276.802 234.148,271.735 236.450 "
        stroke={!focused ? "black" : treeGreen}
        strokeWidth={strokeWidth}
        />
        
    </Svg>
  </View>

)

class BadgeIcon extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            uid: false,
            unreadCount: false,
            isGetting: true
        }
    }

    componentWillMount = () => {
        if(this.props.unreadCount) {
            setTimeout(() => {
                
                this.setState({uid: firebase.auth().currentUser.uid}, () => {
                    this.getNotificationsCount(this.state.uid);
                    setInterval(() => {
                      this.getNotificationsCount(this.state.uid);
                    }, 20000);
                });

                
            }, 1);
        }
        
    }

    // componentDidMount = () => {
    //     this.getNotificationsCountInterval = setInterval(() => {
    //         this.getNotificationsCount(this.state.uid);
    //     }, 20000);
    // }

    componentWillUnmount = () => {
        // clearInterval(this.getNotificationsCountInterval);
    }

    getNotificationsCount = (uid) => {
        this.setState({isGetting: true});
        firebase.database().ref(`/Users/${uid}`).on("value", (snapshot) => {
          var d = snapshot.val();
          let unreadCount = 0
  
          if(d.notifications) {
            if(d.notifications.priceReductions) {
            
              Object.values(d.notifications.priceReductions).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
            
            }
          
            if(d.notifications.itemsSold) {
              
              Object.values(d.notifications.itemsSold).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
              
            }
  
            if(d.notifications.purchaseReceipts) {
              
              Object.values(d.notifications.purchaseReceipts).forEach( n => {
                if(n.unreadCount) {
                  unreadCount += 1
                }
              })
              
            }
          }

          if(d.conversations) {
            Object.values(d.conversations).forEach( c => {
              if(c.unread == true) {
                unreadCount += 1
              }
            })
          }
  
          this.setState({unreadCount, isGetting: false})
          
          
          
        })
        // .catch( (err) => { 
        //   this.setState({unreadCount: 0, isGetting: false})
        //  })
        
      }

    render() {
        return (
          
            <View style={{ width: 35, height: 35, margin: 5, justifyContent: 'center', alignItems: 'center'}}>
                <Icon name={this.props.name} size={this.props.size} color={this.props.color}/>
                {/* Now just for chats icon */}
                { this.state.unreadCount > 0 ?
                    
                  <View style={Platform.OS == 'ios' ? {
                    
                    position: 'absolute',
                    right: -4,
                    top: -3,
                    backgroundColor: flagRed,
                    borderRadius: 9,
                    width: 18,
                    height: 18,
                    // borderWidth: 1,
                    // borderColor: almostWhite,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  } : {
                    
                    position: 'absolute',
                    right: 3,
                    top: 2,
                    backgroundColor: flagRed,
                    borderRadius: 6,
                    width: 12,
                    height: 12,
                    // borderWidth: 1,
                    // borderColor: almostWhite,
                    padding: 2,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                    {this.state.isGetting ?
                        <LoadingIndicator isVisible={this.state.isGetting} type={'Circle'} color={'#fff'}/>
                        :
                        <Text style={{color: almostWhite, fontWeight: "300", fontSize: Platform.OS == 'ios' ? 12:8}}>{this.state.unreadCount}</Text>
                    }
                  </View>
                
                :
                null
                }
            </View>
          
        )
    } 
}



export {GrayLine, WhiteSpace, ProfileMinutia, BasicLoadingIndicator, LoadingIndicator, DismissKeyboardView, CustomTouchableO, CustomTextInput, SignInTextInput, MarketplaceIcon, BadgeIcon}

const styles = StyleSheet.create({
  inputContainer: {
    marginVertical: 7,
    marginHorizontal: 5,
    // flexDirection: ''
    // justifyContent: 'center',
    // borderBottomWidth: 0.2,
    // borderBottomColor: '#fff',
    alignItems: 'stretch'
},

//   placeholderContainer: {
//     position: 'absolute', flex: 1, justifyContent: 'flex-start', alignItems: 'center'
//   },

input: {
  height: 38, borderRadius: 19, backgroundColor: '#fff', 
  padding: 10, 
  // justifyContent: 'center', alignItems: 'flex-start',
  ...new shadow(2,2, color = mantisGreen, -1, 1)
},

inputText: { fontFamily: 'Avenir Next', fontSize: 16, fontWeight: "500", color: "#fff"},

loadingIndicatorContainer: {justifyContent: 'center', alignItems: 'center', width: 75, height: 75},

shiftPointOfOriginForLoadingIndicator: {width: 75, height: 75, position: "absolute", top: 30},


},



)