import React, { Component } from 'react'
import Products from '../components/Products';
import {withNavigation} from 'react-navigation';

class OtherUserProducts extends Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const {otherUser} = this.props.navigation.state.params;
        return <Products showOtherUserProducts={true} otherUser={otherUser}/>
        
    }
}

export default withNavigation(OtherUserProducts)
