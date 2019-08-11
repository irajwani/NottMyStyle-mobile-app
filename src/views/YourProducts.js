import React, { Component } from 'react'
import Products from '../components/Products';
import { withNavigation } from 'react-navigation'; 

class YourProducts extends Component {
  render() {
    return (
      
        <Products showYourProducts={true} />
      
    )
  }
}

export default withNavigation(YourProducts);

////you may navigate to this component from the profile page's sold items button.