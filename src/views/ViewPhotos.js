// import React, { Component } from 'react';
// import {
//   Image,
//   View,
//   ScrollView,
//   ListView,
//   StyleSheet,
//   Text,
//   TouchableHighlight,
//   Platform,
//   Dimensions
// } from 'react-native';
// import { withNavigation } from 'react-navigation';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
// import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
// import { Button } from 'react-native-elements';
// import { treeGreen, highlightGreen, graphiteGray, optionLabelBlue, darkGreen } from '../colors';

// // import SelectedPhoto from './SelectedPhoto';
// import CustomCarousel from '../components/CustomCarousel';

// const {width} = Dimensions.get('window')
// const profilePictureText = "Pick a Profile Picture:";
// const productPictureText = "Choose pictures:";

// class ViewPhotos extends Component {

  
//   constructor(props) {
//     super(props);
//     this.state = {

//       ds: new ListView.DataSource({
//         rowHasChanged: (r1, r2) => r1 !== r2
//       }),
  
//       showSelectedPhoto: false,
//       showSelectedPhotos: false,
//       //uri of photo you're considering
//       uri: '',
//       //uri(s) of photo(s) you have chosen
//       pictureuris: [],
//       temppictureuris: [], //placeholder storage for any 4 pictures you've chosen
//       count: 0,
  
//     }
//   }
  


//   renderRow = (rowData, navToComponent) => {
//     const { uri } = rowData.node.image;
//     // rowData.node.image['selected'] = false;

//     if(navToComponent == 'CreateItem' || navToComponent == 'EditItem') {
//       return (
//         <TouchableHighlight
//         onPress={() => {
          
//             if(!this.state.pictureuris.includes(uri)) {
//               // rowData.node.image['selected'] = true;
//               this.state.pictureuris.push(uri)
//               this.setState({count: this.state.count + 1})
//               if(this.state.pictureuris.length == 4) {
//                 this.setState({showSelectedPhotos: true})
//               }
//             } 
//             else {
//               //if the user deselects this image, set selected property to false and reduce count of Selected Images by 1
//               // rowData.node.image['selected'] = false;
            
//               //identify index of uri that needs to be removed from array, and remove that element based on the value of the index (position of element in array)
//               var index = this.state.pictureuris.indexOf(uri);
//               if(index == 0) {
//                 this.state.count == 0 ? null : this.setState({ pictureuris: this.state.pictureuris.slice(index + 1, this.state.pictureuris.length), count: this.state.count - 1})
//               }
//               else if(index == this.state.pictureuris.length - 1) {
//                 //this uri is last element in pictureuris array
//                 this.state.count == 0 ? null : this.setState({ pictureuris: this.state.pictureuris.slice(0, index), count: this.state.count - 1})
//               }
//               else {
//                 var left = this.state.pictureuris.slice(0,index)
//                 var right = this.state.pictureuris.slice(index + 1, this.state.pictureuris.length)
//                 this.state.count == 0 ? null : this.setState({ pictureuris: left.concat(right), count: this.state.count - 1})
//               }

              



//               //minimum value for count is 0, so if the count is already 0, don't subtract 1 from the count
              
//             }
          
          
//          } }>
//           <View style={styles.imageContainer}>

//           <Image
//                 source={{ uri: rowData.node.image.uri }}
//                 style={styles.image} 
//               />
//             <View style={{position: 'absolute', flexDirection: 'row', }}>
              
//               <Icon 
//               size={30} 
//               color={this.state.pictureuris.includes(uri) ? optionLabelBlue : graphiteGray} 
//               type='material-community' 
//               name={this.state.pictureuris.includes(uri) ? 'check-circle' : 'check-circle-outline'}
//               />
//             </View>
            
//           </View>  
//         </TouchableHighlight>
//       )
//     }
// // Else case is easier as we just display the singular the user will select
//     else if(navToComponent == 'CreateProfile' || navToComponent == 'EditProfile') {
//       return (

//         <TouchableHighlight
//           style={styles.imageContainer}
//           onPress={() => {
//             this.setState({ showSelectedPhoto: true, uri: uri })
//             } }>
//           <Image
//             source={{ uri: rowData.node.image.uri }}
//             style={styles.image} />
//         </TouchableHighlight>
//       )
//         }

//   }

//   render() {
//     const { showSelectedPhotos, showSelectedPhoto, uri, count, pictureuris } = this.state;
//     const {params} = this.props.navigation.state;
//     const {navToComponent, photoArray} = params;
//     // console.log(count, pictureuris);
//     if(showSelectedPhotos) {
//       return (
//         <View style={[styles.selectedPhotoContainer, {marginTop: Platform.OS == 'ios' ? 22 : 0}]}>
//           <View style={styles.backButtonHeader}>
//             <Icon 
//               name='arrow-left'
//               size={38}
//               color={'black'}
//               onPress={() => {
//                 this.setState( {showSelectedPhotos: false, pictureuris: []} );
//               }}
//             />
//           </View>
//           <View style={{flex: 0.57, alignItems: 'center', width: "100%"}}>
//             <CustomCarousel data={this.state.pictureuris}/>
//           </View>
//           <View style={[styles.buttonsColumn, {flex: 0.3, justifyContent: 'center', alignItems: 'center'}]}>
              
//               <Button  
//               buttonStyle={[styles.ModalButtonStyle, {backgroundColor: highlightGreen}]}
              
//               title='Okay'
//               onPress={() => {
//                   console.log(`navigating to ${navToComponent} with ${this.state.pictureuris}`);
//                   this.props.navigation.navigate(`${navToComponent}`, {pictureuris: this.state.pictureuris} );
//                   }}
//               />

              

//           </View>
//         </View>
//       )
//     }

