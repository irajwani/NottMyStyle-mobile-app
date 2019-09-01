import React, { Component } from 'react'
import { Platform, SafeAreaView, Text, TextInput, Image, StyleSheet, View, TouchableHighlight, TouchableOpacity, ScrollView, Fragment } from 'react-native'
import {StackActions,NavigationActions,withNavigation} from 'react-navigation';
// import { Jiro } from 'react-native-textinput-effects';
// import NumericInput from 'react-native-numeric-input' 
import {Button, ButtonGroup, Divider} from 'react-native-elements';
import Dialog, { DialogTitle, DialogContent, DialogButton, SlideAnimation } from 'react-native-popup-dialog';
// import RNFetchBlob from 'react-native-fetch-blob';
import RNFetchBlob from 'rn-fetch-blob';
import MultipleAddButton from '../components/MultipleAddButton';
// import CustomModalPicker from '../components/CustomModalPicker';
import ProductLabel from '../components/ProductLabel.js';
// import {signInContainer} from '../styles.js';
import firebase from '../cloud/firebase.js';

import ImageResizer from 'react-native-image-resizer';
// import Chatkit from "@pusher/chatkit";
// import { CHATKIT_SECRET_KEY, CHATKIT_INSTANCE_LOCATOR, CHATKIT_TOKEN_PROVIDER_ENDPOINT } from '../credentials/keys';
// import * as Animatable from 'react-native-animatable';
import { iOSColors } from 'react-native-typography';
import { PacmanIndicator } from 'react-native-indicators';
import { highlightGreen,lightGreen, confirmBlue, woodBrown, rejectRed, optionLabelBlue, aquaGreen, treeGreen, avenirNext, darkGray, lightGray, darkBlue, highlightYellow, profoundPink, tealBlue, graphiteGray, lightBlack, fbBlue, mantisGreen, almostWhite } from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DismissKeyboardView, WhiteSpace, LoadingIndicator } from '../localFunctions/visualFunctions';
import { avenirNextText } from '../constructors/avenirNextText';
import { textStyles } from '../styles/textStyles';
import { HeaderBar } from '../components/HeaderBar';


// const darkGreen = '#0d4f10';
// const limeGreen = '#2e770f';
// const slimeGreen = '#53b73c';
const priceAdjustmentReminder = "* NottMyStyle takes 10% of the selling price of your product to process payments through PayPal. Be sure to mark up your selling price accordingly.";
paypalReminder = "* If you don't provide a PayPal ID, we can't transfer your money in case of a sale."
const Bullet = '\u2022';
const categories = ["Men", "Women", "Accessories"]
const categoryColors = [darkBlue, profoundPink, treeGreen] //Men, Women, Accessories

//For Resized Image
const maxWidth = 320, maxHeight = 320, suppressionLevel = 0;

// const {height, width} = Dimensions.get('window');

const Blob = RNFetchBlob.polyfill.Blob;
const fs = RNFetchBlob.fs;
window.XMLHttpRequest = RNFetchBlob.polyfill.XMLHttpRequest;
window.Blob = Blob;

const Fetch = RNFetchBlob.polyfill.Fetch
// replace built-in fetch
window.fetch = new Fetch({
    // enable this option so that the response data conversion handled automatically
    auto : true,
    // when receiving response data, the module will match its Content-Type header
    // with strings in this array. If it contains any one of string in this array, 
    // the response body will be considered as binary data and the data will be stored
    // in file system instead of in memory.
    // By default, it only store response data to file system when Content-Type 
    // contains string `application/octet`.
    binaryContentTypes : [
        'image/',
        'video/',
        'audio/',
        'foo/',
    ]
}).build()

function incrementPrice(previousState, currentProps) {
 return { uri: previousState.price + 1 } 
}

const TextForMissingDetail = ({detail}) => {
 return (
 <Text style={new avenirNextText(woodBrown, 22, "400")}>{Bullet + " " + detail}</Text>
 )
}
 

class CreateItem extends Component {
 constructor(props) {
    super(props);

    //extract data if we came to this screen to edit an existing item:
    var item = this.props.navigation.getParam('data', false);
    var isComingFrom = this.props.navigation.getParam('isComingFrom', false);
    // console.log("ITEM IS:" + item);
    // if(item) {
    // this.props.navigation.setParams({
    // data: item, //possibly unnecessary
    // pictureuris: item.uris.source, 
    // price: item.text.price, 
    // original_price: item.text.original_price, 
    // post_price: item.text.post_price > 0 ? item.text.post_price : 0,
    // condition: item.text.condition,
    // type: item.text.type,
    // size: item.text.size,
    // editItemBoolean: true
    // })
    // } 

    this.state = {
        currency: '',
        uri: undefined,
        name: item ? item.text.name : '',
        brand: item ? item.text.brand : '', //empty or value selected from list of brands
        // price: 0,
        // original_price: 0,
        // size: 2,
        // type: 'Trousers',
        gender: item ? categories.indexOf(item.text.gender) : 1,
        // condition: 'Slightly Used',
        // insta: '',
        description: item ? item.text.description ? item.text.description : '' : '',
        typing: true,
        canSnailMail: item ? item.text.post_price > 0 ? true : false : false,
        paypal: item ? item.text.paypal ? item.text.paypal : '' : '',
        isUploading: false,
        pictureuris: 'nothing here',
        helpDialogVisible: false,
        /////////
        //EDIT ITEM STUFF
        editItemBoolean: this.props.navigation.getParam('editItemBoolean', false),
        oldItemPostKey: item ? item.key : false,
        oldUploadDate: item ? item.text.time : false,
        isComingFrom: isComingFrom ? isComingFrom : false,



        /////////

        /////RESIZE IMAGE STUFF
        resizedImage: false,
    }
 }

