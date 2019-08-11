import React, { Component, Fragment } from 'react'
import { Platform, Dimensions, View, Text, TextInput, Image, StyleSheet, ScrollView, ListView, TouchableHighlight, Modal, TouchableOpacity, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Button } from 'react-native-elements';
import {withNavigation} from 'react-navigation'; // Version can be specified in package.json
// import { Text,  } from 'native-base';
// import { Hoshi } from 'react-native-textinput-effects'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { material, iOSUIKit, iOSColors } from 'react-native-typography'
import firebase from '../cloud/firebase.js';
// import {database} from '../cloud/database';
import * as Animatable from 'react-native-animatable';
// import Accordion from 'react-native-collapsible/Accordion';
// import SelectMultiple from 'react-native-select-multiple';

// import ScrollableTabView, { ScrollableTabBar, } from 'react-native-scrollable-tab-view';
// import FacebookTabBar from './FacebookTabBar'

// import PushNotification from 'react-native-push-notification';
// import { PacmanIndicator } from 'react-native-indicators';
import { graphiteGray, lightGreen, rejectRed, treeGreen, avenirNext, optionLabelBlue, almostWhite, flashOrange, lightGray, highlightGreen, lightBlack, darkGreen, mantisGreen } from '../colors.js';

// import { splitArrayIntoArraysOfSuccessiveElements } from '../localFunctions/arrayFunctions';

import ProgressiveImage from '../components/ProgressiveImage';
import NothingHereYet from './NothingHereYet.js';
import { avenirNextText } from '../constructors/avenirNextText.js';
import { GrayLine, LoadingIndicator } from '../localFunctions/visualFunctions.js';
import { categories } from '../fashion/sizesAndTypes.js';
import { textStyles } from '../styles/textStyles.js';

// const nottAuthEndpoint = `https://calm-coast-12842.herokuapp.com/`;

// const emptyMarketText = "Wow, such empty..."
// const noProductsOfYourOwnText = "So far, you have not uploaded any items on the marketplace.\nTo make some cash 🤑 and free up closet space, upload an article of clothing on the Market from the 'Sell' screen.";
// const noSoldProductsText = "So far, you have not sold any products. When a user purchases a product, that product will automatically be marked as sold."
// const emptyCollectionText = "Thus far, you have not liked any of the products on the marketplace 💔.";
const noResultsFromSearchText = "Your search does not match the description of any product on the marketplace 🙁.";
const noSelectedCategoryText = "Please select a Category"
// const emptyMarketDueToSearchCriteriaText = noResultsFromSearchText;
// const noResultsFromSearchForSpecificCategoryText = "Your search does not match the description of any product for this specific category 🙁.";

const textAnimationDuration=1000, textAnimationEasing = "linear";

const timeToRefreshAfterLikeOrUnlike = 500;
var {height, width} = Dimensions.get('window');


const cardWidth = width/2 - 10;
const cardHeaderHeight = 200;
const cardContentHeight = 50
const cardFull = cardHeaderHeight + cardContentHeight;

const popUpMenuHeight = 35;
const popUpMenuWidth = 65;

// const loadingStrings = ['Acquiring Catalogue of Products...', 'Fetching Marketplace...', 'Loading...', 'Almost there...']

const splitArrayIntoArraysOfSuccessiveElements = (array) => {
  var first, second;
  
  if(array.length == 1) {
    first = array;
    second = false
  }
  
  else if(array.length > 1) {
    first = array.filter( (element, index) => index % 2 == 0 );
	second = array.filter( (element, index) => index % 2 != 0 );
  }
  
  return {first, second}
  
}

function randomIntFromInterval(min,max) {
    return Math.floor(Math.random()*(max-min+1)+min); //min and max included
}

function removeKeysWithFalsyValuesFrom(object) {
  const newObject = {};
  Object.keys(object).forEach((property) => {
    if (object[property]) {newObject[property] = object[property]}
  })
  return Object.keys(newObject);
}

function onlyUnique(value, index, self) { 
  return self.indexOf(value) === index;
}

