//import { render } from '@testing-library/react';
import React from 'react';
import { fabric } from 'fabric';
import { GlobalContext } from '../config/global';
import GlobalEvents from '../event/GlobalEvents';

class UtilsCanvas extends React.Component {

  static contextType = GlobalContext;
  
  static rectResize = {
    key: null,
    // ---------------------------
    typeName: "RectResize",
    width: 10000,
    height: 10000,
    left: 0,
    top: 0,
    // ---------------------------
    opacity: 0,
    fill: null,
    border: null,
    borderWidth: 0,
    hoverCursor: "default",
    lockMovementX: true,
    lockMovementY: true,
    evented: false,
    hasControls: false,
    selectable: false,
    absolutePositioned: false,
    hasBorders: false,
    hasRotatingPoint: false,
    preserveObjectStacking: true,
    objectCaching: false,
  }

  static rectMP = {
    key: null,
    // ---------------------------
    typeName: "RectMP",
    width: 500,
    height: 500,
    left: 10,
    top: 10,
    // ---------------------------
    opacity: 1,
    fill: '#ffffff',
    border: null,
    borderWidth: 0,
    hoverCursor: "default",
    lockMovementX: true,
    lockMovementY: true,
    evented: false,
    hasControls: false,
    selectable: false,
    absolutePositioned: false,
    hasBorders: false,
    hasRotatingPoint: false,
    preserveObjectStacking: true,
    objectCaching: false,
  }

  constructor(props) {
    super(props);
    this.test = this.test.bind(this);
    this.center = this.center.bind(this);
  }

  test(log){
    console.log('test() ok',log);
  }
  
  //componentWillMount() {}
  //componentWillUnmount() {}
  //componentDidMount() {}
  //componentDidUpdate() {}
  //componentDidCatch() {}

  //-------------------------------------------------------------------------------------
  // Screen | Stage
  //-------------------------------------------------------------------------------------

  static getStageSize = ( c ) => {
    return { 
      // width: this.props.width, 
      // height: this.props.height,
      // width: this.state.sizes.widthStage, 
      // height: this.state.sizes.heightStage,
      width: c.getWidth(), 
      height: c.getHeight(),
      // width: c.width, 
      // height: c.height,
    };
  }

  //-------------------------------------------------------------------------------------
  // Position x,y
  //-------------------------------------------------------------------------------------

  static setPosition = ( c, x, y ) => {
    if (c === null) return 0;
    if (x === undefined) x = 0;
    if (y === undefined) y = 0;
    new UtilsCanvas().rotateReset( c );
    const { top, left } = c.hasOwnProperty('clipPath') && c.clipPath ? c.clipPath : { top:0, left:0 } ;
    return { top: (top + y) , left: (left + x) }
  }

  static setPositionLeft = ( c, x ) => {
    if (c === null) return 0;
    if (x === undefined) x = 0;
    new UtilsCanvas().rotateReset( c );
    //const clipW = c.clipPath !== undefined ? (c.clipPath.hasOwnProperty('width') ? c.clipPath.width : c.width) : c.width ;
    // const clipW = (c.clipPath !== undefined && c.clipPath !== undefined && c.clipPath.hasOwnProperty('width')) ? c.clipPath.getBoundingRect().width : c.width ;
    // const position = c.width / 2 - clipW / 2 + x;  
    return c.hasOwnProperty('clipPath') && c.clipPath ? c.clipPath.left + x : x ;
  }

  static setPositionTop = ( c, y ) => {
    if (c === null) return 0;
    if (y === undefined) y = 0;
    // const clipH = c.clipPath !== undefined ? (c.clipPath.hasOwnProperty('height') ? c.clipPath.height : c.height) : c.height ;
    // const clipH = (c.clipPath !== undefined && c.clipPath !== undefined && c.clipPath.hasOwnProperty('height')) ? c.clipPath.getBoundingRect().height : c.height ;
    // const position = c.height / 2 - clipH / 2 + y;  
    return c.hasOwnProperty('clipPath') && c.clipPath ? c.clipPath.top + y : y ;
  }

  //-------------------------------------------------------------------------------------
  // Canvas
  //-------------------------------------------------------------------------------------

  static isFine = ( c ) => {
    if (c === undefined || c === null) {
      return false;
    } else if (c.hasOwnProperty('isFabricCanvas')) {
      return true;
    } else {
      return true;
    }
  }

  static checkCanvas = ( c ) => {
    if(this.isFine( c ) === false)
      throw new Error('Can\'t find Canvas element');
  }

