import React from "react";
import { fabric } from "fabric";
import UtilsCanvas from "./../utils/UtilsCanvas";
import UtilsObject from "./../utils/UtilsObject";

//https://cancerberosgx.github.io/demos/misc/fabricRectangleFreeDrawing.html
//http://fabricjs.com/freedrawing
//https://github.com/tennisonchan/fabric-brush

const STROKE_WIDTH = 0;
const STROKE_COLOR = null; //'rgb(0,0,0,1)';
const FILL_COLOR = '#DDDDDD'; //'rgb(255,255,255,0.9)';
const OPACITY = 1;

class Shapes extends React.Component {

  state = {};

  constructor(props) {
    super(props);
    this.removeDrawEvents = this.removeDrawEvents.bind(this);
  }

  removeDrawEvents = (c) => {
    c.off("mouse:down");
    c.off("mouse:up");
    c.off("mouse:move");
  };

  //------------------------------------------------------------------------------------------------
  // Line
  //------------------------------------------------------------------------------------------------
  drawLine = (c) => {

    this.removeDrawEvents(c);
    UtilsObject.enableSelectable(c, false);

    let line, isDown;
    UtilsCanvas.getCanvas(c).on("mouse:down", (o) => {
      console.log('on("mouse:down")');
      UtilsCanvas.enableSelection(c, false);
      //closePanelBrand();

      isDown = true;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      let points = [pointer.x, pointer.y, pointer.x, pointer.y];
      line = new fabric.Line(points, {
        key: UtilsCanvas.key(),
        typeName: "Line",
        fill: null, //'#000000', //gnnc.working.fillColor,
        stroke: '#000000',//STROKE_COLOR, //gnnc.working.strokeColor,
        strokeWidth: 2, //gnnc.working.strokeWeight,
        strokeLineJoin: "round", //(one of "bevil", "round", "miter")
        strokeLineCap: "round", //(one of "bevil", "round", "miter")
        strokeUniform: true, //scale stroke with object
        originX: "left",
        originY: "top",
        selectable: true,
        objectCaching: false,
      });

      UtilsCanvas.getCanvas(c).add(line);
      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:move", (o) => {
      console.log('on("mouse:move")');
      if (!isDown) return;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      line.set({
        x2: parseFloat(pointer.x.toFixed(2)),
        y2: parseFloat(pointer.y.toFixed(2)),
      });
      line.setCoords();
      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:up", (o) => {
      console.log('on("mouse:up")');
      this.removeDrawEvents(c);
      UtilsCanvas.enableSelection(c, true);
      UtilsObject.enableSelectable(c, true);
      isDown = false;
      console.log(line);
      line.setCoords();
      UtilsCanvas.setActiveObject(c, line);
      UtilsCanvas.renderAll(c);

      if (line.width < 5 && line.height < 5) {
        console.log("line less 4px:", line.width);
        UtilsCanvas.remove(c, line);
      }

      c.history.register();

    });
  };

