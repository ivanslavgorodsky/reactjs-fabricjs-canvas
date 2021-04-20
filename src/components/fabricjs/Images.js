import React from "react";
import UtilsCanvas from "./../../../utils/UtilsCanvas";
import { fabric } from "fabric";
import GlobalEvents from "../event/GlobalEvents";

class Images extends React.Component {
  
  add = ( c, settings, callback ) => {

    if ( typeof settings !== 'object' ) return;

    let { imageSmoothing, name, source, originX, originY, 
      angle, opacity, fill, scale, 
      lockScalingFlip, selectable, hasControls,  
      left, top, relativePosition } = settings ;

      const extension = source.split('.').pop().toLowerCase();
  
      const setting = {
        crossOrigin: 'anonymous',
        key: UtilsCanvas.key(),
        name: name || '',
        typeName: '',
        left: relativePosition === false ? left : UtilsCanvas.setPositionLeft( c, left )  ,
        top: relativePosition === false ? top : UtilsCanvas.setPositionTop( c, top ) ,
        hasControls: hasControls !== undefined ? hasControls : true ,
        selectable: selectable !== undefined ? selectable : true ,
        lockScalingFlip: lockScalingFlip !== undefined ? lockScalingFlip : true ,
        scale: scale !== undefined ? scale : true , 
        angle: angle || 0 ,
        fill: fill ,
        backgroundColor: fill ,
        opacity: opacity !== undefined ? opacity : 1 ,
        imageSmoothing: imageSmoothing !== undefined ? imageSmoothing : true , 
        // NAO SETAR ALTURA E LARGURA DA IMAGEM INICIALMENTE
        // scaleToWidth: width,
        // scaleToHeight:height,
        // clipath
        // clipTo: function (ctx) {
        //   ctx.arc(0, 0, 500, 0, Math.PI * 2, true);
        // }
        crossOrigin: 'anonymous',
      }

    if ( extension === 'svg' ) {

      // load svg
      fabric.loadSVGFromURL( source, ( objects, options ) => {
        // console.log('fabric.loadSVGFromURL', source, objects );        
        // objects.map( item => { return item.fill = '#000000' } );
        // const o = [...objects];
        // o.forEach( elements => {
        //   elements.top  += 200;
        //   elements.left += 200;
        //   c.add(elements);
        //   elements.setCoords();
        // });
        // o.distroy();
        this.finallyDone( c, fabric.util.groupSVGElements( objects, options ), {...setting, typeName: 'SVG'}, callback );
      });
  
    } else {

      // load image
      // fabric.util.loadImage
      fabric.Image.fromURL( source, ( image ) => {
        // console.log('fabric.Image.fromURL', source, image );
        this.finallyDone( c, image, {...setting, typeName: 'Image'}, callback );
      }, {crossOrigin: 'anonymous'});

    }

    //var path2 = new fabric.Path('M178.53,77H8.19V6.3H178.53ZM9.6,75.55H177.11V7.72H9.6Z');
    //UtilsCanvas.getCanvas(c).add(path2.set({ left: 100, top: 200 }));

  };

  finallyDone = ( c, image, setting, callback ) => {

    const { index, width, height, scale } = setting ;

    image.scale( scale );
    // image.set( setting );
    image.set(
      setting, { crossOrigin: "anonymous" },
    );

    c.add( image );
    image.setCoords();

    if ( index !== undefined ) {
      image.moveTo( index );
    }

    if ( width  !== undefined ) image.scaleToWidth( width );
    if ( height !== undefined ) image.scaleToHeight( height );

    console.log('Image.add:',image);

    UtilsCanvas.setActiveObject( c, image );
    UtilsCanvas.renderAll( c );

    c.history.register();

    if( callback !== undefined ){
      callback({ object: image });
    }

  }

  // https://jsfiddle.net/ud9nev1g/
  // document.getElementById('file').addEventListener( 'change', function(e) {});
  upload = ( c, event ) => {
    
    // file
    const file = event.target.files[0];
    var reader = new FileReader();
    
    // load file
    reader.onload = ( f ) => {
      const data = f.target.result;
      fabric.Image.fromURL( data, ( image ) => {
        // const typeName = data.substr(0,20).indexOf('svg') < 0 ? 'Image' : 'SVG' ;
        const typeName = 'Image';
        image.set({
          typeName: typeName,
          crossOrigin: 'anonymous',
          left: UtilsCanvas.setPositionLeft( c, 10 ),
          top: UtilsCanvas.setPositionTop( c, 10 ),
          angle: 0,
          imageSmoothingEnabled: true,
          mozImageSmoothingEnabled: true,
          imageSmoothing: true,
        }).scale( .2 );
        c.add( image );
        c.renderAll();
        c.history.register();
      });
    };
    reader.readAsDataURL(file);
  };
  
}

export default Images;
