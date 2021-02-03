import React from 'react';
import './style.css';

const MainControlsButton = ({ faIcon, onClick, children }) => (
  <div className={'mainControlsButton'} onClick={onClick}>
    {faIcon && <i className={faIcon}></i>}
    {children}
  </div>
);

export default MainControlsButton;
