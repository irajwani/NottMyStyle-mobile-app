import * as firebase from 'firebase';
import {firebaseConfig} from '../credentials/keys'
firebase.initializeApp(firebaseConfig);
export default firebase;