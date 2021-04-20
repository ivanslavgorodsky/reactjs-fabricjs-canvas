import React from "react";
import { fabric } from "fabric";
import UtilsCanvas from "../../../utils/UtilsCanvas";

//icons
import { Delete } from "@material-ui/icons";
import InvertColorsIcon from '@material-ui/icons/InvertColors';
import FormatColorResetIcon from '@material-ui/icons/FormatColorReset';
import WbSunnyIcon from '@material-ui/icons/WbSunny'; //saturation
import SettingsBrightnessIcon from '@material-ui/icons/SettingsBrightness'; 
import AcUnitIcon from '@material-ui/icons/AcUnit'; //gama
import TonalityIcon from '@material-ui/icons/Tonality'; //grayscale
import TrackChangesIcon from '@material-ui/icons/TrackChanges'; //sharpen
import { GlobalContext } from "../../components/config/global";
import GlobalEvents from "../event/GlobalEvents";

// Inner Shadow
// https://stackoverflow.com/questions/37378088/inset-shadow-on-html5-canvas-image/37380488#37380488

const effects = [
  { label: 'Clear all',     name: "Clear",        unique: true,  expanded: false },
  { label: 'Invert',        name: "Invert",       unique: true,  expanded: false },
  { label: 'Grayscale',     name: "Grayscale",    unique: true,  expanded: false },
  { label: 'Brightness',    name: "Brightness",   unique: true,  expanded: true, },
  { label: 'Gamma',         name: "Gamma",        unique: true,  expanded: true, },
  { label: 'Contrast',      name: "Contrast",     unique: true,  expanded: true, },
  { label: 'Saturation',    name: "Saturation",   unique: true,  expanded: true, },
  { label: 'Noise',         name: "Noise",        unique: true,  expanded: true, },
  { label: 'Blur',          name: "Blur",         unique: true,  expanded: true, },
  { label: 'Sharpen',       name: "Sharpen",      unique: true,  expanded: true, },
  { label: 'Emboss',        name: "Emboss",       unique: true,  expanded: true, },
  { label: 'Blend Color',   name: "BlendColor",   unique: false, expanded: true, },
  { label: 'Remove Color',  name: "RemoveColor",  unique: false, expanded: true, },
  { label: 'Duotone',       name: "Duotone",      unique: true,  expanded: true, },
];

export default class Effects extends React.Component {
  
  // ---------------------------------------------------------------------------
  // list filters
  // https://material-ui.com/components/material-icons/
  // ---------------------------------------------------------------------------
  getFilters = () => {
    return effects;
  }

  // ---------------------------------------------------------------------------
  // get icon by name
  // https://material-ui.com/components/material-icons/
  // ---------------------------------------------------------------------------
  getIcon = ( name  ) => {
    switch( name ){
      case 'Clear':       return <Delete fontSize="small"></Delete>; 
      case 'Invert':      return <InvertColorsIcon fontSize="small"></InvertColorsIcon>; 
      case 'Grayscale':   return <TonalityIcon fontSize="small"></TonalityIcon>; 
      case 'Brightness':  return <SettingsBrightnessIcon fontSize="small"></SettingsBrightnessIcon>; 
      case 'Gamma':       return <AcUnitIcon fontSize="small"></AcUnitIcon>; 
      case 'Contrast':    return null; 
      case 'Saturation':  return <WbSunnyIcon fontSize="small"></WbSunnyIcon>; 
      case 'Noise':       return null; 
      case 'Blur':        return null; 
      case 'Sharpen':     return <TrackChangesIcon fontSize="small"></TrackChangesIcon>; 
      case 'Emboss':      return null; 
      case 'BlendColor':  return null; 
      case 'RemoveColor': return <FormatColorResetIcon fontSize="small"></FormatColorResetIcon>; 
      //case 'Duotone':   null; 
      default: console.log('NoIcon');
    }
  };

  // ---------------------------------------------------------------------------
  // add filter
  // ---------------------------------------------------------------------------
  add = ( c, name, el, callback  ) => {

    console.log( 'Add Filter: ', name );
    el = el || effects.find( (element) => element.name === name );

    switch( name ){
      case 'Clear':       this.Clear( c );               break;
      case 'Invert':      this.Invert( c, -1, el );      break;
      case 'Grayscale':   this.Grayscale( c, -1, el );   break;
      case 'Brightness':  this.Brightness( c, -1, el );  break;
      case 'Gamma':       this.Gamma( c, -1, el );       break;
      case 'Contrast':    this.Contrast( c, -1, el );    break;
      case 'Saturation':  this.Saturation( c, -1, el );  break;
      case 'Noise':       this.Noise( c, -1, el );       break;
      case 'Blur':        this.Blur( c, -1, el );        break;
      case 'Sharpen':     this.Sharpen( c, -1, el );     break;
      case 'Emboss':      this.Emboss( c, -1, el );      break;
      case 'BlendColor':  this.BlendColor( c, -1, el );  break;
      case 'RemoveColor': this.RemoveColor( c, -1, el ); break;
      //case 'Duotone':   this.Duotone( c, -1, el );     break;
      default: console.log('');
    }

    if(callback !== undefined){
      callback();
    }

  };

