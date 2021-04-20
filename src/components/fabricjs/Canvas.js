import React, { Component } from 'react';
import { fabric } from 'fabric';
import { GlobalContext } from '../config/global';
import UtilsCanvas from '../utils/UtilsCanvas';
import UtilsObject from '../utils/UtilsObject';
import Exports from './Exports';
import GlobalEvents from '../event/GlobalEvents';

class Canvas extends Component {

  static contextType = GlobalContext;

  //----------------------------------------------
  // Class Fabric.js:
  // this.canvasFabric
  // this.canvasFabric.add(...) 
  //----------------------------------------------
  // HTML Canvas Element:
  // this.canvas <canvas ref={}/>
  //----------------------------------------------

  //times = 0;

  constructor(props) {
    super(props);
    this.resizeCanvas = this.resizeCanvas.bind(this);
  }

  click = () => {
    this.canvasToGlobal();
  }
  
  time = 0;
  canvasToGlobal = () => {
    clearTimeout(this.time);
    this.time = setTimeout(() => {
      let v = {
        ...this.props.valGlobal,
        canvas: this.canvasFabric,
      };
      this.props.setGlobal(v);
      console.log('UpdateClassCanvas:',v);
      this.dispatchActiveObject();
    }, 50);
  }

  // dont remove
  // dont use UtilsCanvas.centerContainer();
  // this works with clipPath
  timerToCenter = 0;
  centerContainer = ( c ) => {

    if( c === undefined || c === null ) return;
    if( c._objects === undefined || c._objects === null ) return;
    if( c._objects.length === 0 ) return;

    window.clearTimeout(this.timerToCenter);
    this.timerToCenter = 0;
    this.timerToCenter = setTimeout(()=>{

      let g = c.getObjects();
      if( c.hasOwnProperty('clipPath') && c.clipPath !== undefined && c.clipPath !== null ){
        g.push(c.clipPath);
      }
      var group = new fabric.Group(g)
      //group.rotate(angle)
      c.centerObject(group)
      group.setCoords();
      group.destroy()
      c.renderAll();

    },250);

  }

  resizeCanvas = ( event ) => {

    const {valGlobal} = this.context;

    const size = {
      width:
        window.innerWidth,
      height:
        window.innerHeight,
    };

    const c = valGlobal.canvas !== null ? valGlobal.canvas : this.canvasFabric ;
    
    if( c.width !== size.width || c.height !== size.height ){
      c.setWidth(size.width);
      c.setHeight(size.height);
      new UtilsCanvas().center( c );
    }
    
  }

  resizeRectMP = ( e ) => {
    UtilsCanvas.resizeRectMP( this.canvasFabric, e.width, e.height );
  }

  objectCreated = () => {
    // TODO this.createLayer();
  }
  
  getSelection = ( event ) => {

    console.log('selection:start');    
    this.objectType( event );
    this.dispatchActiveObject();    
  }

