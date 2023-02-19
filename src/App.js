import React, { useCallback, useState, useEffect } from 'react';
import './App.css';
import { useNavigate } from "react-router-dom";
import pqArray from './routes/practiceQuizDatabase.js';

import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import exampleimage1 from './images/examplephoto1.png';
import exampleimage2 from './images/examplephoto2.png';
import Alert from '@mui/material/Alert';

import { initializeApp } from "firebase/app";
import { getFirestore, doc, getDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCneprZKzkDp_vh7UarQIw4Id-IJAMCZEk",
  authDomain: "bam-nvim.firebaseapp.com",
  projectId: "bam-nvim",
  storageBucket: "bam-nvim.appspot.com",
  messagingSenderId: "994867030843",
  appId: "1:994867030843:web:f9739ee4c9fc8d2855651e",
  measurementId: "G-HWNR0XNDBL"
};

const firebaseApp = initializeApp(firebaseConfig)

function App() {
  let navigate = useNavigate();
  const [username, setUsername] = useState("");

  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);

  const [open, setOpen] = useState(false);

  const db = getFirestore(firebaseApp);
  const docRef = username && doc(db, 'users', username);

  // useEffect(() => {
  //   const fetchUser = async () => {
  //     const docSnap = await getDoc(docRef);
  //     const user = docSnap.data()
  
  //     console.log({user, docSnap});
  //   }
  
  //   fetchUser();
  // }, []);

  const fetchData = useCallback(async () => {
    setOpen(false);
    setIsFetching(true);
    const docSnap = await getDoc(docRef);
    const user = docSnap.data()

    setIsFetching(false);
    setOpen(true);

    if (!user) {
      console.log(`No user found with username: ${username}`)
      return;
    }

    navigate("../quiz", { replace: true, state: { username: username } });
  }, [username]);

  const handleKeyDown = (e) => {
    if (e.keyCode === 13 && !e.shiftKey) {
      fetchData();
      e.preventDefault();
    }
  }

  //practice quiz section

  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(30);

  const [storedAns, setStoredAns] = useState([""]);
  const ansStorer = () => {
    for (var i = 0; i < 4; i++) {
      if (count < 2) {
        setStoredAns(storedAns[i] = pqArray[count + 1].answers[i]);
      } else {
        setStoredAns(storedAns[i] = pqArray[0].answers[i]);
      }
    }
    setStoredAns(storedAns.sort((a) => 0.5 - Math.random()));
  }

  //renders first question answers
  useEffect(() => {
    for (var i = 0; i < 4; i++) {
      setStoredAns(storedAns[i] = pqArray[count].answers[i]);
    }
    setStoredAns(storedAns.sort((a) => 0.5 - Math.random()));
  }, []);


  const handleClick = (isCorrect) => {

    //set scores
    if (isCorrect) {
      setScore(score + 1)//tracks total score
    }

    //handles the count
    if (count < 2) {
      setCount(count + 1); //set count
      ansStorer(); //storeAnswers to prevent shuffle
    } else {
      setCount(0);
      ansStorer();
      setScore(0);
    }
    setCounter(30); //resets timer

  }

  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter <= 0) {
      //toggle();
      setCounter(30);
      setCount(count + 1);
      ansStorer();
      handleClick(false);
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <>
      <div className="App">
        <div className="App-header">

          <div className="Instructions">
            <h1>MaRs Reasoning Task</h1>
            <h2>Instructions</h2>
            <p>In this task, you will be shown a 3x3 grid of patterns. The last one, in the bottom right-hand corner, <b>will be missing:</b></p>
            <img src={exampleimage1} alt="Example of questions" class="image1" />
            <p>You need to select <b>which of the four possible patterns</b> along the bottom <b>fits in the gap:</b></p>
            <img src={exampleimage2} alt="Example of answer possibilities" class="image2" />
            <p>Try to be as fast and accurate as you can be.<br></br><br></br> If you cannot solve the puzzle then you should guess - you will not be penalised for an incorrect answer.<br></br><br></br> The task contains a shuffled mix of easy, medium and hard puzzles.<br></br><br></br> You will have <b>30 seconds</b> to complete each puzzle.</p>


            <div className="text-input">
              <TextField id="outlined-basic" label="Enter Access Code" variant="outlined" value={username}
                onChange={(e) => { setUsername(e.target.value); }}
                onKeyDown={(e) => { handleKeyDown(e) }} />
              <LoadingButton variant="contained" sx={{ textTransform: "none" }} disableElevation
                onClick={() => { navigate("../practice", { replace: true }) }}>
                Take Practice Test</LoadingButton>
              <LoadingButton variant="contained" loading={isFetching} sx={{ textTransform: "none" }} disableElevation
                onClick={fetchData}>
                Begin Test</LoadingButton>

              {open ?
                <Alert severity="warning">{message}</Alert>
                :
                <></>
              }

            </div>
          </div>
        </div>
      </div>
    </>


  );

}

export default App;