// import firebase from '../cloud/firebase';

// const getUnreadCount = async (uid) => {
//     let unreadCount = false;
//     await firebase.database().ref(`/Users/${uid}`).on('value', (snapshot) => {
//         var d = snapshot.val();
//         console.log(d);
//         console.log('Notifications Obj is: ' + d.notifications);
//         var {notifications} = d;
        
//         if(notifications == undefined) {
//           console.log('do nothing')  
//         }

//         else {
//           if(notifications.priceReductions) {
//             // console.log("Notifications length: " + Object.keys(d.notifications.priceReductions).length)
//             // unreadCount = Object.keys(d.notifications.priceReductions).length; 
//             Object.values(d.notifications.priceReductions).forEach( (n) => {
//               if(n.unreadCount) {
//                 unreadCount = true //in this case we only care if whether at least one notification has this property
//               }
//             })
//             return unreadCount;    
//           }
//         }

        


//     })
//     return unreadCount;

    
    
// }

// let unreadCount = false;

// var unsubscribe = firebase.auth().onAuthStateChanged( ( user ) => { 
//   unsubscribe();
//   if(user) {
//     unreadCount = getUnreadCount(user.uid);
    
//   }
  
// } )


// // export {unreadCount}