//     if (showSelectedPhoto) {
//       return (

//         <View style={[styles.selectedPhotoContainer, {marginTop: Platform.OS == 'ios' ? 22 : 0}]}>
//             <View style={styles.backButtonHeader}>
//               <Icon 
//                 name='arrow-left'
//                 size={38}
//                 color={'black'}
//                 onPress={() => {
//                   this.setState( {showSelectedPhoto: false, pictureuris: []} );
//                 }}
//               />
//             </View>
//             <View style={{flex: 0.57, alignItems: 'center'}}>
//               <Image
//                   source={{uri: uri}}
//                   style={styles.selectedPhotoImage}/>
//             </View>    
//             <View style={[styles.buttonsColumn, {flex: 0.3, justifyContent: 'center', alignItems: 'center'}]}>
                
//                 <Button  
//                 buttonStyle={[styles.ModalButtonStyle, {backgroundColor: highlightGreen}]}
//                 icon={{name: 'emoticon', type: 'material-community'}}
//                 title='Okay'
//                 onPress={() => {
//                     this.state.pictureuris.push(uri)
//                     this.props.navigation.navigate(`${navToComponent}`, {pictureuris: this.state.pictureuris} )
//                     }}
//                 />

//             </View>    
//         </View>
        
//       )
//     }

//     return (
//       <View style={[styles.mainContainer, {marginTop: Platform.OS == 'ios' ? 22 : 0}]}>

//         <View style={{ flex: 0.2, flexDirection: 'row', paddingHorizontal: 10, alignItems: 'center', justifyContent: 'center' }}>

//           <View style={styles.backIconContainer}>
//             <FontAwesomeIcon
//               name='arrow-left'
//               size={35}
//               color={'black'}
//               onPress = { () => { 
//                 this.props.navigation.navigate(`${navToComponent}`);
//                   } }

//             />
//           </View>

//           <View style={styles.instructionsTextContainer}>      
//             <Text style={{ fontFamily: 'Avenir Next', fontSize: 14, fontWeight: '600' }}>
//               {navToComponent == 'CreateProfile' || navToComponent == 'EditProfile' ? profilePictureText : productPictureText}
//             </Text>
//           </View>

//           {navToComponent == 'CreateItem' || navToComponent == 'EditItem' ?
//             <View style={styles.confirmSelectionIconContainer}>
//               <Icon
//                 name={this.state.pictureuris.length > 0 ? "check-circle" : "check-circle-outline"}
//                 size={45}  
//                 color={this.state.pictureuris.length > 0 ? darkGreen : 'black'}
//                 onPress={this.state.pictureuris.length > 0 ? () => this.setState({showSelectedPhotos: true}) : null}
//               />
//             </View>
//             :
//             null
//           }

//         </View>

//       <View style={{height: 1.3, backgroundColor: 'black'}}/>

//       <ScrollView style={{flex: 1}} contentContainerStyle={styles.contentContainerStyle}>
        
        
        
//         <ListView
//           contentContainerStyle={styles.list}
//           dataSource={this.state.ds.cloneWithRows(photoArray)}
//           renderRow={(rowData) => this.renderRow(rowData, navToComponent)}
//           enableEmptySections={true}
//         />

        
//       </ScrollView>
//       </View>
//     );
//   }
// }

// const styles = StyleSheet.create({

//   mainContainer: { backgroundColor: '#fff', flex: 1, padding: 3 },

//   contentContainerStyle: {
//     flexGrow: 4,
//     flexDirection: 'column'   
//     // flexDirection: 'row',
//     // flexWrap: 'wrap',
//     // paddingTop: 20,
//         },

//   backIconContainer: {
//     flex: 1,
//     justifyContent: 'flex-start'
//   },

//   instructionsTextContainer: {
//     flex: 3,
//     justifyContent: 'center',
//     alignItems: 'center'
//   },

//   confirmSelectionIconContainer: {
//     flex: 1
//   },

//   list: {
//     flex: 1,
//     flexDirection: 'row',
//     flexWrap: 'wrap'
//   },

//   imageContainer: {
//   padding: 0, marginVertical: 3, marginHorizontal: 1, 
//   shadowOpacity: 0.5,shadowRadius: 1.3,shadowColor: 'black',shadowOffset: {width: 0, height: 0},
// },

//   image: { 
//     height: 180, 
//     width: 0.9*(width/2) , 
//     // zIndex: -1, 
//     // position: 'absolute', 
//     // top: 0, 
//     // left: 0, 
//     // right: 0, 
//     // bottom: 0, 
//     // resizeMode: 'cover',
//     // marginLeft: 10,
//     // marginTop: 10,
//     // borderRadius: 5,
//     // borderWidth: 0,
  
//     // borderColor: 'black' 
// },

//   selectedPhotoContainer: {
//       backgroundColor: '#fff',
//     flex: 1,
//     // justifyContent: 'center',
//     // marginTop: 22,
//     // alignItems: 'center'
//   },

//   backButtonHeader: {flex: 0.13, flexDirection: 'row',justifyContent: 'flex-start', alignItems: 'center',},



//   selectedPhotoImage: {
//     flex: 2,
//     margin: 10,
//     height: 200,
//     width: 200,
//     borderColor: treeGreen,
//     borderWidth: 3,
    
//   },

//   buttonsColumn: {
//       flex: 2,
//       flexDirection: "column",
//       flex: 1,
//       margin: 10
//   },

//   ModalButtonStyle : {
//     // backgroundColor: 'black',
//     // width: width/3 + 20,
//     // height: height/15,
//     borderRadius: 20,
//     // justifyContent: 'center',
//     // alignItems:'center',
//     // alignContent: 'center',
  
//   }
// })

// export default withNavigation(ViewPhotos);