function removeDuplicates(myArr, prop) {
  return myArr.filter((obj, pos, arr) => {
      return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

// function extractValuesFrom(arr) {
//   var values = [];
//   arr.forEach( (obj, index, array) => {
//     values.push(obj.value)
//     console.log(values)
//   } )
//   return values;
// }
const mensUpperWear = ["XS / 30-32", "S / 34-36", "M / 38-40", "L / 42-44", "XL / 46", "XXL / 48", "XXXL / 50", "4XL / 52", "5XL / 54", "6XL / 56", "7XL / 58", "8XL / 60"];
const mensFootWear = ["5 / 6", "6 / 7", "6.5 / 7.5", "7 / 8", "7.5 / 8.5", "8 / 9", "8.5 / 9.5", "9 / 10", "9.5 / 10.5", "10 / 11", "10.5 / 11.5", "11 / 12", "12 / 13", "13 / 14", "14 / 15", "15 / 16"];
const womenUpperWear = ["XXS / 2 / 00","2 / 00 petite", "XXS / 4 / 0", "4 / 0 petite", "XS / 6 / 2","6 / 2 petite", "S / 8 / 4", "8 / 4 petite", "S / 10 / 6", "10 / 6 petite", "M / 12 / 8", "12 / 8 petite", "M / 14 / 10", "14 / 10 petite", "L / 16 / 12", "16 / 12 petite", "L / 18 / 14", "18 / 14 petite", "1X / 20 / 16", "20 / 16 petite", "1X / 22 / 18", "22 / 18 petite", "2X / 24 / 20", "24 / 20 petite", "3X / 26 / 22", "26 / 22 petite", "3X / 28 / 24", "28 / 24 petite", "4X / 30 / 26", "30 / 26 petite", "One size"];
const womenFootWear = ["2 / 4", "2.5 / 4.5", "3 / 5", "3.5 / 5.5", "4 / 6", "4.5 / 6.5", "5 / 7", "5.5 / 7.5", "6 / 8", "6.5 / 8.5", "7 / 9", "7.5 / 9.5", "8 / 10", "8.5 / 10.5", "9 / 11", "10 / 11.5-12"];

const generateSizesBasedOn = (type, category) => {
    var sizes;
    switch(category) {
        case "Men":
            switch(type) {
                case "Formal Shirts" || "Coats & Jackets" || "Casual Shirts" || "Suits" || "Trousers" || "Jeans":
                    sizes = mensUpperWear;
                    break;
                case "Shoes":
                    sizes = mensFootWear;
                    break;
                default:
                    sizes = mensUpperWear;
                    break;  
            }
        break;
        case "Women":
            switch(type) {
                case "Shoes" || "Socks":
                    sizes = womenFootWear;
                    break;
                default:
                    sizes = womenUpperWear;
                    break;
            }
        break;
        //for now, no sizes for accessories, person does not see size option for accessory. Vinted offers user selection of colors instead.
        default:
            sizes = mensUpperWear
            break;

    }
    return sizes;
}

const limeGreen = '#2e770f';
const profoundPink = '#c64f5f';

// const HideMenusView = ({children}) => (
//   <TouchableWithoutFeedback onPress={()=>Products.hideMenus()}>
//     {children}
//   </TouchableWithoutFeedback>


// )

class Products extends Component {
  constructor(props) {
      super(props);
      this.state = {
        uid: '',
        isGetting: true,
        //Products Stuff
        leftDS: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        }),
        rightDS: new ListView.DataSource({
          rowHasChanged: (r1, r2) => r1 !== r2
        }),

        leftProducts: false,
        rightProducts: false,
        
        emptyMarket: false,
        noResultsFromFilter: false,
        //forget these:
        emptyMarketDueToSearchCriteria: false,
        noProducts: false,
        emptyCollection: false,
        refreshing: false,
        ////////////



        

        ////Filter Modal Stuff
        searchTerm: '',
        selectedBrands: [],
        // selectedCategory: 'Women',
        selectedCategory: '',
        selectedType: '',
        selectedConditions: [],
        selectedSize: '',
        // activeSectionL: false,
        // activeSectionR: false,
        // collapsed: true,
        // navToChatLoading: false,
        ///////
        ///////
        // filters: '',
        showFilterModal: false,
        activeFilterSection: false,
        // selectedBrand: '',
        // brandSearchTerm: '',
        
        // selectedTypes: [],
        // selectedSizes: [],
      };
      //this.navToChat = this.navToChat.bind(this);
  }


  componentWillMount = () => {
    let {uid} = firebase.auth().currentUser
    this.timerID = setTimeout(() => {
      this.getMarketPlace(uid);
      this.intervalID = setInterval( () => {
        this.getMarketPlace(uid);
      },60000) //10 minutes
      
    }, 100);
  }

  // componentDidMount = () => {
  //   this.getMarketPlace(this.state.uid);
  // }

  // componentWillMount() {
  //   // setTimeout(() => {
  //   //   // console.log('Mounting Products Component')
  //   //   //TODO: Maybe this function is being called too many times which leads to way too many notifications?
  //   //   // this.initializePushNotifications();
  //   // }, 1000);
  //   setTimeout(() => {
  //     this.getPageSpecificProducts();
  //     // setInterval(() => {
  //     //   this.getPageSpecificProducts();
  //     // }, 5000);
  //   }, 100);
  // }

  // componentDidMount() {
  //   this.dataRetrievalTimerId = setInterval( 
  //     () => this.getPageSpecificProducts(), 
  //     300000) //approximately every 5 minutes
  // }

  componentWillUnmount() {
    clearTimeout(this.timerID);
    clearInterval(this.intervalID);
  }

  // initializePushNotifications = () => {
  //   PushNotification.configure({

  //     // (optional) Called when Token is generated (iOS and Android)
  //     onRegister: function(token) {
  //         console.log( 'TOKEN:', token );
  //     },
  
  //     // (required) Called when a remote or local notification is opened or received
  //     onNotification: function(notification) {
  //         const {userInteraction} = notification;
  //         console.log( 'NOTIFICATION:', notification, userInteraction );
  //         if(userInteraction) {
  //           //this.props.navigation.navigate('YourProducts');
  //           alert("To edit a particular product's details, magnify to show full product details \n Select Edit Item. \n (Be warned, you will have to take new pictures)");
  //         }
          
  //         //userInteraction ? this.navToEditItem() : console.log('user hasnt pressed notification, so do nothing');
  //     },
  
  //     // ANDROID ONLY: GCM Sender ID (optional - not required for local notifications, but is need to receive remote push notifications) 
  //     //senderID: "YOUR GCM SENDER ID",
  
  //     // IOS ONLY (optional): default: all - Permissions to register.
  //     permissions: {
  //         alert: true,
  //         badge: true,
  //         sound: true
  //     },
  
  //     // Should the initial notification be popped automatically
  //     // default: true
  //     popInitialNotification: true,
  
  //     /**
  //       * (optional) default: true
  //       * - Specified if permissions (ios) and token (android and ios) will requested or not,
  //       * - if not, you must call PushNotificationsHandler.requestPermissions() later
  //       */
  //     requestPermissions: true,
  // });


  // }
  
  // shouldSendNotifications(arrayOfProducts, your_uid) {
  //   for(var product of arrayOfProducts) {
  //     if(product.shouldReducePrice) {
  //       console.log('should reduce price');
  //       var date = new Date(Date.now() + (1200 * 1000)) // in 20 minutes, if user's app is active (maybe it works otherwise too?), they will receive a notification
  //       var message = `Nobody has initiated a chat with you about your product named, ${product.text.name}, since its submission on the market ${product.daysElapsed} days ago 🤔. Perhaps you should change it's selling price?`;

  //       PushNotification.localNotificationSchedule({
  //         message: message,// (required)
  //         date: date,
  //         vibrate: false,
  //       });

  //       var postData = {
  //         name: product.text.name,
  //         price: product.text.price,
  //         uri: product.uris[0],
  //         daysElapsed: product.daysElapsed,
  //         message: message,
  //         date: date,
  //       }
  //       var notificationUpdates = {};
  //       notificationUpdates['/Users/' + your_uid + '/notifications/' + product.key + '/'] = postData;
  //       firebase.database().ref().update(notificationUpdates);
  //     }
  //   }
  // }

  getMarketPlace = (uid) => {
    //here uid refers to currentUser UID
    this.setState({isGetting: true});
    firebase.database().ref().on('value', (snapshot) => {
      var {Products, Users} = snapshot.val();
      // console.log(Products, typeof Products);
      if(Products == undefined || Products.length < 1) {
        this.setState({isGetting: false, emptyMarket: true});
      }
      else {
        Products = Object.values(Products);
        const {showCollection, showYourProducts, showSoldProducts, showOtherUserProducts, showOtherUserSoldProducts, otherUser} = this.props;
        var emptyMarket = false;
        var productKeys = [], collectionKeys = [], otherUserProductKeys = [];

        if(Users[uid].products) {
          productKeys = Object.keys(Users[uid].products)
        }

        if(Users[uid].collection) {
          var collectionKeys = removeKeysWithFalsyValuesFrom(Users[uid].collection);
        }
        
        if(showYourProducts) {
          Products = Products.filter((product) => productKeys.includes(product.key) && !product.text.sold );
          Products.length > 0 ? null : emptyMarket = true;
          // this.setState({isGetting: false, noProducts: true, productKeys})
        }

        else if(showSoldProducts) {
          Products = Products.filter((product) => productKeys.includes(product.key) && product.text.sold );
          Products.length > 0 ? null : emptyMarket = true;
        }

        else if(showCollection) {
          Products = Products.filter((product) => collectionKeys.includes(product.key) );
          Products.length > 0 ? null : emptyMarket = true;          
        }

        else if(showOtherUserProducts || showOtherUserSoldProducts) {
          if(Users[otherUser].products != "") {
            otherUserProductKeys = Object.keys(Users[otherUser].products);
            if(showOtherUserSoldProducts) {
              Products = Products.filter((product) => otherUserProductKeys.includes(product.key) && product.text.sold );
            }
            else {
              // Just show products on sale
              Products = Products.filter((product) => otherUserProductKeys.includes(product.key) && !product.text.sold );
            }
            Products.length > 0 ? null : emptyMarket = true;
          }
        }

        // else {
        //     // console.log('do nothing')
        // }
        if(!emptyMarket) {
          //Final Level is to sort the products in descending order of the number of likes & assign each index its boolean to handle collapsed or uncollapsed state
          Products = Products.sort( (a,b) => { return a.text.likes - b.text.likes } ).reverse();
          // console.log('after sort ' + all)
          // var test;
          // test = 
          // console.log(test);
          Products.forEach((product) => {
            product['isActive'] = false;  //boolean for rowData UI expansion
            product['isMenuActive'] = false;
          })
          // console.log("OVER HERE"+Products)
          // console.log('before split: ' + all);
          // var {leftProducts, rightProducts} = splitArrayIntoArraysOfSuccessiveElements(all);
          var leftProducts = Products.filter( (e, index) => index % 2 == 0);
          var rightProducts = Products.filter( (e, index) => index % 2 != 0);

          //Second Level is to extract list of information to be displayed in the filterModal
          //first extract the list of current brands:
          var brands = [];
          var typesForCategory = {Men: [], Women: [], Accessories: []};
          var conditions = [{name: "New With Tags", selected: false}, {name: "New Without Tags", selected: false}, {name: "Slightly Used", selected: false}, {name: "Used", selected: false}]
          //Default Sizes
          var sizes = womenUpperWear;
          //Now because there's a fixed number of values of SIZE for each TYPE, 
          //just generate the sizes based on the type selected by the person when they tap the category
          //and for CONDITION We're good because there's only 4 values that apply to any type of product
          // var sizesForType = {}

          // var types = ['Formal Shirts', 'Casual Shirts', 'Jackets', 'Suits', 'Trousers', 'Jeans', 'Shoes', 'Watches', 'Bracelets', 'Jewellery', 'Sunglasses', 'Handbags', 'Tops', 'Skirts', 'Dresses', 'Coats'];
          // var sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Extra Extra Large'];

          Products.forEach((product)=> {
            // console.log(product.text.brand);
            brands.push({name: product.text.brand, selected: false});
            switch(product.text.gender) {
              case "Men":
                typesForCategory.Men.push({name: product.text.type, selected: false});
                break;
              case "Women":
                typesForCategory.Women.push({name: product.text.type, selected: false});
                break;
              case "Accessories":
                typesForCategory.Accessories.push({name: product.text.type, selected: false});
                break;  
              default: 
                break;
            }

          })
          // console.log(typesForCategory)

          // brands = brands.filter( (brand) => brand.includes(brandSearchTerm) ) 
          // console.log("Raw Brands:" + JSON.stringify(brands))
          brands = removeDuplicates(brands, "name");
          // console.log("Brands:" + JSON.stringify(brands))
          typesForCategory.Men = removeDuplicates(typesForCategory['Men'], "name");
          typesForCategory.Women = removeDuplicates(typesForCategory['Women'], "name");
          typesForCategory.Accessories = removeDuplicates(typesForCategory['Accessories'], "name");

          // console.log(brands, typesForCategory);

          

          var name = Users[uid].profile.name;

          this.setState({uid, emptyMarket, collectionKeys, productKeys, leftProducts, rightProducts, typesForCategory, brands, conditions, sizes, name, isGetting: false, noResultsFromFilter: false});

        }

        else {
          this.setState({isGetting: false, uid, emptyMarket: true});
        }

        
        
      }



    })
  }

  //Filter an array of products for user selected properties of a product
  filterProducts = (products) => {
    const {...state} = this.state;
    const {selectedBrands, selectedCategory, selectedType, selectedConditions, selectedSize} = state;

    products = selectedBrands.length > 0 ? products.filter( (product) => selectedBrands.includes(product.text.brand)) : products;
    products = products.filter( (product) => selectedCategory == product.text.gender);
    products = selectedType ? products.filter( (product) => selectedType == product.text.type ) : products;
    products = selectedConditions.length > 0 ? products.filter( (product) => selectedConditions.includes(product.text.condition)) : products;
    products = selectedSize ? products.filter( (product) => selectedSize == product.text.size ) : products;

    return products
  }


  filterMarketPlace = () => {
    // this.setState({isGetting: true});
    console.log("Filtering Marketplace");
    const {...state} = this.state;
    // console.log(products.concat(state.rightProducts));
    
    // console.log(selectedBrands, selectedCategory, selectedType, selectedConditions, selectedSize);
    console.log(state.leftProducts);
    state.leftProducts = this.filterProducts(state.leftProducts);
    console.log(state.leftProducts);
    console.log("RIGHT", state.rightProducts);
    state.rightProducts = this.filterProducts(state.rightProducts);
    console.log("RIGHT", state.rightProducts);



    // state.leftProducts = selectedBrands.length > 0 ? state.leftProducts.filter( (product) => selectedBrands.includes(product.text.brand)) : state.leftProducts;
    // state.leftProducts = state.leftProducts.filter( (product) => selectedCategory == product.text.gender);
    // state.leftProducts = selectedType ? state.leftProducts.filter( (product) => selectedType == product.text.type ) : state.leftProducts;
    // state.leftProducts = selectedConditions.length > 0 ? state.leftProducts.filter( (product) => selectedConditions.includes(product.text.condition)) : state.leftProducts;
    // state.leftProducts = selectedSize ? state.leftProducts.filter( (product) => selectedSize == product.text.size ) : state.leftProducts;

    // state.rightProducts = selectedBrands.length > 0 ? state.rightProducts.filter( (product) => selectedBrands.includes(product.text.brand)) : state.rightProducts;
    // state.rightProducts = state.rightProducts.filter( (product) => selectedCategory == product.text.gender);
    // state.rightProducts = selectedType ? state.rightProducts.filter( (product) => selectedType == product.text.type ) : state.rightProducts;
    // state.rightProducts = selectedConditions.length > 0 ? state.rightProducts.filter( (product) => selectedConditions.includes(product.text.condition)) : state.rightProducts;
    // state.rightProducts = selectedSize ? state.rightProducts.filter( (product) => selectedSize == product.text.size ) : state.rightProducts;
    // console.log(state.leftProducts.concat(state.rightProducts));

    //It's good enough to just check leftProducts for isNoResult
    state.noResultsFromFilter = state.leftProducts.length + state.rightProducts.length > 0 ? false : true;
    state.showFilterModal = false;
    // return state;

    this.setState(state);
  }

  clearFilters = () => {
    const {...state} = this.state;
    state.brands.forEach( (brand) => brand.selected = false);
    state.conditions.forEach( (condition) => condition.selected = false);
    state.selectedBrands = [];
    state.searchTerm = '';
    state.selectedType = '';
    // state.selectedCategory = 'Women';
    state.selectedCategory = ''
    state.selectedConditions = [];
    state.selectedSize = '';

    this.setState(state);
  }

  // HideMenusView = ({children}) => (
  //   <TouchableWithoutFeedback onPress={()=>this.hideMenus()}>
  //     {children}
  //   </TouchableWithoutFeedback>
  // )

  hideMenus = () => {
    const {...state} = this.state;
    state.leftProducts.forEach( (product) => {
      product['isMenuActive'] = false
    })
    state.rightProducts.forEach( (product) => {
      product['isMenuActive'] = false
    })
    this.setState(state);
    // console.log('YOYOYOYOYOYO');
  }


  // getPageSpecificProducts = () => {
  //   this.setState({isGetting: true});
  //   var {selectedBrands, selectedCategory, selectedType, selectedConditions} = this.state;
  //   // const keys = [];
  //   firebase.database().ref().once("value", (snapshot) => {
  //     var d = snapshot.val();
  //     // console.log('retrieving array of products')
  //     //Only pull the products that are in this user's collection for the WishList tab.
  //     const {showCollection, showYourProducts} = this.props;
  //     const uid = firebase.auth().currentUser.uid;

  //     var productKeys = d.Users[uid].products ? Object.keys(d.Users[uid].products) : [];
  //     var noProducts = false;
  //     if(productKeys.length == 0) {noProducts = true}
  //     //need to filter d.Users.uid.collection for only those keys that have values of true
  //     //get collection keys of current user
  //     var collection = d.Users[uid].collection ? d.Users[uid].collection : null;
  //     var rawCollection = collection ? collection : {}
  //     var collectionKeys = removeKeysWithFalsyValuesFrom(rawCollection);
  //     var emptyCollection = false;
  //     if(collectionKeys.length == 0) {emptyCollection = true}    
  //     console.log('Empty Collection Status: ' + emptyCollection);
  //     var all = d.Products ? d.Products : [];

  //     // var emptyMarket = all.length > 0 ? false : true;
  //     all.length < 1 ? this.setState({emptyMarket: true}) : null;


  //     //OF COURSE, the FIRST/TOP level of "filtering" that dictates what products are displayed is if whether:
  //     //Viewing all products, only liked products, or your products
  //     // var yourProducts = all.filter((product) => productKeys.includes(product.key) );
  //     //console.log(all, showCollection, showYourProducts);
  //     if(showCollection == true) {
  //       all = all.filter((product) => collectionKeys.includes(product.key) );
  //     }

  //     if(showYourProducts == true) {
  //       // setTimeout(() => {
  //       //   this.initializePushNotifications();
  //       // }, 200);

  //       // setTimeout(() => {
  //       //   this.shouldSendNotifications(yourProducts, uid);
  //       // }, 3000);
  //       //we need to identify which products have a notification set to True for a price reduction
  //       //loop over yourProducts and if you have a shouldReducePrice boolean of true, then schedule a notification for this individual for after thirty minutes
        
  //       all = all.filter((product) => productKeys.includes(product.key) );
  //     }

  //     if(all.length > 0) {
          
            

  //         //var filters = [{header: "Brand", values: []}, {header: "Type", values: []}, {header: "Size", values: []},];
          
  //         // all = selectedBrand == '' ? all : all.filter( (product) => product.text.brand == selectedBrand );


  //         //Second Level is to extract list of information to be displayed in the filterModal
  //         //first extract the list of current brands:
  //         var brands = [];
  //         var typesForCategory = {Men: [], Women: [], Accessories: []};
  //         var conditions = [{name: "New With Tags", selected: false}, {name: "New Without Tags", selected: false}, {name: "Slightly Used", selected: false}, {name: "Used", selected: false}]

  //         //Now because there's a fixed number of values of SIZE for each TYPE, 
  //         //just generate the sizes based on the type selected by the person when they tap the category
  //         //and for CONDITION We're good because there's only 4 values that apply to any type of product
  //         // var sizesForType = {}
          
  //         // var types = ['Formal Shirts', 'Casual Shirts', 'Jackets', 'Suits', 'Trousers', 'Jeans', 'Shoes', 'Watches', 'Bracelets', 'Jewellery', 'Sunglasses', 'Handbags', 'Tops', 'Skirts', 'Dresses', 'Coats'];
  //         // var sizes = ['Extra Small', 'Small', 'Medium', 'Large', 'Extra Large', 'Extra Extra Large'];
      
  //         all.forEach((product)=> {
  //           brands.push({name: product.text.brand, selected: false});
  //           switch(product.text.gender) {
  //             case "Men":
  //               typesForCategory.Men.push({name: product.text.type, selected: false});
  //               break;
  //             case "Women":
  //               typesForCategory.Women.push({name: product.text.type, selected: false});
  //               break;
  //             case "Accessories":
  //               typesForCategory.Accessories.push({name: product.text.type, selected: false});
  //               break;  
  //             default: 
  //               break;
  //           }

  //         })
  //         // console.log(typesForCategory)
          
  //         // brands = brands.filter( (brand) => brand.includes(brandSearchTerm) ) 
  //         brands = brands.filter(onlyUnique);
  //         typesForCategory.Men = typesForCategory['Men'].filter(onlyUnique);
  //         typesForCategory.Women = typesForCategory['Women'].filter(onlyUnique);
  //         typesForCategory.Accessories = typesForCategory['Accessories'].filter(onlyUnique);

  //         //second extract types of clothing for each category:
          

  //         //Third Level is optional and will be enforced when user has a selectedValue(s) to filter products
  //         all = selectedBrands.length > 0 ? all.filter( (product) => selectedBrands.includes(product.text.brand)) : all;
  //         all = selectedType ? all.filter( (product) => selectedType == product.text.type && selectedCategory == product.text.gender) : all;
  //         all = selectedConditions.length > 0 ? all.filter( (product) => selectedConditions.includes(product.text.condition)) : all;
  //         // all = selectedSizes.length > 0 ? all.filter( (product) => selectedSizes.includes(product.text.size)) : all;

  //         //TODO: After all this filtering, it could be the case that no results match your criteria

  //         //Final Level is to sort the products in descending order of the number of likes & assign each index its boolean to handle collapsed or uncollapsed state
  //         all = all.sort( (a,b) => { return a.text.likes - b.text.likes } ).reverse();
  //         // console.log('after sort ' + all)
  //         // var test;
  //         // test = 
  //         // console.log(test);
  //         all.forEach((product) => {
  //           product['isActive'] = false  //boolean for rowData UI expansion
  //         })
  //         console.log('before split: ' + all);
  //         // var {leftProducts, rightProducts} = splitArrayIntoArraysOfSuccessiveElements(all);
  //         var leftProducts = all.filter( (e, index) => index % 2 == 0);
  //         var rightProducts = all.filter( (e, index) => index % 2 != 0);
  //         // var leftProducts = all.slice(0, (all.length % 2 == 0) ? all.length/2  : Math.floor(all.length/2) + 1 );
  //         // var rightProducts = all.slice( Math.round(all.length/2) , all.length + 1);
  //         //TODO:
  //         console.log('after split :' + all);
  //         // console.log(leftProducts, rightProducts);

  //         // leftProducts.forEach((product) => {
  //         //   product['isActive'] = false  
  //         // })
  //         // rightProducts.forEach((product) => {
  //         //   product['isActive'] = false  
  //         // })


          
  //         var name = d.Users[uid].profile.name;

  //         //emptyMarket and emptyMarketDueToSearchCriteria remain false in this.state;
  //         this.setState({ noProducts, emptyCollection, collectionKeys, productKeys, leftProducts, rightProducts, typesForCategory, brands, conditions, name, isGetting: false, });
        
  //     }

  //     else {
  //       this.setState({isGetting: false, emptyMarketDueToSearchCriteria: true})
  //       // if(this.props.showCollection == true) {
  //       //   this.setState({isGetting: false})
  //       // }

  //       // else {
  //       //   this.setState({isGetting: false, emptyMarketDueToSearchCriteria: true})
  //       // }
        
  //     }

  //   }) 
    
    
    
    
  //   // .then( () => { console.log('finished loading');this.setState( {isGetting: false} );  } )
  //   // .catch( (err) => {console.log(err) })
    
  // }
   
  incrementLikes(likes, uid, key, index, specificArrayOfProducts) {
    
    //here uid refers to uid of seller so the number of likes for their product may be affected
    //func applies to scenario when heart icon is gray
    //add like to product, and add this product to user's collection; if already in collection, modal shows user
    //theyve already liked the product
      //add to current users WishList
      //add a like to the sellers likes count for this particular product
      //unless users already liked this product, in which case, dont do anything
      // if(this.state.collectionKeys.includes(key) == true) {
      //   // console.log('show modal that users already liked this product')
      //   alert("This product is already in your Wish List.")
      // } 
      // else {
        // this.setState({isGetting: true});
        var userCollectionUpdates = {};
        userCollectionUpdates['/Users/' + this.state.uid + '/collection/' + key + '/'] = true;
        let promiseToUpdateCollection = firebase.database().ref().update(userCollectionUpdates);
        //since we don't want the user to add another like to the product,
        //tack on his unique contribution to the seller's product's total number of likes
        var updates = {};
        likes += 1;
        var postData = likes;
        updates['/Users/' + uid + '/products/' + key + '/text/likes/'] = postData;
        let promiseToUpdateProductLikes = firebase.database().ref().update(updates);
        Promise.all([promiseToUpdateCollection, promiseToUpdateProductLikes])
        .then( () => {
          const {...state} = this.state;
          
          //for a little time simulate the goal of this function having been achieved,
          //by locally changing the state to reflect as such
          state[specificArrayOfProducts][index].text.likes += 1;
          // state[specificArrayOfProducts][key].text.likes += 1;
          state.collectionKeys.push(key);
          this.setState(state);
          // setTimeout(() => {
          //   this.getMarketPlace(this.state.uid);  
          // }, timeToRefreshAfterLikeOrUnlike);
          
          // alert("This product has been added to your WishList 💕.");
        })
        //locally reflect the updated number of likes and updated collection of the user,
        // by re-pulling data from the cloud
        // setTimeout(() => {
        //   this.getPageSpecificProducts();  
        // }, timeToRefresh);
        
        

        ////
        // const {productsl, productsr} = this.state;
        
        // productsl.forEach( (product) => {
        //   if(product.key == key) {
        //     product.text.likes += 1;
        //   } 
        //   return null;
        // })

        // productsr.forEach( (product) => {
        //   if(product.key == key) {
        //     product.text.likes += 1;
        //   }
        //   return null;
        // })
        // //need to also append it to your list of collection keys

        // this.setState({ productsl, productsr } );
        //////
        


      
      
    
  }

  decrementLikes(likes, uid, key, index, specificArrayOfProducts) {
    //this func applies when heart icon is red
    // console.log('decrement number of likes');
    // if(this.state.collectionKeys.includes(key) == true) {
      var userCollectionUpdates = {};
      // let promiseToUpdateCollection = firebase.database().ref().update(userCollectionUpdates);
      userCollectionUpdates['/Users/' + firebase.auth().currentUser.uid + '/collection/' + key + '/'] = false;
      let promiseToUpdateCollection = firebase.database().ref().update(userCollectionUpdates);
      //ask user to confirm if they'd like to unlike this product
      var updates = {};
      likes -= 1;
      var postData = likes;
      updates['/Users/' + uid + '/products/' + key + '/text/likes/'] = postData;
      let promiseToUpdateProductLikes = firebase.database().ref().update(updates);
      Promise.all([promiseToUpdateCollection, promiseToUpdateProductLikes])
      .then( () => {
        const {...state} = this.state;
        
        //for a little time simulate the goal of this function having been achieved,
        //by locally changing the state to reflect as such
        state[specificArrayOfProducts][index].text.likes -= 1;
        state.collectionKeys = state.collectionKeys.filter( collectionKey => collectionKey != key );
        this.setState(state);
        // setTimeout(() => {
        //   this.getMarketPlace(this.state.uid);  
        // }, timeToRefreshAfterLikeOrUnlike);
        
        // alert("This product has been added to your WishList 💕.");
      })
    

    // else {
    //   alert('One sec, the marketplace is probably refreshing\n. Like, basically you cannot unlike a product you have not liked yet, you know.' );
    // }

  }

  navToEditItem(item) {
    this.props.navigation.navigate('CreateItem', {
      data: item, 
      pictureuris: item.uris.source, 
      price: item.text.price, 
      original_price: item.text.original_price, 
      post_price: item.text.post_price > 0 ? item.text.post_price : 0,
      condition: item.text.condition,
      type: item.text.type,
      size: item.text.size,
      editItemBoolean: true,
      isComingFrom: 'products',
    });
    // alert('Please take brand new pictures');
  }

  deleteProduct = async (uid, key) => {
    await firebase.database().ref('/Users/' + uid + '/products/' + key).remove();
    await firebase.database().ref('/Users/' + uid + '/notifications/priceReductions/' + key).remove().catch(err => console.log(err));
    this.getMarketPlace(this.state.uid);
    alert("Your product has successfully been deleted");

  }

  // deleteProduct(uid, key) {
  //   let promiseToUpdateProductsBranch = firebase.database().ref('/Products/' + key).remove();
  //   let promiseToDeleteProduct = firebase.database().ref('/Users/' + uid + '/products/' + key).remove();

  //   //Additionally, schedule deletion of any priceReductionNotification notifications that affect this product
  //   let promiseToDeleteNotifications = firebase.database().ref('/Users/' + uid + '/notifications/priceReductions/' + key).remove();
    
  //   Promise.all([promiseToDeleteProduct, promiseToUpdateProductsBranch, promiseToDeleteNotifications])
  //   .then( () => {
  //       // console.log('product has been successfully removed')
  //       this.getMarketPlace(this.state.uid);
  //       alert("Your product has successfully been deleted");

  //   })
  //   .catch( (err)=> {
  //       console.log(err);
  //   });

  // }

    
    // this.getPageSpecificProducts();
    // alert("This product has been removed from your WishList 💔.");
    // setTimeout(() => {
    //   this.getPageSpecificProducts([]);  
    // }, timeToRefresh);
    //locally reflect the updated number of likes and updated collection of the user,

    /////////
    // const {productsl, productsr} = this.state;
        
    // productsl.forEach( (product) => {
    //   if(product.key == key) {
    //     product.text.likes -= 1;
    //   } 
    //   return null;
    // })

    // productsr.forEach( (product) => {
    //   if(product.key == key) {
    //     product.text.likes -= 1;
    //   }
    //   return null;
    // })
    // //need to remove this products key from user's collection Keys
    // //var collectionKeys = this.state.collectionKeys.filter( (productKey) => productKey !== key)


    // this.setState({ productsl, productsr } );
    //////////
  setSaleTo(soldStatus, uid, productKey) {
    var updates={};
    // var postData = {soldStatus: soldStatus, dateSold: Date.now()}
    updates['/Users/' + uid + '/products/' + productKey + '/text/sold/'] = soldStatus;
    updates['/Users/' + uid + '/products/' + productKey + '/text/dateSold/'] = soldStatus ? new Date : '';
    // updates['Users/' + uid + '/products/' + productKey + '/sold/'] = soldStatus;
    firebase.database().ref().update(updates);
    //just alert user this product has been marked as sold, and will show as such on their next visit to the app.
    var status = soldStatus ? 'sold' : 'available for purchase'
    alert(`Product has been marked as ${status}.\n If you wish to see the effects of this change immediately,\n please go back to the Market`);
    this.props.navigation.navigate('Market');

  }

  navToProductDetails(data, collectionKeys, productKeys) {
      this.props.navigation.navigate('ProductDetails', {data: data, collectionKeys: collectionKeys, productKeys: productKeys})
  }

  renderRow = (section, expandFunction, incrementLikesFunction, decrementLikesFunction, menuExpandFunction, column) => {
    return (
      
      <TouchableOpacity
      style={{height: section.isActive == true ? cardFull : cardHeaderHeight}}
      underlayColor={'transparent'}
      onPress={() => {
        // section.isActive ? this.navToProductDetails(section, this.state.collectionKeys, this.state.productKeys) : null;
        !section.isActive ? expandFunction() : this.navToProductDetails(section, this.state.collectionKeys, this.state.productKeys);
      }}
      >
      
        <View 
          style={styles.card}
        >
        
        <View 
        style={[styles.card, section.isActive == true ? styles.active : styles.inactive]}
        >
        
          <View style={styles.productImageContainer}>
              <View style={styles.interactionButtonsRow}>
                
                <View style={styles.likesContainer}>
                  {this.state.collectionKeys.includes(section.key) == true ? 
                    <Icon 
                      name="heart" 
                      size={25} 
                      color={this.state.productKeys.includes(section.key) == true ? limeGreen : '#800000'}
                      onPress={this.state.productKeys.includes(section.key) == true ? null : decrementLikesFunction}
                              

                    /> 
                  :  
                    <Icon 
                      name="heart-outline" 
                      size={25} 
                      color={this.state.productKeys.includes(section.key) == true ? limeGreen : '#800000'}
                      onPress={this.state.productKeys.includes(section.key) == true ? null : incrementLikesFunction}
                    />
                  }
                

                  <Text style={[styles.likes, {color: this.state.productKeys.includes(section.key) == true ? limeGreen : profoundPink }]}>{section.text.likes}</Text>
                </View>

                {this.props.showYourProducts == true ?
                  section.isMenuActive == true?
                  <View style={styles.menuContainer}>
                    {[
                      {text: 'Edit', onPress: () => this.navToEditItem(section)}, 
                      {text: 'Delete', onPress: () => this.deleteProduct(section.uid, section.key)},
                      {text: section.text.sold ? "Unmark as Sold" : "Mark as Sold", onPress: () => this.setSaleTo(section.text.sold ? false : true, section.uid, section.key)}
                    ]
                    .map((option, index) => (
                      <TouchableOpacity key={index} onPress={option.onPress} style={[styles.menuOptionContainer, {borderBottomWidth: index != 2 ? 0.5 : null} ]}>
                        <Text style={[textStyles.generic, {fontSize: 13, color: 'black'}]}>{option.text}</Text>
                      </TouchableOpacity>
                    )) 
                    }
                    
                  </View>
                  :
                  <View style={styles.dotsContainer}>
                    <Icon
                      name="dots-vertical"
                      size={25} 
                      color={"#fff"}
                      onPress={menuExpandFunction}
                    /> 
                  </View>
                :
                  null
                }



              </View>
              {section.text.sold == true ? 
                <View style={styles.soldTextContainer}>
                  <Text style={[styles.soldText, Platform.OS == "ios" ? {borderWidth: 2,} : null]}>SOLD</Text>
                  <Image 
                  source={{uri: section.uris.pd[0]}}
                  style={styles.productImage} 
                  />
                </View>
                
              :
              <Image 
                  source={{uri: section.uris.pd[0]}}
                  style={styles.productImage}
              />
              }  
          </View>

          
          <TouchableOpacity 
          onPress={expandFunction}
          style= { styles.headerPriceMagnifyingGlassRow }
          >
            
            <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
              {(section.text.original_price > 0) == true?
                <Text style={[styles.original_price, {textDecorationLine: 'line-through',}]}>£{section.text.original_price}</Text>
                :
                null
              }
              <Text style={styles.price}>£{section.text.price}</Text>
            </View>

            {section.isActive == true? 
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
            

          </TouchableOpacity>        
          
          

        </View>  
        
        </View>




        

          

          {section.isActive == true ?
            <View style={styles.contentCard}>
              <Animatable.View
                duration={400}
                style={[section.isActive ? styles.active : styles.inactive, {flexDirection: 'row',flex: 1}]}
                transition="backgroundColor">
                  
                
                <Animatable.View style={styles.brandAndSizeCol} transition='backgroundColor'>
                  <Animatable.Text style={styles.contentCardText} direction={column == 'left' ? 'normal' : 'alternate'} easing={textAnimationEasing} duration={textAnimationDuration} animation={section.isActive ? 'bounceInRight' : undefined}>{section.text.brand}</Animatable.Text>
                  <Animatable.Text style={[styles.contentCardText]} direction={column == 'left' ? 'normal' : 'alternate'}  easing={textAnimationEasing} duration={textAnimationDuration} animation={section.isActive ? 'bounceInLeft' : undefined}>{section.text.gender == "Accessories" ? "Accessory" : `Size: ${section.text.size.length > 8 ? section.text.size.substring(0,7) + ".." : section.text.size}`}</Animatable.Text>
                </Animatable.View>

                <Animatable.View style={styles.magnifyingGlassCol} transition='backgroundColor'>
                  <Icon 
                  name="magnify" 
                  size={30} 
                  color={limeGreen}
                  onPress={ () => { 
                      this.navToProductDetails(section, this.state.collectionKeys, this.state.productKeys); 
                      }}  
                  />
                </Animatable.View>  
                
              </Animatable.View>
            </View>   
          :
            null
            } 








        

      </TouchableOpacity>
      
    )
  }

  renderFilterModal = () => {

    var {brands, typesForCategory, conditions, searchTerm, selectedBrands, selectedCategory, selectedConditions, selectedType} = this.state;
    console.log(brands, categories, conditions, sizes);
    if(searchTerm) {
      brands = brands.filter( (brand) => brand.name.includes(searchTerm) );
    }
    if(selectedCategory && selectedType) {
      var sizes = generateSizesBasedOn(selectedType, selectedCategory)
    }


    return (
      <Modal
      animationType="slide"
      transparent={true}
      visible={this.state.showFilterModal}
      onRequestClose={() => {
        Alert.alert('Modal has been closed.');
      }}
      >
      <View style={[{flex: 1},{backgroundColor: lightBlack }, styles.filterModal, {marginTop: Platform.OS == 'ios' ? 22 : 0}]}>

        <View style={styles.filterModalHeader}>
          
          <TouchableHighlight onPress={()=>this.setState({showFilterModal: false})}>
            <Icon 
              name="close" 
              size={42} 
              color='#fff'
            />
          </TouchableHighlight>

          <Text style={styles.filterModalHeaderText}>FILTERS</Text>
          <Text
          onPress={()=>{
            
            this.clearFilters();
            this.getMarketPlace(this.state.uid);
          }}
          style={styles.filterModalHeaderClearText}>Reset</Text>
        </View>

        <ScrollView style={{flex: 0.85}} contentContainerStyle={styles.filterModalContainer}>

          <View style={[styles.searchBarAndIconContainer, {justifyContent: 'space-between'}]}>
            <TextInput
              style={{height: 50, width: 220, fontFamily: 'Avenir Next', fontSize: 20, color: highlightGreen}}
              placeholder={"Search..."}
              placeholderTextColor={lightGray}
              onChangeText={(searchTerm) => this.setState({searchTerm})}
              value={this.state.searchTerm}
              multiline={false}
              maxLength={16}
              autoCorrect={false}
              clearButtonMode={'while-editing'}
            />     

            {this.state.searchTerm ? 
            null
            :
            <Icon name={'magnify'} size={30} color={graphiteGray}/>
            }
          </View>

          <GrayLine/>
          
          <View style={styles.filterBlock}>
            
            <View style={styles.filterBlockHeadingContainer}>
              <Text style={new avenirNextText('#fff', 25, "200")}>Brands</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator style={styles.optionsScroll} contentContainerStyle={styles.optionsScrollContentContainer}>
            {brands.map( (brand, index) => (
              
              <View key={index} style={[styles.optionContainer, (brands.length > 1 && index != brands.length - 1) == true ? {borderRightWidth: 0.3, borderRightColor: graphiteGray,} : null]}>
                <Text 
                onPress={()=>{
                  const {...state} = this.state
                  if(state.selectedBrands.includes(brand.name) == true) {
                    let INDEX = state.selectedBrands.indexOf(brand.name);
                    if(INDEX == 0) {
                       state.selectedBrands = state.selectedBrands.slice(INDEX + 1, state.selectedBrands.length)
                    }
                    else if(INDEX == state.selectedBrands.length - 1) {
                      state.selectedBrands = state.selectedBrands.slice(0,INDEX)
                    }
                    else {
                      var left = state.selectedBrands.slice(0,INDEX)
                      var right = state.selectedBrands.slice(INDEX + 1, state.selectedBrands.length)
                      state.selectedBrands = left.concat(right);
                    }
                  }
                  else {
                    state.selectedBrands.push(brand.name)
                  }
                  
                  state.brands[index].selected = !state.brands[index].selected; 
                  this.setState(state);
                }}
                style={[styles.option, {color: !brand.selected == true ? graphiteGray : highlightGreen}]}>{brand.name}</Text>
              </View>
              
            ))}
            </ScrollView>


          </View>

          <GrayLine/>

          <View style={styles.filterBlock}>

            <View style={styles.filterBlockHeadingContainer}>
              <Text style={new avenirNextText('#fff', 25, "200")}>Category</Text>
            </View>

            <View style={styles.categoriesContainer}>
              {categories.map( (category, index) => (
                <View key={index} style={[styles.optionContainer, {justifyContent: 'space-between'}]}>
                  <Text 
                  style={[styles.option, {fontSize: 22, textAlign: 'center'}, {color: this.state.selectedCategory == category ? highlightGreen : graphiteGray}]} 
                  onPress={()=>{
                    this.setState({selectedCategory: category})
                  }}>{category}</Text>
                </View>
              ))}
            </View>

          </View>

          <GrayLine/>

          
            
          <View style={styles.filterBlock}>

          <View style={[styles.filterBlockHeadingContainer, {flex: 0.6}]}>
            <Text style={new avenirNextText('#fff', 25, "200")}>Type</Text>
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator style={[styles.optionsScroll, {flex: 0.4}]} contentContainerStyle={[styles.optionsScrollContentContainer, ]}>
            {selectedCategory ?
              
            typesForCategory[selectedCategory].map((type, index)=>(
              <View key={index} style={[styles.optionContainer, (typesForCategory[selectedCategory].length > 1 && index != typesForCategory[selectedCategory].length - 1) == true ? {borderRightWidth: 0.3, borderRightColor: graphiteGray,} : null]}>
                <Text
                onPress={()=>{
                  this.state.selectedType == type.name ? null : this.setState({selectedType: type.name});
                  // this.state.typesForCategory[selectedCategory][index].selected = !this.state.typesForCategory[selectedCategory][index].selected;
                  // this.setState({typesForCategory: this.state.typesForCategory});
                }}
                style={[styles.option, {color: this.state.selectedType == type.name ? highlightGreen : graphiteGray }]}>{type.name}</Text>
              </View>
              
            ))

            :

            <View style={styles.optionContainer}>
              <Text style={[styles.option, {color: graphiteGray}]}>{noSelectedCategoryText}</Text>
            </View>
            
            }
          </ScrollView>

          </View>

          <GrayLine/> 

          

           

          <View style={styles.filterBlock}>

            <View style={styles.filterBlockHeadingContainer}>
              <Text style={new avenirNextText('#fff', 25, "200")}>Condition</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator style={styles.optionsScroll} contentContainerStyle={styles.optionsScrollContentContainer}>
            {conditions.map( (condition, index) => (
              <View key={index} style={[styles.optionContainer, conditions.length > 1 && index != conditions.length - 1 ? {borderRightWidth: 0.3, borderRightColor: graphiteGray,} : null]}>
                <Text 
                onPress={()=>{
                  const {...state} = this.state
                  if(state.selectedConditions.includes(condition.name) == true) {
                    let INDEX = state.selectedConditions.indexOf(condition.name);
                    if(INDEX == 0) {
                       state.selectedConditions = state.selectedConditions.slice(INDEX + 1, state.selectedConditions.length)
                    }
                    else if(INDEX == state.selectedConditions.length - 1) {
                      state.selectedConditions = state.selectedConditions.slice(0,INDEX)
                    }
                    else {
                      var leftConditions = state.selectedConditions.slice(0,INDEX)
                      var rightConditions = state.selectedConditions.slice(INDEX + 1, state.selectedConditions.length)
                      state.selectedConditions = leftConditions.concat(rightConditions);
                    }
                  }
                  else {
                    state.selectedConditions.push(condition.name)
                  }
                  state.conditions[index].selected = !state.conditions[index].selected; 
                  this.setState(state);
                }}
                style={[styles.option, {color: !condition.selected ? graphiteGray : highlightGreen}]}>{condition.name}</Text>
              </View>
            ))}
            </ScrollView>


          </View>


              
          { (selectedCategory == "Accessories") || !(selectedCategory && selectedType) ?
            null
            :
            <View style={styles.filterBlock}>

              <View style={styles.filterBlockHeadingContainer}>
                <Text style={new avenirNextText('#fff', 25, "200")}>Size</Text>
              </View>

              <ScrollView horizontal showsHorizontalScrollIndicator style={styles.optionsScroll} contentContainerStyle={styles.optionsScrollContentContainer}>
              {sizes.map( (size, index) => (
                <View key={index} style={[styles.optionContainer, (sizes.length > 1 && index != sizes.length - 1) == true ? {borderRightWidth: 0.3, borderRightColor: graphiteGray,} : null]}>
                  <Text 
                  onPress={()=> {
                    this.state.selectedSize == size ? null : this.setState({selectedSize: size});
                  }}
                  style={[styles.option, {color: this.state.selectedSize == size ? highlightGreen : graphiteGray}]}>{size}</Text>
                </View>
              ))}
              </ScrollView>


            </View>
          }

            

        </ScrollView>

        
        <View style={styles.filterModalFooter}>
          <Text
          onPress={(this.state.selectedBrands.length > 0 || this.state.selectedType || this.state.selectedConditions.length > 0 || this.state.selectedSize) ?
            async () => {
              console.log("Filtering Marketplace Here")
              await this.getMarketPlace(this.state.uid); 
              this.filterMarketPlace();
              // this.setState({showFilterModal: false});
            }
            :
            async () => {
              await this.getMarketPlace(this.state.uid); 
              this.setState({showFilterModal: false});
            }
            
            
           }
          style={new avenirNextText(false, 18, "400")}>APPLY</Text>
        </View>
        



      </View>
      </Modal>
    )

  }

  render() {
    // var {showCollection, showYourProducts, showSoldProducts} = this.props;
    var {isGetting, emptyMarket, noResultsFromFilter} = this.state;
    
    if(isGetting == true) {
      return ( 
        <SafeAreaView style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
            <LoadingIndicator isVisible={isGetting} color={darkGreen} type={'Wordpress'}/>            
        </SafeAreaView>
      )
    }

    else if(emptyMarket == true) {
      return (
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff', padding: 10}}>
          {/* <NothingHereYet specificText={showCollection == true ? emptyCollectionText : (showYourProducts == true && showSoldProducts == true) ? noSoldProductsText : (showYourProducts == true && showSoldProducts == false) ? noProductsOfYourOwnText : emptyMarketText } /> */}
        </SafeAreaView>
      )
    }

    else if(noResultsFromFilter == true){

      return(
        <SafeAreaView style={{flex: 1, backgroundColor: '#fff', padding: 10, alignItems: 'center'}}>

          <View style={{flex: 0.2, }}>
            <NothingHereYet specificText={noResultsFromSearchText} />
          </View>

          <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
            <TouchableOpacity 
            onPress={() => this.setState({ showFilterModal: true }) } 
            style={styles.filterButton}>
            
              <Icon 
                name="filter-outline" 
                size={15} 
                color='#fff'
              />
            
            </TouchableOpacity>
          </View>
          {this.renderFilterModal()}

        </SafeAreaView>
      )
    }

    else {
    // console.log('Entered MarketPlace render')
    return (

      <SafeAreaView style={{flex: 1}}>
      

      <ScrollView
          style={styles.container}
          contentContainerStyle={styles.contentContainerStyle}>

            
            
              <ListView
                  contentContainerStyle={styles.listOfProducts}
                  dataSource={this.state.leftDS.cloneWithRows(this.state.leftProducts)}
                  renderRow={(rowData) => this.renderRow(
                    rowData, 
                    () => {
                        
                        this.props.showYourProducts ? this.hideMenus() : null;

                        let index = this.state.leftProducts.indexOf(rowData);
                        this.state.leftProducts[index].isActive = !this.state.leftProducts[index].isActive;
                        this.setState({leftProducts: this.state.leftProducts});
                        },
                    () => {
                        this.incrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.leftProducts.indexOf(rowData), 'leftProducts')
                    },
                    () => {
                        this.decrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.leftProducts.indexOf(rowData), 'leftProducts')
                    },
                    () => {
                      let index = this.state.leftProducts.indexOf(rowData);
                      this.state.leftProducts[index].isMenuActive = !this.state.leftProducts[index].isMenuActive;
                      this.setState({leftProducts: this.state.leftProducts});
                    },
                    "left"
                      
                  )
                  }
                  enableEmptySections={true}
                  removeClippedSubviews={false}
              />

              
              { this.state.rightProducts ?
                <ListView
                  contentContainerStyle={styles.listOfProducts}
                  dataSource={this.state.rightDS.cloneWithRows(this.state.rightProducts)}
                  renderRow={(rowData) => this.renderRow(
                    rowData, 
                    () => {
                      
                      this.props.showYourProducts ? this.hideMenus() : null;

                      let index = this.state.rightProducts.indexOf(rowData);
                      this.state.rightProducts[index].isActive = !this.state.rightProducts[index].isActive;
                      this.setState({rightProducts: this.state.rightProducts});
                    },
                    () => {
                      this.incrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.rightProducts.indexOf(rowData), 'rightProducts')
                    },
                    () => {
                      this.decrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.rightProducts.indexOf(rowData), 'rightProducts')
                    },
                    () => {
                      let index = this.state.rightProducts.indexOf(rowData);
                      this.state.rightProducts[index].isMenuActive = !this.state.rightProducts[index].isMenuActive;
                      this.setState({rightProducts: this.state.rightProducts});
                    },
                    "right"
                  )}
                  enableEmptySections={true}
                  removeClippedSubviews={false}
              />
              :
              null
              }
            

            {this.renderFilterModal()}

          </ScrollView>

        <View style={styles.filterButtonContainer}>

            <TouchableOpacity 
            onPress={() => this.setState({ showFilterModal: true }) } 
            style={styles.filterButton}>
            
              <Icon 
                name="filter-outline" 
                size={15} 
                color='#fff'
              />
            
            </TouchableOpacity>
          </View>
      
      </SafeAreaView>

    
  
        
    )
    }

    
  }

}



