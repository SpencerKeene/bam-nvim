import "./Researcher.css";
import { LoadingButton } from "@mui/lab";
import {
  Alert,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  TextField,
  Toolbar,
  Tooltip,
} from "@mui/material";
import React, { useMemo, useState } from "react";
import { createUser, deleteUser } from "../../utils/firebase";
import { useResearcherAuth, useUserCollection } from "../../hooks/firebase";
import {
  DataGrid,
  GridToolbarExport,
  GridToolbarFilterButton,
  useGridApiContext,
} from "@mui/x-data-grid";
import { Delete } from "@mui/icons-material";

function CustomGridToolbar() {
  const apiRef = useGridApiContext();

  const [open, setOpen] = useState(false);

  const selectedRows = apiRef.current.getSelectedRows();

  function deleteUsers() {
    selectedRows.forEach((_, accessCode) => {
      deleteUser(accessCode);
    });
  }

  return (
    <Toolbar>
      <Dialog
        open={open}
        onClose={null}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Participants?</DialogTitle>
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
            color="error"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <GridToolbarFilterButton />
      <GridToolbarExport />
      <div style={{ marginLeft: "auto" }}>
        <Tooltip title="Delete">
          <span>
            <IconButton
              onClick={() => setOpen(true)}
              disabled={selectedRows.size === 0}
            >
              <Delete />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    </Toolbar>
  );
}

export default function ResearcherPortal() {
  // Hooks
  const researcher = useResearcherAuth();
  const users = useUserCollection();

  // State
  const [newAccessCode, setNewAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageSeverity, setMessageSeverity] = useState("");
  const [showSignOutDialog, setShowSignOutDialog] = useState(false);

  // Functions
  const setSuccessMessage = (message) => {
    setMessage(message);
    setMessageSeverity("success");
  };
  const setErrorMessage = (message) => {
    setMessage(message);
    setMessageSeverity("error");
  };
  const handleCreateUser = () => {
    setLoading(true);
    createUser(newAccessCode)
      .then(() => setSuccessMessage("User created successfully"))
      .catch((err) => setErrorMessage(err.message))
      .finally(() => setLoading(false));
  };
  const handleKeyDown = (e) => {
    // if user presses Enter without pressing Shift
    if (e.keyCode === 13 && !e.shiftKey) {
      handleCreateUser();
      e.preventDefault();
    }
  };
  const handleSignOut = () => {
    researcher.auth.signOut();
  };
  const getUserScore = (params) => params.row.results?.score ?? "N/A";
  const getUserAnswers = (params) => params.row.results?.answers ?? "N/A";

  // Constants
  const userGridColumns = [
    { field: "accessCode", headerName: "Access Code", width: 300 },
    { field: "status", headerName: "Status", width: 125 },
    {
      field: "score",
      headerName: "Score",
      valueGetter: getUserScore,
      width: 125,
    },
    {
      field: "answers",
      headerName: "Answers",
      valueGetter: getUserAnswers,
      flex: 1,
    },
  ];
  const userGridRows = useMemo(() => {
    if (!users) return [];
    return Object.entries(users).map(([accessCode, doc]) => ({
      id: accessCode,
      accessCode,
      ...doc,
    }));
  }, [users]);

  return (
    <div className="Instructions">
      <h1>MaRs Reasoning Task</h1>

      <h2>Researcher Portal</h2>
      <p>
        Create or delete user accounts for participants and view/download
        participant results.
      </p>

      <p>
        <b>Signed in as:</b> {researcher?.email}
      </p>
      <Button onClick={() => setShowSignOutDialog(true)} color="error">
        Sign Out
      </Button>
      {/* sign out dialog */}
      <Dialog
        open={showSignOutDialog}
        onClose={() => setShowSignOutDialog(false)}
      >
        <DialogTitle>Sign Out?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to sign out?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowSignOutDialog(false)}>Cancel</Button>
          <Button onClick={handleSignOut} autoFocus color="error">
            Sign Out
          </Button>
        </DialogActions>
      </Dialog>

      <h3>Participants</h3>
      <div className="text-input">
        <TextField
          id="outlined-basic"
          label="New Access Code"
          variant="outlined"
          value={newAccessCode}
          onChange={(e) => {
            setNewAccessCode(e.target.value);
          }}
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

      <div className="user-list">
        {!users ? (
          <div style={{ display: "grid", justifyContent: "center" }}>
            <CircularProgress size={50} />
          </div>
        ) : (
          <DataGrid
            rows={userGridRows}
            columns={userGridColumns}
            checkboxSelection
            slots={{
              toolbar: CustomGridToolbar,
            }}
          />
        )}
      </div>
    </div>
  );
}
