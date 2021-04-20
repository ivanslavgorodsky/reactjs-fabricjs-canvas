import { Component } from "react";
import { GlobalContext } from "../config/global";
import { fabric } from 'fabric';

export default class UtilsColor extends Component {

  static contextType = GlobalContext;

  onChangeSelectColor = ( c, e ) => {

    // get the current mouse position
    const mouse = c.getPointer(e.e);
    const x = parseInt(mouse.x);
    const y = parseInt(mouse.y);

    // get the color array for the pixel under the mouse
    // const c = document.getElementById('canvas');
    // const px = c.getContext('2d').getImageData(x, y, 1, 1).data;
    const px = c.getContext("2d").getImageData(x, y, 1, 1).data;

    // report that pixel data
    console.log(" At [" + x + " / " + y + "]");
    console.log(" R" + px[0] + " G " + px[1] + " B " + px[2] + " A " + px[3]);
  };

  pickerColor = ( c ) => {    
    c.on("mouse:move", (e) => this.onChangeSelectColor( c, e ));
    c.on("mouse:down", () => {
      c.off("mouse:move", (e) => this.onChangeSelectColor( c, e ));
    });
  };

  // convertToHex('rgb(0,0,0)');
  convertToHex = ( rgb ) => {
    if( typeof rgb !== 'string' && rgb && rgb.len > 5 ) return rgb;
    if( String(rgb).trim().toLowerCase().indexOf('rgb') === 0) {
      const color = new fabric.Color(rgb);
      // color.toRgb();
      // color.getAlpha();
      // color.toHsl();
      // color.toHex();
      return color.toHex();
    } else {
      return rgb;
    }
  };

  // convertToRGBa('#000000)');
  convertToRGBa = ( hex ) => {
    if( typeof hex !== 'string' && hex && hex.len > 5 ) return hex;
    if( String(hex).trim().toLowerCase().indexOf('#') === 0) {
      const color = new fabric.Color(hex);
      // color.toRgb();
      // color.getAlpha();
      // color.toHsl();
      // color.toHex();
      return color.toRgb();
    } else {
      return hex;
    }
  };

  padZero = ( str, len ) => {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }

  /**
   * 
   * @param {string} hex (sample: '#ffffff')
   * @param {boolean} bw (sample: false )
   */
  // https://stackoverflow.com/questions/35969656/how-can-i-generate-the-opposite-color-according-to-current-color
  invertColorBW = ( hex, bw ) => {

    if( hex === null || hex === null || typeof hex !== 'string' ) return '#AAAAAA';
    bw = bw !== undefined ? bw : true ;

    // convert rgb to hex
    if( hex.indexOf('rgb(') === 0 && hex.indexOf('#') !== 0 ){
      hex = this.convertToHex( hex );
    }
    if (hex.indexOf('#') === 0) {
        hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    // error
    if (hex.length !== 6) {
        //throw new Error('Invalid HEX color.');
        return '#AAAAAA';
    }
    var r = parseInt(hex.slice(0, 2), 16),
        g = parseInt(hex.slice(2, 4), 16),
        b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
        // http://stackoverflow.com/a/3943023/112731
        return (r * 0.299 + g * 0.587 + b * 0.114) > 186
            ? '#000000'
            : '#FFFFFF';
    }
    // invert color components
    r = (255 - r).toString(16);
    g = (255 - g).toString(16);
    b = (255 - b).toString(16);
    // pad each with zeros and return
    return "#" + this.padZero(r) + this.padZero(g) + this.padZero(b);
}

}
