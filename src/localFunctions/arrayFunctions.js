const removeFalsyValuesFrom = (object) => {
    const newObject = {};
    Object.keys(object).forEach((property) => {
      if (object[property]) {newObject[property] = object[property]}
    })
    return Object.keys(newObject);
  }

const splitArrayIntoArraysOfSuccessiveElements = (array) => {
  //array.forEach( (element, index) =>                     
    //index % 2 != 0 ? second.push(element) : first.push(element) 
  //)
  
  var first = array.filter( (element, index) => index % 2 == 0 );
  var second = array.filter( (element, index) => index % 2 != 0 );
  return {first, second}

} 

const removeValueFromArray = (arr, value) => {

  return arr.filter(function(ele){
      return ele != value;
  });

}

const filterObjectByKeys = (obj, keys) => {
  var newObj = Object.keys(obj).filter( key => !keys.includes(key)).forEach( key => delete obj[key]);
  return newObj
}

export {removeFalsyValuesFrom, removeValueFromArray, splitArrayIntoArraysOfSuccessiveElements, filterObjectByKeys}  