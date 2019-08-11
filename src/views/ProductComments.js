import Comments from './Comments';

import React, {Component} from 'react'
// import { Dimensions, Keyboard, Text, TextInput, TouchableHighlight, Image, View, ScrollView, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

// // import { Hoshi } from 'react-native-textinput-effects'
import {withNavigation} from 'react-navigation';
// import firebase from '../cloud/firebase';
// import { material, human, iOSUIKit, iOSColors, systemWeights } from 'react-native-typography'
// import { almostWhite, highlightGreen, treeGreen, avenirNext, graphiteGray, darkGray, optionLabelBlue, rejectRed, lightGray } from '../colors';
// import FontAwesomeIcon  from 'react-native-vector-icons/FontAwesome';
// import { avenirNextText } from '../constructors/avenirNextText';
// //for each comment, use their time of post as the key

// const {width, height} = Dimensions.get('window')

// class ProductComments extends Component {

//     constructor(props) {
//         super(props);
//         this.state = {
//           comments: {},
//           commentString: '',
//           visibleHeight: Dimensions.get('window').height,
//           isGetting: true,
//           showDeleteRow: false
//         }
//         this.height = this.state.visibleHeight
        
        
//     }

//     componentWillMount() {

//         Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
//         Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
        
//         const {params} = this.props.navigation.state;
//         const {comments} = params;
//         console.log(comments);
//         this.setState({comments: comments ? comments : {}, yourUid: firebase.auth().currentUser.uid });

//     }

//     keyboardWillShow (e) {
//         let newSize = Dimensions.get('window').height - e.endCoordinates.height
//         this.setState({visibleHeight: newSize})
//       }

//     keyboardWillHide (e) {
//        this.setState({visibleHeight: Dimensions.get('window').height})
//     }

//     onCommentTextChanged(commentString) {
//         this.setState({ commentString });
//     }

//     uploadComment(name, comment, uid, uri, productKey, yourUid ) {
        
//         var timeCommentedKey = Date.now();
//         var date = (new Date()).getDate();
//         var month = (new Date()).getMonth();
//         var year = (new Date()).getFullYear();
//         var timeCommented = `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`;
        
//         var updates = {}
//         var postData = {text: comment, name: name, time: timeCommented, uri: uri, uid: yourUid }
//         this.state.comments[timeCommentedKey] = postData; // --> how to create a new key in the object with certain values, which in this case is another object containing the specific comment being uploaded
//         this.setState({ comments : this.state.comments });
//         updates['/Users/' + uid + '/products/' + productKey + '/comments/' + timeCommentedKey + '/'] = postData
//         //firebase.database().ref('Posts').set({posts: this.state.posts})
//         console.log(postData, updates)
//         firebase.database().ref().update(updates)
//     }

//     deleteComment(key, uid, productKey) {
//         firebase.database().ref('/Users/' + uid + '/products/' + productKey + '/comments/' + key + '/')
//         .remove( () => {
//             console.log(`successfully removed product comment: ${this.state.comments[`${key}`]}`);
//         })
//         .then(() => {
//             console.log(this.state.comments)
//             delete this.state.comments[`${key}`];

//             // TODO: when all comments are deleted, either locally update the state to show it has no reviews,
//             // OR rework this component to pull from the cloud every time any changes are made.
//             // if(Boolean(Object.keys(this.state.comments)[0])) {
//             //     this.state.comments['a'] = {text: 'No Reviews have been left for this product yet.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' };
//             // }
//             this.setState({comments: this.state.comments});
//         })
//         .catch( (e) => {console.log(e)})
//     }

//     navToOtherUserProfilePage = (uid) => {
//         this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
//     }
    
//     render() {
//         const {yourUid} = this.state;
//         const {params} = this.props.navigation.state;
//         const {productInformation, key, yourProfile, theirProfile, uid} = params;
//         const {uris, text} = productInformation //For row containing product Information
//         const {name, uri} = yourProfile; //To upload a comment, attach the current Users profile details, in this case their name and profile pic uri
        
//         var {comments, showDeleteRow} = this.state;
//         // var emptyReviews = Object.keys(comments).length == 1 && Object.keys(comments).includes('a') ? true : false
//         // var {a, ...restOfTheComments} = comments;
//         // comments = emptyReviews ? {a} : restOfTheComments;

//         return (

//             <View>
//             <View style={styles.mainContainer} >
//             {/* Row to go back and look at seller info */}
//             <View style={styles.backAndSellerRow}>
//                 <View style={styles.backIconContainer}>
//                     <FontAwesomeIcon
//                     name='arrow-left'
//                     size={40}
//                     color={'black'}
//                     onPress = { () => { 
//                         this.props.navigation.goBack();
//                         } }
//                     />
//                 </View>

