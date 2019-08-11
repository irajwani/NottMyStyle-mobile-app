import React, { Component } from 'react'
import { Text, StyleSheet, View } from 'react-native'

export default class NothingHereYet extends Component {
  render() {
    return (
      <View>
        <Text style={{fontFamily: 'Avenir Next', color: 'black'}}>{this.props.specificText}</Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({})
