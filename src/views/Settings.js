import React, { Component } from 'react'
import { Dimensions, Text, Modal, StyleSheet, ScrollView, SafeAreaView, View, TouchableOpacity, TouchableHighlight } from 'react-native'
import { withNavigation } from 'react-navigation';

import firebase from '../cloud/firebase.js';

// import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from 'react-native-popup-dialog';

import { ColorWheel } from 'react-native-color-wheel';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import { material, iOSUIKit, iOSColors } from 'react-native-typography'

import * as Animatable from 'react-native-animatable';
import Accordion from 'react-native-collapsible/Accordion';



import {EulaTop, EulaLink, EulaBottom, TsAndCs, PrivacyPolicy, ContactUs} from '../legal/Documents.js';
import BackButton from '../components/BackButton';
// import { avenirNext } from '../colors.js';
import { avenirNextText } from '../constructors/avenirNextText.js';
import { WhiteSpace } from '../localFunctions/visualFunctions.js';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import { textStyles } from '../styles/textStyles.js';
import { hsv2Hex, hsvToHex } from 'colorsys';

const {width} = Dimensions.get('window');

const limeGreen = '#2e770f';
const profoundPink = '#c64f5f';

const settings = [ 
  {
    header: 'Personalization',
    settings: ['Edit Personal Details', 'Edit Profile Background Color']
  }, 
  {
    header: 'Support',
    settings: ['End User License Agreement', 'Terms & Conditions', 'Privacy Policy', 'Contact Us'] 
  }
]

class Settings extends Component {

  constructor(props) {
    super(props);
    this.state = {
      activeDocument: 'End User License Agreement',
      activeSection: false,
      collapsed: true,
      modalVisible: false,
      colorDialogVisible: false,
      color: '#87d720'
    };
    this.uid = firebase.auth().currentUser.uid;
  }

  logOut = () => {
    firebase.auth().signOut().then(() => {
      // var statusUpdate = {};
      // statusUpdate['Users/' + this.uid + '/status/'] = "offline";
      // await firebase.database().ref().update(statusUpdate);
      this.props.navigation.navigate('SignIn');
    })
  }

  setModalVisible(visible) {
    this.setState({modalVisible: visible});
  }

  //switch between collapsed and expanded states
  toggleExpanded = () => {
    this.setState({ collapsed: !this.state.collapsed });
  };

  setSection = section => {
    this.setState({ activeSection: section });
  };

  confirmColor = () => {
    this.setState({colorDialogVisible: false}, () => {
      let colorUpdate = {};
      colorUpdate['/Users/' + this.uid + '/color/'] = this.state.color;
      let promiseToUpdateColor = firebase.database().ref().update(colorUpdate);
      promiseToUpdateColor
      .then( () => this.props.navigation.navigate('ProfilePage', {backgroundColor: this.state.color}) )
      .catch( err => console.log(err))
    })
  }