  registerPrototype = () => {

    fabric.Canvas.prototype.history = {
      init: ( addEvent ) => {
        // variables
        this.MAX_REGISTER = 50; // registers
        this.REGISTER_TIMEOUT = 500;
        // propries
        this.timeOutToSave = null;
        this.properties = new Exports().getProperties();
        this.values = [];
        this.index = -1;

        // ----- init
        const c = this.canvasFabric;
        const json = JSON.stringify(c.toJSON(this.properties));
        // push no history
        this.values.push(json);
        // add index
        this.index++;
        // ----- init

        // add event
        if( addEvent === true){
          this.off({
            "object:added": this.register,
            "object:removed": this.register,
            "object:modified": this.register
          });  
          this.on({
            "object:added": this.register,
            "object:removed": this.register,
            "object:modified": this.register
          });  
        };
      },
      reset: () => {
        // reset values
        this.values = [];
        this.index = -1;
      },
      register: () => {
        // wait
        if (this.historyProcessing) return;
        // canvas
        const c = this.canvasFabric;

        clearTimeout(this.timeOutToSave);
        this.timeOutToSave = setTimeout(()=>{

          // no more register, max
          if( this.index < this.values.length - 1 ){
            console.log('splice by index');
            this.values.splice( this.index + 1, this.MAX_REGISTER );
            this.index = this.values.length - 1;
          }        
          // remove first elements
          if( this.values.length > this.MAX_REGISTER ){
            console.log('shift by MAX_REGISTER');
            this.values.shift();
            this.index--;
          }        
          // toJSON
          const json = JSON.stringify(c.toJSON(this.properties));
          // push no history
          this.values.push(json);
          // add index
          if(this.index < this.values.length){
            this.index++;
          }
          // length
          c.registerLength = this.index;
          // log
          console.log( 'values:', this.values.length, 'index:', this.index );

        },this.REGISTER_TIMEOUT);
      },
      registerTimeOut: () => {
        // wait
        if (this.historyProcessing) return;
        // canvas
        const c = this.canvasFabric;
        this.historyProcessing = true;
        clearTimeout(this.timeOutToSave);
        this.timeOutToSave = setTimeout(()=>{
          this.historyProcessing = false;
          c.history.register();
        },50);
      },
      undo: ( callback ) => {
        // wait
        this.historyProcessing = true;
        // canvas
        const c = this.canvasFabric;
        // import
        if( this.values.length > 0 && this.index > 0 ){
          this.index--;
          c.loadFromJSON(this.values[this.index]);
          c.renderAll();
        }
        // allow
        this.historyProcessing = false;
        // callback
        if (callback !== undefined && typeof callback === 'function'){
          callback();
        }
        // length
        c.registerLength = this.index;
        // log
        console.log( 'values:', this.values.length, 'index:', this.index );
      },
      redo: ( callback ) => {
        // wait
        this.historyProcessing = true;
        // canvas
        const c = this.canvasFabric;
        // import
        if( this.index < this.values.length && this.values.length - 1 > this.index ){
          this.index++;
          c.loadFromJSON(this.values[this.index]);
          c.renderAll();
        }
        // allow
        this.historyProcessing = false;
        // callback
        if ( callback !== undefined && typeof callback === 'function' ){
          callback();
        }
        // length
        c.registerLength = this.index;
        // log
        console.log( 'values:', this.values.length, 'index:', this.index );
      },
    }
  }

