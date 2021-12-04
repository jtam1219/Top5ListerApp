import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { useContext } from 'react';
import AuthContext from '../auth'
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import { GlobalStoreContext } from '../store'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius:3,
  p: 1,
  padding:0,
};

export default function ErrorModals() {
  const { auth } = useContext(AuthContext);
  const { store } = useContext(GlobalStoreContext);
  function handleClose(){
    store.removeErr();
    auth.errorMessage=null;
    isOpen=false;
  }

  let isOpen=false;
  if (auth.errorMessage && auth.errorMessage!=="Unauthorized"){
    isOpen=true;
  }

  return (
    <div>
      <Modal
        open={isOpen}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
          
          <Alert severity="error">
            <AlertTitle>{auth.errorMessage}<Button onClick={handleClose}>Cancel</Button></AlertTitle>
          </Alert>
          </Typography>
          <Typography id="modal-modal-description errorModal" sx={{ mt: 2 }}>
          
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}