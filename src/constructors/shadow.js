function shadow(opacity, radius, color, width, height) {
    this.shadowOpacity = opacity;
    this.shadowRadius = radius;
    this.shadowColor = color ? color : 'black';
    this.shadowOffset = {width: width ? width:0, height: height?height:0};
}

export {shadow}