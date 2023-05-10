import "./App.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import Alert from "@mui/material/Alert";

import exampleimage1 from "./assets/exampleImages/examplephoto1.png";
import exampleimage2 from "./assets/exampleImages/examplephoto2.png";

import { useGetUser } from "./hooks/firebase";
import {
  Box,
  Button,
  Card,
  CardContent,
  DialogActions,
  Modal,
  Typography,
} from "@mui/material";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  maxWidth: "75%",
  textAlign: "center",
};

function App() {
  const navigate = useNavigate();
  const [accessCode, setAccessCode] = useState("");
  const [message, setMessage] = useState("");
  const [user, error, loading, refresh] = useGetUser(accessCode);
  const [pressedButton, setPressedButton] = useState("");
  const [showStartWarning, setShowStartWarning] = useState(false);

  const startPracticeQuiz = () => {
    navigate("../practice", { state: { accessCode } });
  };

  const startMainQuiz = () => {
    navigate("../quiz", { state: { accessCode } });
  };

  useEffect(() => {
    if (error) setMessage(error);
  }, [error]);

  useEffect(() => {
    if (!user) return;

    if (pressedButton === "practice") {
      startPracticeQuiz();
      return;
    }

    switch (user.status) {
      case "incomplete":
        setMessage(
          "You must complete the practice quiz before you can start the main quiz."
        );
        break;
      case "practiced":
        setShowStartWarning(true);
        break;
      case "started":
        setMessage(
          "You have used your single attempt on the quiz. Please contact the researcher to reactivate your account."
        );
        break;
      case "completed":
        setMessage(
          "You have already completed this quiz once. Please contact the researcher if you believe there is an issue."
        );
        break;
      default:
        setMessage(
          "Account improperly configured. Please contact the researcher."
        );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const handleKeyDown = (e) => {
    // if user presses Enter without pressing Shift
    if (e.keyCode === 13 && !e.shiftKey) {
      refresh();
      e.preventDefault();
    }
  };

  return (
    <div className="App">
      <div className="App-header">
        <div className="Instructions">
          <h1>MaRs Reasoning Task</h1>
          <h2>Instructions</h2>
          <p>
            In this task, you will be shown a 3x3 grid of patterns. The last
            one, in the bottom right-hand corner, <b>will be missing:</b>
          </p>
          <img
            src={exampleimage1}
            alt="Example of questions"
            className="image1"
          />
          <p>
            You need to select <b>which of the four possible patterns</b> along
            the bottom <b>fits in the gap:</b>
          </p>
          <img
            src={exampleimage2}
            alt="Example of answer possibilities"
            className="image2"
          />
          <p>
            Try to be as fast and accurate as you can be.
            <br></br>
            <br></br> If you cannot solve the puzzle then you should guess - you
            will not be penalised for an incorrect answer.
            <br></br>
            <br></br> The task contains a shuffled mix of easy, medium and hard
            puzzles.
            <br></br>
            <br></br> You will have <b>30 seconds</b> to complete each puzzle.
          </p>

          <div className="text-input">
            <TextField
              id="outlined-basic"
              label="Enter Access Code"
              variant="outlined"
              value={accessCode}
              onChange={(e) => {
                setAccessCode(e.target.value);
              }}
              // onKeyDown={handleKeyDown}
            />
            <LoadingButton
              variant="outlined"
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={() => {
                setPressedButton("practice");
                refresh();
              }}
              disabled={!accessCode}
            >
              Take Practice Test
            </LoadingButton>
            <LoadingButton
              variant="contained"
              loading={loading}
              sx={{ textTransform: "none" }}
              disableElevation
              onClick={() => {
                setPressedButton("main");
                refresh();
              }}
              disabled={!accessCode}
            >
              Begin Test
            </LoadingButton>

            {message && <Alert severity="error">{message}</Alert>}

            {/* starting test warning */}
            <Modal
              open={showStartWarning}
              // onClose={handleCloseStartWarning}
              aria-labelledby="modal-start-warning"
            >
              <Box sx={style}>
                <Card sx={{ maxWidth: 400, margin: "auto" }}>
                  <CardContent>
                    <Typography variant="h5" component="div">
                      Starting Main Quiz
                    </Typography>
                    <Typography variant="body2">
                      <br />
                      You are about to start the main quiz.
                      <br />
                      <br />
                      This quiz is very similar to the practice quiz, but it has
                      many more questions. Be prepared to complete the entire
                      quiz in one sitting.
                      <br />
                      <br />
                      You can only attempt this quiz once. DO NOT REFRESH THE
                      PAGE. If for some reason you lose connection to the quiz
                      and must restart, contact the researcher to reactivate
                      your account.
                      <br />
                      <br />
                    </Typography>
                    <DialogActions>
                      <Button
                        onClick={() => {
                          setShowStartWarning(false);
                        }}
                        color="error"
                        autoFocus
                      >
                        Cancel
                      </Button>
                      <Button
                        onClick={() => {
                          startMainQuiz();
                        }}
                      >
                        Begin
                      </Button>
                    </DialogActions>
                  </CardContent>
                </Card>
              </Box>
            </Modal>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
