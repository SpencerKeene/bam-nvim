import './quiz.css';
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from "react-router-dom";

import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';

import qArray from './quizDatabase.js';
import { useCountdownTimer } from '../components/CountdownTimer';
import { useGetUser } from '../hooks/firebase';
import { postUserAnswers } from '../utils/firebase';

// timer durations in milliseconds
const QUESTION_TIMER_DURATION = 30000;
const MODAL_TIMER_DURATION = 1000;

export default function Quiz() {
  let navigate = useNavigate();
  const location = useLocation();
  
  const accessCode = location.state?.accessCode;

  const [count, setCount] = useState(0);
  const [ansArray, setAnsArray] = useState([]);
  const [user, error] = useGetUser(accessCode, true);

  const [timerComponent, startTimer, stopTimer] = useCountdownTimer(QUESTION_TIMER_DURATION, onTimerEnd);

  // redirect user if they don't have a valid access code
  useEffect(() => {
    if (error || !user) navigate('..');

    switch(user.status) {
      case 'completed': 
        navigate('..');
        break;
      case 'incomplete':
        startTimer();
        break;
      default:
        navigate('..');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error])
  
  //Renders first question's answers
  useEffect(() => {
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
    setTimeout(() => {
      setShow(false);
      startTimer();
    }, MODAL_TIMER_DURATION);
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
      a
    ])
  }
  
  const handleClick = (isCorrect) => {
    stopTimer();
    saveScore(isCorrect);

    //handles the count
    if (count < 79) {
      setCount(count + 1); //set count
      ansStorer(); //storeAnswers to prevent shuffle
    } else {
      console.log('update', {
        ansArray,
        ...(accessCode !== 'dev' && { status: 'completed' })
      });
      postUserAnswers(accessCode, ansArray).then(() => {
        navigate("../complete"); //quiz is completed
      });
    }
  }

  //testButton to skip to final few questions
  const testButton = () => {
    console.log('test button pressed, skipping questions');
    setCount(78);
    ansStorer();
    startTimer();
  }

  function onTimerEnd() {
    toggle();
    setCount(count + 1);
    ansStorer();
    handleClick(false);
  }

  return (
    <div className='quiz'>
      <button onClick={testButton} style={{display: 'none'}} />

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

      {!show && user && (
        <div className='quiz-header'>
          <Box sx={{ width: '100%' }}>
            {timerComponent}
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
      )}
    </div>
  );


}