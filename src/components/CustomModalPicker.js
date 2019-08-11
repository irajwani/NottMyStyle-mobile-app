import React, { Component } from 'react'
import { Dimensions, Text, View, Modal, TouchableHighlight, StyleSheet } from 'react-native'
import { material } from 'react-native-typography';
import { bobbyBlue, optionLabelBlue, avenirNext } from '../colors';

const {width} = Dimensions.get('window');

export default class CustomModalPicker extends Component {
    state = {
        modalVisible: false,
    };

    setModalVisible(visible) {
        this.setState({modalVisible: visible});
    }

  render() {
    return (
        <View style={{marginTop: 22}}>
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {
            Alert.alert('Modal has been closed.');
          }}>
          
          <View style={styles.modal}>
            <View>
              {this.props.children}

              <TouchableHighlight
                onPress={() => {
                  this.setModalVisible(!this.state.modalVisible);
                }}>
                <Text style={styles.hideModal}>Back</Text>
              </TouchableHighlight>
            </View>
          </View>
        </Modal>
        
        <TouchableHighlight
          onPress={() => {
            this.setModalVisible(true);
          }}>
          <Text style={styles.selectedOption}>{this.props.subheading}</Text>
        </TouchableHighlight>
      </View>
    )
  }
}

const styles = StyleSheet.create({
    modal: {flexDirection: 'column', justifyContent: 'center', alignContent: 'center', alignItems: 'center', padding: 30, marginTop: 22},
    hideModal: {
      fontFamily: avenirNext,
      fontSize: 20,
      color: 'green',
      fontWeight:'bold',
      textAlign: 'center'
    },
    selectedOption: {
      fontFamily: 'Avenir Next',
      fontSize: 19,
      color: optionLabelBlue
    }
})