  createCanvasFabric = () => {

    this.canvasFabric = new fabric.Canvas(this.canvas, {

        name: 'canvas',
        isFabricCanvas: true, // ajuda a identificar se o object é Fabric.js

        preserveObjectStacking: true, // quando seleciona o object ele vai pra frente ou nao
        controlsAboveOverlay: true, // transform fora do clip
        originX: "left",
        originY: "top",
        backgroundColor: '#999999', //this.state.colors.backgroundColor,
        width: this.props.width,
        height: this.props.height,
        rx: 10,
        ry: 10,

        imageSmoothingEnabled: true,
        mozImageSmoothingEnabled: true,
        enableRetinaScaling: false, //When true, canvas is scaled by devicePixelRatio for better rendering on retina screens 

        fireRightClick: true,
        //stopContextMenu: true,
        selection: true,
    });

    fabric.Object.prototype.objectCaching = true; // if false not smooth

    // const rect = new fabric.Rect({ width: 400, height: 300, fill: "orange" });
    // this.canvasFabric.add(rect);
    // this.canvasFabric.requestRenderAll();
    
    fabric.Object.prototype.padding = 0; // padding transform-corners offset object

    // retângulo de seleção de objetos, mostra a área quando se está selecionando mais de um objeto
    fabric.Object.prototype.selection = true;  

    fabric.Object.prototype.cornerColor = '#00AAE4'; // '#04D9FF';
    fabric.Object.prototype.borderColor = '#00AAE4'; // '#04D9FF';
    fabric.Object.prototype.transparentCorners = false;
    fabric.Object.prototype.cornerStyle = 'circle';
    fabric.Object.prototype.cornerSize = 11;

    console.log('Version: ',fabric.version);

    fabric.initFilterBackend = function() {
      if (fabric.enableGLFiltering &&  fabric.isWebglSupported && fabric.isWebglSupported(fabric.textureSize)) {
        console.log('MaxTextureSize: ' + fabric.maxTextureSize);
        return (new fabric.WebglFilterBackend({ tileSize: fabric.textureSize }));
      }
      else if (fabric.Canvas2dFilterBackend) {
        return (new fabric.Canvas2dFilterBackend());
      }
    };
    fabric.filterBackend = fabric.initFilterBackend();

    // object
    this.canvasFabric.on("object:scaling", ( event ) => {
      this.objectScaling( event );
    });
    this.canvasFabric.on("object:modified", () => {
      console.log('object:modified');
      this.dispatchActiveObject();
      this.canvasFabric.history.register();
    });

    //selection
    this.canvasFabric.on("selection:created", this.getSelection );
    this.canvasFabric.on("selection:updated", this.getSelection );
    this.canvasFabric.on("selection:cleared", () => {
      console.log('selection:cleared');
      this.dispatchActiveObject();
    });

    //zoom
    this.canvasFabric.on('mouse:wheel', ( opt ) => {

      const {setGlobal} = this.context;

      let delta = opt.e.deltaY;
      let zoom = this.canvasFabric.getZoom();
      zoom = zoom + delta/2000;
      if (zoom > 3) zoom = 3;
      if (zoom < 0.5) zoom = 0.5;
      console.log(zoom);
      this.canvasFabric.zoomToPoint({ x: opt.e.offsetX, y: opt.e.offsetY }, zoom);

      setGlobal((prev)=>{
        return {
          ...prev,
          working: { 
            ...prev.working, 
            zoom: zoom,
          }
        }
      });

      GlobalEvents.dispatch('changeZoom',{value:zoom});

      opt.e.preventDefault();
      opt.e.stopPropagation();

    });
    
    /*
    // v 4.3.1

    Fire to Canvas

    object:modified at the end of a transform or any change when statefull is true
    object:rotating while an object is being rotated from the control
    object:scaling while an object is being scaled by controls
    object:moving while an object is being dragged
    object:skewing while an object is being skewed from the controls
    before:transform before a transform is is started
    before:selection:cleared
    selection:cleared
    selection:updated
    selection:created
    path:created after a drawing operation ends and the path is added
    mouse:down
    mouse:move
    mouse:up
    mouse:down:before on mouse down,event: before the inner fabric logic runs
    mouse:move:before on mouse move,event: before the inner fabric logic runs
    mouse:up:before on mouse up,event: before the inner fabric logic runs
    mouse:over
    mouse:out
    mouse:dblclick whenever a native dbl click event fires on the canvas.
    event:dragover
    event:dragenter
    event:dragleave
    event:drop
    after:render at the end of the render process,event: receives the context in the callback
    before:render at start the render process, receives the context in the callback the following events are deprecated:event:
    object:rotated at the end of a rotation transform
    object:scaled at the end of a scale transform
    object:moved at the end of translation transform
    object:skewed at the end of a skew transform

    Fire to Object

    event:added
    event:removed
    event:selected
    event:deselected
    event:modified
    event:modified
    event:moved
    event:scaled
    event:rotated
    event:skewed
    event:rotating
    event:scaling
    event:moving
    event:skewing
    event:mousedown
    event:mouseup
    event:mouseover
    event:mouseout
    event:mousewheel
    event:mousedblclick
    event:dragover
    event:dragenter
    event:dragleave
    event:drop
    */

    // history
    this.registerPrototype();
    // clear
    new UtilsCanvas().clear( this.canvasFabric ); // add RectResize and RectMP
    // resize Canvas
    this.resizeCanvas();
    // send to context
    this.canvasToGlobal();
    // init history
    this.canvasFabric.history.init();
    
  }

  objectType = ( event ) => {
    
    const object = event.target || UtilsCanvas.getActiveObject( this.canvasFabric );
    if (object === undefined || object === null) return;
    //if(!object.hasOwnProperty('typeName')) return;
    //if(object.hasOwnProperty('_objects')) return;

    switch (object.typeName) {
      case "Group":
      case "SVG":
      case "Path":
          console.log('Do not (Group|SVG)');
        break;
      case "RectResize":
      case "rectResize":
        object.typeName = 'RectResize';
        UtilsCanvas.sendToBackRectResize( this.canvasFabric, object, true );
        break;
      case "RectMP":
        UtilsCanvas.sendToBackRectMP( this.canvasFabric, object, true );
        break;
      case "Image":
        console.log('Do not (Image)');
        break;
      case "Ellipse":
      case "Line":
      case "Circle":
      case "Square":
      case "Rect":
        console.log('Do not (Shapes)');
        break;
      case "Label":
      case "Text":
      case "TextBox":
      case "Paragraph":
        console.log('Do not (Text)');
        break;
      default:
        console.log(object.get('type'));
        if(object.hasOwnProperty('typeName')===false){
          let type = object.get('type');
          type = type.charAt(0).toUpperCase() + type.slice(1);
          object.set({typeName: type});  
        }
    }
  }

