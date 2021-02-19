import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Button } from '@material-ui/core';

import './style.css';

const useStyles = makeStyles((theme) => ({
  modal: {
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '8px',
    flexDirection: 'column',
  },
}));

const RoomFullModal = ({ open, handleClose }) => {
  const classes = useStyles();

  return (
    <Modal
      open={open}
      onClose={handleClose}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div className={classes.modal}>
        <div className='modal__text_field'>
          <h3>The room is full</h3>
        </div>

        <div className='modal__button_container'>
          <Button
            className='modal__button'
            variant='contained'
            onClick={handleClose}
          >
            Back
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default RoomFullModal;
