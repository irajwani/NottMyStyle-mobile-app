import { createStackNavigator } from 'react-navigation';
import {Animated, Easing,} from 'react-native';
import CreateItem from '../views/CreateItem';
import MultipleAddButton from '../components/MultipleAddButton'
import MultiplePictureCamera from '../components/MultiplePictureCamera'
// import ViewPhotos from '../views/ViewPhotos'
import PriceSelection from '../views/PriceSelection'
import ConditionSelection from '../views/ConditionSelection'
import CameraForEachPicture from '../components/CameraForEachPicture';

export const multipleAddButtonToMultiplePictureCameraToCreateItemStack = createStackNavigator({

    CreateItem: CreateItem,
    // ViewPhotos: ViewPhotos,
    MultiplePictureCamera: MultiplePictureCamera,
    CameraForEachPicture: CameraForEachPicture,
    MultipleAddButton: MultipleAddButton,
    PriceSelection: PriceSelection,
    ConditionSelection: ConditionSelection,

}, {
    initialRouteName: 'CreateItem',
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
