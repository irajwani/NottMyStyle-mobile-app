import React, { Component } from 'react'
import { Text, StyleSheet, SafeAreaView, View, ScrollView, TouchableOpacity, Dimensions } from 'react-native'
// import { Jiro } from 'react-native-textinput-effects';
import { darkGray, silver } from '../colors';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { avenirNextText } from '../constructors/avenirNextText';
import { GrayLine, WhiteSpace } from '../localFunctions/visualFunctions';
import { conditions } from '../fashion/sizesAndTypes';
import { textStyles } from '../styles/textStyles';

// const categories = [0,1,2]

const {width} = Dimensions.get('screen')

const generateTypesBasedOn = (category) => {
    var types;
    switch(category) {
        case 0:
            types = ["Formal Shirts", "Casual Shirts", "Coats & Jackets", "Suits", "Trousers", "Jeans", "Socks", "Shoes"];
            break;
        case 1:
            types = ["Coats & Jackets", "Pullovers & Sweaters", "Dresses", "Skirts", "Tops & T-Shirts", "Pants", "Swimwear & Beachwear", "Socks", "Shoes"];
            break;
        case 2:
            types = ["Watches", "Bracelets", "Jewellery", "Sunglasses", "Handbags"];
            break;
        default:
            types = ["Formal Shirts", "Casual Shirts", "Coats & Jackets", "Suits", "Trousers", "Jeans", "Shoes"];
            break;
    }
    return types;
}

const mensUpperWear = ["XS / 30-32", "S / 34-36", "M / 38-40", "L / 42-44", "XL / 46", "XXL / 48", "XXXL / 50", "4XL / 52", "5XL / 54", "6XL / 56", "7XL / 58", "8XL / 60"];
const mensFootWear = ["5 / 6", "6 / 7", "6.5 / 7.5", "7 / 8", "7.5 / 8.5", "8 / 9", "8.5 / 9.5", "9 / 10", "9.5 / 10.5", "10 / 11", "10.5 / 11.5", "11 / 12", "12 / 13", "13 / 14", "14 / 15", "15 / 16"];
const womenUpperWear = ["XXS / 2 / 00","2 / 00 petite", "XXS / 4 / 0", "4 / 0 petite", "XS / 6 / 2","6 / 2 petite", "S / 8 / 4", "8 / 4 petite", "S / 10 / 6", "10 / 6 petite", "M / 12 / 8", "12 / 8 petite", "M / 14 / 10", "14 / 10 petite", "L / 16 / 12", "16 / 12 petite", "L / 18 / 14", "18 / 14 petite", "1X / 20 / 16", "20 / 16 petite", "1X / 22 / 18", "22 / 18 petite", "2X / 24 / 20", "24 / 20 petite", "3X / 26 / 22", "26 / 22 petite", "3X / 28 / 24", "28 / 24 petite", "4X / 30 / 26", "30 / 26 petite", "One size"];
const womenFootWear = ["2 / 4", "2.5 / 4.5", "3 / 5", "3.5 / 5.5", "4 / 6", "4.5 / 6.5", "5 / 7", "5.5 / 7.5", "6 / 8", "6.5 / 8.5", "7 / 9", "7.5 / 9.5", "8 / 10", "8.5 / 10.5", "9 / 11", "10 / 11.5-12"];

const generateSizesBasedOn = (type, category) => {
    var sizes;
    switch(category) {
        case 0:
            switch(type) {
                case "Formal Shirts" || "Coats & Jackets" || "Casual Shirts" || "Suits" || "Trousers" || "Jeans":
                    sizes = mensUpperWear;
                    break;
                case "Shoes":
                    sizes = mensFootWear;
                    break;
                default:
                    sizes = mensUpperWear;
                    break;  
            }
        break;
        case 1:
            switch(type) {
                case "Shoes" || "Socks":
                    sizes = womenFootWear;
                    break;
                default:
                    sizes = womenUpperWear;
                    break;
            }
        break;
        //for now, no sizes for accessories, person does not see size option for accessory. Vinted offers user selection of colors instead.
        default:
            sizes = mensUpperWear
            break;

    }
    return sizes;
}


