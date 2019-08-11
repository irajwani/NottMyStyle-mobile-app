import {createSwitchNavigator} from 'react-navigation'
import { SignUpToCreateProfileStack } from '../stackNavigators/signUpToCreateProfileStack';
import HomeScreen from '../views/HomeScreen';
import AuthLoadingScreen from '../views/AuthLoadingScreen';

const AuthOrAppSwitch = createSwitchNavigator(
    {
        AuthStack: SignUpToCreateProfileStack,
        AuthLoadingScreen: AuthLoadingScreen,
        AppStack: HomeScreen,
    },
    {initialRouteName: 'AuthLoadingScreen'}
)

export default AuthOrAppSwitch