 componentWillMount = async () => {
    var uid = await firebase.auth().currentUser.uid;
    firebase.database().ref(`/Users/${uid}/profile/country/`).once('value',(snap)=>{
        var location = snap.val();
        location = location.replace(/\s+/g, '').split(',')[1]
        var currency;
        switch(location) {
            case "UK":
                currency = '£';
                break;
            case "Pakistan":
                currency = 'Rs.';
                break;
            default:
                currency = '$';
                break;
        }
        this.setState({currency});
    })    
 }

// componentDidMount() {
// var editItemBoolean = this.props.navigation.getParam('editItemBoolean', false);
// if(editItemBoolean) {
// this.setState({editItemBoolean: true});
// }
// }

// showPicker(gender, subheading) {
// if (gender == 0) {
// return ( 
// <Picker style={styles.picker} itemStyle={[styles.pickerText, styles.men]} selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
// <Picker.Item label = "Formal Shirts" value = "Formal Shirts" />
// <Picker.Item label = "Casual Shirts" value = "Casual Shirts" />
// <Picker.Item label = "Jackets" value = "Jackets" />
// <Picker.Item label = "Suits" value = "Suits" />
// <Picker.Item label = "Trousers" value = "Trousers" />
// <Picker.Item label = "Jeans" value = "Jeans" />
// <Picker.Item label = "Shoes" value = "Shoes" />
// </Picker>
// )
// }

// else if (gender == 1) {
// return (
// <Picker style={styles.picker} itemStyle={[styles.pickerText, styles.accessories]} selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
// <Picker.Item label = "Watches" value = "Watches" />
// <Picker.Item label = "Bracelets" value = "Bracelets" />
// <Picker.Item label = "Jewellery" value = "Jewellery" />
// <Picker.Item label = "Sunglasses" value = "Sunglasses" />
// <Picker.Item label = "Handbags" value = "Handbags" />
// </Picker>
// )
// }

// else if (gender == 2) {
// return (
// <Picker style={styles.picker} itemStyle={[styles.pickerText, styles.women]} selectedValue = {this.state.type} onValueChange={ (type) => {this.setState({type})} } >
// <Picker.Item label = "Tops" value = "Tops" />
// <Picker.Item label = "Skirts" value = "Skirts" />
// <Picker.Item label = "Dresses" value = "Dresses" />
// <Picker.Item label = "Jeans" value = "Jeans" />
// <Picker.Item label = "Jackets" value = "Jackets" />
// <Picker.Item label = "Coats" value = "Coats" />
// <Picker.Item label = "Trousers" value = "Trousers" />
// </Picker>
// )
// } 
// }

//Nav to Fill In:

//1. Price and Original Price
navToFillPrice = (typeOfPrice) => {
 this.props.navigation.navigate('PriceSelection', {typeOfPrice: typeOfPrice, currency: this.state.currency})
}

//2. Type and Condition
navToFillConditionOrType = (gender, showProductTypes) => {
 this.props.navigation.navigate('ConditionSelection', {gender: gender, showProductTypes: showProductTypes});
}

navToFillSizeBasedOn = (type,gender) => {
 this.props.navigation.navigate('ConditionSelection', {type: type, gender: gender, showProductSizes: true,});
}

helpUserFillDetails = () => {
 this.setState({helpDialogVisible: true})
 // alert(`Please enter details for the following fields:\n${this.state.name ? name}`)
}

updateFirebaseAndNavToProfile = (pictureuris, mime = 'image/jpg', uid, type, price, original_price, post_price, condition, size, oldItemPostKey, oldItemUploadDate) => {
 this.setState({isUploading: true}); 
 // if(priceIsWrong) {
 // alert("You must a choose a non-zero positive real number for the selling price/retail price of this product");
 // return;
 // }

 //Locally stored in this component:
 var {name, description, brand, gender, paypal} = this.state;

 
 // : if request.auth != null;
 switch(gender) {
    case 0:
    gender = 'Men'
    break; 
    case 1:
    gender = 'Women'
    break;
    case 2:
    gender = 'Accessories'
    break;
    default:
    gender = 'Men'
    // console.log('no gender was specified')
 }

 //TODO: check if in Edit Item mode, and update cloud DB with only those text values that have actually changed

 var updates = {}; 
 var actualPostKey;

 if(oldItemPostKey) {
    actualPostKey = oldItemPostKey
 }
 else {
    actualPostKey = firebase.database().ref().child(`Users/${uid}/products`).push().key;
 }

 var productTextPath = '/Users/' + uid + '/products/' + actualPostKey + '/text/';

 if(this.state.editItemBoolean) {
    console.log('Partial Update')
    var item = this.props.navigation.getParam('data', false);
    var oldValues = item.text;
    if(price != oldValues.price) {
        updates[productTextPath + 'price/'] = price;
    }
    if(name != oldValues.name) {
        updates[productTextPath + 'name/'] = name;
    }
    if(brand != oldValues.brand) {
        updates[productTextPath + 'brand/'] = brand;
    }
    if(gender != oldValues.gender) {
        updates[productTextPath + 'gender/'] = gender;
    }
    if(original_price != oldValues.original_price) {
        console.log('Editing Original Price')
        updates[productTextPath + 'original_price/'] = original_price;
    }
    if(type != oldValues.type) {
        updates[productTextPath + 'type/'] = type;
    }
    if(condition != oldValues.condition) {
        updates[productTextPath + 'condition/'] = type;
    }
    if(size != oldValues.size) {
        updates[productTextPath + 'size/'] = type;
    }
 }

 else {
    var postData = {
        name: name,
        brand: brand,
        price: price,
        original_price: original_price ? original_price : "",
        type: type,
        size: size,
        description: description ? description : 'Seller did not specify a description',
        gender: gender,
        condition: condition,
        sold: false,
        likes: 0,
        comments: '',
        time: oldItemPostKey ? oldItemUploadDate : Date.now(), //for now, do ot override initial upload Date
        dateSold: '',
        post_price: post_price ? post_price : 0,
        paypal: paypal //TODO: test if paypal value is remembered and the user can't see it
     };
    
     updates[productTextPath] = postData;
 }
 
 updates['/Users/' + uid + '/profile/isNoob/'] = false;
 
 return {
    database: firebase.database().ref().update(updates),
    storage: this.uploadToStore(pictureuris, uid, actualPostKey)
 }

}

uploadToStore = (pictureuris, uid, postKey) => {
    var picturesProcessed = 0;

    pictureuris.forEach(async (uri, index, array) => {
    // console.log("Picture's Original URL:" + uri);
    //TODO: Will this flow work in EditItem mode for Image Uris placed in firebasestorage: NO it won't, just do simpler thing and
    //don't touch the cloud if these images have not been changed
        if(uri.includes('firebasestorage')) {
            picturesProcessed++;
            if(picturesProcessed == array.length) {
                this.callBackForProductUploadCompletion();
            }
        
        }

        else {

        
            let resizedImageThumbnail = await ImageResizer.createResizedImage(uri,maxWidth, maxHeight,'JPEG',suppressionLevel);
            let resizedImageProductDetails = await ImageResizer.createResizedImage(uri,3000, 3000,'JPEG',suppressionLevel);
            let imageUris = [uri, resizedImageThumbnail.uri, resizedImageProductDetails.uri];
            // alert(imageUris);
            imageUris.forEach((imageUri, imageIndex, imageArray) => {
            // console.log("Picture URL:", imageUri, imageIndex)
            const storageUpdates = {};
            const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : uri

            let uploadBlob = null
            //THIS IS FINE, Just stores images in firebase storage
            const imageRef = firebase.storage().ref().child(`Users/${uid}/${postKey}/${imageIndex == 0 ? index : imageIndex == 1 ? index+'-thumbnail' : index+'-pd'}`);
            fs.readFile(uploadUri, 'base64')
            .then((data) => {
                return Blob.build(data, { type: `${mime};BASE64` })
            })
            .then((blob) => {
            // console.log('got to blob')
                uploadBlob = blob
                return imageRef.put(blob, { contentType: mime })
            })
            .then(() => {
            // console.log('upload successful')
                uploadBlob.close()
                // return true;
                return imageRef.getDownloadURL()
            })
            .then((url) => {
            // console.log(url);

                if(imageIndex == 0) {
                    storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/source/' + index + '/'] = url;
                }

                else if(imageIndex == 1){
                    storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/thumbnail/' + index + '/'] = url;
                }

                else {
                    storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/pd/' + index + '/'] = url;
                }
                
                firebase.database().ref().update(storageUpdates);
                picturesProcessed++;
                if(picturesProcessed == (imageArray.length*array.length)) {
                    this.callBackForProductUploadCompletion();
                }

            })
            .catch(err => {
                // alert(err);
                this.callBackForProductUploadCompletion(isError = true);

            })









        // if(imageUri.includes('firebasestorage')) {
        // //if the person did not take brand new pictures and chose to maintain the URIS received in EditItem mode
        // console.log(url);
        // if(imageIndex == 0) {
        // storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/source/' + index + '/'] = url;
        // }

        // else if(imageIndex == 1){
        // storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/thumbnail/' + index + '/'] = url;
        // }

        // else {
        // storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/pd/' + index + '/'] = url;
        // }
        
        // firebase.database().ref().update(storageUpdates);
        // picturesProcessed++;
        // if(picturesProcessed == (imageArray.length*array.length)) {
        // this.callBackForProductUploadCompletion();
        // }
        // }
        })
    
    
    


    }
 
 })

}
// uploadToStore = (pictureuris, uid, postKey) => {
// //sequentially add each image to cloud storage (pay attention to .child() method) 
// //and then retrieve url to upload on realtime db
// // var picturesProcessed = 0;
 
// // const uploadUri = Platform.OS === 'ios' ? pictureuris[1].replace('file://', '') : uri
// // ImageResizer.createResizedImage(uploadUri,20, 20,'JPEG',80)
// // .then( newUri => {
// // console.log("Resized Image: " + newUri);
// // // this.setState({resizedImage: newUri});

// // })
// // .catch( e => console.log('error resizing image because of: ' + e))
 
// // pictureuris.forEach( (uri, index, array) => {



// // if(uri.includes('firebasestorage')) { 

// // }
// // else {
 
// // }
 
// // })

// pictureuris.forEach( (uri, index, array) => {
// var storageUpdates = {};
// if(uri.includes('firebasestorage')) {
// //if the person did not take brand new pictures and chose to maintain the URIS received in EditItem mode
// storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/' + index + '/'] = uri;
// firebase.database().ref().update(storageUpdates);
// picturesProcessed++;
// if(picturesProcessed == array.length) {
// this.callBackForProductUploadCompletion();
// }
// }

// else {
// const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
// let uploadBlob = null
// const imageRef = firebase.storage().ref().child(`Users/${uid}/${postKey}/${index}-thumbnail`);
// fs.readFile(uploadUri, 'base64')
// .then((data) => {
// return Blob.build(data, { type: `${mime};BASE64` })
// })
// .then((blob) => {
// console.log('got to blob')
// uploadBlob = blob
// return imageRef.put(blob, { contentType: mime })
// })
// .then(() => {
// uploadBlob.close()
// return imageRef.getDownloadURL()
// })
// .then((url) => {
// console.log(url);
// storageUpdates['/Users/' + uid + '/products/' + postKey + '/uris/' + index + '/'] = url;
// firebase.database().ref().update(storageUpdates);
// picturesProcessed++;
// if(picturesProcessed == array.length) {
// this.callBackForProductUploadCompletion();
// }
// })
// }
 
 
 

// // } )

// // for(const uri of pictureuris) {
// // var i = 0;
// // console.log(i);
 
// // const uploadUri = Platform.OS === 'ios' ? uri.replace('file://', '') : uri
// // let uploadBlob = null
// // const imageRef = firebase.storage().ref().child(`Users/${uid}/${newPostKey}/${i}`);
// // fs.readFile(uploadUri, 'base64')
// // .then((data) => {
// // return Blob.build(data, { type: `${mime};BASE64` })
// // })
// // .then((blob) => {
// // console.log('got to blob')
// // i++;
// // uploadBlob = blob
// // return imageRef.put(blob, { contentType: mime })
// // })
// // .then(() => {
// // uploadBlob.close()
// // return imageRef.getDownloadURL()
// // })
// // .then((url) => {
// // console.log(url);
// // })
 
 
// // }
// }

