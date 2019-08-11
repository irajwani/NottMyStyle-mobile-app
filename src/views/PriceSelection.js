import React, { Component } from 'react'
import { Text, TextInput, StyleSheet, SafeAreaView, View, Keyboard, Platform } from 'react-native'
import { Jiro } from 'react-native-textinput-effects';
import { treeGreen, darkGray, lightGray } from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { avenirNextText } from '../constructors/avenirNextText';
import { CustomTextInput } from '../localFunctions/visualFunctions';

export default class PriceSelection extends Component {
  constructor(props) {
      super(props);
      this.state = {
          price: 0,
          original_price: 0,
          post_price: 0,
      }
  }
  
  navToCreateItem = (typeOfPrice) => {
      const {original_price, price, post_price} = this.state
      this.props.navigation.navigate('CreateItem', typeOfPrice == 'sellingPrice' ? {price: price} : typeOfPrice == 'retailPrice' ? {original_price: original_price} : {post_price: post_price});
  }

  render() {
    const {navigation} = this.props;
    const typeOfPrice = navigation.getParam('typeOfPrice', 'sellingPrice');
    // console.log(( (this.state.price > 0) && (Number.isFinite(this.state.price)) ) || ( (this.state.original_price > 0) && (Number.isFinite(this.state.original_price)) ));

    return (
      <SafeAreaView style={styles.mainContainer}>

        <View style={styles.topRow}>
            <View style={[styles.iconContainer, {justifyContent: 'center',alignItems: 'flex-start'}]}>
                <Icon 
                    name="chevron-left"
                    size={40}
                    color='black'
                    onPress={()=>this.props.navigation.goBack()}
                />
            </View>
            {( (this.state.price > 0) && (Number.isFinite(this.state.price)) ) || ( (this.state.original_price > 0) && (Number.isFinite(this.state.original_price)) ) || ( (this.state.post_price > 0) && (Number.isFinite(this.state.post_price)) ) ?
             <View style={[styles.iconContainer, {justifyContent: 'center', alignItems: 'flex-end'}]}>
                <Text style={styles.saveText} onPress={()=>this.navToCreateItem(typeOfPrice)}>Save</Text>
             </View> 
            : 
             null}    
        </View>

        <View style={{height: 1, backgroundColor: darkGray}}/>

        <View style={styles.selectionContainer}>

            <TextInput 
                placeholder={typeOfPrice == "sellingPrice" ? 'Selling Price (£)' : typeOfPrice == "retailPrice" ? 'Original price of this item (£)' : 'Estimated cost of postal services (£)'}
                placeholderTextColor={lightGray}
                value={typeOfPrice == "sellingPrice" ? this.state.price : typeOfPrice == "retailPrice" ? this.state.original_price : this.state.post_price}
                maxLength={typeOfPrice == "postPrice" ? 2 : 3}
                onChangeText={p => {
                    this.setState(typeOfPrice == "sellingPrice" ? { price: Number(p) } : typeOfPrice == "retailPrice" ? { original_price: Number(p)} : { post_price: Number(p)});
                }}
                style={new avenirNextText("black", 16, "500")}
                clearButtonMode={'while-editing'}
                underlineColorAndroid={"transparent"}
                
                keyboardType={Platform.OS == "ios" ? 'number-pad' : 'phone-pad'}
            />
        
            {/* <Jiro
                label={typeOfPrice == "sellingPrice" ? 'Selling Price (£)' : typeOfPrice == "retailPrice" ? 'Original price of this item (£)' : 'Estimated cost of postal services (£)'}
                value={typeOfPrice == "sellingPrice" ? this.state.price : typeOfPrice == "retailPrice" ? this.state.original_price : this.state.post_price}
                maxLength={typeOfPrice == "postPrice" ? 2 : 3}
                onChangeText={p => {
                    this.setState(typeOfPrice == "sellingPrice" ? { price: Number(p) } : typeOfPrice == "retailPrice" ? { original_price: Number(p)} : { post_price: Number(p)});
                    } }
                autoCorrect={false}
                // this is used as active border color
                borderColor={treeGreen}
                // this is used to set backgroundColor of label mask.
                // please pass the backgroundColor of your TextInput container.
                backgroundColor={'#F9F7F6'}
                inputStyle={{ fontFamily: 'Avenir Next', color: 'black' }}
                keyboardType='number-pad'
            /> */}
        
        
            
        </View>
        
      </SafeAreaView>
    )
  }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        // marginTop: 20,
        justifyContent: 'flex-start',
        // paddingVertical: 4,
        paddingHorizontal: 2,
        backgroundColor: '#fff',
    },

    topRow: {
        // backgroundColor: 'yellow',
        flex: 0.09,
        flexDirection: 'row',
        // justifyContent: 'space-between',
    },

    iconContainer: {
        flex: 0.5,
        paddingHorizontal: 2,
        
    },

    saveText: new avenirNextText('black',22,'400'),

    selectionContainer: {
        // backgroundColor: 'red',
        flex: 0.91,
        margin: 10,
        alignItems: 'stretch'
        // paddingHorizontal: 3,
        // paddingVertical: 2,
    },
})
