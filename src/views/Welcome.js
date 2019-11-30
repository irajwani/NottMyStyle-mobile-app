import React, { Component, Fragment } from 'react'
import { SafeAreaView, ImageBackground,Text, View, TouchableOpacity, StyleSheet } from 'react-native' 
import { Images, Metrics, Fonts } from '../Theme';
import { textStyles } from '../styles/textStyles';
import { mantisGreen, limeGreen, fbBlue } from '../colors';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { evenShadow } from '../styles/shadowStyles';


const {platform,screenWidth} = Metrics
const WelcomeButton = ({backgroundColor, text, color, icon = false, onPress}) => (
    <TouchableOpacity style={[styles.welcomeButton, {backgroundColor}, platform == "ios" ? evenShadow : null]} onPress={onPress}>
        {icon &&
        <View style={{flex: 0.15, justifyContent: 'center', alignItems: 'center', paddingVertical: 15, paddingHorizontal: 10,}}>
            <Icon
            name="facebook" 
            size={35} 
            color={'white'}
            />
        </View>
        }
        <View style={{flex: icon ? 0.85 : 1, justifyContent: 'center', alignItems: icon ? 'flex-start' : 'center', paddingVertical: 15, paddingHorizontal: 2,}}>
            <Text style={{...textStyles.generic, ...Fonts.big, color, letterSpacing: 1.2, fontWeight: "200"}}>{text}</Text>
        </View>
    </TouchableOpacity>
)

class Welcome extends Component {
    constructor(props) {
        super(props);

    }

    renderButtons = () => {
        return (
            <Fragment>
                <WelcomeButton 
                onPress={()=>{this.props.navigation.navigate('SignIn')}}
                backgroundColor={limeGreen} text={"Log in to your account"} color={'black'}

                />

                <WelcomeButton 
                onPress={()=>{this.props.navigation.navigate('SignIn')}}
                backgroundColor={fbBlue} text={"Sign up with facebook"} color={'#fff'} icon={true}
                    
                />

                <WelcomeButton 
                onPress={()=>{this.props.navigation.navigate('SignIn')}}
                backgroundColor={'black'} text={"Create New Account"} color={'#fff'}
                    
                />

            </Fragment>
        )
    }

    render() {
        return (
            <SafeAreaView style={{flex: 1}}>
            <ImageBackground source={Images.loginBg} style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 25}}>
                {this.renderButtons()}
            </ImageBackground>
            </SafeAreaView>
        )
    }
}

export default Welcome

const styles = StyleSheet.create({
    welcomeButton: {
        width: 0.8*screenWidth, flexDirection: 'row', borderRadius: 25, margin: 10, 
         
    },
})