  objectScaling = ( event ) => {

    let object = event.target || UtilsCanvas.getActiveObject( this.canvasFabric );
    if (object === undefined || object === null) return;
    if (object.hasOwnProperty("typeName") === false) {
      //throw new Error("O elemento selecionado não tem definição no sistema. This element not type definition (.typeName)");
    }

    console.log("object:scaling:start", object.typeName,object.get('type'));

    // old values
    const { width:oldWidth, height:oldHeight, radius:oldRadius, rx:oldRx, ry:oldRy } = object;
    // new values
    let newWidth, newHeight, newRadius, newRx, newRy;

    switch (object.typeName) {

      case "Circle":
        this.canvasFabric.on("object:scaled", (event) => {

          if(object.scaleX !== object.scaleY){
            newRadius = oldRadius;
          }else{
            newRadius = oldRadius * ( object.scaleX < object.scaleY ? object.scaleX : object.scaleY );
          }

          object.set({
            scaleX: 1,
            scaleY: 1,
            radius: Number(newRadius.toFixed(2)),
          });

          console.log("object:scaled:end");
          this.canvasFabric.off("object:scaled");
        });

        break;
      case "Ellipse":
        this.canvasFabric.on("object:scaled", (event) => {

          newRx = oldRx * object.scaleX;
          newRy = oldRy * object.scaleY;

          object.set({
            rx: Number(newRx.toFixed(2)),
            ry: Number(newRy.toFixed(2)),
            scaleX: 1,
            scaleY: 1,
          });

          console.log("object:scaled:end");
          this.canvasFabric.off("object:scaled");
        });

        break;
      case "Background":
      case "Rect":
      case "Square":
      case "Line":
        this.canvasFabric.on("object:scaled", (event) => {

          newWidth = oldWidth * object.scaleX;
          newHeight = oldHeight * object.scaleY;
          newRx = oldRx * object.scaleX;
          newRy = oldRy * object.scaleY;
          newRadius = ( newRy + newRx ) / 2 ;

          object.set({
            rx: Number(newRadius.toFixed(2)),
            ry: Number(newRadius.toFixed(2)),
            width: Number(newWidth.toFixed(2)),
            height: Number(newHeight.toFixed(2)),
            scaleX: 1,
            scaleY: 1,
          });

          console.log("object:scaled:end");
          this.canvasFabric.off("object:scaled");
        });

        break;
      case "Label":
      case "Text":
      case "TextBox":
      case "Paragraph":
        this.canvasFabric.on("object:scaled", (event) => {

          newWidth = oldWidth * object.scaleX;
          newHeight = oldHeight * object.scaleY;

          object.set({
            width: Number(newWidth.toFixed(2)),
            height: Number(newHeight.toFixed(2)),
          });
  
          if(object.hasOwnProperty('fontSize')){
            console.log('(1)fontSize:',object.fontSize);
            object.fontSize *= object.scaleX;
            object.fontSize = Number(object.fontSize).toFixed(1);
            object.scaleX = 1;
            object.scaleY = 1;
            /* _clearCache clear the two caching arrays for lineWidths and lineHeights 
            ( we do not recalculate them every time in fabricjs) i do not know why i 
            force the call since a change in fontsize trigger the cleaning automatically */
            object._clearCache();
            object.setCoords();
            console.log('(2)fontSize:',object.fontSize);
          }
  
          console.log("object:scaled:end");
          this.canvasFabric.off("object:scaled");
        });
        break;
      default:
        if(object.hasOwnProperty('typeName')===false){
          let type = object.get('type');
          type = type.charAt(0).toUpperCase() + type.slice(1);
          object.set({typeName: type});  
        }
        break;
    }

    object.setCoords();
    this.canvasFabric.renderAll();
    console.log("object:scaling:end");
  }

