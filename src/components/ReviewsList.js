import React, { Component } from 'react'
import { Text, View, StyleSheet, Dimensions } from 'react-native'
import { iOSUIKit, human } from 'react-native-typography';
const {width} = Dimensions.get('window')
function timeSince(date) {

    var seconds = Math.floor((new Date() - date) / 1000);
  
    var interval = Math.floor(seconds / 31536000);
  
    if (interval > 1) {
        return interval + " years";
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 1) {
        return interval + " months";
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 1) {
        return interval + " days";
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 1) {
        return interval + " hours";
    }
    interval = Math.floor(seconds / 60);
    if (interval > 1) {
        return interval + " minutes";
    }
    return seconds == 0 ? "Just now" : Math.floor(seconds) + " seconds";
    
  }
export default class ReviewsList extends Component {
  render() {
    const {reviews} = this.props;
    return (
      <View style={ {backgroundColor: '#f2ece3'} }>
        {Object.keys(reviews).map(
                 (comment) => (
                 <View key={comment} style={styles.rowContainer}>
                    
                    <View style={styles.textContainer}>
                        <Text style={ styles.naam }> {reviews[comment].name} </Text>
                        <Text style={styles.comment}> {reviews[comment].text}  </Text>
                        <Text style={ styles.commentTime }> {timeSince(reviews[comment].time)} ago </Text>
                    </View>
                    <View style={styles.separator}/>   
                    
                 </View>
                 
            )
                     
             )}
      </View>
    )
  }
}

const styles = StyleSheet.create({
    naam: {
        ...iOSUIKit.caption2,
        fontSize: 11,
        color: '#37a1e8'

    },

    title: {
        ...human.headline,
        fontSize: 20,
        color: '#656565'
      },

    comment: {
        ...iOSUIKit.bodyEmphasized,
        fontSize: 25,
        color: 'black',
    },  

    commentTime: {
        fontSize: 12,
        color: '#1f6010'
    },

    rowContainer: {
        flexDirection: 'column',
        padding: 14
      },

    textContainer: {
    flex: 1,
    flexDirection: 'column',
    alignContent: 'center',
    padding: 5,
    },

    separator: {
    width: width,
    height: 2,
    backgroundColor: '#111110'
    },  
})