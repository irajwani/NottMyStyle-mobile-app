// import React, { Component } from 'react'
// import { Text, StyleSheet, View, ActivityIndicator, TouchableHighlight, Image } from 'react-native'
// import { RNCamera } from 'react-native-camera';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// import { withNavigation } from 'react-navigation';


// class PictureCamera extends Component {

//   constructor(props) {
//       super(props);
//       this.state = {
//         navToComponent: 'HomeScreen',
//         isLoading: false,
//         type: RNCamera.Constants.Type.back,
//         flashMode: false,
//         front: false,
//         pictureuri: null,
//         //pictureuris: [],
//         //confirmDisabled: true,
        
//     }
//   }
  
//   takePicture(navToComponent) {
//     console.log(navToComponent);
//     this.setState({isLoading: true});
//     let self = this;
//     console.log('first')
//     const options = { quality: 0.5, base64: true };
//     this.camera.takePictureAsync(options).then((image64) => {
//         // this.state.pictureuris.push( image64.uri );
//         // this.setState({isLoading: false,});
//         // if(this.state.pictureuris.length >= 5) {
//         //   this.confirmSelection.bind(this, navToComponent);
//         // }
//         this.setState({
//             isLoading: false, pictureuri: image64.uri, picturebase64: image64.base64, pictureWidth: image64.width, pictureHeight: image64.height
//         });
//         this.props.navigation.navigate( `${navToComponent}`, {uri: this.state.pictureuri, base64: this.state.picturebase64, width: this.state.pictureWidth, height: this.state.pictureHeight})

//     }).catch(err => console.error(err))

//   }

//   // confirmSelection(navToComponent) {
//   //   this.props.navigation.navigate(`${navToComponent}`, {pictureuris: this.state.pictureuris} )
//   // }
  
//   render() {
//     const {params} = this.props.navigation.state;
//     var navToComponent = params.navToComponent;

//     return (
//         <View style={styles.container}>

//         <RNCamera
//             ref={ref => {
//               this.camera = ref;
//             }}

//             style = {styles.preview}
//             type={this.state.front ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
//             flashMode={this.state.flashMode ? RNCamera.Constants.FlashMode.on : RNCamera.Constants.FlashMode.off}
//             permissionDialogTitle={'Permission to use camera'}
//             permissionDialogMessage={'We need your permission to use your camera phone'}
//         >
//         <View style = { {flexDirection: 'row'} }>
        
//         {/* camera button */}
//           <View style={styles.cambuttons}>
//               <TouchableHighlight style={styles.capture} onPress={this.takePicture.bind(this, navToComponent) } >
//                 <Image
//                   style={{width: 20, height: 20, opacity: 0.7}}
//                   source={require('../images/cb.png')}
//                  />

//               </TouchableHighlight>

//           <ActivityIndicator animating={this.state.isLoading} color='#0040ff' size='large'/>

//           </View>
//               {/* toggle flash mode */}
//           <View style={styles.button}>
//             <TouchableHighlight onPress={ () => {this.setState({flashMode: !this.state.flashMode})}}>
//               {this.state.flashMode ? <Icon type='material-community' name='flashlight' /> : <Icon color='white' type='material-community' name='flashlight-off' />
//                }
//             </TouchableHighlight>  
//           </View>
//                 {/* toggle front camera */}
//           <View style={styles.button}>
//             <TouchableHighlight onPress={ () => {this.setState({front: !this.state.front})}}>
//               {this.state.front ? <Icon color='white' type='material-community' name='camera-front' /> 
//                                   : <Icon color='black' type='material-community' name='camera-front' />
//                }
//             </TouchableHighlight>  
//           </View>
//         </View>

//         </RNCamera>

//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         backgroundColor: 'black'
//       },
//       preview: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center'
//       },
//       cambuttons: {
//         flexDirection: 'row',
//         justifyContent: 'center'
//       },
//       capture: {
//         flex: 0,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         padding: 15,
//         paddingHorizontal: 20,
//         alignSelf: 'center',
//         margin: 20
//       },
//       button: {
//         margin:20,
//         flex:0,
//         borderRadius:25,
//         width:50,
//         height:50,
//         alignItems:'center',
//         justifyContent:'center',
//         backgroundColor:'red'
//       },
// })
// export default withNavigation(PictureCamera)