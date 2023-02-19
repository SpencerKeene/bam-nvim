import React, { useEffect, useState, useCallback } from 'react';
import './quiz.css';
//import quizqs from './quizDatabase.js';
import qArray from './quizDatabase.js';
import Modal from '@mui/material/Modal';
import Box from '@mui/material/Box';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate, useLocation } from "react-router-dom";
import LinearProgress from '@mui/material/LinearProgress';

const style = {
  display: 'flex',
  width: '100%',
  height: '100%',
  bgcolor: '#fff',
  justifyContent: 'center',
  alignContent: 'center',
  alignItems: 'center',
  flexDirection: 'column'
};

export default function Quizui() {
  let navigate = useNavigate();
  const location = useLocation();

  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(30);
  const [ansArray, setAnsArray] = useState([]);

  const [username, setUsername] = useState("admin");
  const [message, setMessage] = useState(null);
  const [isFetching, setIsFetching] = useState(false);


  //Renders first question's answers
  useEffect(() => {
    setUsername(location.state.username);
    console.log(username)
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
    if (a === 1) {
      setAnsArray([...ansArray, {
        id: ansArray.length,
        value: 1
      }])
    } else {
      setAnsArray([...ansArray, {
        id: ansArray.length,
        value: 0
      }])
    }
  }

  const handleClick = (isCorrect) => {

    //set scores
    if (isCorrect) {
      setScore(score + 1)//tracks total score
      saveScore(1);//adds a correct (1) to the array
    } else {
      saveScore(0);//adds an incorrect (0) to the array
    }

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
  const sendData = useCallback(() => {
    setIsFetching(true);
    const answers = JSON.stringify(ansArray)
    fetch(`/apidone?username=${username}&ansArray=${answers}`)
      .then(response => {
        if (!response.ok) {
          throw new Error(`status ${response.status}`);
        }
        return response.json();
      })
      .then(json => {
        setMessage(json.message);
        setIsFetching(false);
        return json.message;
      })
      .then(message => {
        if (message) {
          console.log("f: " + message);
        }
        else {
          navigate("../finalpage", { replace: true });
        }
      })
      .catch(e => {
        setMessage(`API call failed: ${e}`);
        setIsFetching(false);
      })
  }, [username, ansArray]);


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

  // React.useEffect(() => {
  //     counter > 0 && setTimeout(() => setCounter(counter - 1), 1000);
  //     if(counter<=0){
  //       toggle();
  //       setCounter(30);
  //       setCount(count+1);
  //       ansStorer();
  //     }
  //   }, [counter]);


  return (
    <div className='quiz'>

      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
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
            storedAns.
              map((a) => (
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