 callBackForProductUploadCompletion = (isError=false) => {
     //TODO: Some way to inform user product has been uploaded
    // alert(`Product named ${this.state.name} successfully uploaded to Market!`);
    // alert(`Your product ${this.state.name} is being\nuploaded to the market.\nPlease do not resubmit the same product.`);
    //TODO: example of how in this instance we needed to remove pictureuris if its sitting in the navigation params
    
    // isEditItem ? Navigate to Initial Screen in current Stack : Navigate to different Stack
    
    setTimeout(() => {
        this.startOver()
        // If coming from product details due to edit item, stay in your stack and go to marketplace screen
        // If coming from YourProducts/SoldProducts to edit item then popToTop first and then go to Market stack
        if(this.state.oldItemPostKey) {
            if(this.state.isComingFrom == "productDetails" ) {
                this.props.navigation.navigate('MarketPlace');
            }
            else {
                let resetStack = StackActions.reset({
                    index: 0,
                    actions: [
                      NavigationActions.navigate({routeName: 'ProfilePage'})
                    ],
                  });
                  
                  this.props.navigation.dispatch(resetStack);
                  this.props.navigation.navigate('Market');
            }
            
        }
        else {
            this.props.navigation.navigate('Market');
        }
        
        if(isError) {
            alert('There was an error in uploading your product. Please try again.')
        }
        else {
            alert('Product successfully uploaded. Note that it may take up to 1 minute for the product to be visible in the marketplace.')
        }
                 
    }, this.state.oldItemPostKey ? 1 : 1);
    
 }