//////////


  //if(isGetting == true) {
  //   return ( 
  //     <View style={{marginTop: 22, flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff'}}>
  //         <LoadingIndicator isVisible={isGetting} color={darkGreen} type={'Wordpress'}/>            
  //     </View>
  //   )
  // }

  // else if(emptyMarket == true) {
  //   return (
  //     <View style={{marginTop: 22, backgroundColor: '#fff', padding: 10}}>
  //       <NothingHereYet specificText={showCollection == true ? emptyCollectionText : showYourProducts == true ? noProductsOfYourOwnText : emptyMarketText } />
  //     </View>
  //   )
  // }

  // else if(noResultsFromFilter == true){

  //   return(
  //     <View style={{flex: 1, marginTop: 22, backgroundColor: '#fff', padding: 5, alignItems: 'center'}}>

  //       <View style={{flex: 0.2, }}>
  //         <NothingHereYet specificText={noResultsFromSearchText} />
  //       </View>

  //       <View style={{flex: 0.8, alignItems: 'center', justifyContent: 'center'}}>
  //         <Button  
  //           buttonStyle={styles.filterButtonStyleNoMarket}
  //           icon={{name: 'filter', type: 'material-community'}}
  //           title='Filter'
  //           onPress={() => this.setState({ showFilterModal: true }) } 
  //         />
  //       </View>
  //       {this.renderFilterModal()}

  //     </View>
  //   )
  // }

  // else {
  //   console.log('Entered MarketPlace render')
  //   return (

      
  //     <View style={styles.container}>
        
  //     </View>
      

    
  
        
  //   )
  // }

