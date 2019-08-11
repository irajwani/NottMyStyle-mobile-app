import React, { Component } from 'react'
import Products from '../components/Products';
import { withNavigation } from 'react-navigation'; 

class SoldProducts extends Component {
  render() {
    return (
      
        <Products showYourProducts={false} showSoldProducts={true}/>
      
    )
  }
}

export default withNavigation(SoldProducts);

////you may navigate to this component from the profile page's sold items button.