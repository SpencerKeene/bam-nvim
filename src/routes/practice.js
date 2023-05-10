import React, { useState, useEffect } from "react";
import "./quiz.css";
import { useLocation, useNavigate } from "react-router-dom";
import pqArray from "./practiceQuizDatabase.js";

import HomeIcon from "@mui/icons-material/Home";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";

import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { useCountdownTimer } from "../components/CountdownTimer";
import { setStatusPracticed } from "../utils/firebase";
import { useGetUser } from "../hooks/firebase";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "75%",
  textAlign: "center",
};

const QUESTION_TIMER_DURATION = 30000;

function App() {
  let navigate = useNavigate();
  const location = useLocation();

  // user
  const accessCode = location.state?.accessCode;
  const [user, error] = useGetUser(accessCode, true);

  // redirect user if they don't exist
  useEffect(() => {
    if (error) navigate("..");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, error]);

  //practice quiz section

  const [count, setCount] = useState(0);
  const [score, setScore] = useState(0);

  //modal
  const [showHelp, setShowHelp] = useState(false);
  const handleCloseHelp = () => {
    setShowHelp(false);
    startTimer();
  };

  //complete
  const [hasCompleted, setHasCompleted] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const handleCloseComplete = () => {
    setShowComplete(false);
    startTimer();
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

  const [timerComponent, startTimer, stopTimer] = useCountdownTimer(
    QUESTION_TIMER_DURATION,
    onTimerEnd
  );

  //renders first question answers
  useEffect(() => {
    setShowHelp(true);
    for (var i = 0; i < 4; i++) {
      setStoredAns((storedAns[i] = pqArray[count].answers[i]));
    }
    setStoredAns(storedAns.sort((a) => 0.5 - Math.random()));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const markCompleted = () => {
    setStatusPracticed(accessCode);
    setHasCompleted(true);
  };

  const handleClick = (isCorrect) => {
    stopTimer();
    //set scores
    if (isCorrect) {
      setScore(score + 1); //tracks total score
    }

    //handles the count
    if (count < 2) {
      setCount(count + 1); //set count
      ansStorer(); //storeAnswers to prevent shuffle
      startTimer();
    } else {
      setCount(0);
      ansStorer();
      setScore(0);

      if (hasCompleted) {
        startTimer();
      } else {
        markCompleted();
        setShowComplete(true);
      }
    }
  };

  function onTimerEnd() {
    setCount(count + 1);
    ansStorer();
    handleClick(false);
  }

  return (
    <>
      <Modal
        open={showHelp}
        onClose={handleCloseHelp}
        aria-labelledby="modal-help"
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

      <Modal
        open={showComplete}
        onClose={handleCloseComplete}
        aria-labelledby="modal-complete"
      >
        <Box sx={style}>
          <Card sx={{ maxWidth: 400, margin: "auto" }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Completed Practice Test
              </Typography>
              <Typography variant="body2">
                <br />
                You have completed the practice test.
                <br />
                You can either continue practicing or back out to the main menu
                to take the real test.
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
          <Box sx={{ width: "100%" }}>{timerComponent}</Box>
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