 deleteProduct = async (uid, key) => {
    await firebase.database().ref('/Users/' + uid + '/products/' + key).remove();
    await firebase.database().ref('/Users/' + uid + '/notifications/priceReductions/' + key)
    .remove()
    .catch(err => console.log(err));
    this.setState({isUploading: false,})
    alert('Your product has been successfully deleted.');
    this.props.navigation.popToTop();
    // let promiseToUpdateProductsBranch = firebase.database().ref('/Products/' + key).remove();
    // let promiseToDeleteProduct = firebase.database().ref('/Users/' + uid + '/products/' + key).remove();
    //Additionally, schedule deletion of any priceReductionNotification notifications that affect this product
    // let promiseToDeleteNotifications = 
    //TODO: What should happen to purchase receipts and item sold? 
    // Promise.all([promiseToDeleteProduct, promiseToDeleteNotifications])
    // .then( ()=>{
    //     // this.props.navigation.navigate(`${parentScreenInStack}`);
    // })
    // .then( () => {
    //     console.log('product has been successfully removed')
    // })
    // .catch( (err)=> {
    //     console.log(err);
    // });

 }

 startOver = () => {
    this.props.navigation.setParams({pictureuris: 'nothing here', price: 0, original_price: 0, type: false, size: false, condition: false});
    this.setState({ 
    uri: undefined,
    name: '',
    brand: '',
    // price: 0,
    // original_price: 0,
    // size: 2,
    // type: 'Trousers',
    gender: 1,
    // condition: 'Slightly Used',
    insta: '',
    description: '',
    typing: true,
    paypal: '',
    isUploading: false,
    });
 }

 getColorFor = (c) => {
    var color;
    switch(c) {
        case "New With Tags":
            color = 'black';
            break;
        case "New Without Tags":
            color = 'black';
            break;
        case "Slightly Used":
            color = 'black';
            break;
        case "Used":
            color = 'black'
            break;
        default:
            color = 'black'
    }
    return color;
 }

// createRoom(key) {
// //create a new room with product id, and add buyer as member of room. 
// const CHATKIT_USER_NAME = firebase.auth().currentUser.uid;
// // This will create a `tokenProvider` object. This object will be later used to make a Chatkit Manager instance.
// const tokenProvider = new Chatkit.TokenProvider({
// url: CHATKIT_TOKEN_PROVIDER_ENDPOINT
// });
 
// // This will instantiate a `chatManager` object. This object can be used to subscribe to any number of rooms and users and corresponding messages.
// // For the purpose of this example we will use single room-user pair.
// const chatManager = new Chatkit.ChatManager({
// instanceLocator: CHATKIT_INSTANCE_LOCATOR,
// userId: CHATKIT_USER_NAME,
// tokenProvider: tokenProvider
// });

 
// //In order to subscribe to the messages this user is receiving in this room, we need to `connect()` the `chatManager` and have a hook on `onNewMessage`. There are several other hooks that you can use for various scenarios. A comprehensive list can be found [here](https://docs.pusher.com/chatkit/reference/javascript#connection-hooks).
// chatManager.connect().then(currentUser => { 
// this.currentUser = currentUser;
// this.currentUser.createRoom({
// name: key,
// private: false,
// addUserIds: null
// }).then(room => {
// console.log(`Created room called ${room.name}`)
// })
// .catch(err => {
// console.log(`Error creating room ${err}`)
// })
// })
// }


