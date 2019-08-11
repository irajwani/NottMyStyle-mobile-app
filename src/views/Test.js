import React, { Component } from 'react'
import {View, WebView, StyleSheet} from 'react-native'


const payPalEndpoint = "https://calm-coast-12842.herokuapp.com", 
// const payPalEndpoint = "http://localhost:5000",
finalPrice = 1;


export default class Test extends Component {
  constructor(props) {
    super(props)
    this.state = {
      name: 'asjnldbl',
      description: 'klsfnflfl',
      sku: 'ae8qe330'
    }
  }

  handleResponse = (data) => {
    console.log(data)
    console.log(data.title)
  }

  render() {
    return (
      <View style={styles.container}>
        <WebView 
            source={{uri: payPalEndpoint + `/?price=${finalPrice}&name=${this.state.name}&description=${this.state.description}&sku=${this.state.sku}`}} 
            onNavigationStateChange={data => this.handleResponse(data)}
            injectedJavaScript={`document.f1.submit()`}
          />
      </View>
    )
  }
}

// import { Platform, Text, StyleSheet, View, Image, CameraRoll} from 'react-native'
// import ImageResizer from 'react-native-image-resizer';

// //Image Resizer
// export default class Test extends Component {

//   resizeImage = () => {
//     CameraRoll.getPhotos({ first: 30 })
//       .then(async res => {
//         let photoArray = res.edges;
//         let image = photoArray[0].node.image.uri;
//         console.log(image);
//         let resizedImage = await ImageResizer.createResizedImage(image,3000, 3000,'JPEG',0);
//         console.log(resizedImage);
//         const uploadUri = Platform.OS === 'ios' ? resizedImage.replace('file://', '') : resizedImage

//       })
//   }

//   render() {
//     return (
//       <View style={styles.container} >
//         <Text onPress={this.resizeImage}>Resize Image</Text>
//       </View>
//     )
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
})


// import React, { Component } from 'react'
// import { Text, StyleSheet, View, Image, Animated } from 'react-native'
// import ProgressiveImage from 'react-native-progressive-image'


// // Infinitely Spinning Image Example

// export default class Test extends Component {
//   constructor(props) {
//       super(props);
//       this.state = {
//         //   isImageLoading: true
//           load: 'not started', 
//           thumbnailOpacity: new Animated.Value(0),
          
//       }
//   }

//   onLoad() {
//     Animated.timing(this.state.thumbnailOpacity,
//       {
//         toValue: 0,
//         duration: 250
//       }
//     ).start()
//   }

//   onThumbnailLoad() {
//     Animated.timing(this.state.thumbnailOpacity,
//       {
//         toValue: 1,
//         duration: 250
//       }
//     ).start()
//   }

  
//   render() {

//     const {load} = this.state;
//     // const asset = require("../images/cb.png");
//     // const inProgressAsset = require("../images/logo.png");
//     // const uri = "https://s.abcnews.com/images/US/polar-bear-gty-hb-180706_hpMain_16x9_992.jpg"
//     const uri = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2NzdT0H6sCLYNo9ItTfDq1d1YiQQv8ROvcZMcfxunkIRfaak";
//     const thumb = require('../images/blank.jpg');
//     // const uris = ["https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FLlCyNHYiypQ8p1fKQWWsOWXkyb53%2Fprofile?alt=media&token=9a9c749e-ffaa-4b9d-97bf-bb9014daecd4", "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FLlCyNHYiypQ8p1fKQWWsOWXkyb53%2Fprofile?alt=media&token=9a9c749e-ffaa-4b9d-97bf-bb9014daecd4"];
//     return (
//       <View style={{flex: 1,marginTop: 10, flexWrap: 'wrap', flexDirection: 'row'}}>
//         <View style={{flex: 1, height: 200, width: 200}}>
//           <Animated.Image 
//             resizeMode={'contain'}
//             key={1}
//             style={{position: 'absolute', width: 150, height: 150}}
//             source={{uri: uri}}
//             onLoad={this.onLoad}
//           />
//           <Animated.Image 
//             resizeMode={'contain'}
//             key={2}
//             style={{opacity: this.state.thumbnailOpacity, width: 150, height: 150}}
//             source={thumb}
//             onLoad={this.onThumbnailLoad}
//           />
//         </View>

