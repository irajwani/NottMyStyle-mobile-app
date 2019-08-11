import React, { Component } from 'react'
import { View } from 'react-native'
import { Button } from 'react-native-elements';

export default class BackButton extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <View style={ {flexDirection: 'row', justifyContent: 'center', alignContent: 'center', paddingVertical: 10} }>
                <Button  
                    buttonStyle={ {
                        backgroundColor: 'black',
                        width: 100,
                        height:40,
                        borderRadius: 10,
                    }}
                    icon={{name: 'chevron-left', type: 'material-community'}}
                    title='Back'
                    onPress={this.props.action} 
                />
            </View>
        )
    }
}
