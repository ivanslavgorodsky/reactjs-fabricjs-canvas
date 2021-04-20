export default function If(props){ 
    return props.value === true ? props.children : false ;
}

/* import React from 'react';
export default class If extends React.Component {
    constructor(props){
        super(props)
    }
    render(){
        return this.props.value === true ? this.props.children : null
    }
} */