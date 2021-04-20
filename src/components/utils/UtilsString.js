import { Component } from "react";

export default class UtilsString extends Component {

  capitalize = (s) => {
    if (typeof s !== 'string') return ''
    return s.charAt(0).toUpperCase() + s.slice(1)
  }

  capitalizeAllWords = (s) => {
    const arr = s.split(' ');
    const words = arr.map(word => {
      return convertFirstCharacterToUppercase(word);
    });  
    return words.join(' ');
  }

}
