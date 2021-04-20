import React,{useEffect, useState} from "react";
import IconButton from "@material-ui/core/IconButton";
import { Tooltip, withStyles } from "@material-ui/core";
import Badge from '@material-ui/core/Badge';
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';
import { useGlobal } from "../config/global";
import UtilsObject from "../utils/UtilsObject";

// svg icon
import Brands from "./../assets/personalSVG/panel-brands.svg";
import Process from "./../assets/personalSVG/panel-process.svg";
import Library from "./../assets/personalSVG/panel-library.svg";
import Material from "./../assets/personalSVG/panel-material.svg";
import TextAndShapes from "./../assets/personalSVG/panel-text-and-shapes.svg";
import Effects from "./../assets/personalSVG/panel-effects.svg";
import Settings from "./../assets/personalSVG/panel-settings.svg";
import Finishing from "./../assets/personalSVG/panel-finishing.svg";

const StyledBadge = withStyles((theme) => ({
  badge: {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
    // firefox padding: '4px 5px 1px 5px',
    // firefox fontSize: 10,
  },
}))(Badge);

const styles = {
  button: {
    width: 45, 
    height: 45, 
    backgroundColor: 'transparent', 
    borderRadius: 7, 
    border: 0, 
    border: 'none',
    marginBottom: 3,
  },
};


export default function Icons (props) {

  // HOC
  // https://pt-br.reactjs.org/docs/higher-order-components.html#use-hocs-for-cross-cutting-concerns

  // iOS like border-radius corners react component
  // npm install react-ios-corners
  // import { Squircle } from 'react-ios-corners';
  // <Squircle>Hello</Squircle>
  // https://reactjsexample.com/ios-like-border-radius-corners-react-component/

  const {valGlobal} = useGlobal();
  const [filtersRows, setFiltersRows] = useState( 0 );

  const updateActiveObject = () => {

    UtilsObject.getActive( valGlobal.canvas ).then( object => {

      if( object === null ){
        setFiltersRows(0);
      } else if( object.hasOwnProperty('filters') === false ){
        setFiltersRows(0);
      } else if ( Array.isArray(object.filters) === false ){
        setFiltersRows(0);
      } else {
        setFiltersRows( object.filters.length );
      }
  
    }).catch(()=>setFiltersRows(0));

  }

  const changePanelClick = ( name ) => {
    return props.changePanelClick( name );
  }

  const changePanelOver = ( name ) => {
    return props.changePanelOver( name );
  }

  useEffect(() => {
    updateActiveObject();
  },[valGlobal]);

  return (
    <React.Fragment>

      <Tooltip title="Brands & Elements" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick('brands')}
          onMouseOver={() => changePanelOver('brands')}
        >
          <img src={Brands} style={{ width:35, height:35 }} />
        </button>
      </Tooltip>
      
      <Tooltip title="Process" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick('process')}
          onMouseOver={() => changePanelOver('process')}
        >
          <img src={Process} style={{ width:25, height:25 }} />
        </button>
      </Tooltip>

      <Tooltip title="Arts Library & Components" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick('library')}
          onMouseOver={() => changePanelOver('library')}
        >
          <img src={Library} style={{ width:25, height:25 }} />
        </button>
      </Tooltip>

      <Tooltip title="Raw Material (MP)" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick('material')}
          onMouseOver={() => changePanelOver('material')}
        >
          <img src={Material} style={{ width:25, height:25 }} />
        </button>
      </Tooltip>

      <Tooltip title="Text" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick("text")}
          onMouseOver={() => changePanelOver("text")}
        >
          <img src={TextAndShapes} style={{ width:25, height:25 }} />
        </button>
      </Tooltip>

      <Tooltip title="Finishing & Complement" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick("finishing")}
          onMouseOver={() => changePanelOver("finishing")}
        >
          <img src={Finishing} style={{ width:25, height:25 }} />
        </button>
      </Tooltip>

      <Tooltip title="Effects" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick("effects")}
          onMouseOver={() => changePanelOver("effects")}
        >
          <StyledBadge badgeContent={ filtersRows } color="secondary" >
          <img src={Effects} style={{ width:26, height:26 }} />
          </StyledBadge>
        </button>
      </Tooltip>

      <Tooltip title="Settings" placement="right">
        <button style={styles.button}
          onClick={() => changePanelClick("settings")}
          onMouseOver={() => changePanelOver("settings")}
        >
          <img src={Settings} style={{ width:30, height:30 }} />

        </button>
      </Tooltip>

      <center style={{opacity:0.3}}> 
        <a href="javascript:;" onClick={()=>changePanelClick(2)}>2</a> 
        <a href="javascript:;" onClick={()=>changePanelClick(3)}>3</a>  
        <a href="javascript:;" onClick={()=>changePanelClick(6)}>6</a> 
      </center>

    </React.Fragment>
  );
}