 render() {
    const {navigation} = this.props;
    const {isUploading} = this.state;
    const uid = firebase.auth().currentUser.uid; 
    

    // List of values we navigate over to CreateItem from other components:
    var pictureuris = navigation.getParam('pictureuris', 'nothing here');
    var price = navigation.getParam('price', 0);
    var original_price = navigation.getParam('original_price', 0);
    var condition = navigation.getParam('condition', false); 
    var type = navigation.getParam('type', false); 
    var size = navigation.getParam('size', false);
    var post_price = navigation.getParam('post_price', 0);
    // console.log(pictureuris);
    ////

    ///
    ///If there is a change in this.state.gender, remove the product type value

    ///

    //When the condition to submit a product has partially been satisfied:
    var userChangedAtLeastOneField = (this.state.name) || (this.state.description) || (this.state.brand) || ( (Number.isFinite(original_price)) && (original_price > 0) ) || ( (Number.isFinite(price)) && (price > 0) ) || ( (Array.isArray(pictureuris) && pictureuris.length >= 1) ) || (this.state.paypal);
    var partialConditionMet = (this.state.name) || (this.state.brand) || ( (Number.isFinite(price)) && (price > 0) ) || ( (Array.isArray(pictureuris) && pictureuris.length >= 1) ) || (condition);
    //The full condition for when a user is allowed to upload a product to the market
    var conditionMet = (this.state.name) && (this.state.brand) && (Number.isFinite(price)) && (price > 0) && (Array.isArray(pictureuris) && pictureuris.length >= 1) && (type) && ( (this.state.gender == 2 ) || (this.state.gender < 2) && (size) ) && (condition);
    //var priceIsWrong = (original_price != '') && ((price == 0) || (price.charAt(0) == 0 ) || (original_price == 0) || (original_price.charAt(0) == 0) )

    //console.log(priceIsWrong);
    //console.log(pictureuri);
    //this.setState({uri: params.uri})
    //this.setState(incrementPrice);
    //const picturebase64 = params.base64;
    //console.log(pictureuri);
    // categoryColors[this.state.gender] color selectedType based on gender

    if(isUploading) {
        return (
            <View style={{marginTop: Platform.OS == "ios" ? 22 : 0, flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
            <View style={{height: 200, justifyContent: 'center', alignContent: 'center', alignItems: 'center'}}>
            <LoadingIndicator isVisible={isUploading} color={lightGreen} type={'Wordpress'}/>
            <WhiteSpace height={20}/>
            <Text style={{paddingVertical: 1, paddingHorizontal: 10, fontFamily: 'Avenir Next', fontSize: 18, fontWeight: '500', color: highlightGreen, textAlign: 'center'}}>
            Your product {this.state.name} is being uploaded to the market. Please do not resubmit the same product.
            </Text>
            </View>
            
            </View>
        )
    }

    return (
    
        <SafeAreaView style={{flex: 1}}>
        {this.state.editItemBoolean ? <HeaderBar customFlex={0.13} navigation={this.props.navigation} hideCross={true}/> : null}
        <ScrollView
        style={{flex: this.state.editItemBoolean ? 0.87 : 1}}
        contentContainerStyle={styles.contentContainer}
        >

            <Divider style={{ backgroundColor: '#fff', height: 12 }} />
            
            <Text style={[styles.detailHeader, {fontSize: 18, textAlign: 'center'}]}>Picture(s) of Product:</Text>
            <Divider style={{ backgroundColor: '#fff', height: 8 }} />

            <MultipleAddButton navToComponent={'CreateItem'} pictureuris={pictureuris}/>
            {/* {pictureuris[1] ? <Image style={{width: 60, height: 60}} source={{uri: pictureuris[1]}} /> : null}
            {this.state.resizedImage ? <Image style={{width: 60, height: 60}} source={{uri: this.state.resizedImage}}/> : null} */}
            <WhiteSpace height={10}/>
            
            
            <Text style={[styles.detailHeader, {fontSize: 18, textAlign: 'center'}]}>Category</Text>
            <ButtonGroup
                onPress={ (index) => {
                if(index != this.state.gender) {
                navigation.setParams({type: false});
                // type = '';
                this.setState({gender: index});
                }
                
                }}
                selectedIndex={this.state.gender}
                buttons={ ['Men', 'Women', 'Accessories'] }
                containerStyle={styles.buttonGroupContainer}
                buttonStyle={styles.buttonGroup}
                textStyle={styles.buttonGroupText}
                selectedTextStyle={styles.buttonGroupSelectedText}
                selectedButtonStyle={styles.buttonGroupSelectedContainer}
            />
            
            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} 
            onPress={() => {
            navigation.setParams({size: false});
            this.navToFillConditionOrType(this.state.gender, showProductTypes = true);
            
            } }>
                <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0}]}>
                
                    <View style={[styles.detailHeaderContainer, {flex: type ? 0.25 : 0.8}]}>
                        <Text style={styles.detailHeader}>Type</Text>
                    </View>

                    {type?
                    <View style={[styles.displayedPriceContainer, {flex: 0.55}]}>
                        <Text style={[styles.displayedCondition, {color: 'black', fontSize: 15, fontWeight: "300"}]}>{type}</Text>
                    </View>
                    :
                    null
                    }

                    <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                        <Icon 
                        name="chevron-right"
                        size={40}
                        color='black'
                        />
                    </View>

                </View>
            </TouchableHighlight>

            

            
            <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start', borderBottomColor: darkGray, borderBottomWidth: 0.5}}>
                <TextInput
                style={{height: 50, width: 280, ...styles.detailHeader}}
                placeholder={"Name (e.g. zip-up hoodie)"}
                placeholderTextColor={lightGray}
                onChangeText={(name) => this.setState({name})}
                value={this.state.name}
                multiline={false}
                maxLength={16}
                autoCorrect={false}
                autoCapitalize={'words'}
                clearButtonMode={'while-editing'}
                underlineColorAndroid={"transparent"}
                /> 
            </View>

            {/* <WhiteSpace height={4}/> */}

            
            
            


            <DismissKeyboardView>
            <View style={[styles.descriptionContainer, {borderBottomWidth: 0.5,borderColor: darkGray}]}>

                <View style={styles.descriptionHeaderContainer}>
                    <Text style={styles.detailHeader}>Description</Text>
                </View>

                <WhiteSpace height={1}/>

