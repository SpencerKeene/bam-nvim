import './App.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from '@mui/material/Alert';

import exampleimage1 from './assets/exampleImages/examplephoto1.png';
import exampleimage2 from './assets/exampleImages/examplephoto2.png';

import { useGetUser } from './hooks/firebase';

function App() {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState('');
  const [user, error, loading, refresh] = useGetUser(accessCode);

  useEffect(() => {
    if (error) setMessage(error);
  }, [error])

  useEffect(() => {
    switch(user?.status) {
      case 'completed': 
        setMessage('You have already completed this quiz once. Please contact the researcher if you believe there is an issue.');
        break;
      case 'incomplete':
        navigate("../quiz", { state: { accessCode } });
        break;
      default:
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const handleKeyDown = (e) => {
    // if user presses Enter without pressing Shift
    if (e.keyCode === 13 && !e.shiftKey) {
      refresh();
      e.preventDefault();
    }
  }

  return (
    <div className="App">
      <div className="App-header">

        <div className="Instructions">
          <h1>MaRs Reasoning Task</h1>
          <h2>Instructions</h2>
          <p>In this task, you will be shown a 3x3 grid of patterns. The last one, in the bottom right-hand corner, <b>will be missing:</b></p>
          <img src={exampleimage1} alt="Example of questions" className="image1" />
          <p>You need to select <b>which of the four possible patterns</b> along the bottom <b>fits in the gap:</b></p>
          <img src={exampleimage2} alt="Example of answer possibilities" className="image2" />
          <p>Try to be as fast and accurate as you can be.
            <br></br><br></br> If you cannot solve the puzzle then you should guess - you will not be penalised for an incorrect answer.
            <br></br><br></br> The task contains a shuffled mix of easy, medium and hard puzzles.
            <br></br><br></br> You will have <b>30 seconds</b> to complete each puzzle.
          </p>


          <div className="text-input">
            <TextField 
              id="outlined-basic" 
              label="Enter Access Code"
              variant="outlined"
              value={accessCode}
              onChange={(e) => { setAccessCode(e.target.value); }}
              onKeyDown={handleKeyDown}
            />
            <LoadingButton 
              variant="contained"
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={() => { navigate("../practice") }}
            >
              Take Practice Test
            </LoadingButton>
            <LoadingButton
              variant="contained"
              loading={loading}
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={refresh}
              disabled={!accessCode}
            >
              Begin Test
            </LoadingButton>

            {message && <Alert severity="error">{message}</Alert>}

          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
