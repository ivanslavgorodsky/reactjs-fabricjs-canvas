import React from "react";
import UtilsCanvas from "./UtilsCanvas";
import { fabric } from 'fabric';

class UtilsObject extends React.Component {

  static clone = (object) => {
    if (object === undefined || object === null || typeof object !== "object")
      return object
    else
    return Object.assign(Object.create(Object.getPrototypeOf(object)), object);
    // if (!object) return;
    // if(object.hasOwnProperty('isCloned')){
    //   delete object.isCloned;
    //   return object;
    // }
    // if (fabric.util.getKlass(object.type).async) {
    //   object.clone((cloned)=>{
    //     cloned.key = UtilsCanvas.key();
    //     return this.clone(cloned);
    //   });
    // }
    // else {
    //   return object.clone();
    // }
  }

  static deepClone = ( object ) => {
    if (object === undefined || object === null || typeof object !== "object")
      return object
    var props = Object.getOwnPropertyDescriptors(object)
    for (var prop in props) {
      props[prop].value = this.deepClone(props[prop].value)
    }
    return Object.create(
      Object.getPrototypeOf(object), 
      props
    )
  }

  static enableSelectable = ( c, enabled, objects ) => {

    objects = Array.isArray( objects ) ? objects : c._objects ;
    enabled = enabled !== undefined ? enabled : true ;
  
    //get all the objects into an array
    objects.forEach(element => {
      // dont change RectResize and RectMP
      if(element.hasOwnProperty('typeName') && element.typeName !== 'RectResize' && element.typeName !== 'RectMP'){
        element.isLockForDraw = enabled ? true : null ;
        element.hoverCursor = enabled ? "auto" :  "default";
        element.hasControls = enabled;
        element.evented = enabled;  
      }
    });

    UtilsCanvas.discardActiveObject( c );
    UtilsCanvas.renderAll( c );
    // TODO createLayer();
  }

  static getActive = ( c, defineObject ) => {
    return new Promise((resolve,reject)=>{
      if( defineObject !== null && defineObject !== undefined ){
        return resolve( defineObject, c );
      }
      if( c === null || c === undefined ){
        return reject( undefined, c );
      }
      const object = c.getActiveObject();
      if( object === null || object === undefined ){
        return reject( undefined, c );
      }else{
        c.renderAll();
        return resolve( object, c );
      }
    });
  }

  tempCanv = null;
  ctx = null;
  w = null;
  h = null;

  getImageData = (dataUrl) => { 

    // we need to use a temp canvas to get imagedata
    if (this.tempCanv === null) {
      this.tempCanv = document.createElement('canvas');
      this.tempCanv.style.border = '1px solid blue';
      this.tempCanv.style.visibility = 'hidden';
      this.tempCanv.style.position = 'absolute';
      this.tempCanv.style.top = '-5000px';
      this.ctx = this.tempCanv.getContext('2d');
      document.body.appendChild(this.tempCanv);
    }
      
    return new Promise( (resolve, reject) => {
      
      if (dataUrl == null) return reject();    
      
      let image = new Image();
      image.addEventListener('load', (e) => {
        this.w = image.width;
        this.h = image.height;
        this.tempCanv.width = this.w;
        this.tempCanv.height = this.h;
        this.ctx.drawImage(image, 0, 0, this.w, this.h);
        let imageData = this.ctx.getImageData(0, 0, this.w, this.h).data.buffer;
        resolve(imageData, false);
        this.tempCanv.remove();
      });
      image.src = dataUrl;
    });
    
  }
  
  scanPixels = (imageData) => {

    let data = new Uint32Array(imageData),
        //len = data.length,
        x, y, y1, y2, x1 = this.w, x2 = 0;
    
    // y1
    for(y = 0; y < this.h; y++) {
      for(x = 0; x < this.w; x++) {
        if (data[y * this.w + x] & 0xff000000) {
          y1 = y;
          y = this.h;
          break;
        }
      }
    }
    
    // y2
    for(y = this.h - 1; y > y1; y--) {
      for(x = 0; x < this.w; x++) {
        if (data[y * this.w + x] & 0xff000000) {
          y2 = y;
          y = 0;
          break;
        }
      }
    }
  
    // x1
    for(y = y1; y < y2; y++) {
      for(x = 0; x < this.w; x++) {
        if (x < x1 && data[y * this.w + x] & 0xff000000) {
          x1 = x;
          break;
        }
      }
    }
  
    // x2
    for(y = y1; y < y2; y++) {
      for(x = this.w - 1; x > x1; x--) {
        if (x > x2 && data[y * this.w + x] & 0xff000000) {
          x2 = x;
          break;
        }
      }
    }
    
    return {
      x1: x1,
      x2: x2,
      y1: y1,
      y2: y2,
      width: this.w,
      height: this.h,
    }
  }