                <View style={styles.descriptionInputContainer}>

                    <TextInput
                    style={styles.descriptionInput}
                    placeholder={"(Optional) For Example, Excellent condition. Flaws are evident in item's pictures."}
                    placeholderTextColor={lightGray}
                    onChangeText={(description) => this.setState({description})}
                    value={this.state.description}
                    multiline={true}
                    numberOfLines={4}
                    scrollEnabled={true}
                    underlineColorAndroid={"transparent"}
                    />

                </View>

            </View>
            </DismissKeyboardView>

            {/* <WhiteSpace height={1.5}/> */}

            

            
            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillPrice("retailPrice")}>
            <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0}]}>
            
                <View style={[styles.detailHeaderContainer, {flex: original_price > 0 ? 0.5 : 0.8}]}>
                    <Text style={styles.detailHeader}>Retail price (Optional)</Text>
                </View>

                {original_price > 0 ?
                <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                    <Text style={styles.displayedPrice}>{this.state.currency+original_price}</Text>
                </View>
                :
                null
                }

                <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>

            </View>
            </TouchableHighlight>

            

            


            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillPrice("sellingPrice")}>
            <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0}]}>
            
                <View style={[styles.detailHeaderContainer, {flex: price > 0 ? 0.5 : 0.8}]}>
                    <Text style={styles.detailHeader}>Selling price</Text>
                </View>

                {price > 0 ?
                    <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                        <Text style={[styles.displayedPrice, {color: treeGreen}]}>{this.state.currency + price}</Text>
                    </View>
                :
                    null
                }

                <View style={[styles.navToFillDetailIcon, {flex: price > 0 ? 0.2 : 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>

            </View>
            </TouchableHighlight>

            
            
            <View style={styles.priceAdjustmentReminderContainer}>
                <Text style={styles.priceAdjustmentReminder}>{priceAdjustmentReminder}</Text>
            </View>

            

            
            
            <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start', borderBottomWidth: 0.5,borderColor: darkGray}}>
                <TextInput
                style={{height: 50, width: 280}}
                placeholder={"Brand (e.g. Hollister Co.)"}
                placeholderTextColor={lightGray}
                onChangeText={(brand) => this.setState({brand})}
                value={this.state.brand}
                multiline={false}
                maxLength={16}
                autoCorrect={false}
                autoCapitalize={'words'}
                clearButtonMode={'while-editing'}
                underlineColorAndroid={"transparent"}
                /> 
            </View>

            

            

            

            

            

            { type && this.state.gender != 2 ?
            
            

            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillSizeBasedOn(type, this.state.gender)}>
            <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0,}]}>
            
            <View style={[styles.detailHeaderContainer, {flex: size ? 0.35 : 0.8}]}>
            <Text style={styles.detailHeader}>Size</Text>
            </View>

            
            <View style={[styles.displayedPriceContainer, {flex: 0.45}]}>
            <Text style={[styles.displayedCondition, { color: size ? 'black' : 'gray', fontWeight: "400"}]}>{size ? size : "Select a size"}</Text>
            </View>
            
            
            

            <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
            <Icon 
            name="chevron-right"
            size={40}
            color='black'
            />
            </View>

            </View>
            </TouchableHighlight>
            
            
            :
            null
            }

            


            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillConditionOrType(this.state.gender, false)}>
                
                <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0,}]}>
                <View style={[styles.detailHeaderContainer, {flex: condition ? 0.35 : 0.8}]}>
                    <Text style={styles.detailHeader}>Condition</Text>
                </View>

                {condition?
                <View style={[styles.displayedPriceContainer, {flex: 0.45}]}>
                    <Text style={styles.displayedCondition}>{condition}</Text>
                </View>
                :
                null
                }

                <View style={[styles.navToFillDetailIcon, {flex: 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>

                </View>

                
            </TouchableHighlight>

            {this.state.editItemBoolean ? 
                null 
            :
                <View style={styles.priceAdjustmentReminderContainer}>
                    <Text style={[styles.priceAdjustmentReminder, !this.state.paypal ? {color: 'red'} : null]}>{paypalReminder}</Text>
                </View>
            }

            

            {this.state.editItemBoolean ? 
                null
            :
            <View style={{paddingHorizontal: 7, justifyContent: 'center', alignItems: 'flex-start', borderBottomWidth: 0.5, borderBottomColor: darkGray,}}>
                <TextInput
                style={{height: 50, width: 280, ...styles.detailHeader}}
                placeholder={"PayPal Email Address"}
                placeholderTextColor={lightGray}
                onChangeText={(paypal) => this.setState({paypal})}
                value={this.state.paypal}
                multiline={false}
                autoCorrect={false}
                clearButtonMode={'while-editing'}
                keyboardType={'email-address'}
                underlineColorAndroid={"transparent"}
                /> 
            </View>
            
            }

            
            
            <View style={styles.navToFillDetailRow}>

                <View style={[styles.detailHeaderContainer, {paddingHorizontal: 6,flex: 0.8}]}>
                    <Text style={[styles.detailHeader, {fontSize: 17}]}>Can you post this item?</Text>
                </View>

                <View style={[styles.checkBoxContainer, {flex: 0.2}]}>
                <TouchableOpacity 
                onPress={() => this.setState({canSnailMail: !this.state.canSnailMail})}
                style={[styles.checkBox, this.state.canSnailMail ? {borderStyle: 'solid'} : {borderStyle: 'dashed'} ]}
                >
                    {this.state.canSnailMail ?
                    <Icon 
                    name="check"
                    size={35}
                    color={lightGreen}
                    />
                    :
                    null
                    }
                </TouchableOpacity>
                </View>

            </View>

            


            {this.state.canSnailMail ?
            <TouchableHighlight underlayColor={'#fff'} style={styles.navToFillDetailRow} onPress={() => this.navToFillPrice("postPrice")}>
            <View style={[styles.navToFillDetailRow, {borderBottomWidth: 0,}]}>
            
                <View style={[styles.detailHeaderContainer, {flex: post_price > 0 ? 0.5 : 0.8}]}>
                    <Text style={styles.detailHeader}>Cost of post</Text>
                </View>

                {post_price > 0 ?
                    <View style={[styles.displayedPriceContainer, {flex: 0.3}]}>
                        <Text style={styles.displayedPrice}>{this.state.currency + post_price}</Text>
                    </View>
                :
                    null
                }

                <View style={[styles.navToFillDetailIcon, {flex: post_price > 0 ? 0.2 : 0.2 }]}>
                    <Icon 
                    name="chevron-right"
                    size={40}
                    color='black'
                    />
                </View>
            
            </View>
            </TouchableHighlight>
            :
            null
            }

            

            <WhiteSpace height={15} /> 
            
            <View style={{alignItems: 'center'}}>
                <Button
                large
                disabled = { partialConditionMet ? false : true}
                buttonStyle={{
                backgroundColor: conditionMet ? "#22681d" : highlightYellow,
                width: 280,
                height: 80,
                borderColor: "transparent",
                borderWidth: 0,
                borderRadius: 5,
                }}
                icon={{name: this.state.editItemBoolean ? 'auto-fix' : 'check-all', type: 'material-community'}}
                title={this.state.editItemBoolean ? 'Upload Edited Product' : 'Submit To Market'}
                onPress={() => {
                conditionMet ?
                    this.state.editItemBoolean ?
                        this.updateFirebaseAndNavToProfile(pictureuris, mime = 'image/jpg', uid, type, price, original_price, post_price, condition, size, this.state.oldItemPostKey, this.state.oldUploadDate)
                        :
                        this.updateFirebaseAndNavToProfile(pictureuris, mime = 'image/jpg', uid, type, price, original_price, post_price, condition, size, false, false)
                    :
                    this.helpUserFillDetails();
                } } 
                />
            </View>

            

            {this.state.editItemBoolean ?
                <View style={styles.actionButtonContainer}>
                    <Button
                        buttonStyle={{
                        backgroundColor: profoundPink,
                        width: 180,
                        height: 80,
                        borderColor: "transparent",
                        borderWidth: 3,
                        borderRadius: 40,
                        }}
                        icon={{name: 'delete-empty', type: 'material-community'}}
                        title='Delete Product'
                        onPress={() => { 
                        this.deleteProduct(uid, this.state.oldItemPostKey);
                        } }
                    />
                </View>
            :
            null
            }


            <Dialog
            visible={this.state.helpDialogVisible}
            dialogAnimation={new SlideAnimation({
            slideFrom: 'top',
            })}
            dialogTitle={<DialogTitle title="You forgot to fill in:" titleTextStyle={new avenirNextText('black', 22, "500")} />}
            actions={[ 
            <DialogButton
            text="OK"
            onPress={() => {this.setState({ helpDialogVisible: false });}}
            />,
            ]}
            onTouchOutside={() => {
            this.setState({ helpDialogVisible: false });
            }}
            >
            <DialogContent>
                <View style={styles.dialogContentContainer}>
                { pictureuris == 'nothing here' ? <TextForMissingDetail detail={'Picture(s) of product'} /> : null }
                { !this.state.name ? <TextForMissingDetail detail={'Name'} /> : null }
                { !this.state.brand ? <TextForMissingDetail detail={'Brand'} /> : null }
                { !price ? <TextForMissingDetail detail={'Selling price'} /> : null }
                { !type ? <TextForMissingDetail detail={'Type of product'} /> : null }
                { !size ? <TextForMissingDetail detail={'Size'} /> : null }
                { !condition ? <TextForMissingDetail detail={'Condition'} /> : null }
                { !this.state.paypal ? <TextForMissingDetail detail={'PayPal Email ID so we can send your payment'} /> : null }
                </View>
            </DialogContent>
            </Dialog>

            <Divider style={{ backgroundColor: '#fff', height: 10 }} />

        </ScrollView>
        </SafeAreaView>
    
    
    
    
    )
 }
}

