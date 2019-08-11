import React, {Component} from 'react';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { withNavigation, TabNavigator, TabBarBottom } from 'react-navigation'; // Version can be specified in package.json

import { profileToEditProfileStack } from '../stackNavigators/profileToEditProfileStack';
import { marketToProductDetailsOrChatOrCommentsStack } from '../stackNavigators/marketToProductDetailsOrChatOrCommentsStack';
import { multipleAddButtonToMultiplePictureCameraToCreateItemStack } from '../stackNavigators/createItemToPictureCameraStack';
import { wishListToProductDetailsOrChatOrCommentsStack } from '../stackNavigators/wishListToProductDetailsOrChatOrCommentsStack';
import { ChatsToCustomChatStack } from '../stackNavigators/chatsToCustomChatStack';
import { highlightGreen } from '../colors';
import { BadgeIcon, MarketplaceIcon } from '../localFunctions/visualFunctions';
// import firebase from '../cloud/firebase';
// import {unreadCount} from '../localFunctions/dbFunctions';

// const uid = firebase.auth().currentUser.uid;

const HomeScreen = TabNavigator(
            {

              
              Profile: profileToEditProfileStack,
              
              Market: marketToProductDetailsOrChatOrCommentsStack,
              
              Sell: multipleAddButtonToMultiplePictureCameraToCreateItemStack,
              
              Chats: ChatsToCustomChatStack,
              
              WishList: wishListToProductDetailsOrChatOrCommentsStack,
              
            },
            {
              navigationOptions: ({ navigation }) => ({
                
                tabBarIcon: ({ focused, tintColor }) => {
                  const { routeName } = navigation.state;
                  // const unreadCount = navigation.getParam('unreadCount', false);
                  // let unreadCount = false;
                  // setTimeout(() => {
                  //   let unreadCount = getUnreadCount(firebase.auth().currentUser.uid);
                  //   setInterval(() => {
                  //     unreadCount = getUnreadCount(firebase.auth().currentUser.uid);
                  //     console.log("Is it true that one deserves notification badge?" + unreadCount);
                  //   }, 20000);
                    
                  // }, 1);
                  //TODO: Is below susceptible to app crash upon lack of network?
                  // let unreadCount = getUnreadCount(firebase.auth().currentUser.uid);
                  let iconName;
                  let iconSize = 25;
                  if (routeName === 'Profile') {
                    iconName = focused ? 'account-circle' : 'account';
                    iconSize = focused ? 30 : 25;
                  } else if (routeName === 'Market') {
                    iconName = 'shopping';
                    iconSize = focused ? 30 : 25;
                    return <MarketplaceIcon strokeWidth={"8"} focused={focused}/>
                  } else if (routeName === 'Sell') {
                      iconName = focused ? 'plus-circle' : 'plus-circle-outline';
                      iconSize = focused ? 30 : 25;
                    }

                    else if (routeName === 'Chats') {
                      iconName = focused ? 'forum' : 'forum-outline';
                      iconSize = focused ? 30 : 25;
                      // IconComponent = BadgeIcon;
                      return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={true} />;
                    }

                    else if (routeName === 'WishList') {
                      iconName = 'basket';
                      iconSize = focused ? 30 : 25;
                    }
          
                  // You can return any component that you like here! We usually use an
                  // icon component from react-native-vector-icons
                  return <BadgeIcon name={iconName} size={iconSize} color={tintColor} unreadCount={false} />;
                  // return 
                },
              }),
              tabBarComponent: TabBarBottom,
              tabBarPosition: 'bottom',
              tabBarOptions: {
                activeTintColor: highlightGreen,
                inactiveTintColor: 'black',
                showLabel: false

              },
              animationEnabled: true,
              swipeEnabled: false,
            }
          ); 
        
    
export default HomeScreen;