  // get canvas
  static getCanvas = ( c ) => {
    if (c !== undefined) {
      //this.setState({ ...this.state, canvas: c });
      return c;
    }
    else if (this.props){
      if(this.props.hasOwnProperty('canvas')){
        return this.props.canvas;
      }
    }
    else if (window.canvas !== undefined){
      //this.setState({ ...this.state, canvas: window.canvas });
      return window.canvas;
    } else {
      }
  }

  // get active object
  static getActiveObject = ( c ) => {
    this.renderAll( c );
    return c.getActiveObject() || undefined ;
  }

  // get active objectS - many
  static getActiveObjects = ( c ) => {
    this.renderAll( c );
    return c.getActiveObjects() || undefined ;
  }

  // discart active object
  static discardActiveObject = ( c ) => {
    c.discardActiveObject();
  }

  // set element selection
  static setActiveObject = ( c, o ) => {
    c.setActiveObject( o );
    const data = { 
      activeObject: ( o === undefined || o === null) ? null : o ,
      key: ( o === undefined || o === null) ? null : ( o.hasOwnProperty('key') ? o.key : null ) ,
    };
    GlobalEvents.dispatch('changeActiveObject', data);
    c.activeObjectKey = data.key;
    this.renderAll( c );
  }

  // get getObjects on canvas
  static getObjects = ( c ) => {
    return c.getObjects() || undefined ;
  }
  
  // re-render fabric
  static renderAll = ( c ) => {
    if( c === undefined || c === null ) return;
    try {
      c.requestRenderAll();      
      c.renderAll();
      c.calcOffset();
      } catch (error) {}
  }

  // setSelection = (v) => {
  static enableSelection = (c, v) => {
    fabric.Object.prototype.selection = v === undefined ? true : v;
    c.set("selection", v);

    // fabric.Object.prototype.selectable = false;
    // fabric.Object.prototype.selection = false;
    // c.set('selection', false);
    // c.set('selectable', false);
    // c.selection = false;
    // c.selectable = false;
    // this.renderAll( c );

    // this.canvas.forEachObject(object => {
    //   object.selectable = false;
    //   object.evented = false;
    // });

  }
  