  //------------------------------------------------------------------------------------------------
  // Circle
  //------------------------------------------------------------------------------------------------
  drawCircle = (c) => {
    this.removeDrawEvents(c);
    UtilsObject.enableSelectable(c, false);

    let circle, isDown, origX;
    UtilsCanvas.getCanvas(c).on("mouse:down", (o) => {
      console.log('on("mouse:down")');
      UtilsCanvas.discardActiveObject(c);
      UtilsCanvas.enableSelection(c, false);
      //closePanelBrand();

      isDown = true;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      origX = pointer.x;
      circle = new fabric.Circle({
        key: UtilsCanvas.key(),
        typeName: "Circle",
        left: pointer.x,
        top: pointer.y,
        fill: FILL_COLOR, //gnnc.working.fillColor,
        stroke: STROKE_COLOR, //gnnc.working.strokeColor,
        strokeWidth: STROKE_WIDTH, //gnnc.working.strokeWeight,
        strokeUniform: true, //scale stroke with object
        radius: 1,
        selectable: true,
        originX: "center", //"center"
        originY: "center", //"center"
        objectCaching: false,
      });

      circle.setControlVisible("mb", false);
      circle.setControlVisible("mt", false);
      circle.setControlVisible("mr", false);
      circle.setControlVisible("ml", false);

      UtilsCanvas.getCanvas(c).add(circle);
      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:move", (o) => {
      console.log('on("mouse:move")');
      if (!isDown) return;
      //UtilsCanvas.discardActiveObject(c);
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      circle.set({
        radius: +parseFloat(Math.abs(origX - pointer.x)).toFixed(1),
      });
      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:up", (o) => {
      console.log('on("mouse:up")');
      circle.set({
        originX: "left",
        originY: "top",
        left: circle.left - circle.radius - circle.strokeWidth / 2,
        top: circle.top - circle.radius - circle.strokeWidth / 2,
      });

      this.removeDrawEvents(c);
      UtilsCanvas.enableSelection(c, true);
      UtilsObject.enableSelectable(c, true);
      isDown = false;
      circle.setCoords();
      UtilsCanvas.setActiveObject( c, circle );
      UtilsCanvas.renderAll(c);

      c.history.register();

    });
  };

  //------------------------------------------------------------------------------------------------
  // Ellipse
  //------------------------------------------------------------------------------------------------
  drawEllipse = (c) => {
    this.removeDrawEvents(c);
    UtilsObject.enableSelectable(c, false);
    //closePanelBrand();

    let ellipse, isDown, origX, origY;
    UtilsCanvas.getCanvas(c).on("mouse:down", (o) => {
      console.log('on("mouse:down")');
      UtilsCanvas.discardActiveObject(c);
      UtilsCanvas.enableSelection(c, false);

      isDown = true;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;
      ellipse = new fabric.Ellipse({
        key: UtilsCanvas.key(),
        typeName: "Ellipse",
        left: parseFloat(origX.toFixed(1)),
        top: parseFloat(origY.toFixed(1)),
        fill: FILL_COLOR, //gnnc.working.fillColor,
        stroke: STROKE_COLOR, //gnnc.working.strokeColor,
        strokeWidth: STROKE_WIDTH, //gnnc.working.strokeWeight,
        strokeUniform: true,
        rx: pointer.x - origX,
        ry: pointer.y - origY,
        selectable: true,
        originX: "left", //"center"
        originY: "top", //"center"
        objectCaching: false,
      });

      UtilsCanvas.getCanvas(c).add(ellipse);
      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:move", (o) => {
      console.log('on("mouse:move")');
      if (!isDown) return;

      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      let rx = Math.abs(origX - pointer.x) / 2;
      let ry = Math.abs(origY - pointer.y) / 2;
      if (rx > ellipse.strokeWidth) {
        rx -= ellipse.strokeWidth / 2;
      }
      if (ry > ellipse.strokeWidth) {
        ry -= ellipse.strokeWidth / 2;
      }
      ellipse.set({
        rx: parseFloat(rx.toFixed(2)),
        ry: parseFloat(ry.toFixed(2)),
      });

      if (origX > pointer.x) {
        ellipse.set({ originX: "right" });
      } else {
        ellipse.set({ originX: "left" });
      }
      if (origY > pointer.y) {
        ellipse.set({ originY: "bottom" });
      } else {
        ellipse.set({ originY: "top" });
      }

      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:up", (o) => {
      console.log('on("mouse:up")');
      this.removeDrawEvents(c);
      UtilsCanvas.enableSelection(c, true);
      UtilsObject.enableSelectable(c, true);
      isDown = false;
      ellipse.setCoords();
      UtilsCanvas.setActiveObject( c, ellipse );
      UtilsCanvas.renderAll(c);

      if (ellipse.width < 5 && ellipse.height < 5) {
        console.log("ellipse less 4px:", ellipse.width);
        UtilsCanvas.remove(c, ellipse);
      }

      c.history.register();

    });
  };

