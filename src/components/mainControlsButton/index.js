import React from 'react';
import './style.css';

const MainControlsButton = ({ faIcon, children }) => (
  <div className={'mainControlsButton'}>
    {faIcon && <i className={faIcon}></i>}
    {children}
  </div>
);

export default MainControlsButton;