{/* {userChangedAtLeastOneField ?
 
 <View style={styles.actionButtonContainer}>
 <Button
 small
 buttonStyle={{
 backgroundColor: '#fff',
 width: 140,
 height: 50,
 borderColor: "transparent",
 borderWidth: 0,
 borderRadius: 0,
 }}
 icon={{name: 'delete', type: 'material-community', size: 20, color: graphiteGray}}
 title='START OVER'
 onPress={() => {
 this.startOver();
 } } 
 />
 </View>
 
 :
 null
 } */}

const styles = StyleSheet.create({
 contentContainer: {
 flexGrow: 1, 
 backgroundColor: '#fff',
 flexDirection: 'column',
 justifyContent: 'space-between',
 // alignContent:'center',
 // alignItems: 'center',
 // paddingTop: 15
 
 },

 descriptionContainer: {paddingVertical: 4, paddingHorizontal: 3},

 descriptionHeaderContainer: {flex: 0.2,justifyContent: 'center', alignItems: 'flex-start', paddingHorizontal: 6},

 descriptionHeader: {fontFamily: 'Avenir Next', fontSize: 19, fontWeight: "400"},

 descriptionInputContainer: {flex: 0.8, justifyContent: 'center', alignItems: 'flex-start', paddingVertical: 2,  paddingHorizontal: 6},

 descriptionInput: {width: 260, height: 60, marginBottom: 10, borderColor: treeGreen, borderWidth: 0},

 navToFillDetailRow: {
 // backgroundColor: 'red',
 flexDirection: 'row',
 justifyContent: 'center',
 alignItems: 'center',
 paddingTop: 4,
 paddingHorizontal: 4,
//  borderTopWidth: 0.5,
 borderBottomWidth: 0.5,
 borderColor: darkGray

 // height: 
 },

 navToFillDetailIcon: {
 justifyContent: 'flex-end',
 alignItems: 'flex-end'
 },

 detailHeaderContainer: {
 justifyContent: 'center',
 alignItems: 'flex-start',
 paddingVertical: 3
 },

 detailHeader: {
 fontFamily: 'Avenir Next',
 fontWeight: '400',
 fontSize: 22,
 color: 'black'
 },

 displayedPriceContainer: {
 justifyContent: 'center',
 alignItems: 'flex-end'
 },

 displayedPrice: {
 fontFamily: avenirNext,
 fontSize: 21,
 fontWeight: '600',
 color: darkGray

 },

 priceAdjustmentReminderContainer: {
 justifyContent: 'center',
 padding: 10,
 borderBottomWidth: 0.5,
 borderColor: darkGray
 },

 priceAdjustmentReminder: {...textStyles.generic, color: graphiteGray, textAlign: "left", fontSize: 13},

 displayedCondition: new avenirNextText('black', 16, "300"),

 imageadder: {
 flexDirection: 'row'
 },

 promptText: {fontSize: 12, fontStyle: 'normal', textAlign: 'center'},

 modalPicker: {
 flexDirection: 'column',
 paddingLeft: 20,
 paddingRight: 20,
 justifyContent: 'flex-start',
 alignItems: 'center',
 },

 subHeading: {
 fontFamily: avenirNext,
 color: '#0c5759',
 fontSize: 15,
 textDecorationLine: 'underline',
 },

 picker: {
 width: 280,
 // justifyContent: 'center',
 // alignContent: 'center',
 //alignItems: 'center'
 // height: height/2
 },

 pickerText: {
 fontFamily: avenirNext,
 fontSize: 22,
 fontWeight: 'bold'
 },

 men: {
 color: confirmBlue
 },

 accessories: {
 color: woodBrown
 },

 women: {
 color: rejectRed
 },

 optionSelected: {
 fontFamily: avenirNext,
 fontWeight: 'bold',
 fontSize: 18,
 color: '#0c5925'
 },

 buttonGroupText: {
    fontFamily: 'Avenir Next',
    fontSize: 14,
    fontWeight: '300',
    color: 'black'
 },

 buttonGroupSelectedText: {
    color: '#fff'
 },

 buttonGroupContainer: {
    height: 40,
    backgroundColor: '#edeff2',
    borderWidth: 1,
    borderColor: 'black'
 },
 
 buttonGroupSelectedContainer: {
    backgroundColor: treeGreen
 },

 actionButtonContainer: {padding: 5, alignItems: 'center'},

 dialogContentContainer: {
 padding: 5,
 },

 checkBoxContainer: {
 padding: 10,
 alignItems: 'center'
 },

 checkBox: {
 width: 40,
 height: 40,
 borderWidth: 1.2,
 borderColor: 'black',
 }
})

