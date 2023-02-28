import React from 'react';
import greyScreen from './greyScreen.png';
import './modal.css';

const Modal = props => {

  if (!props.show){
    return null;
  }

  return (
    <div className = "modal">
      <img src={greyScreen} className="modal"/>
    </div>
  );
};

export default Modal;