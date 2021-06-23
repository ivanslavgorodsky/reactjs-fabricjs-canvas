import { Tooltip } from "@material-ui/core";
import React from "react";

// svg icon
import shapeOval from "./../../assets/personalSVG/shape-oval.svg";
import shapeRectFull from "./../../assets/personalSVG/shape-rect-full.svg";

// icon
import RadioButtonUncheckedIcon from "@material-ui/icons/RadioButtonUnchecked";
import CropSquareIcon from "@material-ui/icons/CropSquare";
import Crop75Icon from "@material-ui/icons/Crop75";
import RemoveIcon from "@material-ui/icons/Remove";
import Shapes from "../../components/fabricjs/Shapes";
import TextRotationNoneIcon from '@material-ui/icons/TextRotationNone';
import FormatTextdirectionLToRIcon from '@material-ui/icons/FormatTextdirectionLToR';
import { useGlobal } from "../../components/config/global";
import Paragraph from "../../components/fabricjs/Paragraph";
import CreateIcon from '@material-ui/icons/Create';

import OptionsButton from "../../components/OptionsBtn";

const styles = {
  tool: {
    zIndex: 10,
    position: 'absolute', 
    float: 'left',
    margin: 10, 
  },
  button: {
    float: 'left',
    width: 50, 
    height: 50, 
    borderRadius: 7, 
    backgroundColor: '#e9e9e9', 
    border: 'none', 
    cursor: 'pointer', 
    marginRight: 1,
  },
  buttonHover: {
    backgroundColor: '#ffffff', 
  }
};

const PanelToolBigButton = (props) => {

  const {valGlobal} = useGlobal();
  
  const drawPen = () => {
    valGlobal.canvas.isDrawingMode = !valGlobal.canvas.isDrawingMode;
  };

  const drawLine = () => {
    new Shapes().drawLine(valGlobal.canvas);
  };

  const drawCircle = () => {
    new Shapes().drawCircle(valGlobal.canvas);
  };

  const drawEllipse = () => {
    new Shapes().drawEllipse(valGlobal.canvas);
  };

  const drawRect = () => {
    new Shapes().drawRect(valGlobal.canvas);
  };

  const drawSquare = () => {
    new Shapes().drawSquare(valGlobal.canvas);
  };

  const addRect = () => {
    const {width, height} = valGlobal.canvas.clipPath;
    new Shapes().addRectangle(valGlobal.canvas, { radius: 0, left: 0, top: 0, borderWidth: 0, opacity: 1, width: width, height: height });
    // const {width, height, top, left} = valGlobal.canvas.clipPath;
    // new Shapes().addRectangle(valGlobal.canvas, { radius:0, left:left, top:top, borderWidth:0, opacity:1, width:width, height:height, relativePosition:false });
  };

  const addText = () => {
    new Paragraph().addTex(valGlobal.canvas,{
      text: 'Lorem ipsum dolor sit amet.',
      fontSize: 30,
    });
  };

  const addParagraphy = () => {
    new Paragraph().addParagraph(valGlobal.canvas,{
      text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      fontSize: 30,
      width: 400,
      // text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Praesent id laoreet metus, vel pharetra dolor. Suspendisse sagittis commodo leo vel dignissim. Curabitur tempus scelerisque tempus. Ut lacinia magna et mattis congue. Donec semper ut nisi sit amet placerat. Sed dictum luctus tortor vel lacinia. Donec dignissim tellus aliquet, finibus enim vitae, fringilla lacus. Vivamus euismod mollis urna, eget accumsan eros aliquet eget. Nunc velit justo, sodales quis placerat quis, ullamcorper tempus massa. Duis tristique mauris eget augue luctus venenatis. Nam accumsan viverra arcu, nec fermentum tortor bibendum vitae. Sed mauris turpis, maximus at mollis quis, tristique laoreet justo. Cras auctor aliquet neque, vitae molestie nisl volutpat vitae. Fusce egestas nulla sit amet placerat pharetra.',
      // fontSize: 10,
      // width: 400,
    });
  };


  const list = [
    {label: 'Draw Pen',           name: 'pen', fn: drawPen ,            icon: <CreateIcon style={{ width: 20 }}/>},
    {label: 'Draw Line',          name: 'line', fn: drawLine ,          icon: <RemoveIcon/>},
    {label: 'Draw Ellipse',       name: 'ellipse', fn: drawEllipse ,    icon: <img src={shapeOval} style={{ maxHeight: 16 }} alt="ellipse"/>},
    {label: 'Draw Circle',        name: 'circle', fn: drawCircle ,      icon: <RadioButtonUncheckedIcon />},
    {label: 'Draw Rect',          name: 'rect', fn: drawRect ,          icon: <Crop75Icon />},
    {label: 'Draw Square',        name: 'square', fn: drawSquare ,      icon: <CropSquareIcon />},
    {label: 'Add Rect Full Size', name: 'rectfull', fn: addRect ,       icon: <img src={shapeRectFull} style={{ maxHeight: 17 }} alt="rectfull"/>},
    {label: 'Add Label',          name: 'label', fn: addText ,           icon: <TextRotationNoneIcon />},
    // {label: 'Add Label',          name: 'label', fn: addLabel ,         icon: <TextRotationNoneIcon />},
    {label: 'Add Paragraph',      name: 'paragraph', fn: addParagraphy ,icon: <FormatTextdirectionLToRIcon />},
  ];

  return (
    <div style={styles.tool}>
      {list.map((el)=>(
        <Tooltip title={el.label} placement="bottom">
          <button style={styles.button} key={el.label} onClick={()=>el.fn()} >
            {el.icon}
          </button>
        </Tooltip>
      ))}
      <OptionsButton />
    </div>
  );
};
export default PanelToolBigButton;