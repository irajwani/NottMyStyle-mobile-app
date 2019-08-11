import { createStackNavigator } from 'react-navigation';
import {Animated, Easing} from 'react-native';

import ProfilePage from '../views/ProfilePage';
// import EditProfile from '../views/EditProfile';
import MultiplePictureCamera from '../components/MultiplePictureCamera';
import MultipleAddButton from '../components/MultipleAddButton';
import YourProducts from '../views/YourProducts';
import SoldProducts from '../views/SoldProducts';
import CreateItem from '../views/CreateItem';
// import Users from '../views/Users';
import UserComments from '../views/UserComments';
import Settings from '../views/Settings';
// import ViewPhotos from '../views/ViewPhotos';
import OtherUserProfilePage from '../views/OtherUserProfilePage';
import CreateProfile from '../views/CreateProfile';
import ConditionSelection from '../views/ConditionSelection';
import PriceSelection from '../views/PriceSelection';
import CameraForEachPicture from '../components/CameraForEachPicture';

import OtherUserProducts from '../views/OtherUserProducts';
import OtherUserSoldProducts from '../views/OtherUserSoldProducts';


export const profileToEditProfileStack = createStackNavigator({
    ProfilePage: ProfilePage,
    Settings: Settings,
    CreateProfile: CreateProfile,
    MultipleAddButton: MultipleAddButton,
    MultiplePictureCamera: MultiplePictureCamera,
    CameraForEachPicture: CameraForEachPicture,
    // ViewPhotos: ViewPhotos,
    YourProducts: YourProducts,
    SoldProducts: SoldProducts,
    CreateItem: CreateItem,
    PriceSelection: PriceSelection,
    ConditionSelection: ConditionSelection,
    UserComments: UserComments,
    OtherUserProfilePage: OtherUserProfilePage,
    OtherUserProducts,
    OtherUserSoldProducts,
},
{   
    initialRouteName: 'ProfilePage',
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
  })