  // restart
  clear = ( c, settings, callback ) => {
    const backgroundColor = undefined;
    const bgColor = backgroundColor !== undefined ? `"background":"${backgroundColor}",` : '' ;
    const fill = '"fill":"#ffffff",';
    //const data = `{"version":"3.1.1","objects":[],"name":"canvas","preserveObjectStacking":true,"hoverCursor":"move"'+backgroundColor+'}`;
    //const data = `{"version":"4.3.1","objects":[{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":-4811,"top":-4811,"width":10000,"height":10000,"fill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"typeName":"RectResize","key":"OLs6bVqktTH8dVjjBNIY","evented":false,"hasBorders":false,"hasRotatingPoint":false,"selectable":false,"objectCaching":false,"preserveObjectStacking":true,"absolutePositioned":false,"lockMovementX":true,"lockMovementY":true,"lockRotation":false,"lockScalingX":false,"lockScalingY":false,"hoverCursor":"default"},{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":0,"top":0,"width":378,"height":378,${fill}"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"typeName":"RectMP","key":"yCJ7azBIC1yt8wF3I0aX","evented":false,"hasBorders":false,"hasRotatingPoint":false,"selectable":false,"objectCaching":false,"preserveObjectStacking":true,"absolutePositioned":false,"lockMovementX":true,"lockMovementY":true,"lockRotation":false,"lockScalingX":false,"lockScalingY":false,"hoverCursor":"default"}],"clipPath":{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":0.5,"top":0.5,"width":378,"height":378,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":null,"ry":null,"evented":true,"hasBorders":true,"selectable":true,"objectCaching":false,"absolutePositioned":false,"lockMovementX":false,"lockMovementY":false,"lockRotation":false,"lockScalingX":false,"lockScalingY":false,"hoverCursor":null},${bgColor}"isFabricCanvas":true,"name":"canvas","clipPathObject":{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":150,"top":93,"width":378,"height":378,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":null,"ry":null},"rx":10,"ry":10,"preserveObjectStacking":true,"hoverCursor":"move"}`;
    const data = `{"version":"4.3.1","objects":[{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":-4716.5,"top":-4811,"width":10000,"height":10000,"fill":null,"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":0,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"typeName":"RectResize","key":"OLs6bVqktTH8dVjjBNIY","evented":false,"hasBorders":false,"hasRotatingPoint":false,"selectable":false,"objectCaching":false,"preserveObjectStacking":true,"absolutePositioned":false,"lockMovementX":true,"lockMovementY":true,"lockRotation":false,"lockScalingX":false,"lockScalingY":false,"hoverCursor":"default"},{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":0,"top":0,"width":567,"height":378,${fill}"stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":0,"ry":0,"typeName":"RectMP","key":"yCJ7azBIC1yt8wF3I0aX","evented":false,"hasBorders":false,"hasRotatingPoint":false,"selectable":false,"objectCaching":false,"preserveObjectStacking":true,"absolutePositioned":false,"lockMovementX":true,"lockMovementY":true,"lockRotation":false,"lockScalingX":false,"lockScalingY":false,"hoverCursor":"default"}],"clipPath":{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":0.5,"top":0.5,"width":567,"height":378,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,"backgroundColor":"","fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":null,"ry":null,"evented":true,"hasBorders":true,"selectable":true,"objectCaching":false,"absolutePositioned":false,"lockMovementX":false,"lockMovementY":false,"lockRotation":false,"lockScalingX":false,"lockScalingY":false,"hoverCursor":null},"isFabricCanvas":true,"name":"canvas","clipPathObject":{"type":"rect","version":"4.3.1","originX":"left","originY":"top","left":169.5,"top":93,"width":567,"height":378,"fill":"rgb(0,0,0)","stroke":null,"strokeWidth":1,"strokeDashArray":null,"strokeLineCap":"butt","strokeDashOffset":0,"strokeLineJoin":"miter","strokeUniform":false,"strokeMiterLimit":4,"scaleX":1,"scaleY":1,"angle":0,"flipX":false,"flipY":false,"opacity":1,"shadow":null,"visible":true,${bgColor}"fillRule":"nonzero","paintFirst":"fill","globalCompositeOperation":"source-over","skewX":0,"skewY":0,"rx":null,"ry":null},"rx":10,"ry":10,"preserveObjectStacking":true,"hoverCursor":"move"}`;
    c.loadFromJSON(data,()=>{
      c.setViewportTransform([
        1,0,0,
        1,0,0,
      ]);
      c.renderAll();
      this.center( c );
      GlobalEvents.dispatch('resizeCanvas');
      GlobalEvents.dispatch('reset', c );
      c.history.reset();
      GlobalEvents.dispatch('changeActiveObject',{ activeObject:null, key:null });
      if(callback !== undefined){
        callback();
      }
    });
  }

  //get element by id
  static getElementById = (c, id) => {
    return this.getElementByName(c, id);
  }

  //get element by name
  static getElementByName = (c, name) => {
    return [...c.getObjects()].find((el) => {
      if (el.hasOwnProperty('name') === false)
        return false;
      else if (el.name && el.name === name)
        return true;
      else
        return false;
    });
    /*
    return objects.map((el) => {
      if (el.hasOwnProperty('name') === false)
        return null;
      else if (el.name && el.name === name)
        return el;
      else
        return null;
    });
    */ 
  }

  //get element by key
  static getElementByKey = (c, key, callback) => {
    let object = [...c.getObjects()].find((el) => {
        if (el.hasOwnProperty('key') === false)
          return false;
        else if (el.key && el.key === key)
          return true;
        else
          return false;
      });

    if (callback !== undefined)
      callback({
        success: object === null ? false : true,
        fail: object === null ? true : false,
        object: object
      });
    return object;
  }

  //get element by key
  static getElementByTypeName = (c, value, callback) => {
    const prop = 'typeName';
    let objects = [...c.getObjects()].filter((el) => {
        if (el.hasOwnProperty(prop) === false)
          return false;
        else if (el[prop] && el[prop] === value)
          return true;
        else
          return false;
      });

    if (callback !== undefined)
      callback({
        success: objects.length === 0 ? false : true,
        fail: objects.length === 0 ? true : false,
        objects: objects
      });
    return objects;
  }

  static add = (c, el) => {
    c.add(el);
    this.renderAll( c );
  }

  static remove = (c, el) => {
    c.discardActiveObject();
    // multiples removes
    if( Array.isArray( el ) ){
      el.forEach( rm => c.remove( rm ) );
    } else { // single remove
      c.remove( el );
    }
    this.renderAll( c );
  }

  static key = (len) => {
    len = len === undefined ? 20 : len;
    let result = "";
    let characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let charLen = characters.length;
    for (let i = 0; i < len; i++) {
      result += characters.charAt(Math.floor(Math.random() * charLen));
    }
    return result;
  };

