import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ time, start, timeup }) => {
  const [timeRemain, setTimeRemain] = useState(time);

  useEffect(() => {
    if (!start) {
      return; // If start is false, do nothing
    }

    const intervalId = setInterval(() => {
      setTimeRemain((prevTime) => {
        if (prevTime <= 0) {
          clearInterval(intervalId);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [start]); // Dependency array includes start
  if (timeRemain === 0) {
    timeup();
  }
  return (
    <div style={{ textAlign: 'center' }}>
      <h1>Time Remaining: {timeRemain}</h1>
    </div>
  );
};

export default CountdownTimer;
