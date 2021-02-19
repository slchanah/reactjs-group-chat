import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, TextField, Button } from '@material-ui/core';

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

const ChangeNameModal = ({
  open,
  handleClose,
  username,
  onUsernameChange,
  isUsernameInvalid,
}) => {
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
          <TextField
            label='Your Name'
            fullWidth
            value={username}
            error={isUsernameInvalid}
            helperText={isUsernameInvalid ? 'Username cannot be empty' : ''}
            onChange={(e) => onUsernameChange(e)}
          />
        </div>

        <div className='modal__button_container'>
          <Button
            className='modal__button'
            variant='contained'
            disabled={username.length === 0 || isUsernameInvalid}
            classes={{ disabled: 'modal__button_disabled' }}
            onClick={handleClose}
          >
            Close
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ChangeNameModal;