  // guide lines
  // https://jsfiddle.net/3mtcsy6p/1/

  static align = ( c, direction ) => {

		let object = UtilsCanvas.getActiveObject( c );
    if ( object === undefined || object == null ) return;
    if ( direction === undefined ) return;

		const strokeWidth   = 0;//object.strokeWidth !== undefined ? object.strokeWidth : 0;
    const clipWidth     = c.clipPath !== undefined ? c.clipPath.width : c.width ;
    const clipHeight    = c.clipPath !== undefined ? c.clipPath.height : c.height ;

    const utils = new UtilsObject();
    const bound = object.getBoundingRect();

    const angle = parseInt(object.angle);
    // angles:
    // 1: 0   - 45
    // 2: 46  - 90
    // ----------------- 
    // 3: 91  - 135
    // 4: 136 - 180
    // ----------------- 
    // 5: 181 - 225
    // 6: 226 - 270
    // ----------------- 
    // 7: 271 - 315
    // 8: 316 - 360

    // oCoords.tl.x, oCoords.tl.y // top left corner 
    // oCoords.tr.x, oCoords.tr.y // top right corner
    // oCoords.bl.x, oCoords.bl.y // bottom left corner
    // oCoords.br.x, oCoords.br.y // bottom right corner
    

    switch ( direction ) {
      case "left":

      console.log(this);

        utils.getImageData(object.toDataURL())
          .then((data) => {    

            // const realBound = utils.scanPixels(data);  
            // object.set('left', (object.left - bound.left - realBound.x1));
            // object.setCoords();
            // UtilsCanvas.renderAll( c );

            const realBound = utils.scanPixels(data);
            object.set( 'left', UtilsCanvas.setPositionLeft( c, object.left - bound.left - realBound.x1 ) );
            object.setCoords();
            UtilsCanvas.renderAll( c );
  
          }).catch( (e) => {

            object.set("left", UtilsCanvas.setPositionLeft( c, 0 ));

          });

        break;
      case "right":

        utils.getImageData(object.toDataURL())
        .then((data) => {

          const realBound = utils.scanPixels(data);
          if ( (angle >= 0 && angle <= 90) ){
            console.log('---------------angles: 0 - 90 ');
            object.set( 'left', UtilsCanvas.setPositionLeft( c, clipWidth - (object.oCoords.bl.x - object.oCoords.tl.x) - realBound.x2 ));
          } else if ( (angle > 90 && angle <= 180) ){
            console.log('---------------angles: 91 - 180 ');
            object.set( 'left', UtilsCanvas.setPositionLeft( c, clipWidth + ( bound.width - realBound.x2 ) ));

          } else {
          //else if ( (angle <= 360 && angle > 90) ){
            console.log('---------------angles: 270 - 360 ');
            object.set( 'left', UtilsCanvas.setPositionLeft( c, clipWidth - object.width + (( object.width - bound.width )/2) ) );
          }
          object.setCoords();
          UtilsCanvas.renderAll( c );

          console.log( c.width );
          console.log( '-1', (object.oCoords.bl.x - object.oCoords.tl.x).toFixed(1) );
          console.log( '-2', (clipWidth - object.oCoords.bl.x).toFixed(1) );
          console.log( 'oCoords.tl.x', (object.oCoords.tl.x).toFixed(1) );
          console.log( 'w-x', (c.width - object.left).toFixed(1) );
          console.log( 'bound.width - object.width', (bound.width - object.width).toFixed(1) );
          console.log( 'x1 - x2', (realBound.x2 - realBound.x1).toFixed(1) );
          console.log( 'x1 + x2', (realBound.x2 + realBound.x1).toFixed(1) );
          console.log( 'object.width', object.width.toFixed(1) );
          console.log( 'object.left', object.left.toFixed(1) );
          console.log( 'bound.width', bound.width.toFixed(1) );
          console.log( 'bound.left', bound.left.toFixed(1) );
          console.log( 'realBound.width', realBound.width.toFixed(1) ); 
          console.log( 'realBound.height', realBound.height.toFixed(1) );
          console.log( 'realBound.x1', realBound.x1.toFixed(1) ); 
          console.log( 'realBound.x2', realBound.x2.toFixed(1) );
          console.log( 'setPositionLeft', UtilsCanvas.setPositionLeft( c ) );

        }).catch( (err) => {
          // object.set(
          //   "left",
          //   UtilsCanvas.setPositionLeft( c, clipWidth - object.width * object.scaleX ) - strokeWidth
          // );
        });

        // object.set(
        //   "left",
        //   UtilsCanvas.setPositionLeft( c, clipWidth - object.width * object.scaleX ) - strokeWidth
        // );
        break;
      case "center":
        object.set(
          "left",
          UtilsCanvas.setPositionLeft( c, clipWidth / 2 - (object.width * object.scaleX) / 2 - strokeWidth / 2 ) 
        );
        break;
      case "top":
        object.set("top", UtilsCanvas.setPositionTop( c, 0 ));
        break;
      case "bottom":
        object.set(
          "top",
          UtilsCanvas.setPositionTop( c, clipHeight - object.height * object.scaleY ) - strokeWidth
        );
        break;
      case "middle":
        object.set(
          "top",
          UtilsCanvas.setPositionTop( c, clipHeight / 2 - (object.height * object.scaleY) / 2 - strokeWidth / 2 )
        );
        break;
      default: console.log('');
    }
    object.setCoords();
    UtilsCanvas.renderAll( c );
  };

