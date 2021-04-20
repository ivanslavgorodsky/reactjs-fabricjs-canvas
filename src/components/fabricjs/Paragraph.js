import React from "react";
import { fabric } from "fabric";
import UtilsCanvas from "./../utils/UtilsCanvas";

class Paragraph extends React.Component {

  state = {};

  addParagraph = ( c, settings, callback ) => {
    settings = {...settings, typeName: 'Paragraph' };
    this.add( c, settings, callback );
  }

  addLabel = ( c, settings, callback ) => {
    settings = {...settings, typeName: 'Label' };
    this.add( c, settings, callback );
  }

  addTex = ( c, settings, callback ) => {
    settings = {...settings, typeName: 'Text' };
    this.add( c, settings, callback );
  }

  //------------------------------------------------------------------------------------------------
  // Add Pragraph
  //------------------------------------------------------------------------------------------------
  add = ( c, settings, callback ) => {

    if ( typeof settings !== 'object' ) return;

    const { name, typeName, text, 
      top, left, originX, originY, 
      width, height, 
      fontFamily, textAlign, fontSize, charSpacing, lineHeight, 
      fill, backgroundColor, textBackgroundColor, stroke, 
      editable, 
      strokeWidth, 
      fontWeight, fontStyle, underline, overline, linethrough,
      selectable, hasControls, angle, opacity, index, relativePosition,
    } = settings ;

    const data = {
      key: UtilsCanvas.key(),
      typeName: typeName || 'Paragraph',
      name: name || '',
      width: width ? parseFloat( width || 100 , 1 ) : null ,
      height: height ? parseFloat( height || 100 , 1 ) : null ,
      left: relativePosition === false ? left : UtilsCanvas.setPositionLeft( c, left ) ,
      top: relativePosition === false ? top : UtilsCanvas.setPositionTop( c, top ) ,
      originX: originX || "left",
      originY: originY || "top",
      angle: isNaN(angle) ? 0 : angle ,

      stroke: stroke || null,
      strokeWidth: strokeWidth || null,
      strokeUniform: true,

      selectable: selectable === false ? false  : true ,
      hasControls: hasControls === false ? false : true ,
      objectCaching: false,

      opacity: opacity || 1 ,
      fill: fill || '#000000' ,
      backgroundColor: backgroundColor || null,
      textBackgroundColor: textBackgroundColor || null,

      text: text || 'Text Edit',
      fontFamily: fontFamily || 'helvetica',   
      fontSize: fontSize || 40,
      charSpacing: charSpacing || null,       
      lineHeight: lineHeight || 1.16,
      textAlign: textAlign || 'left', // "left", "center", "right", "justify", "justify-left", "justify-center" or "justify-right"

      fontStyle: fontStyle || '', // '', 'normal', 'italic' or 'oblique'
      fontWeight: fontWeight || 'normal', // 'bold, normal, 400, 600, 800',

      underline: typeof underline === 'boolean' ? underline : false,
      overline: typeof overline === 'boolean' ? overline : false, 
      linethrough: typeof overline === 'boolean' ? linethrough : false, 

      editable: editable || true,
      lockUniScaling: true, // no change
    };

    // fontFamily: o.fontFamily,
    // fontFileName: '',
    // fontFileSize: '',
    // charSpacing : (fabric.util.parseUnit(o.letterSpacing, o.fontSize) / o.fontSize * 1000),

    if(c.hasOwnProperty('clipPath') && c.clipPath){
      if(data.width > c.clipPath.width){
        data.width = c.clipPath.width;
      }
      if(data.height > c.clipPath.height){
        data.height = c.clipPath.height;
      }
    }

    let paragraph = null;

    if(data.typeName === 'Paragraph'){
      paragraph = new fabric.Textbox( data.text, data );
    } else if(data.typeName === 'Label'){
      paragraph = new fabric.Text( data.text, data );
    } else { //if(data.typeName === 'Text')
      paragraph = new fabric.IText( data.text, {...data, typeName: 'Text'} );
    }

    c.add(paragraph);
    c.centerObject(paragraph); // ???
    c.setActiveObject(paragraph);

    paragraph.setControlVisible('mb', false);
    paragraph.setControlVisible('mt', false);

    if(data.typeName === 'Text' || data.typeName === 'Label'){
      paragraph.setControlVisible('ml', false);
      paragraph.setControlVisible('mr', false);    
    }

    if (index !== undefined) {
      paragraph.moveTo(index);
    }

    UtilsCanvas.renderAll( c );

    c.history.register();

    if( callback !== undefined ){
      callback();
    }

  }

}

export default Paragraph;
