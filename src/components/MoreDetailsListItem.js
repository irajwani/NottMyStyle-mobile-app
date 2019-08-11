import React, { Component } from 'react'
import { StyleSheet, Text, View, Dimensions } from 'react-native'
import { iOSColors } from 'react-native-typography';

var {height, width} = Dimensions.get('window');

export default class MoreDetailsListItem extends Component {
  render() {
    const {key, value} = this.props;
    
    console.log( value, key )
    return (
      <View style={styles.container}>
        <View style={ styles.keyContainer }>
            <Text style={styles.keyText}>{key}</Text>
        </View>
        <View style={ styles.valueContainer }>
            <Text style={styles.valueText}>{value}</Text>
        </View>
      </View>
    )
  }
}

const styles = StyleSheet.create( {
    dalmationContainer: {
        flexDirection: 'row',
        padding: 5,
        justifyContent: 'space-evenly'
    },

    keyContainer: {
        width: (width/2) - 30,
        height: 40,
        padding: 5,
        justifyContent: 'center',
        backgroundColor: iOSColors.customGray
    },

    valueContainer: {
        width: (width/2),
        height: 40,
        padding: 5,
        justifyContent: 'center',
        backgroundColor: iOSColors.black
    },

    keyText: {
        color: iOSColors.black,

    },

    valueText: {
        color: iOSColors.white,

    },
} )