//         {/* {[1].map( () => <ProgressiveImage
//           thumbnailSource={{ uri: uri }}
//           imageSource={{ uri: uri}}
//           style={{ width: 200, height: 200 }}
//           imageFadeDuration={250}
//           thumbnailFadeDuration={250}
//           thumbnailBlurRadius={20}
//           onLoadImage={Function.prototype}
//           onLoadThumbnail={Function.prototype}
//         />)} */}
//         {/* {[1,2,3,4,5,6,7,8,9,10,11,12,13,15,17,18,87,98,888,9999,859,897907,55].map( () => (
//             <Image 
//         // onLoadStart={() => this.setState({load: 'in progress'})}
//         // onLoad={()=>this.setState({load: 'done'})}
//         // source={load == "not started" ? asset : load == "in progress" ? inProgressAsset : {uri: uris[0]} } 
//         source={{uri: uri}}
//         loadingIndicatorSource={inProgressAsset}
//         style={{width: 100, height: 100}}

//         />
//         ))
        
//         } */}
//       </View>
//     )
//   }
// }

// const styles = StyleSheet.create({})


//Below test is a test of app's ability to open node js project which utilizes PayPal rest sdk to carry out a transaction,
//and send the user back to the app afterwards.

// import React, { Component } from 'react'
// import { Text, View, Modal, TouchableOpacity, WebView, StyleSheet } from 'react-native'

// const uri = "http://localhost:5000"
// const uri = "https://calm-coast-12842.herokuapp.com";
// export default class Test extends Component {
//     state = {
//         showModal: false,
//         status: "pending",
//     }

//     handleResponse = (data) => {
//         if(data.title == "success") {
//             this.setState({showModal: false, status: "complete"});
//         }

//         else if(data.title == "cancel") {
//             this.setState({showModal: false, status: "canceled"});
//         }
//         else {
//             return;
//         }
//     }

//     render() {
//         return (
//             <View style={styles.container}>
//                 <Modal visible={this.state.showModal} onRequestClose={() => this.setState({showModal: false})}>
//                     <WebView 
//                     source={{uri: uri}} 
//                     onNavigationStateChange={data => this.handleResponse(data)}
//                     injectedJavaScript={`document.f1.submit()`}/>
//                 </Modal>
//                 <TouchableOpacity style={styles.button} onPress={() => this.setState({showModal: true})}>
//                     <Text>Pay with PayPal</Text>
//                 </TouchableOpacity>
//                 <Text>Payment Status: {this.state.status}</Text>
//             </View>
//         )
//     }
// }

// const styles = StyleSheet.create({
//     container: {
//         marginTop: 22,
//     },
//     button: {
//         width: 300,
//         height: 100
//     }

// })



// Test for ListView from scratch

// import React, { Component } from 'react'
// import { ScrollView, Text, StyleSheet, View, TouchableOpacity, Image, ListView, TouchableHighlight } from 'react-native'
// import Accordion from 'react-native-collapsible/Accordion';
// import * as Animatable from 'react-native-animatable';
// import { splitArrayIntoArraysOfSuccessiveElements } from '../localFunctions/arrayFunctions';
// const cardWidth = 145;
// const cardHeight = 190;


// export default class Test extends Component {

//     constructor(props) {
//         super(props);

//         this.state = {

//             ds: new ListView.DataSource({
//               rowHasChanged: (r1, r2) => r1 !== r2
//             }),

//             photoArray: [
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//             ],

//             first: [
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32",
//                     isActive: false
//                 },
//             ],
//             second: [
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LOt8UrRxuOyc3RKZnsa%2F1?alt=media&token=3f5fd76a-5b10-446d-b383-c8aa688842c3",
//                     isActive: false
//                 },
//                 {
//                     uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LOt8UrRxuOyc3RKZnsa%2F1?alt=media&token=3f5fd76a-5b10-446d-b383-c8aa688842c3",
//                     isActive: false
//                 },
//             ]
//         }
        
//     }

//     renderRow = (section, expandFunction) => {
//         return(
//         <View style={{}}>
//             <TouchableHighlight 
//                 onPress={expandFunction}
//                 style={styles.card}
//             >
//                 <View style={styles.card}>
//                     <Image 
//                         style={styles.productImage} 
//                         source={{uri: section.uri}}

//                         />
//                 </View>
//             </TouchableHighlight>    
//             {   section.isActive?
//                 <View>
//                     <Text style={{fontSize: 34}}>BIG TEXT</Text>
//                 </View>
//                 :
//                 null
//             }
            
