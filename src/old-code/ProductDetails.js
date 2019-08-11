{/* <View style={styles.likeIconContainer}>
            {collectionKeys.includes(params.data.key) ? 
              <Icon name="heart" 
                    size={22} 
                    color='#800000'
                    onPress={() => { alert("you've already liked this product, but may unlike it from the Market"); }}
              /> 
              : 
              <Icon name="heart-outline" 
                    size={22} 
                    color='#800000'
                    onPress={() => {alert('You may like this product directly from the Market')}}
              />
            }
            <Text style={styles.likes}>{text.likes}</Text>
          </View> */}



{/* // ProductDetails in the past:

// <View style={styles.infoAndButtonsColumn}>
//         {/* product details */}
{/* //         <View style={{flex: 1}}>
//           <Text style={styles.brandText}>{text.brand.toUpperCase()}</Text>
//         </View>

//         <View style={styles.nameAndLikeRow} >
//           <Text style={styles.nameText}>{text.name.toUpperCase()}</Text>
//           <View style={styles.likesRow}>
//   {/* Boolean Row for ability to either like or unlike this product */}
{/* //               {collectionKeys.includes(params.data.key) ?  */} */}
//                   <Icon name="heart"  */}
//                         size={22} 
//                         color='#800000'
//                         onPress={() => { alert("you've already liked this product, but may unlike it from the Market"); }}

//               /> : <Icon name="heart-outline" 
//                         size={22} 
//                         color='#800000'
//                         onPress={() => {alert('You may like this product directly from the Market')}}

//               />}

//               <Text style={styles.likes}>{params.data.text.likes}</Text>
//             </View> 
//         </View>
        
//         {text.original_price > 0 ?
//           <View style= { styles.headerPriceMagnifyingGlassRow }>
            
//             <View style={styles.priceRow}>
//               <Text style={styles.original_price} >
//                 £{text.original_price}
//               </Text>
//               <Text style={styles.price} >
//                 £{text.price}
//               </Text>
//             </View>
//             {/* ownership product --> 2 things, edit item, confirm sale or unconfirm sale
//                 when youre an interested buyer --> 3 things, buy item, review item, report item */}
//             {productKeys.includes(data.key) ?
              
//               data.text.sold ? 
              
//               <View style={styles.buttonsRow}>
//                 <Button
//                     buttonStyle={{
//                         backgroundColor: "#186f87",
//                         width: 80,
                        
                        
//                     }}
//                     icon={{name: 'lead-pencil', type: 'material-community'}}
//                     title='EDIT'
//                     onPress = { () => { 
//                         console.log('going to edit item details');
//                         //subscribe to room key
//                         this.navToEditItem(data);
//                         } }

//                     />
//                 <View style={{flexDirection: 'column',}}>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Reset</Text>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
//                   <Icon
//                       name="check-circle" 
//                       size={30}  
//                       color={'#0e4406'}
//                       onPress = {() => {console.log('setting product status to available for purchase'); this.setSaleTo(false, data.uid, data.key)}}
//                   />
//                 </View>      
//               </View>      
                
              
//                :

//                <View style={styles.buttonsRow}>
//                 <Button
//                     buttonStyle={{
//                         backgroundColor: "#186f87",
//                         width: 80,
                        
                        
//                     }}
//                     icon={{name: 'lead-pencil', type: 'material-community'}}
//                     title='EDIT'
//                     onPress = { () => { 
//                         console.log('going to edit item details');
//                         //subscribe to room key
//                         this.navToEditItem(data);
//                         } }

//                     />
//                 <View style={{flexDirection: 'column',}}>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Confirm</Text>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
//                   <Icon
//                     name="check-circle" 
//                     size={30}  
//                     color={'gray'}
//                     onPress = {() => {console.log('setting product status to sold'); this.setSaleTo(true, data.uid, data.key)}}
//                   />
//                 </View>      
//               </View>   

                    
//               :
//               <View style={styles.buttonsRow}>
//                 <Button
//                     buttonStyle={{
//                         backgroundColor: chatIcon.color,
//                         width: 80,
                      
                        
//                     }}
//                     icon={chatIcon.type}
//                     title={chatIcon.title}
//                     onPress = { () => { 
//                         console.log('going to chat');
//                         //subscribe to room key
//                         this.navToChat(data.uid, data.key);
//                         } }
//                 />

//                 <Icon
//                   name="alert" 
//                   size={40}  
//                   color={'#800'}
//                   onPress = { () => { 
//                               this.setState({showReportUserModal: true})
//                               } }
//                 />
//               </View> 
//           }

            
            

//           </View>        
//         :
//         <View style= { styles.headerPriceMagnifyingGlassRow }>
            
