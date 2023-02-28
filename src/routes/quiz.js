import './quiz.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import LinearProgress from '@mui/material/LinearProgress';

import qArray from './quizDatabase.js';

export default function Quiz() {
  let navigate = useNavigate();
  const location = useLocation();

  const [count, setCount] = useState(0);
  const [counter, setCounter] = useState(30);
  const [ansArray, setAnsArray] = useState([]);

  const [username, setUsername] = useState("admin");

  //Renders first question's answers
  useEffect(() => {
    setUsername(location.state.username);
    for (var i = 0; i < 4; i++) {
      setStoredAns(storedAns[i] = qArray[count].answers[i]);
    }
    setStoredAns(storedAns.sort((a) => 0.5 - Math.random()));
  }, []);


  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  //modal toggle
  const toggle = () => {
    setShow(true);
    setTimeout(() => setShow(false), 1000);
  };


  //stores answer options 
  const [storedAns, setStoredAns] = useState([""]);
  const ansStorer = () => {
    for (var i = 0; i < 4; i++) {
      setStoredAns(storedAns[i] = qArray[count + 1].answers[i]);
    }
    setStoredAns(storedAns.sort((a) => 0.5 - Math.random()));
  }

  //stores correct/incorrect answers in array
  const saveScore = (a) => {
    setAnsArray([
      ...ansArray,
      {
        id: ansArray.length,
        value: a
      }
    ])
  }

  const handleClick = (isCorrect) => {
    saveScore(isCorrect ? 1 : 0)

    //handles the count
    if (count < 79) {
      setCount(count + 1); //set count
      ansStorer(); //storeAnswers to prevent shuffle
    } else {
      sendData();
      navigate("../complete"); //quiz is completed
    }
    setCounter(30); //resets timer
  }

  //testButton to skip to final few questions
  const testButton = () => {
    console.log(username)
    setCount(78);
    setCounter(30);
  }


  //Finish Test and Upload Data
  // const sendData = useCallback(() => {
  //   const answers = JSON.stringify(ansArray)
  //   fetch(`/apidone?username=${username}&ansArray=${answers}`)
  //     .then(response => {
  //       if (!response.ok) {
  //         throw new Error(`status ${response.status}`);
  //       }
  //       return response.json();
  //     })
  //     .then(json => {
  //       setMessage(json.message);
  //       setIsFetching(false);
  //       return json.message;
  //     })
  //     .then(message => {
  //       if (message) {
  //         console.log("f: " + message);
  //       }
  //       else {
  //         navigate("../finalpage", { replace: true });
  //       }
  //     })
  //     .catch(e => {
  //       setMessage(`API call failed: ${e}`);
  //       setIsFetching(false);
  //     })
  // }, [username, ansArray]);

  async function sendData() {

  }


  //Timer 
  React.useEffect(() => {
    const timer =
      counter > 0 && setInterval(() => setCounter(counter - 1), 1000);

    if (counter <= 0) {
      toggle();
      setCounter(30);
      setCount(count + 1);
      ansStorer();
      handleClick(false);
    }
    return () => clearInterval(timer);
  }, [counter]);

  return (
    <div className='quiz'>

      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={{
          display: 'flex',
          width: '100%',
          height: '100%',
          bgcolor: '#fff',
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          flexDirection: 'column'
        }}>
          <AddIcon sx={{ fontSize: 100 }} />
        </Box>
      </Modal>

      <div className='quiz-header'>
        <Box sx={{ width: '100%' }}>
          <LinearProgress variant="determinate" color="inherit"  value={counter*(10/3)}/>
        </Box>
        <img src={qArray[count].question}
          className="questions" alt="Quiz Question" />
        <div className="answers">
          {
            storedAns
              .map((a) => (
                <button onClick={() => {
                  handleClick(a.isCorrect);
                  toggle();
                }
                }>
                  <img src={a.ansImg} alt="Quiz Answer" />
                </button>))}
        </div>
      </div>
    </div>
  );


}