  static set = (c, settings, callback) => {

    if ( settings === null || settings === undefined || typeof settings !== 'object' ) return;

    let object, objects;
    
    // has object on settings
    if( settings.hasOwnProperty('object') && settings.object ){
      object = settings.object;
    } else {
      // or get active object
      object = c.getActiveObject();
    } 

    // convetional set
    if ( settings.hasOwnProperty("conventionalSet") && settings.conventionalSet === true ) {
      object.set(settings);
      return;
    }

    // objects in array
    if ( object.hasOwnProperty('_objects') && object._objects ) {
      objects = object._objects;
    } else {
      objects = [object];
    }

    // forEach settings
    for (let prop in settings) {

      // discart object key and continue
      if (prop === 'object') continue;

      // forEach elements
      objects.forEach( el => {

        if (prop === "width") {
          // rescale width
          object.scaleToWidth(settings.width);
        } else if (prop === "height") {
          // rescale height
          object.scaleToWidth(settings.height);
        } else if (prop === "scale") {
          // scale
          object.scale(settings.scale);
          //scale and opacity
        } else if (prop === "angle" || prop === "opacity") {
          object.set(prop, settings[prop]);
          //} else if (object._objects[i].hasOwnProperty(prop)) {
        } else {
          // conventional set
          el.set(prop, settings[prop]);
          console.log("conventional:set!");
        }

      }); // forEach
    } // for

    object.setCoords();
    UtilsCanvas.renderAll( c );
    // TODO librariesHistory.state.save();
  }

  static enableObjects = ( c, enabled, objects) => {

    enabled = enabled || true;
    objects = objects || c._objects;

    objects.map((o) => {
      o.isLockForDraw = enabled ? true : null;
      o.hoverCursor = enabled ? "auto" : "default";
      o.evented = enabled;
      o.hasControls = enabled;
      o.selectable = enabled;
      return o;
    });

    UtilsCanvas.discardActiveObject( c );
    UtilsCanvas.renderAll( c );
    //####createLayer() --> Layer.refresh();
  };

  // never static
  center = ( c ) => {
    if( c === undefined || c === null ) return;
    const elements = c.getObjects();
    if( c.hasOwnProperty('clipPath') && c.clipPath !== undefined && c.clipPath !== null ){
      elements.push(c.clipPath);
    }
    const group = new fabric.Group(elements);
    c.centerObject(group)
    group.setCoords(); // error
    group.destroy()
    c.renderAll();  
  }

  // never static
  rotate = ( c, angle ) => {
    if( c === undefined || c === null ) return;
    angle = angle === undefined ? 0 : angle ;
    const elements = c.getObjects(); // no change this
    if( c.hasOwnProperty('clipPath') && c.clipPath !== undefined && c.clipPath !== null ){
      elements.push(c.clipPath);
    }
    const group = new fabric.Group(elements);
    group.rotate(angle)
    c.centerObject(group)
    group.setCoords(); // error
    group.destroy()
    c.renderAll();  
  }

  /** rotate angle zero, reset to zero */
  rotateReset = ( c ) => {
    if( c === undefined || c === null ) return;
    if( c.clipPath === undefined || c.clipPath === null ) return;
    const {angle} = c.clipPath;
    const elements = c.getObjects(); // no change this
    elements.push(c.clipPath);
    const group = new fabric.Group(elements);
    group.rotate( angle === undefined ? 0 : angle * -1 )
    c.centerObject(group)
    // group.setCoords();
    group.destroy()
    c.renderAll();  
  }

  /** zoom scale to 1:1, reset to 1 */
  zoomReset = ( c ) => {
    if( c === undefined || c === null ) return;
    c.setViewportTransform([1,0,0,1,0,0]); 
    c.renderAll();  
  }

  // static centerContainer = ( c ) => {

  //   // desabilitar todos os elementos selecionados
  //   c.discardActiveObject();

  //   // clipPath
  //   let cp = undefined;

  //   //centralize clip, caso exista um clip np canvas (clip = mask/mascara)
  //   if(c.clipPath !== undefined && c.clipPath !== null){

  //     if(c.clipPath.hasOwnProperty('width')){
  //       cp = c.clipPath;
  //     }else{
  //       cp = { width:c.width, height:c.height };
  //     }
  //     // valGlobal.sizes.widthClip = cp.width;
  //     // valGlobal.sizes.heightClip = cp.height;

  //     console.log('clipPath:');

