
import React from "react";
import { useState, useEffect } from "react";

import UtilsCanvas from "./utils/UtilsCanvas";
import Switch from "@material-ui/core/Switch";

import { fabric } from "fabric";

import { useGlobal } from "./config/global";
import { Tooltip } from "@material-ui/core";



const OptionsButton = (props) => {
  
  const {valGlobal} = useGlobal();
  var canvas = valGlobal.canvas;

  const [snapState, setSnapState] = useState(false);
  const g_delta = 9;
  const g_DirectionsColor = "#ff0000";

  var addedDirections = [];
  var commonLines = [];

  const handleObjectMoved = (e) => {
    removeLines();
  };

  const handleObjectMoving = (e) => {

    
    if (snapState === false) return;


    let isMoreThanOneSelected = e.target["_objects"] ? 1 : 0;
    removeLines();

    if (isMoreThanOneSelected) return;

    //canvas.bringToFront(e.target); // when draggin i-text over image

    let directionsArray = [];
    let linesArr = getDirectionLines(e.target);

    canvas.getObjects().forEach((obj) => {
      if (obj === e.target) return;

      if (obj.type === "image" || obj.type === "i-text") {
        let dirArr = getDirectionLines(obj);
        directionsArray = directionsArray.concat(dirArr);
      }
    });
    // compare with common direcion lines
    directionsArray = directionsArray.concat(commonLines);


    // for objects on canvas
    for (let line of directionsArray)
      compareDirectionLines(linesArr, line, e.target);
  };

  useEffect(() => {

    if (!canvas) return;

    //let ao = canvas.getActiveObject();
    //console.log("!!!!!!!!!!", ao);

    // defalut values for center directions
    commonLines.push({
      x1: canvas.width / 2,
      x2: canvas.width / 2,
      y1: 0,
      y2: canvas.height,
    });
    commonLines.push({
      x1: 0,
      x2: canvas.width,
      y1: canvas.height / 2,
      y2: canvas.height / 2,
    });

    
    canvas.on("object:moved", handleObjectMoved);
    canvas.on("object:moving", handleObjectMoving);

    return () => {
      canvas.off("object:moving", handleObjectMoving);
      canvas.off("object:moved", handleObjectMoved);
    };
  }, [canvas, snapState]);

  if (!canvas ) return null;

  function removeLines() {
    for (let l of addedDirections) canvas.remove(l);

    addedDirections = [];
  }

  function getDirectionLines(obj) {
    let x1 = obj.left,
      x2 = obj.left + obj.width * obj.scaleX,
      y1 = obj.top,
      y2 = obj.top + obj.height * obj.scaleY,
      cx = obj.left + (obj.width * obj.scaleX) / 2,
      cy = obj.top + (obj.height * obj.scaleY) / 2;

    let l1 = { x1: x1, x2: x1, y1: 0, y2: canvas.height },
      l2 = { x1: x2, x2: x2, y1: 0, y2: canvas.height },
      l3 = { x1: 0, x2: canvas.width, y1: y1, y2: y1 },
      l4 = { x1: 0, x2: canvas.width, y1: y2, y2: y2 },
      l5 = { x1: cx, x2: cx, y1: 0, y2: canvas.height },
      l6 = { x1: 0, x2: canvas.width, y1: cy, y2: cy };

    return [l1, l2, l3, l4, l5, l6];
  }

  function snap2Direction(line, direction, activeTarget) {
    switch (direction) {
      case 0:
        activeTarget.left = line.x1;
        break;
      case 1:
        activeTarget.left = line.x1 - activeTarget.width * activeTarget.scaleX;
        break;
      case 2:
        activeTarget.top = line.y1;
        break;
      case 3:
        activeTarget.top = line.y1 - activeTarget.height * activeTarget.scaleY;
        break;
      case 4:
        activeTarget.left =
          line.x1 - (activeTarget.width * activeTarget.scaleX) / 2;
        break;
      case 5:
        activeTarget.top =
          line.y1 - (activeTarget.height * activeTarget.scaleY) / 2;
        break;

      default:
        break;
    }

    activeTarget.setCoords();
  }

  function drawDirection(line) {

    const strokeWidth = 1.1;

    let l = new fabric.Line([line.x1, line.y1, line.x2, line.y2], {
      strokeDashArray: [strokeWidth*5, strokeWidth*5],
      stroke: g_DirectionsColor,
      strokeWidth: strokeWidth,
      selectable: false,
      evented: false,
    });

    UtilsCanvas.getCanvas(canvas).add(l);
    addedDirections.push(l);
  }

  function compareDirectionLines(lArr, line, activeTarget) {
    for (let i = 0; i < lArr.length; i++) {
      let l = lArr[i];
      if (
        Math.abs(l.x1 - line.x1) < g_delta &&
        Math.abs(l.x2 - line.x2) < g_delta &&
        Math.abs(l.y1 - line.y1) < g_delta &&
        Math.abs(l.y2 - line.y2) < g_delta
      ) {
        drawDirection(line);
        snap2Direction(line, i, activeTarget);
      }
    }
  }

  const handleStateChange = (event) => {

    if (event.target) setSnapState(event.target.checked);
    else setSnapState(event);
  };


  return (
    <React.Fragment>
      <Tooltip title="Auto Snap Feature" placement="bottom">
          <Switch checked={snapState} onChange={handleStateChange}
            onClick={(event) => {
              handleStateChange(snapState ? false : true);
            }}
          />
      </Tooltip>
    </React.Fragment>
  );
};

export default OptionsButton;
