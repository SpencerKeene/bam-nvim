import './Researcher.css'
import { LoadingButton } from '@mui/lab';
import { Alert, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, TextField, Toolbar, Tooltip } from '@mui/material';
import React, { useMemo, useState } from 'react'
import { createUser, deleteUser } from '../../utils/firebase';
import { useUserCollection } from '../../hooks/firebase';
import { DataGrid, GridToolbarExport, GridToolbarFilterButton, useGridApiContext } from '@mui/x-data-grid';
import { Delete } from '@mui/icons-material';

function CustomGridToolbar() {
  const apiRef = useGridApiContext();
  
  const [open, setOpen] = useState(false);
  
  const selectedRows = apiRef.current.getSelectedRows();

  function deleteUsers() {
    selectedRows.forEach((_, accessCode) => {
      deleteUser(accessCode);
    })
  }

  return (
    <Toolbar>
      <Dialog
        open={open}
        onClose={null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Delete Participants?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete these participants?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button 
            onClick={() => {
              setOpen(false);
              deleteUsers();
            }}
            autoFocus
            color='error'
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <GridToolbarFilterButton />
      <GridToolbarExport />
      <div style={{marginLeft: 'auto'}}>
        <Tooltip title='Delete'>
          <IconButton 
            onClick={() => setOpen(true)}
            disabled={selectedRows.size === 0}
          >
            <Delete />
          </IconButton>
        </Tooltip>
      </div>
    </Toolbar>
  )
}

export default function ResearcherPortal() {
  const [newAccessCode, setNewAccessCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageSeverity, setMessageSeverity] = useState('');

  const users = useUserCollection();

  const userGridRows = useMemo(() => !users ? [] : Object.entries(users).map(([accessCode, doc]) => ({
    id: accessCode,
    accessCode,
    ...doc
  })), [users]);
  
  const userGridColumns = [
    { field: 'accessCode', headerName: 'Access Code', width: 300 },
    { field: 'status', headerName: 'Status', width: 150 },
    { field: 'score', headerName: 'Score', width: 150},
    { field: 'answers', headerName: 'Answers'}
  ]

  function setSuccessMessage(message) {
    setMessage(message);
    setMessageSeverity('success');
  }

  function setErrorMessage(message) {
    setMessage(message);
    setMessageSeverity('error');
  }

  function handleCreateUser() {
    setLoading(true);
    createUser(newAccessCode)
      .then(() => setSuccessMessage('User created successfully'))
      .catch(err => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  }

  const handleKeyDown = (e) => {
    // if user presses Enter without pressing Shift
    if (e.keyCode === 13 && !e.shiftKey) {
      handleCreateUser();
      e.preventDefault();
    }
  }

  return (
    <div className="Instructions">
      <h1>MaRs Reasoning Task</h1>

      <h2>Researcher Portal</h2>
      <p>Create or delete user accounts for participants and view/download participant results.</p>

      <h3>Participants</h3>
      <div className='text-input'>
        <TextField
          id="outlined-basic" 
          label="Enter Access Code"
          variant="outlined"
          value={newAccessCode}
          onChange={(e) => { setNewAccessCode(e.target.value) }}
          onKeyDown={handleKeyDown}
        />
        <LoadingButton
          variant="contained"
          loading={loading}
          sx={{ textTransform: "none" }}
          disableElevation
          onClick={handleCreateUser}
          disabled={!newAccessCode}
        >
          Create New User
        </LoadingButton>

        {message && <Alert severity={messageSeverity}>{message}</Alert>}
      </div>

      <div className='user-list'>
        {!users ? (
          <div style={{ display: 'grid', justifyContent: 'center' }}>
            <CircularProgress size={50}/>
          </div>
        ) : (
          <DataGrid
            rows={userGridRows}
            columns={userGridColumns}
            checkboxSelection
            slots={{
              toolbar: CustomGridToolbar
            }}
          />
        )}
      </div>
    </div>
  )
}