  // ---------------------------------------------------------------------------
  // apply filter filter by index
  // ---------------------------------------------------------------------------
  apply = ( c, index, filter, callback ) => {

    if(typeof filter !== 'object') return;

    // get active object
    let object = UtilsCanvas.getActiveObject( c );
    if (object === undefined) return;
    //if (object.typeName !== 'Image') return;

    // se filters não existir, criar uma array
    object.filters = object.filters || [];
 
    // console.log( 'filter:', filter );
    // console.log( 'filters:', object.filters );
    
    // verifica se o index é verdadeiro e maior que -1
    if( Number.isInteger(index) && !isNaN(index) && Number(index) >= 0 ){
      
      // então atualiza o filtro por ele mesmo, ou uma nova configuração do mesmo filtro
      object.filters[index] = filter;
  
    // se o index for -1 ou NaN (Not a Number)
    } else { 

      // ao contrário disso procura o mesmo filtro pelo nome
      let indexUnique = object.filters.findIndex( (arr) => arr.name === filter.name );      
      // verifica se é um filtro classificado como único 
      // verifica se não existe outro com o mesmo nome
      if( filter.unique === true && indexUnique === -1){
          object.filters.push(filter);
      }
      // verifica se está classificado para não ser único 
      // pode ter um ou mais filtros de igual nome
      else if( filter.unique === false){
        object.filters.push(filter);
      }

    }

    // inverte para quando remover os efeitos duplicados, deixar os últimos aplicados
    // let arr = [ ...object.filters, filter ].reverse();
    // remover duplicidade de efeitos
    // arr = UtilsArray.unique(arr,['name']);
    // ------------------------------------------------------------
    // inverter novamente a ordem de efeitos
    // object.filters = arr.reverse();
    
    // apply filters
    if(typeof object['applyFilters'] === 'function'){

      // http://fabricjs.com/v2-breaking-changes
      c.renderAll();
      c.requestRenderAll(); // or the old canvas.renderAll() if you prefer or need it

      try{
        object.applyFilters();
      } catch (error) {
        console.log('ERROR',error);
      }

      c.renderAll();
      c.requestRenderAll(); // or the old canvas.renderAll() if you prefer or need it

      // var filter = new fabric.Image.filters.Resize();
      // object.filters.push(filter);
      // object.applyFilters(canvas.renderAll.bind(canvas));

      // Optionally you can pass a filters array to applyFilter
      // if you want to apply something that is not the image filter chain.
      try {
        object.applyFilters(object.filters);
        object.applyFilters(c.renderAll.bind(c));
        object.resizeFilter = new fabric.Image.filters.ResizeFilter({type: 'hermite'});            
      } catch (error) {
        console.log('ERRORRRRRRR',error);
      }
    }
    // render all
    UtilsCanvas.renderAll( c );
    c.renderAll();
    GlobalEvents.dispatch('changeActiveObject',{activeObject:object,key:object.key});
    // GlobalEvents.dispatch('changeFilters');
    //object.applyFilters(c.renderAll.bind(c));
    c.history.register();
  }

  // ---------------------------------------------------------------------------
  // remove by index
  // ---------------------------------------------------------------------------
  removeByIndex( c, index, callback ) {
    const object = UtilsCanvas.getActiveObject( c );
    if(object!== undefined){

      //object.filters.splice(index,1);
      object.filters = object.filters.filter((v, idx) => {
        return idx !== index;
      });
      // apply filters
      if(typeof object['applyFilters'] === 'function'){
        object.applyFilters();        
      }
      // render all
      UtilsCanvas.renderAll( c );

      if(callback !== undefined){
        callback();
      }
    }
  }

  // ---------------------------------------------------------------------------
  // remove by name
  // ---------------------------------------------------------------------------
  removeByName( c, name, callback ) {
    const object = UtilsCanvas.getActiveObject( c );
    if(object!== undefined){

      object.filters = object.filters.filter((v) => {
        return v.name !== name;
      });
      // apply filters
      if(typeof object['applyFilters'] === 'function'){
        object.applyFilters();        
      }
      // render all
      UtilsCanvas.renderAll( c );

      if(callback !== undefined)
        callback();
    }
  }

  // -----------------------------------------------------------------------------
  // Filters
  // -----------------------------------------------------------------------------

  // remove all effects|filters
  Clear( c ) {    
    // get active object
    let object = UtilsCanvas.getActiveObject( c );
    if (object === undefined) return;
    // remove all filters
    object.filters = [];
    // apply filters
    if(typeof object['applyFilters'] === 'function'){
      object.applyFilters();        
    }
  // render all
    UtilsCanvas.renderAll( c );
    //object.applyFilters(c.renderAll.bind(c));
  }