//////////

{/* <ScrollView
          style={{flex: 1}}
          contentContainerStyle={styles.contentContainerStyle}>

            
            
              <ListView
                  contentContainerStyle={styles.listOfProducts}
                  dataSource={this.state.leftDS.cloneWithRows(this.state.leftProducts)}
                  renderRow={(rowData) => this.renderRow(
                    rowData, 
                    () => {
                        
                        this.props.showYourProducts ? this.hideMenus() : null;

                        let index = this.state.leftProducts.indexOf(rowData);
                        this.state.leftProducts[index].isActive = !this.state.leftProducts[index].isActive;
                        this.setState({leftProducts: this.state.leftProducts});
                        },
                    () => {
                        this.incrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.leftProducts.indexOf(rowData), 'leftProducts')
                    },
                    () => {
                        this.decrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.leftProducts.indexOf(rowData), 'leftProducts')
                    },
                    () => {
                      let index = this.state.leftProducts.indexOf(rowData);
                      this.state.leftProducts[index].isMenuActive = !this.state.leftProducts[index].isMenuActive;
                      this.setState({leftProducts: this.state.leftProducts});
                    }
                      
                  )}
                  enableEmptySections={true}
                  removeClippedSubviews={false}
              />

              
              { this.state.rightProducts ?
                <ListView
                  contentContainerStyle={styles.listOfProducts}
                  dataSource={this.state.rightDS.cloneWithRows(this.state.rightProducts)}
                  renderRow={(rowData) => this.renderRow(
                    rowData, 
                    () => {
                      
                      this.props.showYourProducts ? this.hideMenus() : null;

                      let index = this.state.rightProducts.indexOf(rowData);
                      this.state.rightProducts[index].isActive = !this.state.rightProducts[index].isActive;
                      this.setState({rightProducts: this.state.rightProducts});
                    },
                    () => {
                      this.incrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.rightProducts.indexOf(rowData), 'rightProducts')
                    },
                    () => {
                      this.decrementLikes(rowData.text.likes, rowData.uid, rowData.key, this.state.rightProducts.indexOf(rowData), 'rightProducts')
                    },
                    () => {
                      let index = this.state.rightProducts.indexOf(rowData);
                      this.state.rightProducts[index].isMenuActive = !this.state.rightProducts[index].isMenuActive;
                      this.setState({rightProducts: this.state.rightProducts});
                    }
                  )}
                  enableEmptySections={true}
                  removeClippedSubviews={false}
              />
              :
              null
              }
            

            {this.renderFilterModal()} 

          </ScrollView> */}
          

          {/* <View style={styles.filterButtonContainer}>

            <TouchableOpacity 
            onPress={() => this.setState({ showFilterModal: true }) } 
            style={styles.filterButton}>
            
              <Icon 
                name="filter-outline" 
                size={15} 
                color='#fff'
              />
            
            </TouchableOpacity>
          </View> */}

          /////////////



