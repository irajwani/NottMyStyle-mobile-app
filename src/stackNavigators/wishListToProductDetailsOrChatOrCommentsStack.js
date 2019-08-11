import { createStackNavigator } from 'react-navigation';
import {Animated, Easing} from 'react-native';
import Collection from '../views/Collection';
import ProductDetails from '../views/ProductDetails';
import CustomChat from '../views/CustomChat';
import YourProducts from '../views/YourProducts';
import OtherUserProfilePage from '../views/OtherUserProfilePage';
import UserComments from '../views/UserComments';
import ProductComments from '../views/ProductComments';
import CreateItem from '../views/CreateItem';
import ConditionSelection from '../views/ConditionSelection';
import PriceSelection from '../views/PriceSelection';

import OtherUserProducts from '../views/OtherUserProducts';
import OtherUserSoldProducts from '../views/OtherUserSoldProducts';


export const wishListToProductDetailsOrChatOrCommentsStack = createStackNavigator({
    Collection: Collection,
    YourProducts: YourProducts,
    ProductDetails: ProductDetails,
    CreateItem: CreateItem,
    PriceSelection: PriceSelection,
    ConditionSelection: ConditionSelection,
    ProductComments: ProductComments,
    OtherUserProfilePage: OtherUserProfilePage,
    UserComments: UserComments,
    CustomChat: CustomChat,
    OtherUserProducts,
    OtherUserSoldProducts,
},
{
    initialRouteName: 'Collection',
    headerMode: 'none',
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps;
        const { index } = scene;

        const height = layout.initHeight;
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        });

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        });

        return { opacity, transform: [{ translateY }] };
      },
    }),
}
)