//             <View style={{ flexDirection: 'row', justifyContent: 'flex-start' }}>
//               <Text style={styles.price} >
//                 £{text.price}
//               </Text>
//             </View>

//             {productKeys.includes(data.key) ?
              
//               data.text.sold ? 
              
//               <View style={styles.buttonsRow}>
//                 <Button
//                     buttonStyle={{
//                         backgroundColor: "#186f87",
//                         width: 80,
                        
                        
//                     }}
//                     icon={{name: 'lead-pencil', type: 'material-community'}}
//                     title='EDIT'
//                     onPress = { () => { 
//                         console.log('going to edit item details');
//                         //subscribe to room key
//                         this.navToEditItem(data);
//                         } }

//                     />
//                 <View style={{flexDirection: 'column',}}>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Reset</Text>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
//                   <Icon
//                       name="check-circle" 
//                       size={30}  
//                       color={'#0e4406'}
//                       onPress = {() => {console.log('setting product status to available for purchase'); this.setSaleTo(false, data.uid, data.key)}}
//                   />
//                 </View>      
//               </View>      
                
              
//                :

//                <View style={styles.buttonsRow}>
//                 <Button
//                     buttonStyle={{
//                         backgroundColor: "#186f87",
//                         width: 80,
                        
                        
//                     }}
//                     icon={{name: 'lead-pencil', type: 'material-community'}}
//                     title='EDIT'
//                     onPress = { () => { 
//                         console.log('going to edit item details');
//                         //subscribe to room key
//                         this.navToEditItem(data);
//                         } }

//                     />
//                 <View style={{flexDirection: 'column',}}>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Confirm</Text>
//                   <Text style={{color: '#0e4406', fontSize: 8 }}>Sale</Text>
//                   <Icon
//                     name="check-circle" 
//                     size={30}  
//                     color={'black'}
//                     onPress = {() => {console.log('setting product status to sold'); this.setSaleTo(true, data.uid, data.key)}}
//                   />
//                 </View>      
//               </View>   

                    
//               :
//               <View style={styles.buttonsRow}>
//                 <Button
//                     buttonStyle={{
//                         backgroundColor: chatIcon.color,
//                         width: 80,
                        
                        
//                     }}
//                     icon={chatIcon.type}
//                     title={chatIcon.title}
//                     onPress = { () => { 
//                         console.log('going to chat');
//                         //subscribe to room key
//                         this.navToChat(data.uid, data.key);
//                         } }

//                     />

//                 <Icon
//                   name="alert" 
//                   size={40}  
//                   color={'#800'}
//                   onPress = { () => { 
//                               this.setState({showReportUserModal: true})
//                               } }
//                 />  
//               </View> 
//           }

            
            

//           </View>
//         }
//         </View>


//         {/* row showing user details */}
//         <View style={profileRowStyles.separator}/>

//         <View style={profileRowStyles.rowContainer}>
//           {/* row containing profile picture, and user details */}
//           <TouchableOpacity onPress={() => {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage()}}>
//             <Image source={ {uri: profile.uri }} style={profileRowStyles.profilepic} />
//           </TouchableOpacity>
//           <View style={profileRowStyles.textContainer}>
            
//             <Text onPress={() => 
//             {firebase.auth().currentUser.uid == data.uid ? this.props.navigation.navigate('Profile') : this.navToOtherUserProfilePage()}}
//             style={profileRowStyles.name}>
//               {profile.name}
//             </Text>
//             <Text style={profileRowStyles.email}>
//               {profile.country}
//             </Text>
//             {profile.insta ? 
//               <Text style={profileRowStyles.insta}>@{profile.insta}</Text>
//              : 
//               null
//             }
            
//           </View>
          
          
//         </View>

//         <View style={styles.numberOfProductsSoldRow}>
//             <Text style={styles.numberProducts}>Products on Sale: {this.state.numberProducts} </Text>
//             <Text style={styles.soldProducts}> Products Sold: {this.state.soldProducts}</Text>
//         </View>

//         <View style={profileRowStyles.separator}/>

        
        
        

//         {/* more details */}
        
//         { Object.keys(details).map( (key, index) => (
          
//             <View style={styles.dalmationContainer}>
//               <View style={ [styles.keyContainer, {backgroundColor: index % 2 == 0 ? bobbyBlue : iOSColors.lightGray2}] }>
//                   <Text style={styles.keyText}>{key === 'original_price' ? 'RETAIL PRICE' : key.toUpperCase()}</Text>
//               </View>
//               <View style={ [styles.valueContainer, {backgroundColor: index % 2 == 0 ? highlightGreen : iOSColors.black} ] }>
//                   <Text style={styles.valueText}>{key === 'original_price' ? `£${details[key]}` : details[key]}</Text>
//               </View>
//             </View>

//         )
//         ) }