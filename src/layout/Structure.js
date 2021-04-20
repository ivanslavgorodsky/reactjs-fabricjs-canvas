import React from "react";
import Canvas from "../components/fabricjs/Canvas";
import { useGlobal } from "../components/config/global";
import { Menu, MenuItem } from '@material-ui/core';
import PanelToolBigButton from "./panel/PanelToolBigButton";
import "./Structure.css";

const initialState = {
  mouseX: null,
  mouseY: null,
};

function Structure() {
  
  const {setGlobal} = useGlobal();  
  const [state, setState] = React.useState(initialState);

  const handleClick = (event) => {
    event.preventDefault();
    setState({
      mouseX: event.clientX - 2,
      mouseY: event.clientY - 4,
    });
  };

  const handleClose = ( event ) => {
    setState( initialState );
  };

  return (
    <React.Fragment>

      <PanelToolBigButton/>

      <div onContextMenu={handleClick}>
        <Canvas
          id="canvas"
          setGlobal={(g) => setGlobal(g)}
          style={{float:'left'}}
        />
          <Menu
          keepMounted
          open={state.mouseY !== null}
          onClose={handleClose}
          anchorReference="anchorPosition"
          anchorPosition={
            state.mouseY !== null && state.mouseX !== null
              ? { top: state.mouseY, left: state.mouseX }
              : undefined
          }
          >
            <MenuItem>
              Item 1
            </MenuItem>
            <MenuItem>
              Item 2
            </MenuItem>
        </Menu>
      </div>

    </React.Fragment>
  );
}

export default Structure;