  renderHeader = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[styles.headerCard, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >

        <Text style={styles.headerText}>
          {section.header}
        </Text>
        {isActive? 
          <Icon name="chevron-up" 
                size={30} 
                color='black'
          />
        :
          <Icon name="chevron-down" 
                size={30} 
                color='black'
          />
        }
      </Animatable.View>
    )
  }

  renderContent = (section, _, isActive) => {
    return (
      <Animatable.View
        duration={400}
        style={[section.settings.length == 2 ? styles.shortContentCard : styles.contentCard, isActive ? styles.active : styles.inactive]}
        transition="backgroundColor"
      >
        {section.settings.map( (setting, index) => (
          <Animatable.Text 
            key={index}
            onPress={ section.settings.length == 2 ?
            !index ? 
              () => {this.props.navigation.navigate('CreateProfile', {editProfileBoolean: true})}
              :
              () => {this.setState({colorDialogVisible: true})}
            :
            () => { this.setState({ activeDocument: setting, modalVisible: true }) } 
            } 
            style={styles.contentText} animation={isActive ? 'bounceInLeft' : undefined}>
            {setting}
          </Animatable.Text>
        ))}
      </Animatable.View>
    )
  }



  render() {

    const {activeSection, activeDocument} = this.state;

    var selectedDocument;
    switch(activeDocument) {
      case 'End User License Agreement':
        selectedDocument = EulaTop + EulaLink + EulaBottom;
        break;
      case 'Terms & Conditions':
        selectedDocument = TsAndCs;
        break;
      case 'Privacy Policy':
        selectedDocument = PrivacyPolicy;
        break;
      case 'Contact Us':
        selectedDocument = ContactUs;
        break;
      default:
        selectedDocument = EulaTop + EulaLink + EulaBottom;
        break;  
    }
    
    return (
      <SafeAreaView style={styles.container}>

        {/* <BackButton action={()=>this.props.navigation.goBack()} /> */}

        <View style={styles.header}>
          <FontAwesomeIcon
          name='arrow-left'
          size={30}
          color={'black'}
          onPress = { () => { 
              this.props.navigation.goBack();
              } }

          />
        </View>

        <View style={styles.body}>

          <Accordion
            activeSection={activeSection}
            sections={settings}
            touchableComponent={TouchableOpacity}
            renderHeader={this.renderHeader}
            renderContent={this.renderContent}
            duration={100}
            onChange={this.setSection}
          />

          <View style={styles.headerCard}>
            <Text style={styles.headerText} onPress={this.logOut}>Log out</Text>
          </View>

          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.colorDialogVisible}
            onRequestClose={() => {
              this.setState({colorDialogVisible: false})
              // Alert.alert('Modal has been closed.');
            }}
          >
            <View style={styles.dialogContentContainer}>
              <View style={styles.dialogHeaderContainer}>
                <Text style={{...textStyles.generic, color: 'black', fontSize: 22, fontWeight: "500"}}>{this.state.color}</Text>
                <View style={{width: 60, height: 40, backgroundColor: this.state.color, borderRadius: 10, borderWidth: 1, borderColor: 'black'}}/>
              </View>
              
              <View style={styles.dialogBodyContainer}>
                <ColorWheel
                  initialColor="#87d720"
                  onColorChange={color => console.log(color)}
                  onColorChangeComplete={color => this.setState({color: hsvToHex(color.h, color.s, color.v)})}
                  style={{width: 300, height: 300}}
                  // thumbSize={}
                  thumbStyle={{ height: 7, width: 7, borderRadius: 7}}
                />
              </View>

              <TouchableOpacity 
              style={styles.dialogButton}
              onPress={this.confirmColor}>
                <Text style={styles.dialogTitle}>Confirm</Text>
              </TouchableOpacity>

            </View>
          </Modal>
            

        </View>

        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            this.setState({modalVisible: false})
            // Alert.alert('Modal has been closed.');
          }}
        >
          <ScrollView style={{flex: 1, padding: 5}} contentContainerStyle={styles.licenseContainer}>
            <Text style={new avenirNextText(false, 13, "400")}>{selectedDocument}</Text>
            <TouchableHighlight
              onPress={() => {
                this.setModalVisible(!this.state.modalVisible);
              }}>
              <Text style={styles.hideModal}>Back</Text>
            </TouchableHighlight>
            <WhiteSpace height={10}/>
          </ScrollView>
        </Modal>

      </SafeAreaView>
    )
  }
}

export default withNavigation(Settings);

const styles = StyleSheet.create({

    container: {
      backgroundColor: 'white',
      flexDirection: 'column',
      // justifyContent: 'flex-start',
      // padding: 10,
      // marginTop: 20,
      flex: 1,
    },

    header: {
      flex: 0.1,
      flexDirection: 'row',
      borderBottomColor: 'black',
      borderBottomWidth: 2,
      justifyContent: 'flex-start',
      alignItems: 'center',
      paddingLeft: 10
    },

    body: {
      flex: 0.9,
      marginTop: 10,     
      padding: 10
    },

    licenseContainer: {
      marginVertical: 12,
      flexGrow: 4, 
      backgroundColor: '#fff',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: 10
  },

    modal: {flexDirection: 'column', justifyContent: 'space-evenly', alignItems: 'center', padding: 10, marginTop: 22},
    hideModal: {
      fontFamily: 'Avenir Next',
      fontSize: 20,
      color: 'green',
      fontWeight:'bold'
    },

    headerCard: {
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      paddingTop: 2,
      paddingLeft: 5,
      paddingRight: 5,
      paddingBottom: 0, 
      height: 40
    },

    shortContentCard: {
      height: 95,
      justifyContent: 'space-evenly',
      paddingVertical: 5,
      paddingLeft: 10,
    },
    contentCard: {
      flexDirection: 'column',
      justifyContent: 'space-evenly',
      height: 200,
      padding: 10,
    },
    headerText: {
      fontFamily: 'Avenir Next',
      fontSize: 20
    },
    contentText: {
      fontFamily: 'Avenir Next',
      // color: limeGreen,
      fontSize: 20
    },
    active: {
      backgroundColor: '#fff'
    },
    inactive: {
      backgroundColor: '#fff'
    },

    dialogContentContainer: {
      flex: 1,
      // padding: 5,
      // margin: 5,
      // alignItems: 'center',
      // justifyContent: 'center'
      // margin: 10,
    },

    dialogHeaderContainer: {
      flex: 0.15,
      flexDirection: 'row',
      justifyContent: 'space-between',
      padding: 10,
      alignItems: 'center'
    },

    dialogBodyContainer: {
      flex: 0.75,
      justifyContent: 'center',
      alignItems: 'center'
    },

    dialogButton: {
      flex: 0.1,
      backgroundColor: 'black', 
      alignItems: 'center', justifyContent: 'center'
    },

    dialogTitle: {
      ...textStyles.generic,
      fontSize: 20,
      color: '#fff'
    }
})