export default class ConditionSelection extends Component {
  constructor(props) {
      super(props);
      this.state = {
      }
  }

  
  navToCreateItem = (detailType, value) => {
      //use switch to have 3 nav options
      if(detailType == 'condition') {  
        this.props.navigation.navigate('CreateItem', {condition: value});
      }

      else if(detailType == 'size') {
        this.props.navigation.navigate('CreateItem', {size: value});
      }

      else {
        this.props.navigation.navigate('CreateItem', {type: value});
      }
          
  }

  render() {
    const {navigation} = this.props;
    var showProductTypes = navigation.getParam("showProductTypes", false);
    var gender = navigation.getParam("gender", 0); //For "Men" by default
    
    
    var types = generateTypesBasedOn(gender);

    var showProductSizes = navigation.getParam("showProductSizes", false)
    var type = navigation.getParam("type","Coats & Jackets") //Men coats and jackets anyway
    var sizes = generateSizesBasedOn(type,gender) //just generate an array of size options by default anyway
    // types.map( (t, index) => console.log(t,index) )
    // conditions.map( (t, index) => console.log(t,index) )

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
        </View>

        <View style={{height: 1, backgroundColor: silver}}/>

        

            {showProductTypes ?
            <ScrollView style={styles.selectionContainer} contentContainerStyle={styles.typesContainer}>
                    {types.map( (t, index) => 
                        <View key={index} style={styles.conditionRow}>
                            <TouchableOpacity underlayColor={'#fff'} onPress={()=>this.navToCreateItem('type', t)}>
                                <Text style={[styles.condition, {fontSize: 22}]}>{t}</Text>
                            </TouchableOpacity>
                            

                        </View>
                
                    )
                    }
            </ScrollView>
            :
                showProductSizes ?
                    <ScrollView style={styles.selectionContainer} contentContainerStyle={styles.typesContainer}>
                        <View style={styles.sizesInfo}>
                            <Text style={[styles.sizesInfoText, {textAlign: 'center'}]}>
                                NottMyStyle uses the following size formats: UK / US or International / UK / US.
                            </Text>
                        </View>
                        {
                            sizes.map( (s, index) => 
                                <View key={index} style={styles.conditionRow}>
                                    
                                    <TouchableOpacity underlayColor={'#fff'} onPress={()=>this.navToCreateItem('size', s)}>
                                        <Text style={styles.condition}>{s}</Text>
                                    </TouchableOpacity>
                                    
                                </View>
                            )
                        }
                    </ScrollView>
                :
                    <View style={styles.selectionContainer}>
                        {conditions.map( (c, index) => 
                            
                            <View key={index} style={styles.conditionRow}>
                                <TouchableOpacity underlayColor={'#fff'} onPress={()=>this.navToCreateItem('condition', c)}>
                                    <Text style={styles.condition}>{c}</Text>
                                </TouchableOpacity>
                                
                            </View>
                        
                        )
                        }
                    </View>    


            }

        
        
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

    // saveText: new avenirNextText('black',22,'400'),

    selectionContainer: {
        // backgroundColor: 'red',
        flex: 0.91,
        // paddingHorizontal: 3,
        // paddingVertical: 4,
        // justifyContent: 'space-evenly'
    },

    typesContainer: {
        flexGrow: 4,
        // justifyContent: 'center',
        alignItems: 'flex-start',
    },

    conditionRow: {
        backgroundColor: '#fff',
        // margin: 10,
        // borderRadius: 15,
        borderBottomWidth: 0.7,
        borderColor: silver,
        // justifyContent: 'center', 
        // paddingLeft: 8, 
        padding: 8,
        // paddingHorizontal: 5, paddingVertical: 3, 
        // width: width - 30,
        width: width,
        // shadowOpacity: 1,
        // shadowRadius: 0.5,
        // shadowColor: 'black',
        // shadowOffset: {width: -1, height: 1},
    },

    condition: {
        fontFamily: 'Avenir Next',
        fontSize: 22,
        fontWeight: '300',
        color: 'black'
    },

    sizesInfo: {
        paddingHorizontal: 5,
        paddingVertical: 2,
    },

    sizesInfoText: {
        ...textStyles.generic,
        color: darkGray,
        fontSize: 15
    },
})