  dispatchActiveObject = () => {
    const o = this.canvasFabric.getActiveObject();

    if( o !== undefined && o !== null ){
      if( o.key === this.canvasFabric.activeObjectKey){
        //console.log('object with same key');
        return;
      } 
    }else{
      //console.log('object is null');
      if( this.canvasFabric.activeObjectKey === null ){
        return;
      } 
    }

    const data = { 
      activeObject: ( o === undefined || o === null) ? null : o ,
      key: ( o === undefined || o === null) ? null : ( o.hasOwnProperty('key') ? o.key : null ) ,
    };
    GlobalEvents.dispatch('changeActiveObject', data);
    this.canvasFabric.activeObjectKey = data.key;
  }

  keyDown = ( event ) => {

    UtilsObject.keyDownMove( this.canvasFabric, event );
    UtilsObject.keyDownDelete( this.canvasFabric, event );
    new Exports().keyDownControlSave( this.canvasFabric, event );

    //document.addEventListener("keyup", function(event)

    if (event.keyCode === 90 && event.ctrlKey) {
      GlobalEvents.dispatch('undo', this.canvasFabric );
      this.canvasFabric.history.undo();
    }
    if (event.keyCode === 89 && event.ctrlKey) {
      GlobalEvents.dispatch('redo', this.canvasFabric );
      this.canvasFabric.history.redo();
    }
    if ((event.keyCode === 48 || event.keyCode === 96) && event.ctrlKey) {
      this.canvasFabric.setViewportTransform([1,0,0,1,0,0]); 
    }
  
  }
  
  componentDidMount() {
    // init fabric canvas
    this.createCanvasFabric();
    // resize canvas
    this.resizeCanvas();
    
    console.log("componentDidMount");
    window.addEventListener("keydown", this.keyDown, false ); // save json
    window.addEventListener("resize", this.resizeCanvas );
    GlobalEvents.on('canvasToGlobal', this.canvasToGlobal) ;
    GlobalEvents.on('changeClipPath', this.resizeRectMP );
    GlobalEvents.on('resizeCanvas', this.resizeCanvas );
  }

  componentWillUnmount(){
        
    console.log("componentWillUnmount");
    window.removeEventListener("keydown", this.keyDown, false );
    window.removeEventListener("resize", this.resizeCanvas );
    GlobalEvents.off('canvasToGlobal', this.canvasToGlobal) ;
    GlobalEvents.off('changeClipPath', this.resizeRectMP );
  }

  componentDidUpdate() {
    this.resizeCanvas();

    //-------------------------------------------------------------------------------------
    // send to GLOBAL temporary
    // sent to global.js the Fabric Canvas (this file)
    //-------------------------------------------------------------------------------------
    // window.canvas = this.canvasFabric;
    // this.canvasToGlobal();
    //-------------------------------------------------------------------------------------

    //-------------------------------------------------------------------------------------
    // este recurso é para enviar o acesso ao this.canvasFabric para o props

    // Access this.props
    // this.props.canvas : Created a variable named canvas|c|fabric|anyway...
    // this.canvasFabric : send fabric canvas to props

    //this.props.canvas(this.canvasFabric);
    //this.props.setSettings((prev)=>{return {...prev,canvas: this.canvasFabric }});
    //-------------------------------------------------------------------------------------

    //-------------------------------------------------------------------------------------
    // este recurso é para recever this.canvasFabric pelo props

    // <Component canvas={(c) => setCanvas(c)}>
    // <Component : this Class
    // canvas= : name props / canvas|getCanvas|seCanvas|anyway...
    // (c) : this.canvasFabric
    // setCanvas(c) : function parent component
    // update canvas props, call function setCanvas
    //-------------------------------------------------------------------------------------
}
  //-------------------------------------------------------------------------------------

  render() {
    // const { width, height } = this.state;
    // const {valGlobal} = this.context;
    return (
      <React.Fragment>
        <div onClick={this.click} onMouseOver={()=>UtilsCanvas.focus()}>
          {/* <HistoryComponent> */}
            <canvas id="canvas" tabIndex="0" ref={me => (this.canvas = me)} />
          {/* </HistoryComponent> */}
        </div>
      </React.Fragment>
    );
  }
}

export default Canvas;