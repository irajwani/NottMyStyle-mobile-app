import React from 'react';
import Comments from './Comments';
import {withNavigation} from 'react-navigation';

class UserComments extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return <Comments type={'user'} navigation={this.props.navigation}/>
    }
}

export default withNavigation(UserComments)