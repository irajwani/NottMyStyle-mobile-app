import React, { Component } from 'react'
import { Text, View, Image, Dimensions, StyleSheet, Animated } from 'react-native'

export default class ProgressiveImage extends Component {

  thumbnailAnimated = new Animated.Value(0);
  imageAnimated = new Animated.Value(0);

  handleThumbnailLoad = () => {
    Animated.timing(this.thumbnailAnimated, {
      toValue: 1,
    }).start();
  }

  handleImageLoad = () => {
    Animated.timing(this.imageAnimated, {
      toValue: 1,
    }).start();
  }

  render() {
    const {
        thumbnailSource,
        source,
        style,
        ...props
      } = this.props;

    return (  
    <View style={styles.container}>
        <Animated.Image
          {...props}
          source={thumbnailSource}
          style={style}
          blurRadius={20}
          onLoad={this.handleThumbnailLoad}
        />
        <Animated.Image
          {...props}
          source={source}
          style={[styles.imageOverlay, style]}
          onLoad={this.handleImageLoad}
        />
    </View>
    )
  }
}

const styles = StyleSheet.create({
    imageOverlay: {
        position: 'absolute',
        // left: 0,
        // right: 0,
        // bottom: 0,
        // top: 0,
      },
      container: {
        // backgroundColor: '#e1e4e8',
      },
})