//         </View>
//         )
        
//     }

//     render() {
//       var {first, second} = splitArrayIntoArraysOfSuccessiveElements(this.state.photoArray);
//       return (
//         <View style={{marginTop: 22, flex: 1}}>
        
//             <ScrollView style={{flex:1, backgroundColor: 'red'}} contentContainerStyle={styles.cc}>
//                 <ListView
//                     contentContainerStyle={styles.list}
//                     dataSource={this.state.ds.cloneWithRows(this.state.first)}
//                     renderRow={(rowData) => this.renderRow(rowData, () => {
//                     // let photoArray;
//                     // section.isActive = !section.isActive;
//                     let index = this.state.first.indexOf(rowData);
//                     this.state.first[index].isActive = !this.state.first[index].isActive;
//                     this.setState({first: this.state.first});
//                 })}
//                     enableEmptySections={true}
//                 />
//                 <ListView
//                     contentContainerStyle={styles.list}
//                     dataSource={this.state.ds.cloneWithRows(this.state.second)}
//                     renderRow={(rowData) => this.renderRow(rowData, () => {
//                     // let photoArray;
//                     // section.isActive = !section.isActive;
//                     let index = this.state.second.indexOf(rowData);
//                     this.state.second[index].isActive = !this.state.second[index].isActive;
//                     this.setState({second: this.state.second});
//                 })}
//                     enableEmptySections={true}
//                 />
//           </ScrollView>
//         </View>
//       )
//     }
//   }

// const styles = StyleSheet.create({

//     cc: {flexGrow: 4, flexDirection: 'row'},
//     card: {
//         // flexDirection: 'row',
//         // flexWrap: 'wrap',
//         backgroundColor: '#fff',
//         width: cardWidth,
//         //width/2 - 0
//         height: cardHeight,
//         //200
//         //marginLeft: 2,
//         //marginRight: 2,
//         marginTop: 2,
//         padding: 0,
//         // justifyContent: 'space-between'
//       } ,

//       productImage: {width: cardWidth, height: cardHeight},

//       list: {flexDirection: 'row', flexWrap: 'wrap'}
// })

// class TTest extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//           activeSection: false,
//           collapsed: true,
//         }
//     }
  
//     toggleExpanded = () => {
//       this.setState({ collapsed: !this.state.collapsed });
//     };
  
//     setSection = section => {
//       this.setState({ activeSection: section });
//     };
  
//     renderHeader = (section, _, isActive) => {
//       return (
//       <View
      
      
      
//       >
      
//           <Image style={styles.productImage} 
//           source={{uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32"}}/>
  
//           <Text style={{fontSize: 4}}>BIG TEXT</Text>
  
          
  
//       </View>
  
//       )
//     }
  
//     renderContent = (section, _, isActive) => {
//         return (
//       <View
      
      
      
//       >
      
//           <Image style={styles.productImage} 
//           source={{uri: "https://firebasestorage.googleapis.com/v0/b/nottmystyle-447aa.appspot.com/o/Users%2FAjiaKr1XkCgfhWm3zdR8TKKiLno2%2F-LPbRhbEqd-wNNk13xn2%2F0?alt=media&token=b4f93c88-babd-4d92-af09-6ffa92fd2a32"}}/>
  
//       </View>
  
//         )
        
//     }
  
//     render() {
//       return (
//         <View style={{flex: 1, marginTop: 22}}>
//           <ScrollView style={{}} contentContainerStyle={styles.cc}>
  
//               <View style={{flex: 0.2, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: 'green', padding: 10, alignItems: 'center'}}>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               <Text style={{fontSize: 24}}>BIG TEXT</Text>
//               </View>
  
//               <View style={{flex: 0.8, flexDirection: 'row', flexWrap: 'wrap', backgroundColor: '#fff'}}>
//                   <Text style={{fontSize: 10}}>BIG TEXT</Text>
                  
//                   <Accordion
//                       activeSection={this.state.activeSection}
//                       sections={[1,2,3,4]}
//                       touchableComponent={TouchableOpacity}
//                       renderHeader={this.renderHeader}
//                       renderContent={this.renderContent}
//                       duration={200}
//                       onChange={this.setSection}
//                       sectionContainerStyle={{flexDirection: 'column', padding: 5}}
//                       containerStyle={styles.list}
//                   />
//               </View>
//           </ScrollView>
//         </View>
//       )
//     }
//   }
