import React from 'react';
import {
  differenceInHours,
  format,
  distanceInWordsToNow,
  isTomorrow,
} from 'date-fns';

const ShiftBlock = ({ startTime, endTime }) => {
  const startDate = new Date(startTime);
  const endDate = new Date(endTime);
  const shiftLength = differenceInHours(endDate, startDate);
  const pStyle = {
    marginBottom: 0,
  };
  return (
    <div
      style={{
        background: 'lightgray',
        padding: '.6em .6em',
        margin: '.4em',
        minWidth: '270px',
        borderRadius: '.2em',
        fontFamily: 'Roboto',
      }}
    >
      <p style={pStyle}>{format(startDate, 'MMM Do - h A')}</p>
      <p style={pStyle}>{format(endDate, 'MMM Do - h A')}</p>
      <p style={pStyle}>
        Starts
        {isTomorrow(startDate)
          ? ' tomorrow'
          : ` ${distanceInWordsToNow(startDate, { addSuffix: true })}`}
      </p>
      <p style={pStyle}>🕑 {shiftLength} hour shift</p>
    </div>
  );
};

export default ShiftBlock;
