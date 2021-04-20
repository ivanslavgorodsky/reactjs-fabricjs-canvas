//import { render } from '@testing-library/react';
import React from 'react';

class UtilsScreen extends React.Component {

  /*constructor(props){
      super(props);        
      //this.alert1 = this.alert1.bind(this);
      //this.alert2 = this.alert2.bind(this);
  }*/

  static log = () => {
    console.log(
      "\nwindow.screen.width",
      window.screen.width,
      "\nwindow.screen.height",
      window.screen.height,
      "\nwindow.screen.availWidth",
      window.screen.availWidth,
      "\nwindow.screen.availHeight",
      window.screen.availHeight,
      "\nwindow.outerWidth",
      window.outerWidth,
      "\nwindow.outerHeight",
      window.outerHeight,
      "\nwindow.innerWidth",
      window.innerWidth,
      "\nwindow.innerHeight",
      window.innerHeight,
      "\ndocument.documentElement.clientWidth",
      document.documentElement.clientWidth,
      "\ndocument.documentElement.clientHeight",
      document.documentElement.clientHeight,
      "\ndocument.body.clientWidth",
      document.body.clientWidth,
      "\ndocument.body.clientHeight",
      document.body.clientHeight,
    )
  }

  static getScreen = () => {
    return {
      width: window.screen.width,
      height: window.screen.height,
    }
  }

  static getScreenAvail = () => {
    return {
      width: window.screen.availWidth,
      height: window.screen.availHeight,
    }
  }

  static getNavigation = () => {
    return {
      width: window.innerWidth,
      height: window.innerHeight,
    }
  }

  //componentWillMount() {}
  //componentWillUnmount() {}

  //componentDidMount() {}
  //componentDidUpdate() {}
  //componentDidCatch() {}

  //render(){ return () }

}
export default UtilsScreen;