{/* <Text style={[styles.filterModalHeaderText, {fontSize: 11}]}>FILTER</Text> */}

{/* <View style={styles.filterButtonContainer}>
              <Button  
                  buttonStyle={styles.filterButtonStyle}
                  icon={{name: 'filter', type: 'material-community'}}
                  title='Filter'
                  onPress={() => this.setState({ showFilterModal: true }) } 
              />
            </View> */}
{/* <Accordion
                activeSection={activeSectionL}
                sections={productsl}
                touchableComponent={TouchableOpacity}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                duration={200}
                onChange={this.setSectionL}
              />

              <Accordion
                activeSection={activeSectionR}
                sections={productsr}
                touchableComponent={TouchableOpacity}
                renderHeader={this.renderHeader}
                renderContent={this.renderContent}
                duration={200}
                onChange={this.setSectionR}
              /> */}

// Products.PropTypes = {
//     showCollection: PropTypes.bool,
//     showYourProducts: PropTypes.bool,
// }

// Products.defaultProps = {
//     showCollection: false,
//     showYourProducts: false,
// }

Products.defaultProps = {
  showYourProducts: false,
  showSoldProducts: false,
  showCollection: false,
  showOtherUserProducts: false,
  showOtherUserSoldProducts: false,
  otherUser: false
}

