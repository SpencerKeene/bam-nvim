import { LoadingButton } from '@mui/lab';
import { Alert, TextField } from '@mui/material';
import React, { useState } from 'react'
import { researcherSignIn } from '../../utils/firebase';

export default function ResearcherSignin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  function handleSignIn() {
    setLoading(false);
    researcherSignIn(email, password)
      .catch(err => setMessage(err.message))
      .finally(() => setLoading(false));
  }


  const handleKeyDown = (e) => {
    // if user presses Enter without pressing Shift
    if (e.keyCode === 13 && !e.shiftKey) {
      handleSignIn();
      e.preventDefault();
    }
  }

  return (
    <div className="Instructions">
      <h1>MaRs Reasoning Task</h1>

      <h2>Researcher Sign In</h2>

      <div className='text-input' style={{width: '400px'}}>
        <TextField
          id="email" 
          label="Email"
          variant="outlined"
          value={email}
          onChange={(e) => { setEmail(e.target.value) }}
        />
        <TextField
          id="password" 
          label="Password"
          variant="outlined"
          type='password'
          value={password}
          onChange={(e) => { setPassword(e.target.value) }}
          onKeyDown={handleKeyDown}
        />
        <LoadingButton
          variant="contained"
          loading={loading}
          sx={{ textTransform: "none" }}
          disableElevation
          onClick={handleSignIn}
          disabled={!email || !password}
        >
          Sign In
        </LoadingButton>

        {message && <Alert severity='error'>{message}</Alert>}
      </div>
    </div>
  )
}
