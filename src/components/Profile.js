import React, { Component } from 'react'
import { Platform, Dimensions, Modal, Text, StyleSheet, ScrollView, View, SafeAreaView, Image, TextInput, TouchableHighlight, TouchableOpacity, TouchableWithoutFeedback, Keyboard } from 'react-native'


import Svg, { Path } from 'react-native-svg';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import {Button, Divider} from 'react-native-elements'
import {withNavigation, StackNavigator} from 'react-navigation'; // Version can be specified in package.json
import firebase from '../cloud/firebase.js';

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

export default class Profile extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }


    render() {
        var {isGetting} = this.props;
        
        if(isGetting){
            return(
              <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30}}>
                <LoadingIndicator isVisible={isGetting} color={lightGreen} type={'Wordpress'}/>
              </View>
            )
          }
       
      
          return (
            <SafeAreaView style={styles.mainContainer}>
            
      
              <ImageBackground source={Images.profileBackground} style={styles.linearGradient}>
                
                {/* <View style={[styles.oval, {backgroundColor: this.props.navigation.getParam('backgroundColor', this.state.backgroundColor)}]}/> */}
                
                  
                  {/* Top Icons */}
      
                  <View style={styles.iconRow}>
                    
                    <Icon 
                      name="settings" 
                      size={40} 
                      color={'black'}
                      onPress={() => this.props.navigation.navigate('Settings')}
      
                    />
      
                    <TouchableOpacity onPress={this.toggleMenu}>
                      <Image style={{width: 40, height: 40}} source={Images.logout}/>
                    </TouchableOpacity>
                    
      
                    
                    {/* <View style={{alignItems: 'center'}}>
      
                      <View style={{flex: 0.5, alignItems: 'center'}}>
                        {this.state.isMenuActive ?
                        <Icon 
                        name={"chevron-down"} 
                        size={40} 
                        color={'#fff'}
                        onPress={this.toggleMenu}
                        
                        />
                        :
                        <TouchableOpacity onPress={this.toggleMenu}>
                          <Image style={{width: 40, height: 40}} source={Images.logout}/>
                        </TouchableOpacity>
                        }
                      </View>
      
                      <View style={{flex: 0.5, position: 'absolute', top: 30, padding: 10, alignItems: 'center'}}>
                        {this.state.isMenuActive ? 
                        
                          <TouchableOpacity
                          underlayColor={'transparent'} 
                          onPress={this.logOut}  
                          style={styles.popDownMenu}>
                          <Text
                              
                            style={new avenirNextText('black', 13, "300")}>Log Out</Text>
                            
                            
                          </TouchableOpacity>
                          :
                          <View/>
                        }
                      </View>
      
                    </View> */}
                    
                      
                    
                  </View>  
      
                  {/* Profile pic, name etc. */}
      
                  <View style={styles.profileRow}>
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
      
                  
                      
      
                
                
                
                <View style={styles.buttonsContainer}>
                    <ButtonContainer onPress={() => {this.props.navigation.navigate('YourProducts')}} text={"On Sale"}>
                      <View  style={[styles.blackCircle]}>
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
                      </View>
                    </ButtonContainer>
      
                    {/* <ButtonContainer>
                      <TouchableOpacity onPress={() => {this.props.navigation.navigate('Sell')}} style={styles.whiteCircle}>
                        <Icon name={'plus'} size={60} color='black'/>
                      </TouchableOpacity>
                    </ButtonContainer> */}
      
                    <ButtonContainer onPress={() => {this.props.navigation.navigate('SoldProducts')}} text={"Sold"}>
                      <View style={styles.blackCircle}>
                        <FontAwesomeIcon 
                          name={"paper-plane"} 
                          size={30} 
                          color={'#fff'}
                        />
                        {/* <Text style={{fontFamily: 'Avenir Next', fontWeight: "700", fontSize: 16, color:'#fff'}}>SOLD</Text> */}
                      </View>
                    </ButtonContainer>
      
                </View>
      
                
      
      
            </ImageBackground>
            
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
      
            {/* Top 70% ends here */}
            
            
            <View style={styles.footerContainer} >
            {/* Reviews Section contained within this flex-box */}
            <ScrollView style={styles.halfPageScrollContainer} contentContainerStyle={styles.halfPageScroll}>
                
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
                
              
            </ScrollView>
            </View>
      
                  
            
      
            {this.renderExitModal()}
            </SafeAreaView>
            
      
      
          )
    }
}
