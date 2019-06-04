import React, { useState, useEffect } from 'react';

import ShiftBlock from './ShiftBlock';

const ShiftsDisplay = () => {
  const [error, setError] = useState(null);
  const [shifts, setShifts] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    function parseShifts(shiftsRes) {
      const groupedShifts = shiftsRes.reduce((acc, shiftInfo) => {
        const {
          username,
          firstName,
          lastName,
          startTime,
          endTime,
          id,
        } = shiftInfo;
        const userShiftsDetails = acc.find(
          userShifts => userShifts.username === username
        );
        if (!userShiftsDetails) {
          acc.push({
            username,
            firstName,
            lastName,
            shifts: [
              {
                startTime,
                endTime,
                id,
              },
            ],
          });
        } else {
          userShiftsDetails.shifts.push({ startTime, endTime, id });
        }
        return acc;
      }, []);
      return groupedShifts;
    }
    setIsLoading(true);
    const fetchOptions = {
      credentials: 'include',
    };
    fetch('http://localhost:3333/shifts', fetchOptions)
      .then(res => res.json())
      .then(({ res, err }) => {
        if (err) {
          setError(err);
          setShifts(null);
          setIsLoading(false);
          return;
        }
        setError(null);
        setShifts(parseShifts(res.shifts));
        setIsLoading(false);
      })
      .catch(err => setError(err.message));
  }, []);
  return (
    <div>
      {isLoading ? <h2>Loading...</h2> : null}
      {error && <p>Error: {error}</p>}
      {shifts
        ? shifts.map(({ firstName, lastName, username, shifts }) => (
            <div key={username} style={{ marginBottom: '2.2em' }}>
              <h3>{`${firstName}${
                lastName ? ` ${lastName}` : ''
              } (${username})`}</h3>
              {shifts.length ? (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                  }}
                >
                  {shifts.map(({ startTime, endTime, id }) => (
                    <ShiftBlock
                      startTime={startTime}
                      endTime={endTime}
                      key={id}
                    />
                  ))}
                </div>
              ) : null}
            </div>
          ))
        : null}
    </div>
  );
};

export default ShiftsDisplay;
