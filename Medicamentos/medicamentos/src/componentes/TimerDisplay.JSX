import React from 'react';

const TimerDisplay = ({ timeRemaining }) => {
  const formatTimeRemaining = (timeRemaining) => {
    const hours = Math.floor(timeRemaining / 3600000);
    const minutes = Math.floor((timeRemaining % 3600000) / 60000);
    const seconds = Math.floor((timeRemaining % 60000) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
  };

  return (
    <div style={{ position: 'absolute', top: '10px', right: '10px', background: '#fff', padding: '10px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)' }}>
      <strong>Próxima dosis en:</strong> {formatTimeRemaining(timeRemaining)}
    </div>
  );
};

export default TimerDisplay;
