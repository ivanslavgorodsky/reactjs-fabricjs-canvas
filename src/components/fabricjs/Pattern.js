import React from "react";
import { fabric } from "fabric";
import UtilsCanvas from "../../../utils/UtilsCanvas";

export default class Pattern extends React.Component {
  // rect.setPatternFill({
  //   source: img,
  //   repeat: 'no-repeat',
  //   patternTransform: [0.2, 0, 0, 0.2, 0, 0]
  // });

  add = (c, settings, callback) => {
    if (typeof settings !== "object") return;

    let {
      object,
      name,
      source,
      scale,
      width,
      height,
      offsetX,
      offsetY,
      angle,
      padding,
      repeat,
      stroke,
      strokeWidth,
      isStroke,
      isFill,
      fill,
      color,
      filters
    } = settings;

    object = object !== undefined ? object : UtilsCanvas.getActiveObject(c);
    source = source || "";
    scale = scale || 1;
    width = width || null;
    height = height || null;
    offsetX = offsetX || 0;
    offsetY = offsetY || 0;
    angle = angle || 0;
    padding = padding || 0;
    repeat = repeat !== undefined ? repeat : true;
    strokeWidth = strokeWidth || null;
    stroke = stroke || 0;
    isStroke = isStroke !== undefined ? isStroke : false;
    isFill = isFill !== undefined ? isFill : false;
    fill = fill || null;
    color = color || null;
    //filters = filters || [];

    if (!object) return;
    if (object.typeName === "Image") return;
    if (width !== null && width < 2) width = 2;
    if (scale > 30) scale = 30;
    if (strokeWidth === null) strokeWidth = object.strokeWidth;

    const url = process.env.REACT_APP_IMAGE_HOST + source;
    //const pattWidth = [];

    fabric.Image.fromURL(
      url,
      (img) => {

        img.set({ crossOrigin: "anonymous" });

        // filters = [new fabric.Image.filters.Grayscale(30),new fabric.Image.filters.Brightness(90)];
        if(filters && Array.isArray(filters)){
          filters.forEach((el)=>{
            img.filters.push(el);
          });
          img.applyFilters();
        }

        // remove this |  remove this |  remove this |  remove this |  remove this |  remove this |  remove this |
        // to analytics after
        // pattWidth.push({ key: "widthInitial", value: img.width });
        // pattWidth.push({ key: "naturalWidth", value: img.naturalWidth });

        if (width !== null) {
          img.scaleToWidth(width); /// minimum 2
        } else {
          img.scale(scale);
        }

        // remove this |  remove this |  remove this |  remove this |  remove this |  remove this |  remove this |
        // to analytics after
        // pattWidth.push({ key: "widthScale", value: img.width });

        //---------------------------------------------------------------- enable this when remove rect: line 143
        if (angle > 0) {
          img.set({
            angle: angle,
            left: (img.width * scale) / 2,
            top: (img.height * scale) / 2,
            originX: "center",
            originY: "center",
          });
        }

        // remove this |  remove this |  remove this |  remove this |  remove this |  remove this |  remove this |
        // to analytics after
        // pattWidth.push({ key: "widthSetWith", value: img.width });
        // pattWidth.push({
        //   key: "widthSetWithParse",
        //   value: parseInt(img.getScaledWidth()),
        // });

        // create pattern register ---------------------------------------
        object["pattern"] = {
          fill: null,
          stroke: null,
        };

        let patt = {
          name: name,
          url: source,
          scale: scale,
          angle: angle,
          width: width,
          height: height,
          padding: padding,
          offsetX: offsetX,
          offsetY: offsetY,
          repeat: repeat,
          color: color,
        };

        // console.log( 'patt', patt );
        // console.log( 'img.getScaledWidth()', img.getScaledWidth() );
        // console.log( 'img.scale', scale );
        // console.log( 'img.width', img.width );
        // console.log( 'img.width * scale', (img.width * scale) );
        // console.log( 'canv.width', parseInt(img.getScaledWidth() + padding) );

        if (isStroke === true) {
          patt.push({ strokeWidth: strokeWidth });
        }

        object.pattern[isFill ? "fill" : "stroke"] = patt;
        // end pattern register -------------------------------------------

        // remove this |  remove this |  remove this |  remove this |  remove this |  remove this |  remove this |
        // to analytics after
        // pattWidth.push({
        //   key: "widthScaledWidth",
        //   value: img.getScaledWidth(),
        // });

        // now apply parttern
        let canv = new fabric.StaticCanvas();
        canv.add(img);
        //canv.setBackgroundColor('#eeeeee',canv.renderAll.bind(canv));
        canv.setDimensions({
          width: parseInt(img.getScaledWidth() + padding),
          height: parseInt(img.getScaledHeight() + padding),
        });

        //---------------------------------------------------------------- rect
        // let rect = null;
        // if( angle > 0){
        //   rect = new fabric.Rect({
        //     width: parseInt(img.getScaledWidth()),
        //     height: parseInt(img.getScaledHeight())
        //   });
        //   canv.add(rect);
        // }
        //---------------------------------------------------------------- rect

        // remove this |  remove this |  remove this |  remove this |  remove this |  remove this |  remove this |
        // to analytics after
        // pattWidth.push({ key: "widthCanv", value: canv.width });
        // pattWidth.push({
        //   key: "widthCanvPadding",
        //   value: parseInt(img.getScaledWidth() + padding),
        // });

        canv.renderAll();
        let pattern = new fabric.Pattern(
          {
            source: canv.getElement(),
          },
          (patternObj) => {

            // remove this |  remove this |  remove this |  remove this |  remove this |  remove this |  remove this |
            // to analytics after
            // pattWidth.push({ key: "canvGetElement", value: canv.getElement() });
            // pattWidth.push({ key: "patternObj", value: patternObj });

            //apply to save pattern, dont remove
            if (object === c) {
              c.backgroundColor = pattern;
            } else if (isStroke === true) {
              object.stroke = patternObj;
              object.dirty = true;
            } else if (isFill === true) {
              object.fill = patternObj;
              //---------------------------------------------------------------- rect
              // if( angle > 0){
              //   rect.fill = patternObj;
              //   rect.rotate(angle);
              //   rect.dirty = true;
              // }
              //---------------------------------------------------------------- rect
            }
            object.dirty = true;
            canv.renderAll();
          }
        );

        pattern.offsetX = offsetX;
        pattern.offsetY = offsetY;
        pattern.repeat = repeat === true ? "repeat" : "no-repeat";

        // is group
        if (object === c) {
          c.backgroundColor = pattern;
        } else if (object._objects === undefined) {
          // is stroke
          if (isStroke === true) {
            object.set("stroke", pattern);
            object.set("strokeWidth", strokeWidth);
            // is fill
          } else {
            object.set("fill", pattern);
          }
        }
        // is group or SVG
        else {
          object._objects.forEach((o) => {
            if (isStroke === true) {
              o.set("stroke", pattern);
              o.set("strokeWidth", strokeWidth);
            } else {
              o.set("fill", pattern);
            }
          });
        }
        UtilsCanvas.renderAll(c);
        //librariesHistory.state.save();

        // remove this |  remove this |  remove this |  remove this |  remove this |  remove this |  remove this |
        // to analytics after
        // c._pattern_ = [...pattWidth];
        // console.table(pattWidth);
      },
      { crossOrigin: "anonymous" },
      { crossOrigin: "anonymous" }
    );
  };
}