export default withNavigation(CreateItem)


{/* <ProductLabel color={'black'} title='Select a Size'/> 
 <ButtonGroup
 onPress={ (index) => {this.setState({size: index})}}
 selectedIndex={this.state.size}
 buttons={ ['XS', 'S', 'M', 'L', 'XL', 'XXL'] }
 containerStyle={styles.buttonGroupContainer}
 buttonStyle={styles.buttonGroup}
 textStyle={styles.buttonGroupText}
 selectedTextStyle={styles.buttonGroupSelectedText}
 selectedButtonStyle={styles.buttonGroupSelectedContainer}
 /> */}

{/* <View style={styles.modalPicker}>
 <CustomModalPicker subheading={'Product Condition:'}>
 <Picker style={styles.picker} itemStyle={[styles.pickerText, {color: 'black'}]} selectedValue = {this.state.condition} onValueChange={ (condition) => {this.setState({condition})} } >
 <Picker.Item label = "New With Tags" value = "New With Tags" />
 <Picker.Item label = "New Without Tags" value = "New Without Tags" />
 <Picker.Item label = "Slightly Used" value = "Slightly Used" />
 <Picker.Item label = "Used" value = "Used" />
 </Picker>
 </CustomModalPicker> 
 <Text style={styles.optionSelected}>{this.state.condition}</Text>
 </View> */}

{/* <TextField 
 label="Optional Description (e.g. Great for chilly weather)"
 value={this.state.description}
 onChangeText = { (desc)=>{this.setState({description: desc})}}
 multiline = {true}
 characterRestriction = {180}
 textColor={basicBlue}
 tintColor={darkGreen}
 baseColor={darkBlue}
 /> */}


// <View style={styles.modalPicker}>
// <CustomModalPicker subheading={'Product Type:'}>
// {this.showPicker(this.state.gender)} 
// </CustomModalPicker>
// <Text style={styles.optionSelected}>{this.state.type}</Text>
// </View> 
// {/* product age (months) */}
// <View style = { {alignItems: 'center', flexDirection: 'column'} } >
// <NumericInput 
// value={this.state.months} 
// onChange={months => this.setState({months})} 
// type='plus-minus'
// initValue={0}
// minValue={0}
// maxValue={200}
// totalWidth={240} 
// totalHeight={50} 
// iconSize={25}
// valueType='real'
// rounded 
// textColor='black' 
// iconStyle={{ color: 'white' }} 
// upDownButtonsBackgroundColor='#E56B70'
// rightButtonBackgroundColor={limeGreen} 
// leftButtonBackgroundColor={darkGreen}
// containerStyle={ {justifyContent: 'space-evenly', padding: 10,} } 
// />
// <Text> Months since you bought the product </Text>
// </View>


{/* <Jiro
 label={'Name (e.g. )'}
 value={this.state.name}
 onChangeText={name => this.setState({ name })}
 maxLength={16}
 autoCorrect={false}
 autoCapitalize={'words'}
 
 // this is used as active border color
 borderColor={treeGreen}
 // this is used to set backgroundColor of label mask.
 // please pass the backgroundColor of your TextInput container.
 backgroundColor={'#F9F7F6'}
 inputStyle={{ color: 'black' }}
 /> */}