//                 <View style={styles.sellerNameContainer}>
//                     <Text 
//                     onPress={() => yourUid == uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(uid)}  
//                     style={styles.sellerName}
//                     >
//                     {theirProfile.name}
//                     </Text>
//                 </View>

//                 <TouchableHighlight 
                // onPress={() => yourUid == uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(uid)} 
//                 style={styles.sellerImageContainer}
//                 >
//                     <Image source={ {uri: theirProfile.uri }} style={styles.profilePic} />
//                 </TouchableHighlight>
//             </View>

//             <View style={{backgroundColor: 'black', height: 1.5}}/>

//             {/* Row to view product picture and name */}
            
//             <View style={styles.productInfoContainer}>
//                 {/* row containing picture, and details for product */}
//                <View style={styles.productImageContainer}>
//                 <Image source={ {uri: uris.thumbnail[0] }} style={styles.productPic} />
//                </View>
                
//                <View style={styles.productTextContainer}>
//                  <Text style={styles.name}>
//                    {text.name}
//                  </Text>
//                </View>
               
//              </View>

//             <View style={{backgroundColor: 'black', height: 1.5}}/>
//              {/* Product Reviews by other users */}
//              <ScrollView style={styles.contentContainerStyle} contentContainerStyle={styles.contentContainer}>
//              {comments?
//                  Object.keys(comments).map(
//                   (comment) => (
//                   <TouchableOpacity key={comment} style={[styles.commentContainer, {color: showDeleteRow ? almostWhite : '#fff'}]} onLongPress={()=>this.setState({showDeleteRow: true})}>
                    
//                     {
//                     showDeleteRow && comments[comment].uri == uri ?
//                         <View style={styles.deleteCommentRow}>
//                             <Icon name="close" 
//                             size={22} 
//                             color={'black'}
//                             onPress={ () => {this.setState({showDeleteRow: false}) }}
//                             />
//                             <Text
//                             onPress={() => this.deleteComment(comment, productInformation.uid, productInformation.key)} 
//                             style={styles.deleteComment}>
//                                 Delete
//                             </Text>
//                         </View>
//                     :
//                         null
//                     }
//                         {/* Ensure individual commenter's comment sends current user to their profile page. TODO: Blocked Users Later */}
//                       <View style={styles.commentPicAndTextRow}>

//                         {comments[comment].uri ?
//                         <TouchableHighlight 
//                         onPress={() => yourUid == comments[comment].uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(comments[comment].uid)} 
//                         style={styles.commentPic}
//                         >
//                           <Image style= {styles.commentPic} source={ {uri: comments[comment].uri} }/>
//                         </TouchableHighlight>  
//                         :
//                           <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
//                         }
                          
//                         <View style={styles.textContainer}>
//                             <Text style={ styles.commentName }> {comments[comment].name} </Text>
//                             <Text style={styles.comment}> {comments[comment].text}  </Text>
//                         </View>

//                       </View>

//                       <View style={styles.commentTimeRow}>

//                         <Text style={ styles.commentTime }> {comments[comment].time} </Text>

//                       </View>
                      
//                   </TouchableOpacity>
                  
//               )
                      
//               )
//               :
//               null
//               }
//             </ScrollView>
             
//             <View style={[styles.inputAndSendContainer, {bottom: this.height - this.state.visibleHeight}]} >

            
//                 <View style={styles.inputContainer}>
//                     <TextInput
//                     style={{height: 50, width: width/2, fontFamily: 'Avenir Next', fontSize: 20, fontWeight: "500"}}
//                     placeholder={'Comment'}
//                     placeholderTextColor={lightGray}
                    // onChangeText={ commentString => this.onCommentTextChanged(commentString)}
                    // value={this.state.commentString}
//                     multiline={false}
//                     autoCorrect={false}
//                     autoCapitalize={'none'}
//                     clearButtonMode={'while-editing'}
//                     underlineColorAndroid={"transparent"}
//                     />         
//                 </View>
            

//                 <View style={styles.sendContainer}>
//                     <Icon 
//                     name="send" 
//                     size={40} 
//                     color={optionLabelBlue}
                    // onPress={ () => {
                    //     this.uploadComment(name, this.state.commentString, uid, uri, key, yourUid);
                    //     this.setState({commentString: ''}); 
                    //     Keyboard.dismiss()
                    // }}
//                     />
//                 </View>
                
//             </View>

//            </View>

//            <KeyboardAvoidingView behavior={Platform.OS == 'android' ? 'padding' : null} keyboardVerticalOffset={80}/>

//            </View>
//         )
//     }
// }

class ProductComments extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return <Comments type={'product'} navigation={this.props.navigation}/>
    }
}


export default withNavigation(ProductComments)