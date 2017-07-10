import React from 'react'
import ReactDOM from 'react-dom'
import Container from './components/Container'

let RenderComponent = () =>
	ReactDOM.render(
    	    <Container />,
	  document.getElementById('container')
	);


window.RenderComponent = RenderComponent;

