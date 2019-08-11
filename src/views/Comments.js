import React from 'react';
import {SafeAreaView, Keyboard, KeyboardAvoidingView, Text, TextInput, Platform, Dimensions, ScrollView, View, Image, TouchableOpacity, TouchableHighlight, StyleSheet} from 'react-native';
import firebase from '../cloud/firebase';
import { almostWhite, highlightGreen, treeGreen, avenirNext, graphiteGray, darkGray, optionLabelBlue, rejectRed, lightGray } from '../colors';
import FontAwesomeIcon  from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { textStyles } from '../styles/textStyles';

const {height} = Dimensions.get('screen');

export default class Comments extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          comments: {},
          commentString: '',
          visibleHeight: Dimensions.get('window').height,
          isGetting: true,
          showDeleteRow: false
        }
        this.height = this.state.visibleHeight
        
        
    }

    componentWillMount() {

        Keyboard.addListener('keyboardWillShow', this.keyboardWillShow.bind(this))
        Keyboard.addListener('keyboardWillHide', this.keyboardWillHide.bind(this))
        
        const {params} = this.props.navigation.state;
        const {comments} = params;
        console.log(comments);
        this.setState({comments: comments ? comments : {}, yourUid: firebase.auth().currentUser.uid });

    }

    keyboardWillShow (e) {
        let newSize = Dimensions.get('window').height - e.endCoordinates.height
        this.setState({visibleHeight: newSize})
      }

    keyboardWillHide (e) {
       this.setState({visibleHeight: Dimensions.get('window').height})
    }

    onCommentTextChanged(commentString) {
        this.setState({ commentString, typingComment: true });
    }

    uploadComment = (name, comment, uid, uri, yourUid, productKey) => {
        console.log("Product Key is:" + productKey);
        var timeCommentedKey = Date.now();
        var now = new Date();
        var date = now.getDate();
        
        var month = now.getMonth() + 1;
        var year = now.getFullYear();
        var timeCommented = `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`;
        
        var updates = {}
        var postData = {text: comment, name: name, time: timeCommented, uri: uri, uid: yourUid }
        
        const {...state} = this.state;
        state.comments[timeCommentedKey] = postData; // --> how to create a new key in the object with certain values, which in this case is another object containing the specific comment being uploaded
        this.setState(state);
        if(this.props.type == "product") {
            // console.log("Commment wil be stored to:" + '/Users/' + uid + '/products/' + productKey + '/text/comments/' + timeCommentedKey + '/')
            updates['/Users/' + uid + '/products/' + productKey + '/text/comments/' + timeCommentedKey + '/'] = postData
        }

        else {
            updates['/Users/' + uid + '/comments/' + timeCommentedKey + '/'] = postData
        }
        
        //firebase.database().ref('Posts').set({posts: this.state.posts})
        // console.log(postData, updates)
        firebase.database().ref().update(updates)
    }

    deleteComment(key, uid, productKey) {
        console.log(uid, productKey);
        var ref = this.props.type == 'product' ? '/Users/' + uid + '/products/' + productKey + '/comments/' + key + '/'  : '/Users/' + uid + '/comments/' + key + '/';
        firebase.database().ref(ref)
        .remove( () => {
            console.log(`successfully removed user comment: ${this.state.comments[`${key}`]}`);
        })
        .then(() => {
            // console.log(this.state.comments)
            delete this.state.comments[`${key}`];

            // TODO: when all comments are deleted, either locally update the state to show it has no reviews,
            // OR rework this component to pull from the cloud every time any changes are made.
            // if(Boolean(Object.keys(this.state.comments)[0])) {
            //     this.state.comments['a'] = {text: 'No Reviews have been left for this product yet.', name: 'NottMyStyle Team', time: `${year}/${month.toString().length == 2 ? month : '0' + month }/${date}`, uri: '' };
            // }
            this.setState({comments: this.state.comments});
        })
        .catch( (e) => {console.log(e)})
    }

    navToOtherUserProfilePage = (uid) => {
        this.props.navigation.navigate('OtherUserProfilePage', {uid: uid})
    }

    render() {
        // console.log("Initializing Comments")
        var {type} = this.props;
        var {yourUid} = this.state;
        var {params} = this.props.navigation.state;
        var {key, yourProfile, theirProfile, uid} = params;
        if(type == 'product') {
            var productKey = key;
            var {productInformation} = params;
            var productImage = productInformation.uris.thumbnail[0] //For row containing product Information
        }
        console.log('Product Key In Comments Is:' + productKey);
        
        var {name, uri} = yourProfile; //To upload a comment, attach the current Users profile details, in this case their name and profile pic uri
        
        var {comments, showDeleteRow} = this.state;

        return (
            <SafeAreaView style={styles.mainContainer}>
                <View style={styles.headerContainer}>
                    <View style={[styles.headerElementContainer, {flex: 0.15}]}>
                        <FontAwesomeIcon
                        name='arrow-left'
                        size={35}
                        color={'black'}
                        onPress = { () => { 
                            this.props.navigation.goBack();
                            } }
                        />
                    </View>

                    <View style={[styles.headerElementContainer, {flex: 0.65}]}>
                        <Text style={styles.headerText}>REVIEWS</Text>
                    </View>

                    <TouchableOpacity 
                        style={[styles.headerElementContainer, {flex: 0.2}]} 
                        onPress={() => yourUid == uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(uid)}
                    >
                        <Image source={  {uri: type == 'product' ? productImage : theirProfile.uri }} style={styles.headerImage} />
                    </TouchableOpacity>
                </View>

                <ScrollView style={{flex: 0.75}}>
                    {comments?
                    Object.keys(comments).map(
                    (comment) => (
                        <TouchableOpacity key={comment} style={[styles.commentContainer, {backgroundColor: showDeleteRow ? almostWhite : '#fff'}]} onLongPress={()=>this.setState({showDeleteRow: true})}>
                            {/* Allow user to delete their own comments*/}
                            {
                            showDeleteRow && comments[comment].uri == uri ?
                                <View style={styles.deleteCommentRow}>
                                    <Icon name="close" 
                                    size={22} 
                                    color={'black'}
                                    onPress={ () => {this.setState({showDeleteRow: false}) }}
                                    />
                                    <Text
                                    onPress={() => {
                                        type == 'product' ? 
                                        this.deleteComment(comment, productInformation.uid, productKey)
                                        :
                                        this.deleteComment(comment, uid, '')
                                        }
                                    } 
                                    style={styles.deleteComment}>
                                        Delete
                                    </Text>
                                </View>
                            :
                                null
                            }
                                {/* Ensure individual commenter's comment sends current user to their profile page. TODO: Blocked Users Later */}
                            <View style={styles.commentPicAndTextRow}>

                                {comments[comment].uri ?
                                <TouchableHighlight 
                                onPress={() => yourUid == comments[comment].uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage(comments[comment].uid)} 
                                style={styles.commentPic}
                                >
                                <Image style= {styles.commentPic} source={ {uri: comments[comment].uri} }/>
                                </TouchableHighlight>  
                                :
                                <Image style= {styles.commentPic} source={ require('../images/companyLogo2.jpg') }/>
                                }
                                
                                <View style={styles.textContainer}>
                                    <Text style={ styles.commentName }> {comments[comment].name} </Text>
                                    <Text style={styles.comment}> {comments[comment].text}  </Text>
                                </View>

                            </View>

                            <View style={styles.commentTimeRow}>

                                <Text style={ styles.commentTime }> {comments[comment].time} </Text>

                            </View>
                            
                        </TouchableOpacity>
                        
                    )
                            
                    )
                :
                    null
                }        
                </ScrollView>

                {/* <View style={styles.footerContainer} behavior={Platform.OS == 'android' ? 'padding' : null} keyboardVerticalOffset={80}> */}
                <View style={[styles.footerContainer, this.state.commentString && this.state.typingComment ? {position: "absolute", bottom: height/2.8} : null]}>
                    <View style={[styles.footerElementContainer, {flex: 0.15}]}>
                        <Image source={{uri}} style={styles.footerImage}/>
                    </View>

                    <View style={[styles.footerElementContainer, {flex: 0.85, flexDirection: 'row', borderColor: lightGray, borderWidth: 0.5, borderRadius: 30, paddingHorizontal: 5}]}>
                        <View style={{flex: 0.8}}>
                            <TextInput 
                                placeholder={"Add a comment..."} 
                                onChangeText={ commentString => this.onCommentTextChanged(commentString)}
                                value={this.state.commentString}
                                style={styles.input}
                                multiline={true}
                                maxLength={100}
                                autoCorrect={false}
                                underlineColorAndroid={"transparent"}
                                onEndEditing={()=>this.setState({typingComment: false})} 
                                returnKeyType={'default'}   
                                />
                        </View>

                        <View style={{flex: 0.2}}>
                            <Text 
                            style={[styles.postText, {opacity: this.state.commentString ? 1 : 0.5}]}
                            onPress={ () => {
                                if(this.state.commentString) {
                                    type == 'product' ? 
                                        this.uploadComment(name, this.state.commentString, uid, uri, yourUid, productKey) 
                                        : 
                                        this.uploadComment(name, this.state.commentString, uid, uri, yourUid, '');
                                    this.setState({commentString: ''}); 
                                    Keyboard.dismiss();
                                }
                                else {
                                 alert('Please input a comment')   
                                }
                                
                            }}
                            >
                            Post
                            </Text>
                        </View>
                    </View>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1,
        backgroundColor: "#fff"
    },


    headerContainer: {
        flex: 0.15,
        flexDirection: 'row',
        borderBottomColor: 'black',
        borderBottomWidth: 1.5,
        marginHorizontal: 5

    },

        headerElementContainer: {
            justifyContent: 'center',
            alignItems: 'center'
        },

        headerText: {
            ...textStyles.generic, fontSize: 35, fontWeight: "200", letterSpacing: 1.2
        },

        headerImage: {
            width: 45,
            height: 45
        },

        commentContainer: {
        
    flexDirection: 'column',
    // backgroundColor: 'blue'
    },

    deleteCommentRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingTop:5,
        paddingHorizontal:5,
        // alignContent: 'flex-end',
        // backgroundColor: 'blue'
    },

    deleteComment: {
        fontFamily: 'Iowan Old Style',
        fontWeight: '500',
        fontSize: 18,
        color: rejectRed,
        // textAlign: 'right'
    },
    
    commentPicAndTextRow: {
        flexDirection: 'row',
        width: 300 - 20,
        padding: 10
    },
    
    commentPic: {
        //flex: 1,
        width: 70,
        height: 70,
        alignSelf: 'center',
        borderRadius: 35,
        borderColor: '#fff',
        borderWidth: 0
    },
    
    textContainer: {
        flex: 1,
        flexDirection: 'column',
        padding: 5,
    },

    commentTimeRow: {
        justifyContent: 'flex-end',
        alignContent: 'flex-end',
        alignItems: 'flex-end',
    },
    
    commentName: {
        ...textStyles.generic,
        color: highlightGreen,
        fontSize: 16,
        fontWeight: "800",
        textAlign: "left"
    },

    

    comment: {
        ...textStyles.generic,
        fontSize: 16,
        color: darkGray,
    },  

    commentTime: {
        ...textStyles.generic,
        fontSize: 12,
        color: highlightGreen
    },


    footerContainer: {
        flex: 0.10,
        flexDirection: 'row',
        padding: 5
    },

        footerElementContainer: {
            justifyContent: 'center',
            alignItems: 'center',
            // padding: 3,
        },

            footerImage: {
                width: 45,
                height: 45,
                borderRadius: 22.5
            },

            input: {
                width: 200,
                height: 40,
                justifyContent: 'center',
                ...textStyles.generic
            },

            postText: {
                ...textStyles.generic,
                color: optionLabelBlue,
                fontWeight: "400"
            }

        

})