export default withNavigation(Products);

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#fff',
    // paddingHorizontal: 5,
    // marginTop: 22,
    paddingBottom: 3,
    paddingLeft: 6,
    // width: 320,
    // height: height,
    // flexDirection: 'column',
    //alignItems: 'center',
    // justifyContent: 'center',
    
  },

  contentContainerStyle: {
    // flexGrow: 4,   
    flexDirection: 'row',
    // justifyContent: 'flex-start',
    // flexWrap: 'wrap',
    // paddingTop: 20,
      },

  listOfProducts: {
    // flexDirection: 'row',
    // flexWrap: 'wrap',
    // padding: 5,
    // justifyContent: 'space-evenly', 
    // will lead to good spacing between cards but the product in last row will be in dead center
    // alignItems: 'center'
  },    

  sectionContainer: {width: cardWidth, padding: 3},

  filterScrollContainer: {
    flexDirection: 'column',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: graphiteGray,
    borderWidth: 2,
    // backgroundColor: '#122021'
  },    

  headerPriceMagnifyingGlassRow: {
    flexDirection: 'row', justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0 
  },    

  priceMagnifyingGlassRow: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 5 
  },    

  brandAndSizeCol: {
    flex: 0.7,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    padding: 5
  },

  magnifyingGlassCol: {
    flex: 0.3,
    alignItems: 'center'
  },

  interactionButtonsRow: {
    flexDirection: 'row',
    // width: popUpMenuWidth + 5,
    height: 55 + 5, //55+5
    // marginTop: 5
    // width: ,
    // backgroundColor: 'blue',
    // justifyContent: 'center',
    // alignItems: 'center'
    //backgroundColor: iOSColors.lightGray2,
    // marginRight: 95,
  },

  likesContainer: {
    height: 0.45*55,
    flex: 0.3,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingHorizontal: 5,
    marginTop: 5,
    // backgroundColor: 'red'
  },

  dotsContainer: {
    flex: 0.7,
    marginTop: 5,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
    
    // backgroundColor: 'green'
  },

  menuContainer: {flex: 0.7, backgroundColor: '#fff', borderBottomLeftRadius: 10, width: 35, height: 80},

  menuOptionContainer: {
    // backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    // borderRadius: 0,
    paddingVertical: 5,
    borderColor: 'black',
    // padding: 7,
    // marginBottom: 4,
    // width: popUpMenuHeight,
    // height: popUpMenuWidth
    // marginVertical: 4,

  },

  editOrDeleteMenu: {
    width: popUpMenuWidth,
    height: popUpMenuHeight,
    borderRadius: 8,
    borderWidth: 0.3,
    backgroundColor: "white",
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },

  // interactionContainer: {
  //   flex: 0.5,
  //   flexDirection: 'row',
  //   justifyContent: 'flex-start',
  //   alignItems: 'center'
  // },

  buyReviewRow: {
    flexDirection: 'row', justifyContent: 'space-between', padding: 5, marginRight: 30
  },

  boldText: {fontFamily: 'verdana', fontSize: 9, fontWeight: 'bold', color: 'blue'},  

  soldText: {
    fontFamily: 'Avenir Next', 
    fontSize: 25, 
    fontWeight: 'bold',
    color: 'black',
    transform: [{ rotate: '-45deg'}],
    borderColor: "black",
    // borderWidth: 2,
    borderRadius: 10,
    borderStyle: 'dashed'
  },
  
  likes: {
    fontFamily: 'Avenir Next',
    
    padding: 2,
    marginLeft: 4,
  },

  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '300',
    marginBottom: 20,
  },
  // header: {
  //   backgroundColor: '#F5FCFF',
  //   padding: 10,
  // },

  productImageContainer: { 
    flex: 1, 
    position: 'relative' 
  },

  soldTextContainer: {
    position: 'absolute', 
    top: 0, left: 0, right: 0, bottom: 0, 
    justifyContent: 'center', alignItems: 'center'
  },
  productImage: { 
    height: cardHeaderHeight - 37, width: cardWidth,  position: 'absolute',
    zIndex: -1,
    //  top: 0, left: 0, right: 0, bottom: 0, resizeMode: 'cover' 
   },
  headerText: {
    fontFamily: avenirNext,
    color: rejectRed,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: '500',
  },
  contentCard: {
    backgroundColor: '#fff',
    width: cardWidth,
    //width/2 - 10
    height: cardContentHeight,
    //200
    //marginLeft: 2,
    //marginRight: 2,
    marginTop: 2,
    paddingTop: 3,
    // paddingRight: 7,
    paddingLeft: 7,
    paddingBottom: 5
  },
  content: {
    padding: 20,
    backgroundColor: '#fff',
  },

  contentCardText: {
    ...textStyles.generic,
    color: 'black'
  },

  //header Card
  card: {
    backgroundColor: '#fff',
    width: cardWidth,
    //width/2 - 0
    height: cardHeaderHeight,
    //200
    //marginLeft: 2,
    //marginRight: 2,
    marginTop: 2,
    padding: 0,
    // justifyContent: 'space-between'
  } ,
  //controls the color of the collapsible card when activated
  active: {
    // backgroundColor: almostWhite,
    backgroundColor: '#fff',
    //#96764c
    //#f4d29a
    //#b78b3e
    //#7c5d34
    //#c99f68
  },
  inactive: {
    backgroundColor: '#fff',
  },
  selectors: {
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'center',
  },
  selector: {
    backgroundColor: '#F5FCFF',
    padding: 10,
  },
  activeSelector: {
    fontWeight: 'bold',
  },
  selectTitle: {
    fontSize: 14,
    fontWeight: '500',
    padding: 10,
  },

  original_price: {
    ...textStyles.generic,
    fontSize: 17,
    color: 'black',
    fontWeight: "500"
  },

  price: {
    ...textStyles.generic,
    fontSize: 17,
    color: limeGreen,
    fontWeight: "500"
  },

  brand: {
    ...textStyles.generic,
    fontSize: 15,
    color: 'black',
    fontWeight: "200"
  },

  size: {
    ...textStyles.generic,
    fontSize: 15,
    color: 'black',
    fontWeight: "400"
  },


  filterButton: {
    backgroundColor: 'black',
    justifyContent: 'center',
    // alignContent: 'center',
    alignItems: 'center',
    // marginRight: width/3.6,
    // position: 'absolute',
    // left: cardWidth,
    // bottom: 30,
    width: 60,
    height: 32,
    borderRadius: 30
  },

  filterButtonContainer: {
    justifyContent: 'center', alignItems: 'center', position: 'absolute', width: 90,
    // backgroundColor: 'green',
    borderRadius: 30,
    bottom: 30,
    left: cardWidth - 40,
    right: cardWidth - 40
    // marginLeft: cardWidth - 40
  },

  
  ////////////////////////////////// 
  ////////////////////// Partition between marketplace styles and the filter modal styles

  filterModal: {
    // paddingVertical: 10,
    paddingHorizontal: 0, 
    // marginTop: 22
  },

  filterModalHeader: {
    flex: 0.15,
    flexDirection: 'row',
    backgroundColor: 'black',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10

  },

  filterModalHeaderText: {
    fontFamily: 'Avenir Next',
    fontSize: 24,
    color: '#fff',
    letterSpacing: 2,
    fontWeight: "300",
  },

  filterModalHeaderClearText: {
    color: '#fff',
    fontSize: 18,
    fontFamily: 'Avenir Next',
    fontWeight: "300"
  },


  filterModalContainer: {
    flexGrow: 4, 
    padding: 3,
    // backgroundColor: '#fff',
    // flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },

  filterBlock: {
    paddingVertical: 2,
    height: 100,
    justifyContent: 'center'
  },

  filterBlockHeadingContainer: {
    flex: 0.6,
    // justifyContent: 'space-evenly',
    alignItems: 'center'
  },

  optionsScroll: {
    flex: 0.4,
    
  },

  optionsScrollContentContainer: {
    flexGrow: 4,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    padding: 10
  },

  optionContainer: {
    // flexDirection: 'row',
    // justifyContent: 'space-between',
    // alignContent: 'space-between',
    alignItems: 'center',
    // paddingVertical: 3,
    paddingHorizontal: 8,
    // backgroundColor: 'red'
  },

  option: {
    ...textStyles.generic,
    fontSize: 22,
    color: '#fff',
    fontWeight: "500"
  },

  categoriesContainer: {
    flex: 0.7,
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center'
  },

  filterModalFooter: {
    flex: 0.1,
    backgroundColor: '#fff',
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center'
  },

  // filterModalFooterText: {textAlign: 'center'},


  ///////////


  filterButtonStyleNoMarket : {
    backgroundColor: 'black',
    width: 80,
    height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
    
  },

  filterButtonContainerNoMarket: {
    justifyContent: 'center',
    alignContent: 'center',
    alignItems: 'center',
    marginRight: width/3.6,
    // position: 'absolute',
    // bottom: 30
  },

  headerFilterCard: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingTop: 2,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 0, 
    height: 40
  },

  contentFilterCard: {
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    height: 200,
    padding: 10,
  },
  headerFilterText: {
    ...material.headline,
    fontSize: 20
  },
  contentFilterText: {
    ...material.body1,
    color: limeGreen,
    fontSize: 20
  },

  filterOptionRow: {
    flexDirection: 'row',
    width: width/1.2,
    justifyContent: 'space-between',
  },

  tabView: {
    flex: 1,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.01)',
  },

  tabContent: {
    borderWidth: 1,
    backgroundColor: '#fff',
    borderColor: 'rgba(0,0,0,0.1)',
    margin: 5,
    height: 150,
    padding: 15,
    shadowColor: '#ccc',
    shadowOffset: { width: 2, height: 2, },
    shadowOpacity: 0.5,
    shadowRadius: 3,
  },

  searchBarAndIconContainer: {
    flexDirection: 'row',
    paddingVertical: 3,
    // paddingHorizontal: 3,
    // justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'green'
  },

  searchBarContainer: {
    flex: 0.7, 
    paddingHorizontal: 10
    // backgroundColor: 'blue'
  },

  clearSearchIconContainer: {
    flex: 0.3, 
    // backgroundColor: 'red'
  },

  removeFiltersButtonStyle : {
    backgroundColor: rejectRed,
    width: width/3 + 40,
    height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
  
  },

  confirmFiltersButtonStyle : {
    backgroundColor: lightGreen,
    width: width/3 + 40,
    height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
  
  },

  hideModalButtonStyle : {
    backgroundColor: optionLabelBlue,
    width: 100,
    // height: height/15,
    borderRadius: 20,
    // justifyContent: 'center',
    // alignItems:'center',
    // alignContent: 'center',
  
  },

  

});

