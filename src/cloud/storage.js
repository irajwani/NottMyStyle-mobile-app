import firebase from './firebase';

var storage = firebase.storage().ref('Users/');

export {storage};