	static flipX = ( c, object ) => {
    if( object === undefined || object === null ){
      object = UtilsCanvas.getActiveObject( c );
    }
    if( object === undefined || object === null ) return;
		UtilsCanvas.set( c, {'flipX':(object.flipX === true ? false : true)});
		UtilsCanvas.renderAll( c );
	}

	static flipY = ( c, object ) => {
    if( object === undefined || object === null ){
      object = UtilsCanvas.getActiveObject( c );
    }
    if( object === undefined || object === null ) return;
		UtilsCanvas.set( c, {'flipY':(object.flipY === true ? false : true)});
		UtilsCanvas.renderAll( c );
	}

  static deleteAll = ( c, event ) => {
    c.discardActiveObject();
    new UtilsCanvas().clear( c );
  };

  // delete from control
  // http://fabricjs.com/custom-control-render
  static keyDownDelete = ( c, event ) => {

    const key = event.keyCode || event.charCode ;
    if ( key !== 46) return; // key delete

    let object = c.getActiveObjects();
    
    if(object === undefined || object === null) return;
    if(object.length === 0) return;
  
    if (window.confirm("Are you sure? Total: "+object.length)) {
      object.forEach((el)=>{
        if(el.typeName !== 'RectResize' && el.typeName !== 'RectMP'){
          c.remove(el);
        }
      })
      c.discardActiveObject();
    }

  };


  static keyDownMove ( c, event ) {

    // block move objects then on html inputs
    if (event.target !== null) {
      if (event.target["type"]) {
        return;
      }
    }

    // if(event.target.hasOwnProperty('typeName')) return;
    let object = UtilsCanvas.getActiveObject( c );
    if (object === undefined || object == null) return;

    // impede que o evento padrão ocorra (ex.: seguir um link)
    // Quando um elemento tenha um comportamento único, sem herdar o comportamento dos elementos onde ele está contido.
    // content | element | button -> mouse click
    // content (click handler) < element (click handler) < button (click handler)
    event.preventDefault();
     // impede que o evento seja propagado para os handlers dos elementos DOM pais; return false faz as duas coisas 
    // (e ainda interrompe a execução do handler imediatamente, sem executar as instruções que vêm depois)
    // content | element | button -> mouse click
    // content | element | button (only click handler)
    event.stopPropagation();

    let padding = event.shiftKey === true ? 5 : 1;

    const update = ( object ) => {
      UtilsCanvas.set( c, { conventionalSet: true, left: object.left, top: object.top });
      object.setCoords();
      UtilsCanvas.renderAll( c );
      c.history.register();
    };

    switch (event.key) {
      case "ArrowUp":
        object.top += - padding;
        update( object );
        break;
      case "ArrowDown":
        object.top += + padding;
        event.preventDefault();
        update( object );
        break;
      case "ArrowLeft":
        object.left += - padding;
        event.preventDefault();
        update( object );
        break;
      case "ArrowRight":
        object.left += + padding;
        event.preventDefault();
        update( object );
        break;
      default: console.log('');
    }
  
  }

  // Bring

  static bringToFront = ( c, object ) => {
    if( object === undefined || object === null ){
      object = UtilsCanvas.getActiveObject( c );
    }
    if( object === undefined || object === null ) return;
    if (object === undefined || object == null) return;
    c.bringToFront( object );
    // preserveObjectStacking se true traz os objetos selecionados ara cima
    if ( fabric.Object.prototype.preserveObjectStacking === false ){
      UtilsCanvas.discardActiveObject( c );
    } 
    // sendToBackRectResizeLoop();
  }

  static bringForward = ( c, object ) => {
    if( object === undefined || object === null ){
      object = UtilsCanvas.getActiveObject( c );
    }
    if( object === undefined || object === null ) return;
    c.bringForward( object );
    // preserveObjectStacking se true traz os objetos selecionados ara cima
    if ( fabric.Object.prototype.preserveObjectStacking === false ){
      UtilsCanvas.discardActiveObject( c );
    } 
    // sendToBackRectResizeLoop();
  }
  
