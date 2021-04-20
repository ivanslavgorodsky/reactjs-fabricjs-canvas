import React from "react";
import { fabric } from "fabric";
import UtilsCanvas from "../../../utils/UtilsCanvas";
import GlobalEvents from "../event/GlobalEvents";

export default class Imports extends React.Component {

  fromJson = ( c, jsonString, register ) => {

    // reset history
    register = register === undefined ? true : register; 
    if( register === true ){
      GlobalEvents.dispatch('resetRegister', c );      
    }

    //UtilsCanvas.clear(c);
    let fonts = [];
    let sc = new fabric.Canvas();
    sc.loadFromJSON(
      jsonString,
      // canvas.renderAll.bind(canvas),
      (event) => {
        console.log(fonts);
        // TODO librariesFont.multiLoad(fonts, (event) => {
        this.final(c, jsonString, register);
        // });
      },
      (o, object) => {
        // `o` = json object
        // `object` = fabric.Object instance
        console.log(o,object);
        return;
        // if (object.hasOwnProperty("fontFileName") === true) {
        //   const { fontFamily, fontFileName, fontFileSize } = object;
        //   fonts.push({
        //     fontFamily: fontFamily,
        //     fontFileName: fontFileName,
        //     fontFileSize: fontFileSize,
        //   });
        // }
      }
    );
  };

  final = ( c, j, r ) => {
    const uc = new UtilsCanvas();
    console.log("Load JSon");
    c.loadFromJSON(
      j, // json
      (event) => {
        // register
        if( r === true){
          c.history.register();
        }
        // render
        c.renderAll.bind( c );
        // center content
				uc.center( c );
        // zoom 1:1
        c.setViewportTransform([1, 0, 0, 1, 0, 0]);
        // TODO if (librariesHistory.state.history.value.length === 0) {
        // TODO 	librariesHistory.state.save();
        // TODO }
      },
      (o, object) => {
        // librariesFont.preInitializeFontsFromImport(object);
        // console.log(o,object);
        // `o` = json object
        // `object` = fabric.Object instance
        // ... do some stuff ...
      }
    );
  };

}
