import React, { Component } from 'react';
import {View, Image, TouchableOpacity, Platform, Dimensions, StyleSheet} from 'react-native'
import styled from "styled-components/native"; // 3.1.6
import Carousel, {Pagination} from 'react-native-snap-carousel'; // 3.6.0
import { graphiteGray, mantisGreen, lightGray } from '../colors';
// import { iOSColors } from 'react-native-typography';

const {width, height} = Dimensions.get('window');

class FullScreenCarousel extends Component {

  constructor(props){
    super();
    this.state = {
      errors: [],
      activeSlide: 0,
    }
    this.props = props;
    this._carousel = {};
  }

  handleSnapToItem(index){
    // console.log("snapped to ", index);
    this.setState({ activeSlide: index });
  }

  _renderItem = ( {item, index} ) => {
    // console.log("rendering,", index, item)
    return (
      

        <TouchableOpacity
            
            underlayColor={'transparent'}
            onPress={ () => { 
              // console.log("clicked to index", index)
              this._carousel.snapToItem(index);
            }}
        >
            <Image 
            source={{ uri: item }} 
            style={Platform.OS == 'ios' ? styles.iosImage : styles.androidImage}

            />
        </TouchableOpacity>
        
        
       

        

        
    );
  }

  get pagination () {
    const { activeSlide } = this.state;
    const {data} = this.props;
    return (
        <Pagination
          dotsLength={data.length}
          activeDotIndex={activeSlide}
          containerStyle={{ backgroundColor: '#fff' }}
          dotStyle={{
              // width: 10,
              // height: 10,
              // borderRadius: 5,
              // marginHorizontal: 8,
              backgroundColor: mantisGreen
          }}
          inactiveDotStyle={{
              backgroundColor: lightGray
              // Define styles for inactive dots here
          }}
          inactiveDotOpacity={0.4}
          inactiveDotScale={0.6}
        />
    );
}

  render = () => {
    //const { params } = this.props.navigation.state;
    

    // console.log("videos: updating")

    return (

      
        <Carousel
          ref={ (c) => { this._carousel = c; } }
          data={this.props.data}
          renderItem={this._renderItem.bind(this)}
          onSnapToItem={this.handleSnapToItem.bind(this)}
          sliderWidth={300}
          itemWidth={256}
          layout={'default'}
          firstItem={0}
        />
      
        
      

    );
  }
}

export default FullScreenCarousel;

const styles = StyleSheet.create({
  iosImage: {width: 256,height: 420, borderWidth: 2,borderColor: "#2c2d2d",},
  androidImage: {width: 256,height: 400, borderWidth: 2,borderColor: "#2c2d2d",}
})


const VideoTitleText = styled.Text`
  color: white;
  top: 28;
  justify-content: center;
`

const CarouselBackgroundView = styled.View`
  background-color: #fff;
  ${'' /* 500, 400 */}
  height: 100%;
  width: 100%;
`

const ThumbnailBackgroundView = styled.View`
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%; 
`;

const CurrentVideoTO = styled.TouchableOpacity`
`

const CurrentVideoImage = styled.Image`
  ${'' /* top: 5; */}
  ${'' /* box-shadow: 5px 10px; */}
  ${'' /* 275 */}
  width: 99%;
  ${'' /* 400 */}
  height: 99%; 
  border-radius: 0;
  border-width: 1;
  border-color: gray
`;


// #156820