  static sendBackwards = ( c, object ) => {
    if( object === undefined || object === null ){
      object = UtilsCanvas.getActiveObject( c );
    }
    if( object === undefined || object === null ) return;
    c.sendBackwards( object );
    // Confere se o index é 0 e manda para o index 1
    if( c.getObjects().indexOf( object ) === 0 ){ // RectResize
      c.bringForward( object );
    }
    if( c.getObjects().indexOf( object ) === 1 ){ // RectMP
      c.bringForward( object );
    }
    // preserveObjectStacking se true traz os objetos selecionados ara cima
    if ( fabric.Object.prototype.preserveObjectStacking === false ){
      UtilsCanvas.discardActiveObject( c );
    } 
    // sendToBackRectResizeLoop();
  }
  
  static sendToBack = ( c, object ) => {

    if( object === undefined || object === null ){
      object = UtilsCanvas.getActiveObject( c );
    }
    if( object === undefined || object === null ) return;
    c.sendToBack( object );
    c.bringForward( object ); // some uma posição, para o index 1
    c.bringForward( object ); // some uma posição, para o index 2
    // preserveObjectStacking se true traz os objetos selecionados ara cima
    if ( fabric.Object.prototype.preserveObjectStacking === false ){
      UtilsCanvas.discardActiveObject( c );
    } 
    // sendToBackRectResizeLoop();
  }
  
  static rotate = ( c, object, angle ) => {

    this.getActive( c, object ).then(( object )=>{
        
      //node.set("angle", 90)  
      const angleDeg = true;
      const PI_OVER_180 = Math.PI / 180;
    
      const getAngle = ( angle ) => {
        return angleDeg ? angle * PI_OVER_180 : angle;
      }
        
      const rotatePoint = ( x, y, rad ) => {
        const rcos = Math.cos( rad );
        const rsin = Math.sin( rad );
        return { x: x * rcos - y * rsin, y: y * rcos + x * rsin };
      };
    
      //current rotation origin (0, 0) relative to desired origin - center (object.width()/2, object.height()/2)
      let topLeft = {
        x: (-object.width * object.scaleX) / 2,
        y: (-object.height * object.scaleY) / 2
      };
      let current = rotatePoint(topLeft.x, topLeft.y, getAngle( object.angle || 0 ));
      let rotated = rotatePoint(topLeft.x, topLeft.y, getAngle( angle ));
      let dx = rotated.x - current.x, dy = rotated.y - current.y;
      object.set( "angle", angle );
      object.set( "left",  object.left + dx );
      object.set( "top",   object.top + dy );

      // render
      UtilsCanvas.renderAll( c );

    });

  }
  
  static rotateRight = ( c, object ) => {
    this.getActive( c, object ).then( object => {

      let angle = object.get("angle");
      switch (angle) {
        case 0:
          angle = angle + 90;
          break;
        case 90:
        case -270:
          angle = angle + 90;
          break;
        case 180:
        case -180:
          angle = angle + 90;
          break;
        case 270:
        case -90:
          angle = 0;
          break;
          default: angle = angle + 90;
      }
      this.rotate( c, object, angle );
  
    });
  }
  
  static rotateLeft = ( c, object ) => {
    this.getActive( c, object ).then( object => {

      let angle = object.get("angle");
      switch (angle) {
        case 0:
          angle = angle + -90;
          break;
        case -90:
        case 270:
          angle = angle + -90;
          break;
        case -180:
        case 180:
          angle = angle + -90;
          break;
        case -270:
        case 90:
          angle = 0;
          break;
          default: angle = angle - 90;
      }
      this.rotate( c, object, angle );
  
    });
  }

  static setLock = ( c, object, turnOn ) => {
    this.getActive( c, object ).then( object =>{

      turnOn = turnOn === undefined ? true : false ;
      UtilsCanvas.set({
        obj: object,
        conventionalSet: true,
    
        lockMovementX: turnOn,
        lockMovementY: turnOn,
        lockRotation: turnOn,
        lockScalingX: turnOn,
        lockScalingY: turnOn,
        lockUniScaling: turnOn,
        hoverCursor: turnOn,
    
        editable: !turnOn,  
        evented: !turnOn,
        hasBorders: !turnOn,
        hasRotatingPoint: !turnOn,
        selectable: !turnOn,
      });

    });
  }

  static lock = ( c ) => {
    this.setLock( c, undefined, true );
  }
  
  static unlock = ( c ) => {
    this.setLock( c, undefined, false );
  }

}

export default UtilsObject;