// import React, { Component } from 'react'
// import { Text, View, Image, StyleSheet, TouchableHighlight } from 'react-native'
// import Icon from 'react-native-vector-icons/FontAwesome'
// import ActionSheet from 'react-native-actionsheet'
// import { withNavigation } from 'react-navigation';

// class AddButton extends Component {
//   constructor(props) {
//     super(props);
//     this.state = {cameraToggle: false};
//   }

//   showActionSheet() {
//     console.log('adding Item')
//     this.ActionSheet.show()

//   }

//   cameraOrGallery(index, navToComponent) {
//     if (index === 0) {
//       this.setState({cameraToggle: true});
//       this.launchCamera(navToComponent);

//     }
//     else {this.launchGallery();}
//   }

//   launchCamera(navToComponent) {
//     console.log('launching camera');
//     this.props.navigation.navigate('PictureCamera', {navToComponent: `${navToComponent}` })
//     //<MyCustomCamera />
    
//   }

//   launchGallery() {
//     console.log('opening Photo Library');
//   }

//   render() {
    
//     return (
//       <View style={styles.headerBackground}>
        
//         <TouchableHighlight style={styles.profilepicWrap} onPress={() => this.showActionSheet()} >
//           {this.props.pictureuri === 'nothing here' ? 
//             <Image source={require('../images/nothing_here.png')} style={styles.profilepic} /> : 
//             <Image source={{uri: this.props.pictureuri}} style={styles.profilepic} />
//             }

//         </TouchableHighlight>
        
        
//           <ActionSheet
//           ref={o => this.ActionSheet = o}
//           title={'Choose picture selection option'}
//           options={['Camera', 'PhotoLibrary', 'cancel']}
//           cancelButtonIndex={2}
//           destructiveButtonIndex={1}
//           onPress={(index) => { console.log(index); this.cameraOrGallery(index, this.props.navToComponent) }}
//           />
        
        
       
//         </View>
        
      
      
//     )
//   }
// }

// {/* <Icon.Button name='plus' onPress={() => this.showActionSheet() }>
//           <Text>Add Picture of Item</Text>
//         </Icon.Button> */}

// const styles = StyleSheet.create( {

//   image: {
//     width: 100,
//     height: 100
//   },
//   headerBackground: {
//     flex: 1,
//     justifyContent: 'space-between',
//     alignItems: 'center'
//   },
//   profilepicWrap: {
//     width: 150,
//     height: 150,
//     borderRadius: 100,
//     borderColor: 'blue',
//     borderWidth: 5,
    
//   },
//   profilepic: {
//     flex: 1,
//     width: null,
//     alignSelf: 'stretch',
//     borderRadius: 65,
//     borderColor: '#fff',
    
//   },

// } )

// export default withNavigation(AddButton)