///////////
///////////
//OLD RENDER WITH MESSY LOGIC
//////////
//////////

// render() {
//   const {showYourProducts, showCollection} = this.props;
//   var {isGetting, noProducts, emptyMarket, emptyMarketDueToSearchCriteria, emptyCollection, rightProducts} = this.state;

//   if(isGetting) {
//     return ( 
//       <View style={{marginTop: 22, flex: 1, justifyContent: 'center', backgroundColor: '#fff'}}>
//           <View style={{height: 200, justifyContent: 'center', alignContent: 'center'}}>
//             <LoadingIndicator isVisible={isGetting} color={flashOrange} type={'Wordpress'}/>
//               <Text style={{paddingVertical: 1, paddingHorizontal: 10, fontFamily: 'Avenir Next', fontSize: 18, fontWeight: '500', color: 'black', textAlign: 'center'}}>
//                   {loadingStrings[randomIntFromInterval(0,3)]}
//               </Text>
//           </View>
          
//       </View>
//     )
//   }

//   else if(emptyMarket) {
//     return (
//       <View style={{marginTop: 22, backgroundColor: '#fff', padding: 5}}>
//         <NothingHereYet specificText={emptyMarketText} />
//       </View>
//   )
//   }

//   else if(emptyMarket && !emptyCollection) {
//     return (
//       <View style={{
//         flexDirection: 'column',
//         marginTop: 22,
//         height: height/2.2,
//         backgroundColor: lightGreen
//       }}
//       >
//           <NothingHereYet specificText={noResultsFromSearchText}/>
//           {/* {this.renderFilterModal()} */}
//           <View style={styles.filterButtonContainerNoMarket}>
//             <Button  
//                 buttonStyle={styles.filterButtonStyleNoMarket}
//                 icon={{name: 'filter', type: 'material-community'}}
//                 title='Filter'
//                 onPress={() => this.setState({ showFilterModal: true }) } 
//             />
//           </View>
//       </View>
//     )
//   }

//   else if(showCollection && emptyCollection && emptyMarket) {
//       return (
//         <View style={{marginTop: 22, backgroundColor: '#fff', padding: 5}}>
//           <NothingHereYet specificText={emptyCollectionText} />
//         </View>
//     )
    
      
//   }

//   else if(showYourProducts && noProducts) {
//     return (
//       <View style={{marginTop: 22, backgroundColor: '#fff', padding: 5}}>
//         <NothingHereYet specificText={noProductsOfYourOwnText} />
//       </View>
//     )
//   }

//   // else if(emptyMarketDueToSearchCriteria) {
//   //   console.log('HERE 2')
//   //   return (
//   //     <View style={{marginTop: 22, backgroundColor: '#fff', padding: 5}}>
//   //       <NothingHereYet specificText={emptyMarketDueToSearchCriteriaText} />
//   //     </View>
//   // )
//   // }
  
//   else {
//     return (

    
//         <View style={styles.container}>
//           <ScrollView
//                 style={{flex: 1}}
//                 contentContainerStyle={styles.contentContainerStyle}
//           >

//               <ListView
//                   contentContainerStyle={styles.listOfProducts}
//                   dataSource={this.state.leftDS.cloneWithRows(this.state.leftProducts)}
//                   renderRow={(rowData) => this.renderRow(rowData, () => {
//                       // let photoArray;
//                       // section.isActive = !section.isActive;
                      
//                       let index = this.state.leftProducts.indexOf(rowData);
//                       this.state.leftProducts[index].isActive = !this.state.leftProducts[index].isActive;
//                       this.setState({leftProducts: this.state.leftProducts});
//                       }
//                   )}
//                   enableEmptySections={true}
//               />

              
//               { this.state.rightProducts?
//                 <ListView
//                   contentContainerStyle={styles.listOfProducts}
//                   dataSource={this.state.rightDS.cloneWithRows(this.state.rightProducts)}
//                   renderRow={(rowData) => this.renderRow(rowData, () => {
//                       // let photoArray;
//                       // section.isActive = !section.isActive;
//                       let index = this.state.rightProducts.indexOf(rowData);
//                       this.state.rightProducts[index].isActive = !this.state.rightProducts[index].isActive;
//                       this.setState({rightProducts: this.state.rightProducts});
//                   })}
//                   enableEmptySections={true}
//               />
//               :
//               null
//               }
//             {this.renderFilterModal()}

//           </ScrollView>

//           <View style={styles.filterButtonContainer}>

//             <TouchableOpacity 
//               onPress={() => this.setState({ showFilterModal: true }) } 
//               style={styles.filterButton}
//             >
            
//               <Icon 
//                 name="filter-outline" 
//                 size={15} 
//                 color='#fff'
//               />
            
//             </TouchableOpacity>
//           </View>

//         </View>

      
    
          
//   )
// }

// }

////////////
////////////
///////////


// return (
      
//   <Modal
//   animationType="slide"
//   transparent={false}
//   visible={this.state.showFilterModal}
//   onRequestClose={() => {
//     Alert.alert('Modal has been closed.');
//   }}
//   >

//     <ScrollView style={{flex: 1, marginTop: 22, }} contentContainerStyle={[styles.filterModalContainer, {backgroundColor: '#fff'}]}>

//         <View style={{padding: 5}}>
//         <Button  
//           buttonStyle={styles.hideModalButtonStyle}
//           icon={{name: 'chevron-left', type: 'material-community'}}
//           title='Back'
//           onPress={() => {
//               this.setState( {showFilterModal: false} );
//             }}
//         />
//         </View>

//         <View style={styles.searchBarAndIconContainer}>

//           <View style={styles.searchBarContainer}>
//             <Hoshi
//                     style={{ width: 250, backgroundColor: '#fff' }}
//                     label={'What Brand, Type, or Size?'}
//                     labelStyle={ {color: rejectRed} }
//                     value={this.state.brandSearchTerm}
//                     onChangeText={(brandSearchTerm)=>{this.setState({ brandSearchTerm })}}
//                     borderColor={treeGreen}
//                     inputStyle={{ color: 'black', fontWeight: '400', fontFamily: avenirNext }}
//                     autoCorrect={false}
                    
//             />
//           </View> 

//           <View style={styles.clearSearchIconContainer}>
//           <Icon name="close" 
//                           size={40} 
//                           color={'#800000'}
//                           onPress={ () => this.setState({brandSearchTerm: ''})}
//             />
//           </View>   


        
//         </View>
      
//       <Text style={[styles.headerText, {color: treeGreen}]}>Brands</Text>
//       <ScrollView style={{flex: 1, backgroundColor: '#122021'}} contentContainerStyle={[styles.filterScrollContainer, {backgroundColor: '#122021'}]}>

//         {brands.length > 0? 
//           <SelectMultiple
//             items={brands}
//             selectedItems={this.state.selectedBrands}
//             onSelectionsChange={(selectedBrands) => this.setState({ selectedBrands })} 
//           />
//         :
//           <Text>{noResultsFromSearchForSpecificCategoryText}</Text>
//         }