  //     //se o tamanho do canvas for igual ao ClipPath entao o point(x,y) do clip é zero = 0
  //     if(parseInt(c.width) === parseInt(cp.width) && parseInt(c.height) === parseInt(cp.height)){
  //       cp.left = cp.top = 0;
  //     }else{ // centralizao o clip
  //       cp.left = this.setPositionLeft( c );
  //       cp.top  = this.setPositionTop( c );
  //     }

  //     c.clipPath = undefined;
  //     c.clipPath = cp;
  //     cp.setCoords();
  //     console.log('center:clipPath('+cp.width+'x'+cp.height+')');

  //   }
    
  //   //group all the objects
  //   let allTogether = new fabric.Group( c._objects );    // allTogether.left = 100;
  //   c.centerObject( allTogether );
  //   setTimeout(() => {
  //     // allTogether.left = 100;
  //     // allTogether.top = 50;
  //     allTogether.set("angle", 0); // why ???
  //     allTogether.destroy();
  //   }, 500);

  // }

  static focus = () => {

    const element = document.getElementById('canvas');
    //console.log('focusCanvas',element);

    try {
      // first try
      element.focus();
      element.click();
    } catch (error) {
      console.log('focus1Error');      
    }

    try {
      // secod try
      const simpleEvent = new Event("click");
      element.focus();      
      element.dispatchEvent(simpleEvent);
    } catch (error) {
      console.log('focus2Error');
    }

    try {
      //third try
      const mouseEvent = new MouseEvent('click', {
        view: window,
        bubbles: true,
        cancelable: true,
        simulate: true,
      });
      element.focus();      
      element.dispatchEvent(mouseEvent);
    } catch (error) {
      console.log('focus3Error');
    }

  }

  static addRectMP = ( c ) => {

    if( c === undefined || c === null ) return ;
    const rectMP = new fabric.Rect( {...this.rectMP, key: UtilsCanvas.key() } );
    c.add( rectMP );
    c.centerObject( rectMP );
    console.log("addRectMP()",rectMP);
    this.sendToBackRectMP( c, rectMP, true );

  }

  static sendToBackRectMP = ( c, object, discardActiveObject ) => {

    if (c === undefined || c === null) return;
    if (object === undefined || object === null) return;
    if (object.typeName !== 'RectMP') return;

    //object.set( this.rectMP );
    c.centerObject( object );
    c.sendToBack( object );  
    // up 1
    c.bringForward( object );  

    if ( discardActiveObject === true ) {
      c.discardActiveObject();
    }
    console.log("RectMP:sendToBack()");

  }

  static resizeRectMP = ( c, width, height ) => {
    if (c === undefined || c === null) return;
    if(width === undefined || height === undefined){
      if( c.hasOwnProperty('clipPath') && c.clipPath !== undefined && c.clipPath !== null ){
        width = c.clipPath.getBoundingRect().width;
        height = c.clipPath.getBoundingRect().height;
      }
    }
    const object = c.item(1);
    if(object.typeName === 'RectMP'){
      object.set({
        width: width,
        height: height,
      });
      c.centerObject(object);
    }else{
      this.getElementByTypeName( c, 'RectMP', (e) =>{
        if(e.success){
          console.log('getElementByTypeName',e.objects[0]);
        }
      });
    }
  }

  // react resize é para agrupar os elementos quando o navegador for redimensionado
  // agrupa tudo e centraliza na tela, reordenando o x e o y
  static addRectResize = ( c ) => {

    if( c === undefined || c === null ) return ;
    const rectResize = new fabric.Rect( {...this.rectResize, key: UtilsCanvas.key() } );
    c.add( rectResize );
    c.centerObject( rectResize );
    console.log("addRectResize()",rectResize);

  }

  static sendToBackRectResize = ( c, object, discardActiveObject ) => {

    if (c === undefined || c === null) return;
    if (object === undefined || object === null) return;
    if (object.typeName !== 'RectResize') return;

    //object.set( this.rectResize );
    c.centerObject( object );
    c.sendToBack( object );    

    if ( discardActiveObject === true ) {
      c.discardActiveObject();
    }
    console.log("RectResize:sendToBack()");

  }

  //-------------------------------------------------------------------------------------
  //render(){ return () }
  //-------------------------------------------------------------------------------------


}
export default UtilsCanvas;

/*
const helper1 = () => {};
const helper2 = () => {};

export default {
  helper1,
  helper2
};
*/

//import { HelloChandu } from './helpers'
//import functions from './helpers' then functions.HelloChandu