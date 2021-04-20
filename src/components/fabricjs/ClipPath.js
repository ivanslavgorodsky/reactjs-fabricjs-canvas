import React from "react";
import UtilsCanvas from "./../../../utils/UtilsCanvas";
import { fabric } from "fabric";
import { object } from "prop-types";
import GlobalEvents from "../event/GlobalEvents";
import UtilsObject from "../../../utils/UtilsObject";

class ClipPath extends React.Component {

  // Inverted clipPaths
  // fazer perfuracoes nos moldes 
  //   var canvas = new fabric.Canvas('ex11');
  //   var clipPath = new fabric.Circle({ radius: 100, top: -200, left: -200 });
  //   var clipPath2 = new fabric.Circle({ radius: 100, top: 0, left: 0 });
  //   var clipPath3 = new fabric.Circle({ radius: 100, top: 0, left: -200 });
  //   var clipPath4 = new fabric.Circle({ radius: 100, top: -200, left: 0 });
  //   var g = new fabric.Group([clipPath, clipPath2, clipPath3, clipPath4]);
  //   g.inverted = true;
  //   fabric.Image.fromURL('assets/dragon.jpg', function(img) {
  //     img.clipPath = g;
  //     img.scaleToWidth(500);
  //     canvas.add(img);
  //   });

  //https://stackoverflow.com/questions/34196472/fabric-js-svg-with-multiple-paths-cliping-to-multiple-images

  fromSVGUrl(c, url, objectToClip) {
    fabric.loadSVGFromURL(url, (objects, options) => {
      if ( objects !== null && objects !== undefined && Array.isArray(objects) ) {
        if (objects[0].hasOwnProperty('d') === false|| objects.length === 0) {
          console.log('Error: Not found tag d', objects);
          return;
        }
      }
      this.fromSVGString(c, objects[0].d);
    });
  }

  fromSVGString(c, SVGstring) {
    const clipVar = new fabric.Path(String(SVGstring).trim(), {
      left: 0,
      top: 0,
      objectCaching: false,
      // fill: 'black',
      // angle: 0,
      // scale: 1,
      // hasBorders: false,
      // hasControls: false,
      // hasRotatingPoint: false,
      // selectable: false,
      // preserveObjectStacking: false,
    }
    );

    const width = clipVar.getBoundingRect().width;
    const height = clipVar.getBoundingRect().height;

    // set dimension on svg clip
    clipVar.set({
      TypeName: 'SVG',
      width: width,
      height: height,
      left: c.width / 2 - width / 2,
      top: c.height / 2 - height / 2,
    });

    console.log('ClipPath: width:',clipVar.getBoundingRect().width);

    // on canvas
    c.clipTo = null; // remove function
    c.clipPath = null; // remove 
    c.clipPath = clipVar; // set svg
    c.clipPath.setCoords();
    clipVar.clone((clone)=>{
      c.clipPathObject = clone; // backup
    })

    // dispatch event
    GlobalEvents.dispatch('changeClipPath',{width:width,height:height,clipPath:clipVar});
    
    // render all
    UtilsCanvas.renderAll(c);
  }

  addRect(c, width, height, radius) {
    width = Number(Number(width).toFixed(0));
    height = Number(Number(height).toFixed(0));

    const clipVar = new fabric.Rect({
      TypeName: 'Rect',
      width: width,
      height: height,
      left: c.width / 2 - width / 2,
      top: c.height / 2 - height / 2,
      objectCaching: false,
      rx: Number(Number(radius).toFixed(1)),
      ry: Number(Number(radius).toFixed(1)),
      border: null,
      borderWidth: 0,
      borderWidth: null,
      // angle: 0,
      // scale: 1,
      // hasBorders: false,
      // hasControls: false,
      // hasRotatingPoint: false,
      // selectable: false,
      // preserveObjectStacking: false
    });

    // on canvas
    c.clipTo = null; // remove function
    c.clipPath = null; // remove
    c.clipPath = clipVar; // set
    c.clipPath.setCoords();
    clipVar.clone((clone)=>{
      c.clipPathObject = clone; // backup
    })

    // dispatch event
    GlobalEvents.dispatch('changeClipPath',{width:width,height:height,clipPath:clipVar});

    // render all
    UtilsCanvas.renderAll(c);
  }

  rotate = ( c, angle ) => {

    if( !c.hasOwnProperty('clipPath') || c.clipPath === undefined || c.clipPath === null ) return;

    console.log('clip-1',c.clipPath.getBoundingRect());

    c.clipPath.clone((clone)=>{
      // c.add(clone);
      UtilsObject.rotate(c,clone,90);
      c.clipTo = null;
      c.clipPath = null;
      c.clipPath = clone;
      clone.setCoords();
      c.clipPath.setCoords();
      c.renderAll();
      // c.remove(clone);
    });

    console.log('clip-2',c.clipPath.getBoundingRect());
    console.log('clip-3',this.getSVGDimensions(c.clipPath));

    console.log('c.clipPath',JSON.stringify(c.clipPath));

  }

  getClipPath = ( c ) => {
    if( c !== null && c !== undefined ){
      if( c.hasOwnProperty('clipPath') && c.clipPath !== undefined && c.clipPath !== null ){
        const { width, height, rx, ry } = c.clipPath;
        return { width: width, height: height, rx: rx, ry: ry, clipPath: c.clipPath };
      }
    }
    const { width, height, rx, ry } = c;
    return { width: width, height: height, rx: 0, ry: 0, clipPath: null };
  }

  getSVGDimensions = ( object ) => {
    var bBox = object.hasOwnProperty('getBBox') ? object.getBBox() : null;
    var bBou = object.hasOwnProperty('getBoundingClientRect') ? object.getBoundingClientRect() : null;
    return {
      width1: object.clientWidth || undefined,
      height1: object.clientHeight || undefined,
      width2: bBox && bBox.width,
      height2: bBox && bBox.height,
      width3: bBou && bBou.width,
      height3: bBou && bBou.height,
    }    
    // var svg1 = document.getElementById('svg1');
    // console.log(svg1);
    // console.log('style', svg1.style.width + 'x' + svg1.style.height);
    // console.log('client', svg1.clientWidth + 'x' + svg1.clientHeight);
    // console.log('offset', svg1.offsetWidth + 'x' + svg1.offsetHeight);
    // var bBox = svg1.getBBox();
    // console.log('XxY', bBox.x + 'x' + bBox.y);
    // console.log('size', bBox.width + 'x' + bBox.height);
  }

  remove = ( c ) => {
    c.clipTo = null; // remove function
    c.clipPath = null; // remove svg
    UtilsCanvas.renderAll(c);
  }

}

export default ClipPath;
