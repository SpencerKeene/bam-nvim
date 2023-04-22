import React, { useEffect, useRef, useState } from "react";
import { LinearProgress } from "@mui/material";

const TIMER_INTERVAL = 100; // milliseconds

export default function CountdownTimer({ targetTime, onEnd }) {
  const [startTime, setStartTime] = useState(new Date().getTime());
  const [countdown, setCountdown] = useState(targetTime - startTime);
  const [hasStarted, setHasStarted] = useState(false);
  const timerRef = useRef(null);

  const onEndRef = useRef(onEnd);
  onEndRef.current = onEnd;

  // restart timer
  useEffect(() => {
    clearInterval(timerRef.current);
    const now = new Date().getTime();
    if (targetTime < now) return;

    setHasStarted(true);
    setStartTime(now);
    setCountdown(targetTime - now);
    timerRef.current = setInterval(() => {
      setCountdown(targetTime - new Date().getTime());
    }, TIMER_INTERVAL);
  }, [targetTime]);

  // clear timer interval on component unmount
  useEffect(() => {
    if (targetTime < new Date().getTime()) return;

    setHasStarted(true);
    setInterval(() => {
      setCountdown(targetTime - new Date().getTime());
    }, TIMER_INTERVAL);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // when timer ends, call onEnd function
  useEffect(() => {
    if (!hasStarted || countdown > 0) return;
    clearInterval(timerRef.current);
    onEndRef.current();
  }, [countdown, hasStarted]);

  return (
    <LinearProgress
      variant="determinate"
      color="inherit"
      value={(100 * countdown) / (targetTime - startTime)}
    />
  );
}

export function stop(setTargetTime) {
  setTargetTime(0); // arbitrary time in the past
}

export function start(setTargetTime, duration) {
  setTargetTime(new Date().getTime() + duration);
}

export function useCountdownTimer(duration, onEnd) {
  const [targetTime, setTargetTime] = useState(0); // begins stopped

  function startTimer() {
    setTargetTime(new Date().getTime() + duration);
  }

  function stopTimer() {
    setTargetTime(0); // arbitrary time in the past
  }

  const component = <CountdownTimer targetTime={targetTime} onEnd={onEnd} />;

  return [component, startTimer, stopTimer];
}
