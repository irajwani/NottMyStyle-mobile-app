import React, { Component } from 'react'
import Products from '../components/Products';
import {withNavigation} from 'react-navigation';

class OtherUserSoldProducts extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const {otherUser} = this.props.navigation.state.params;
        return <Products showOtherUserProducts={false} showOtherUserSoldProducts={true} otherUser={otherUser}/>
        
    }
}

export default withNavigation(OtherUserSoldProducts)
