import {StyleSheet} from 'react-native';
import { mantisGreen, darkGreen } from '../colors';

const generic = {
    fontFamily: 'Avenir Next',
    fontSize: 18,
    fontWeight: "300"
}

const textStyles = StyleSheet.create({
    nothingHere: {
        ...generic,
        fontSize: 18,
        color: 'black',
        
    },

    submit: {
        ...generic,
        fontSize: 24,
        color: '#fff',
    },

    information: {
        ...generic,
        color: darkGreen,
        fontWeight: "600",
        fontSize: 22,

    },

    generic: generic
})

export {textStyles}