import React, { Component } from 'react';
import { Text, StyleSheet, View, ActivityIndicator, TouchableHighlight, Image, Platform } from 'react-native';
// import {withNavigationFocus} from 'react-navigation';
import { RNCamera } from 'react-native-camera';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

import {Button} from 'react-native-elements';

// import { withNavigation } from 'react-navigation';
// import { material } from 'react-native-typography';
import {flashOrange, graphiteGray, almostWhite, treeGreen, highlightGreen} from '../colors.js';
import { BasicLoadingIndicator } from '../localFunctions/visualFunctions.js';

class MultiplePictureCamera extends Component {
  

  constructor(props) {
      super(props);
      this.state = {
        navToComponent: 'HomeScreen',
        isLoading: false,
        type: RNCamera.Constants.Type.back,
        flashMode: false,
        front: false,
        //pictureuri: null,
        pictureuris: [],
        confirmDisabled: true,
        
    }
  }
  
  takePicture(navToComponent) {
    console.log(navToComponent);
    this.setState({isLoading: true});
    let self = this;
    console.log('first')
    const options = { quality: 0.5, base64: true };
    this.camera.takePictureAsync(options).then((image64) => {
        this.state.pictureuris.push( image64.uri );
        this.setState({isLoading: false, confirmDisabled: false});
        //if the user was previously on the EditProfile Page, then send user back there, else assume
        //the user is creating an item and let them take up to 4 pictures
        if(navToComponent == 'EditProfile' || navToComponent == 'CreateProfile') {this.confirmSelection(navToComponent)};
        if(this.state.pictureuris.length == 4) {
          this.confirmSelection(navToComponent);
        }
        console.log(this.state.pictureuris);
        // this.setState({
        //     isLoading: false, pictureuri: image64.uri, picturebase64: image64.base64, pictureWidth: image64.width, pictureHeight: image64.height
        // });
        // this.props.navigation.navigate( `${navToComponent}`, {uri: this.state.pictureuri, base64: this.state.picturebase64, width: this.state.pictureWidth, height: this.state.pictureHeight})

    }).catch(err => console.error(err))

  }

  confirmSelection(navToComponent) {
    console.log('User confirmed selection of pictures')
    //if its going back to EditItem, will it skim over the details?
    this.props.navigation.navigate(`${navToComponent}`, {pictureuris: this.state.pictureuris} )
  }
  
  render() {
    const {params} = this.props.navigation.state;
    var {navToComponent} = params;
    // const isFocused = this.props.navigation.isFocused();

    return (
        <View style={[styles.container, {marginTop: Platform.OS == "ios" ? 18 : 0}]}>

         
        <RNCamera
            ref={ref => {
              this.camera = ref;
            }}
            style = {styles.preview}
            type={this.state.front ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
            flashMode={this.state.flashMode ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
            permissionDialogTitle={'Permission to use camera'}
            permissionDialogMessage={'We need your permission to use your camera phone'}
        >
        <View style={styles.backButtonRow}>
          <FontAwesomeIcon
            name='arrow-left'
            size={34}
            color={'#fff'}
            onPress = { () => { 
              this.props.navigation.goBack();
            } }

          />
        </View>      
        <View style = { styles.buttonsRow }>
        {/* confirm button */}
          <View style={styles.confirmButton}>
            <TouchableHighlight disabled={this.state.confirmDisabled} onPress={ () => { this.confirmSelection(navToComponent) }}>
              <View style={styles.confirmButtonColumn}>
                <Icon size={40} color={!this.state.confirmDisabled ? treeGreen : almostWhite} type='material-community' name='thumb-up' />
                <Text style={[styles.confirmText, !this.state.confirmDisabled ? {color: treeGreen} : {color: flashOrange}]}>Done?</Text>
              </View>
              
            </TouchableHighlight>  
          </View>
        {/* camera button */}
        
          {!this.state.isLoading ? 
            <TouchableHighlight onPress={this.takePicture.bind(this, navToComponent) } >
                
              <Icon size={58} type='material-community' name='camera-iris' color='#fff' />

            </TouchableHighlight>  
          :    
            <BasicLoadingIndicator isVisible={this.state.isLoading} color={highlightGreen} type={'Bounce'}/>
          }   
          
              {/* toggle flash mode */}
          <View style={styles.flashButton}>
            <TouchableHighlight onPress={ () => {this.setState({flashMode: !this.state.flashMode})}}>
              {this.state.flashMode ? <Icon size={48} color={flashOrange} type='material-community' name='flash' /> : <Icon size={48} color='white' type='material-community' name='flash-off' />
               }
            </TouchableHighlight>  
          </View>
                {/* toggle front camera */}
          <View style={styles.frontButton}>
            <TouchableHighlight onPress={ () => {this.setState({front: !this.state.front})}}>
              {this.state.front ? 
              <Icon size={40} color='#fff' type='material-community' name='camera-rear-variant' /> 
              : 
              <Icon size={40} color={'#fff'} type='material-community' name='camera-front-variant' />
              }
            </TouchableHighlight>  
          </View>
        </View>

        </RNCamera>
        

      </View>
    )
  }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // flexDirection: 'column',
        backgroundColor: 'black',
        // marginTop: 18
      },
      preview: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignContent: 'flex-start'
        // alignItems: 'center'
      },
      cambuttons: {
        flexDirection: 'row',
        justifyContent: 'center'
      },
      backButtonRow: {flexDirection: 'row', padding: 10, justifyContent: 'flex-start'},
      buttonsRow: { flexDirection: 'row', justifyContent: 'space-between', margin: 5},
      capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20
      },
      confirmButton: {
        // margin:5,
        // flex:0,
        // borderRadius:40,
        // width:50,
        // height:50,
        alignItems:'center',
        justifyContent:'center',
        marginLeft: 10,
        marginBottom: 5
        // backgroundColor:'#fff'
      },

      confirmButtonColumn: {
        flexDirection: 'column',
        // flexWrap: 'wrap',
        justifyContent: 'flex-start',
        margin: 5
      },

      confirmText: {
        fontFamily: 'Iowan Old Style',
        fontWeight: '900',
        fontSize: 15,
        textAlign: 'center'
      },

      button: {
        margin:5,
        flex:0,
        borderRadius:20,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        backgroundColor:'#fff'
      },

      flashButton: {
        margin:5,
        flex:0,
        borderRadius:20,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        
      },

      frontButton: {
        margin:5,
        flex:0,
        borderRadius:20,
        width:50,
        height:50,
        alignItems:'center',
        justifyContent:'center',
        
      },
})
export default MultiplePictureCamera
// export default MultiplePictureCamera