function avenirNextText(color,fontSize,fontWeight, textAlign, fontStyle) {

    this.fontFamily = 'Avenir Next';
    this.fontWeight = fontWeight ? fontWeight : '400';
    this.fontSize = fontSize ? fontSize : 18;
    this.color= color ? color : 'black';
    this.textAlign = textAlign ? textAlign : 'auto'
    this.fontStyle = fontStyle ? fontStyle : 'normal';

}

// delivery option constructor

function deliveryOptions(text1, text2) {
    this.options = [{text: text1, selected: false}, {text: text2, selected: false}]
    // this.text = text;
    // this.selected = false;
}

export {avenirNextText, deliveryOptions}