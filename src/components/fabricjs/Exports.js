import React from "react";
import UtilsCanvas from "./../utils/UtilsCanvas";
import GlobalEvents from "./../event/GlobalEvents";

export default class Exports extends React.Component {

  state = {
    properties: [
      // personal
      "_controlsVisibility", // ???
      "isFabricCanvas",
      "typeName",
      "key",
      "name",
      "responsive", // to elements like shadow, follow other elements dynamically
      "clipPathObject", // temporary test (back)
      "document", // to avenuz report, tecnical, ficha tecnica 
      // radius
      "rx",
      "ry",
      // font
      "fonts",
      "fontFileName",
      "fontFileSize",
      // pattern fill & stroke
      "pattern",
      // "patternFillName",
      // "patternFillUrl",
      // "patternFillScale",
      // "patternFillWidth",
      // "patternFillHeight",
      // "patternFillAngle",
      // "patternFillOffsetX",
      // "patternFillOffsetY",
      //pattern stroke
      // "patternStrokeName",
      // "patternStrokeUrl",
      // "patternStrokeScale",
      // "patternStrokeWidth",
      // "patternStrokeHeight",
      // "patternStrokeAngle",
      // "patternStrokeOffsetX",
      // "patternStrokeOffsetY",
      // "patternStrokeStrokeWidth",
      // "patternStrokeRepeat",
      // pattern stroke
      // "canvasWidth",
      // "canvasHeight",
      // "clipWidth",
      // "clipHeight",
      "evented",
      "hasControl",
      "hasBorders",
      "hasRotatingPoint",
      "selectable",
      "objectCaching",
      "preserveObjectStacking",
      "absolutePositioned",
      // lock
      "lockMovementX",
      "lockMovementY",
      "lockRotation",
      "lockScalingX",
      "lockScalingY",
      "lockUniScaling",
      "hoverCursor",
      // allow images
      "crossOrigin",
    ]
  }

  getProperties = () => {
    return this.state.properties;
  }

  // https://stackoverflow.com/questions/45984263/fabricjs-clipping-and-svg-export

  /**
   * Promisse
   * @param {canvas} c 
   * @returns Promisse
   */
   toJson = (c) => {
    if ( !c.hasOwnProperty('clipPath') || c.clipPath === null || c.clipPath === undefined) {
      window.alert("Define material size on millimeters");
      return;
    }

    // init class
    const uc = new UtilsCanvas();
    // save angle zero
    uc.rotateReset( c );
    // zoom to 1:1
    uc.zoomReset( c ); 
    // Transforma o stage do canvas no tamanho do CLIP
    const {width,height} = c.clipPath.getBoundingRect();
    // block resize and events
    c.exporting = true;
    // set dimensions    
    c.setWidth(width);
    c.setHeight(height);
    // center content
    uc.center( c );
    
    return new Promise((resolve, reject) => {
      try {
        const json = JSON.stringify(c.toJSON(this.state.properties));
        // allow resize and events
        c.exporting = false;
        GlobalEvents.window.dispatch('resize',{})
        // window..dispatchEvent(new CustomEvent(event, { detail: data }));
        // window.dispatch('resize');
        resolve(json);
      } catch (error) {
        // allow resize and events
        c.exporting = false;
        GlobalEvents.window.dispatch('resize',{})
        reject(error);
      }
    });
  };

  keyDownControlSave = ( event, callback ) => {
    if(
        (event.which === 83 && (event.ctrlKey || event.metaKey)) ||
        (event.keyCode === 83 && (navigator.platform.match("Mac") ? event.metaKey : event.ctrlKey))
      ) {
      event.preventDefault();
      if( callback !== undefined ){
        callback();
      }
    };
  };

  toImageDownload = ( c ) => {

    if (!window.localStorage) {
      window.alert("This function is not supported by your browser.");
      return;
    }

    // init class
    const uc = new UtilsCanvas();
    // save angle zero
    uc.rotateReset( c );
    // zoom to 1:1
    c.setViewportTransform([1,0,0,1,0,0]); 
    // Transforma o stage do canvas no tamanho do CLIP
    const {width,height} = c.clipPath.getBoundingRect();
    const {backgroundColor} = c;
    // block resize and events
    c.exporting = true;
    // set dimensions    
    c.setWidth(width);
    c.setHeight(height);
    // transparent
    c.set({ backgroundColor: null });
    // center content
    uc.center( c );

    try {

      // UtilsCanvas.centerContainer( c );
      const dataURL = c.toDataURL({
        enableRetinaScaling: true,
        format: "png", // png | jpg
        // quality: 1, // only jpg
        multiplier: 2, // scale, default 1
        width: width,
        height: height,
        left: 0,
        top: 0,
      });

      const link = document.createElement("a");
      link.download = `avenus-awesome-${new Date().getTime()}.png`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      // done 
      c.set({ backgroundColor: backgroundColor });
      c.exporting = false;
      GlobalEvents.window.dispatch('resize',{})
    
    } catch (error) {

      window.alert("cant download");
      // done
      c.set({ backgroundColor: backgroundColor });
      c.exporting = false;
      GlobalEvents.window.dispatch('resize',{})

    }
  };

  toBase64 = ( c ) => {
    return c.toDataURL({
      enableRetinaScaling: true,
      format: "png", // png | jpg
      // quality: 1, // only jpg
      multiplier: 2, // scale, default 1
      // width: width,
      // height: height,
      // left: 0,
      // top: 0,
    });
  };

}
