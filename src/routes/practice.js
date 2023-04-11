import React, { useCallback, useState, useEffect } from "react";
import "./quiz.css";
import { useNavigate } from "react-router-dom";
import pqArray from "./practiceQuizDatabase.js";

import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";
import LinearProgress from "@mui/material/LinearProgress";
import Modal from "@mui/material/Modal";

import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "75%",
  textAlign: "center",
};

function App() {
  let navigate = useNavigate();

  //practice quiz section

  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);
  const [counter, setCounter] = useState(30);

  //modal
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  //modal toggle
  const toggle = () => {
    setShow(true);
    setTimeout(() => setShow(false), 1000);
  };

  const [storedAns, setStoredAns] = useState([""]);
  const ansStorer = () => {
    for (var i = 0; i < 4; i++) {
      if (count < 2) {
        setStoredAns((storedAns[i] = pqArray[count + 1].answers[i]));
      } else {
        setStoredAns((storedAns[i] = pqArray[0].answers[i]));
      }
    }
    setStoredAns(storedAns.sort((a) => 0.5 - Math.random()));
  };

  //renders first question answers
  useEffect(() => {
    setShow(true);
    for (var i = 0; i < 4; i++) {
      setStoredAns((storedAns[i] = pqArray[count].answers[i]));
    }
    setStoredAns(storedAns.sort((a) => 0.5 - Math.random()));
  }, []);

  const handleClick = (isCorrect) => {
    //set scores
    if (isCorrect) {
      setScore(score + 1); //tracks total score
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
  };

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
      <Modal
        open={show}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Card sx={{ maxWidth: 400, margin: "auto" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Practice Test
              </Typography>
              <Typography variant="body2">
                <br />
                You will be shown a 3x3 grid of patterns.
                <br />
                The last one, in the bottom right-hand corner, will be missing.
                Select the answer which fits best.
                <br />A 30 second timer will keep you on track.
              </Typography>
              <Typography
                sx={{ fontSize: 14 }}
                color="text.secondary"
                gutterBottom
              >
                <br />
                Click anywhere outside of this box to continue.
                <br />
                Click the Home button to return to the main menu.
              </Typography>
            </CardContent>
          </Card>
        </Box>
      </Modal>

      <div className="quiz">
        <div className="quiz-header">
          <Box sx={{ width: "100%" }}>
            <LinearProgress
              variant="determinate"
              color="inherit"
              value={counter * (10 / 3)}
            />
          </Box>
          <div className="home-icon">
            <Box
              onClick={() => {
                navigate("../", { replace: true });
              }}
            >
              <HomeIcon sx={{ fontSize: 30, color: "#666666" }} />
            </Box>
          </div>

          <img
            src={pqArray[count].question}
            className="questions"
            alt="Quiz Question"
          />
          <div className="answers">
            {storedAns.map((a) => (
              <button
                onClick={() => {
                  handleClick(a.isCorrect);
                }}
              >
                <img src={a.ansImg} alt="Quiz Answer" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