  Shadow = ( c, index, settings ) => {
  }
  // const shadow = new fabric.Shadow({
  //   color: "rgba(0, 0, 0, 0.5)",
  //   blur: 10,
  // })
  
  // container.set("shadow", shadow)
  // obj.set("shadow", shadow)

  // 
  Invert = ( c, index, settings ) => {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Invert();
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // mode: between 'average', 'lightness', 'luminosity' 
  Grayscale = ( c, index, settings ) => {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Grayscale({
      // ---------------------------------------------------- 
      mode: 'average', // 'average', 'lightness', 'luminosity' 
      // ---------------------------------------------------- 
      ...settings,
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    console.log('>>>>>>',filter);
    this.apply( c, index, filter );
  }

  // distance: 0|1
  // color: rgb|hex
  RemoveColor( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.RemoveColor({
      // ---------------------------------------------------- 
      color: '#1210ED',
      distance: 0.2,
      threshold: 0.2,
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // Gamma array value, from 0.01 to 2.2.
  // Default Value: [1,1,1]
  // Sample: [1, 0.5, 2.1]
  Gamma( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    const { red, green, blue } = settings.hasOwnProperty('red') === true ? settings : { red: 1, green: 0.5, blue: 2.1 };
    let filter = new fabric.Image.filters.Gamma({
      // ---------------------------------------------------- 
      gamma: [ red, green, blue ],
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // contrast: 0|1
  Contrast( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Contrast({
      // ---------------------------------------------------- 
      contrast: 0.25, // 0 to 1.
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // saturation: 0|1
  Saturation( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Saturation({
      // ---------------------------------------------------- 
      saturation: 0.5, // 0 to 1.
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // noise: 250 // 0 - 500
  Noise( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Noise({
      // ---------------------------------------------------- 
      noise: 100, // 0 - 500
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // var filter = new fabric.Image.filters.Convolute({
  //   matrix: [ 1/9, 1/9, 1/9,
  //             1/9, 1/9, 1/9,
  //             1/9, 1/9, 1/9 ]
  // });

  // blur: 0.5 // 0 - 1
  Blur( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Blur({
      // ---------------------------------------------------- 
      blur: 0.1, // 0 - 1
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // matrix: 
  // [  0, -1,  0,
  //   -1,  5, -1,
  //    0, -1,  0 ]
  Sharpen( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Convolute({
      // ---------------------------------------------------- 
      matrix: 
      [  0, -1,  0,
        -1,  5, -1,
         0, -1,  0 ],
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // matrix: 
  // [ 1,   1,  1,
  //   1, 0.7, -1,
  //  -1,  -1, -1 ]
  Emboss( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Convolute({
      // ---------------------------------------------------- 
      matrix: 
      [ 1,   1,  1,
        1, 0.7, -1,
       -1,  -1, -1 ],
       opaque: false,
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  Brightness( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.Brightness({
      // ---------------------------------------------------- 
      brightness: 0.1, //-1 to 1.
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

  // <select>
  //   <option value="add" selected>Add</option>
  //   <option value="diff">Diff</option>
  //   <option value="subtract">Subtract</option>
  //   <option value="multiply">Multiply</option>
  //   <option value="screen">Screen</option>
  //   <option value="lighten">Lighten</option>
  //   <option value="darken">Darken</option>
  //   <option value="overlay">Overlay</option>
  //   <option value="exclusion">Exclusion</option>
  //   <option value="tint">Tint</option>
  // </select>

  //  var filter = new fabric.Image.filters.BlendImage({
  //   image: fabricImageObject,
  //   mode: 'multiply',
  //   alpha: 0.5
  //  });

  BlendColor( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.BlendColor({
      // ---------------------------------------------------- 
      color: '#99D843',
      mode: 'multiply',
      alpha: 0.5, // 0 - 1 
      // ---------------------------------------------------- 
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }
  
  // Matrix Samples: 
  //  https://kazzkiq.github.io/svg-color-filter/
  Matrix( c, index, settings ) {
    const { name, label, unique, expanded, icon } = settings;
    let filter = new fabric.Image.filters.ColorMatrix({
      ...settings, 
    });
    filter.name = name;
    filter.label = label;
    filter.unique = unique;
    filter.expanded = expanded;
    filter.icon = icon;
    this.apply( c, index, filter );
  }

    /*

    ideia pra complementar
    https://mdbootstrap.com/previews/docs/latest/html/fsscroller/basic.html#view-1

    efeitos

    http://fabricjs.com/text-on-paths
    http://fabricjs.com/duotone-filter
    https://codepen.io/durga598/pen/gXQjdw
    https://stackoverflow.com/questions/48761416/how-to-add-polygon-points-and-draw-it-on-an-image-in-fabric-js
    http://jsfiddle.net/77vg88mc/34/
    http://fabricjs.com/custom-controls-polygon
    http://fabricjs.com/quadratic-curve

    Invert
    Grayscale
    Remove color
    Brightness
    Gamma
    Contrast
    Saturation
    Noise
    Blur
    Sharpen
    Emboss
    Blend Color

    */

}