//       </ScrollView>
//       <Text style={[styles.headerText, {color: 'black'}]}>Types</Text>
//       <ScrollView contentContainerStyle={styles.filterScrollContainer}>

//         {types.length > 0? 
//           <SelectMultiple
//             items={types}
//             selectedItems={this.state.selectedTypes}
//             onSelectionsChange={(selectedTypes) => this.setState({ selectedTypes })} 
//           />
//         :
//           <Text>{noResultsFromSearchForSpecificCategoryText}</Text>
//         }

//       </ScrollView>  
//       <Text style={[styles.headerText, {color: optionLabelBlue}]}>Sizes</Text>
//       <ScrollView contentContainerStyle={styles.filterScrollContainer}>

//         {sizes.length > 0? 
//           <SelectMultiple
//             items={sizes}
//             selectedItems={this.state.selectedSizes}
//             onSelectionsChange={(selectedSizes) => this.setState({ selectedSizes })} 
//           />
//         :
//           <Text>{noResultsFromSearchForSpecificCategoryText}</Text>
//         }

//       </ScrollView>  

      

                  

//         <View style={{padding: 5}}>
//         <Button  
//           buttonStyle={styles.confirmFiltersButtonStyle}
//           icon={{name: 'filter', type: 'material-community'}}
//           title='Confirm Selection'




//           onPress={() => {
//               this.getPageSpecificProducts(extractValuesFrom(selectedBrands), extractValuesFrom(selectedTypes), extractValuesFrom(selectedSizes));
//               this.setState( {showFilterModal: false} );
//             }}
//         />
//         </View>

//         <View style={{padding: 5}}>
//         <Button  
//           buttonStyle={styles.removeFiltersButtonStyle}
//           icon={{name: 'filter-remove', type: 'material-community'}}
//           title='Remove Filters'
//           onPress={() => {
//               this.getPageSpecificProducts([],[],[]);
//               this.setState( {selectedBrands: [], selectedTypes: [], selectedSizes: [], showFilterModal: false} );
//             }}
//         />
//         </View>
        
        
//     </ScrollView>
  
// </Modal>
// )
  // //switch between collapsed and expanded states
  // toggleExpanded = () => {
  //   this.setState({ collapsed: !this.state.collapsed });
  // };

  // setSectionL = section => {
  //   this.setState({ activeSectionL: section });
  // };

  // setSectionR = section => {
  //   this.setState({ activeSectionR: section });
  // };



  // renderHeader = (section, _, isActive) => {
  //   return (
  //     <View
        
  //       style={[styles.card, section.isActive ? styles.active : styles.inactive]}
        
  //     >

  //       <View style={styles.productImageContainer}>
  //           <View style={styles.likesRow}>
  //             {/* if this product is already in your collection, you have the option to dislike the product,
  //                 reducing its total number of likes by 1,
  //                 and remove it from your collection. If not already in your collection, you may do the opposite. */}
  //             {this.state.collectionKeys.includes(section.key) ? 
  //               <Icon name="heart" 
  //                         size={25} 
  //                         color='#800000'
  //                         onPress={() => {this.decrementLikes(section.text.likes, section.uid, section.key)}}
                          

  //               /> 
  //             :  
  //               <Icon name="heart-outline" 
  //                         size={25} 
  //                         color='#800000'
  //                         onPress={() => {this.incrementLikes(section.text.likes, section.uid, section.key)}}

  //               />
  //             }

  //             <Text style={styles.likes}>{section.text.likes}</Text>
  //           </View>
  //           {section.text.sold ? 
  //             <View style={styles.soldTextContainer}>
  //               <Text style={styles.soldText}>SOLD</Text>
  //               <Image 
  //               source={{uri: section.uris[0]}}
  //               style={styles.productImage} 
  //               />
  //             </View>
              
  //            :
  //            <Image 
  //               source={{uri: section.uris[0]}}
  //               style={styles.productImage}
  //            />
  //           }  
  //       </View>

  //       {section.text.original_price > 0 ?
  //         <View style= { styles.headerPriceMagnifyingGlassRow }>
            
  //           <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
  //             <Text style={styles.original_price} >
  //               £{section.text.original_price}
  //             </Text>
  //             <Text style={styles.price} >
  //               £{section.text.price}
  //             </Text>
  //           </View>

  //           {section.isActive? 
  //             <Icon name="chevron-up" 
  //                   size={30} 
  //                   color='black'
  //             />
  //           :
  //             <Icon name="chevron-down" 
  //                   size={30} 
  //                   color='black'
  //             />
  //           }
            

  //         </View>        
  //       :
  //         <View style= { styles.headerPriceMagnifyingGlassRow }>
            
  //           <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
  //             <Text style={styles.price} >
  //               £{section.text.price}
  //             </Text>
  //           </View>

  //           {isActive? 
  //             <Icon name="chevron-up" 
  //                   size={30} 
  //                   color='black'
  //             />
  //           :
  //             <Icon name="chevron-down" 
  //                   size={30} 
  //                   color='black'
  //             />
  //           }
            
            
  //         </View>
  //       }  

                

  //     </View>
  //   );
  // };

  // renderContent = (section, _, isActive) => {
  //   return (
  //     <Animatable.View
  //       duration={400}
  //       style={[styles.contentCard, isActive ? styles.active : styles.inactive]}
  //       transition="backgroundColor"
  //     >
          
        
  //       <Animatable.View style={styles.priceMagnifyingGlassRow} transition='backgroundColor'>
  //         <Animatable.Text style={styles.brand} animation={isActive ? 'bounceInRight' : undefined}>
  //           {section.text.brand}
  //         </Animatable.Text>
  //         <Icon name="magnify" 
  //               size={30} 
  //               color={limeGreen}
  //               onPress={ () => { 
  //                   console.log('navigating to full details');
  //                   this.navToProductDetails(section, this.state.collectionKeys, this.state.productKeys); 
  //                   }}  
  //         />
  //       </Animatable.View>  
        
  //       <Animatable.Text style={styles.size} animation={isActive ? 'bounceInLeft' : undefined}>
  //         Size: {section.text.size}
  //       </Animatable.Text>
        
  //     </Animatable.View>
  //   );
  // }

  // // setFilterSection = section => {
  // //   this.setState({ activeFilterSection: section });
  // // };

  // renderFilterHeader = (section, _, isActive) => {
  //   return (
  //     <Animatable.View
  //       duration={300}
  //       style={[styles.headerFilterCard, isActive ? styles.active : styles.inactive]}
  //       transition="backgroundColor"
  //     >

  //       <Text style={styles.headerFilterText}>
  //         {section.header}
  //       </Text>
  //       {isActive? 
  //         <Icon name="chevron-up" 
  //               size={30} 
  //               color='black'
  //         />
  //       :
  //         <Icon name="chevron-down" 
  //               size={30} 
  //               color='black'
  //         />
  //       }
  //     </Animatable.View>
  //   )
  // }

  // renderFilterContent = (section, _, isActive) => {

  //   if(section.header == "Brand") {
  //     return (
  //       <ScrollView contentContainerStyle={styles.contentContainerStyle}>
  //         <Animatable.View
  //         duration={300}
  //         style={[styles.contentFilterCard, isActive ? styles.active : styles.inactive]}
  //         transition="backgroundColor"
  //       >
  //         {section.values.map( (value, index) => (
  //           <Animatable.Text 
  //             onPress={()=>{this.getPageSpecificProducts(value, section.header); this.setState({showFilterModal: false})}} 
  //             style={styles.contentFilterText} animation={isActive ? 'bounceInDown' : undefined}
  //           >
  //             {value}
  //           </Animatable.Text>
  //         ))}
  //       </Animatable.View>
  //     </ScrollView>
  //     )
  //   }
  //   return (
  //     <Animatable.View
  //       duration={300}
  //       style={[styles.contentFilterCard, isActive ? styles.active : styles.inactive]}
  //       transition="backgroundColor"
  //     >
  //       {section.values.map( (value, index) => (
  //         <Animatable.Text 
  //           onPress={()=>{this.getPageSpecificProducts(value, section.header); this.setState({showFilterModal: false})}} 
  //           style={styles.contentFilterText} animation={isActive ? 'bounceInDown' : undefined}
  //         >
  //           {value}
  //         </Animatable.Text>
  //       ))}
  //     </Animatable.View>
  //   )
  // }



// brands.map((brand, index,) => (
//   <View style={styles.filterOptionRow} key={index}>
  
//     <Text onPress={() => {
//       this.getPageSpecificProducts(brand, chosenType = '', chosenSize = '');
//       this.setState({showFilterModal: false})}}
//     >
//       {brand}
//     </Text>
//   </View>
// ))

//now that we have the actual list of products we'd like to work with:
        //extract the values which shall represent the filter choices only for the brands,
        //provide all values for type and size
        //TODO: screen to show 'no products match your search'
        // console.log(all);
        // for(var i = 1; i < all.length ; i++) {
        //   filters[0].values.push(all[i].text.brand);
        //   filters[1].values.push(all[i].text.type);
        //   filters[2].values.push(all[i].text.size);
        //   if(i == all.length - 1) {
        //     //remove all duplicate values from these categories
        //     filters[0].values = filters[0].values.filter(onlyUnique);
        //     filters[1].values = filters[1].values.filter(onlyUnique);
        //     filters[2].values = filters[2].values.filter(onlyUnique);
        //   }
        // }

        // if(selectedValue && category) {
        //   //filter for a specific value based on the category selected.
        //   switch(category) {
        //     case "Brand":
        //       all = all.filter( (product) => product.text.brand == selectedValue )
        //       break;
        //     case "Type":
        //       all = all.filter( (product) => product.text.type == selectedValue )
        //       break;
        //     case "Size":
        //       all = all.filter( (product) => product.text.size == selectedValue )
        //       break;
        //     default:
        //       break;
        //   }
          
        // }


{/* <Image
            
            style={{width: 150, height: 150}}
            source={ {uri: product.uri} }/> */}

            // refreshControl = {
            //   <RefreshControl 
            //     refreshing={this.state.refreshing} 
            //     onRefresh={() => {this.getProducts();}}

            //     />}
            // <Button
            
            // buttonStyle={{
            //     backgroundColor: "#000",
            //     width: 100,
            //     height: 40,
            //     borderColor: "transparent",
            //     borderWidth: 0,
            //     borderRadius: 5
            // }}
            // icon={{name: 'credit-card', type: 'font-awesome'}}
            // title='BUY'
            // onPress = { () => { navigate('CustomChat', {key: '-LLEL8jZIaK_AmjuXhUb'}) } }

            // />


            // <Accordion
            //   activeSection={this.state.activeFilterSection}
            //   sections={filters}
            //   touchableComponent={TouchableOpacity}
            //   renderHeader={this.renderFilterHeader}
            //   renderContent={this.renderFilterContent}
            //   duration={100}
            //   onChange={this.setFilterSection}
            // />


            // <SearchBar
              
            //   clearIcon={{ color: 'gray' }}
            //   searchIcon={{ size: 20 }}
            //   onChangeText={(brandSearchTerm)=>{this.setState({ brandSearchTerm })}}
            //   onClearText={()=>this.setState({brandSearchTerm: ''})}
            //   placeholder='What Brand, Type, or Size?'
            // />