  //------------------------------------------------------------------------------------------------
  // Rect
  //------------------------------------------------------------------------------------------------
  drawRect = (c) => {
    this.removeDrawEvents(c);
    UtilsObject.enableSelectable(c, false);
    //closePanelBrand();

    let rect, isDown, origX, origY;
    UtilsCanvas.getCanvas(c).on("mouse:down", (o) => {
      console.log('on("mouse:down")');
      UtilsCanvas.enableSelection(c, false);

      isDown = true;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;

      rect = new fabric.Rect({
        key: UtilsCanvas.key(),
        typeName: "Rect",
        left: parseFloat(origX.toFixed(1)),
        top: parseFloat(origY.toFixed(1)),
        originX: "left",
        originY: "top",
        rx: 0,
        ry: 0,
        width: parseFloat(parseFloat(pointer.x - origX).toFixed(1)),
        height: parseFloat(parseFloat(pointer.y - origY).toFixed(1)),
        angle: 0,
        fill: FILL_COLOR, //gnnc.working.fillColor,
        stroke: STROKE_COLOR, //gnnc.working.strokeColor,
        strokeWidth: STROKE_WIDTH, //gnnc.working.strokeWeight,
        strokeUniform: true,
        //transparentCorners: false,
        selectable: true,
        objectCaching: false,
      });

      UtilsCanvas.getCanvas(c).add(rect);
      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:move", (o) => {
      console.log('on("mouse:move")');
      if (!isDown) return;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);

      pointer.x = pointer.x < 0 ? 0 : pointer.x;
      pointer.y = pointer.y < 0 ? 0 : pointer.y;

      if (origX > pointer.x) {
        rect.set({
          left: parseFloat(Math.abs(pointer.x).toFixed(1)),
        });
      }
      if (origY > pointer.y) {
        rect.set({
          top: parseFloat(Math.abs(pointer.y).toFixed(1)),
        });
      }

      rect.set({
        width: parseFloat(Math.abs(origX - pointer.x).toFixed(1)),
        height: parseFloat(Math.abs(origY - pointer.y).toFixed(1)),
      });

      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:up", (o) => {
      console.log('on("mouse:up")');
      this.removeDrawEvents(c);
      UtilsCanvas.enableSelection(c, true);
      UtilsObject.enableSelectable(c, true);
      isDown = false;
      rect.setCoords();
      UtilsCanvas.setActiveObject( c, rect );
      UtilsCanvas.renderAll(c);

      c.history.register();

    });
  };

  //------------------------------------------------------------------------------------------------
  // Square
  //------------------------------------------------------------------------------------------------
  drawSquare = (c) => {
    this.removeDrawEvents(c);
    UtilsObject.enableSelectable(c, false);
    //closePanelBrand();

    let square, isDown, origX, origY;
    UtilsCanvas.getCanvas(c).on("mouse:down", (o) => {
      console.log('on("mouse:down")');
      UtilsCanvas.enableSelection(c, false);

      isDown = true;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);
      origX = pointer.x;
      origY = pointer.y;

      console.log("pointer", pointer);

      square = new fabric.Rect({
        key: UtilsCanvas.key(),
        typeName: "Square",
        left: parseFloat(origX.toFixed(1)),
        top: parseFloat(origY.toFixed(1)),
        originX: "left",
        originY: "top",
        rx: 0,
        ry: 0,
        width: parseFloat(parseFloat(pointer.x - origX).toFixed(1)),
        height: parseFloat(parseFloat(pointer.y - origY).toFixed(1)),
        angle: 0,
        fill: FILL_COLOR, //gnnc.working.fillColor,
        stroke: STROKE_COLOR, //gnnc.working.strokeColor,
        strokeWidth: STROKE_WIDTH, //gnnc.working.strokeWeight,
        strokeUniform: true,
        //transparentCorners: false,
        selectable: true,
        objectCaching: false,
      });

      UtilsCanvas.getCanvas(c).add(square);
      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:move", (o) => {
      console.log('on("mouse:move")');
      if (!isDown) return;
      let pointer = UtilsCanvas.getCanvas(c).getPointer(o.e);

      console.log("pointer", pointer);
      pointer.x = pointer.x < origX ? origX : pointer.x;
      pointer.y = pointer.y < origX ? origX : pointer.y;

      if (origX > pointer.x) {
        square.set({
          left: parseFloat(Math.abs(pointer.x).toFixed(1)),
        });
      }
      if (origY > pointer.y) {
        square.set({
          top: parseFloat(Math.abs(pointer.y).toFixed(1)),
        });
      }

      let a = origX - pointer.x;
      let b = origY - pointer.y;

      square.set({
        width: parseFloat(Math.abs(a > b ? a : b).toFixed(1)),
        height: parseFloat(Math.abs(a > b ? a : b).toFixed(1)),
      });

      UtilsCanvas.renderAll(c);
    });

    UtilsCanvas.getCanvas(c).on("mouse:up", (o) => {
      console.log('on("mouse:up")');
      this.removeDrawEvents(c);
      UtilsCanvas.enableSelection(c, true);
      UtilsObject.enableSelectable(c, true);
      isDown = false;
      square.setCoords();
      UtilsCanvas.setActiveObject( c, square );
      UtilsCanvas.renderAll(c);

      if (origX > square.x && origY > square.Y) {
        UtilsCanvas.remove(c, square);
      }
      if (square.width < 5) {
        console.log("Square less 5px:", square.width);
        square.set({
          width: 20,
          height: 20,
        });
      }

      c.history.register();

    });
  };

  // Draw Poligon
  // http://jsfiddle.net/77vg88mc/34/

  //------------------------------------------------------------------------------------------------
  // Add Rectangle
  //------------------------------------------------------------------------------------------------
  addRectangle = ( c, settings, callback ) => {

    if ( typeof settings !== 'object' ) return;

    const { 
      name, width, height, originX, originY, 
      selectable, hasControls, angle, opacity, scale, 
      index, fill, stroke, radius, strokeWidth, 
      top, left, relativePosition
    } = settings ;
    
    const shape = new fabric.Rect({
      key: UtilsCanvas.key(),
      typeName: "Rect",
      name: name || "",
      width: parseFloat( width || 100 , 1 ),
      height: parseFloat( height || 100 , 1 ),
      left: relativePosition === false ? left : UtilsCanvas.setPositionLeft( c, left )  ,
      top: relativePosition === false ? top : UtilsCanvas.setPositionTop( c, top ) ,
      originX: originX || "left",
      originY: originY || "top",
      scale: isNaN(scale) ? 0 : scale,
      rx: isNaN(radius) ? 0 : radius ,
      ry: isNaN(radius) ? 0 : radius ,
      angle: isNaN(angle) ? 0 : angle ,
      opacity: opacity || OPACITY ,
      fill: fill || FILL_COLOR,
      stroke: stroke || STROKE_COLOR,
      strokeWidth: strokeWidth || STROKE_WIDTH,
      strokeUniform: true,
      selectable: selectable === false ? false  : true ,
      hasControls: hasControls === false ? false : true ,
      objectCaching: false,
    });

    // shape.setPatternFill({
    //     source: imageLoaded,
    //     repeat: 'no-repeat',
    //     patternTransform: [0.2, 0, 0, 0.2, 0, 0]
    // });

    c.add( shape );

    // change index object before create and add on canvas
    if ( index !== undefined ) {
      shape.moveTo( index );
    }

    // set active object
    UtilsCanvas.setActiveObject( c, shape );
    // render all
    UtilsCanvas.renderAll( c );

    c.history.register();

    if( callback !== undefined ){
      callback();
    }

  }

  // Pen
  // http://fabricjs.com/freedrawing

}

export default Shapes;
