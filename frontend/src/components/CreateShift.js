import React, { useState } from 'react';

const CreateShift = () => {
  const today = new Date().toISOString().split('T')[0];
  const [startDate, setStartDate] = useState(today);
  const [startTime, setStartTime] = useState('09:00');
  const [endDate, setEndDate] = useState(today);
  const [endTime, setEndTime] = useState('17:00');
  const [employee, setEmployee] = useState('ericemployee');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [response, setResponse] = useState(null);
  function submitForm(e) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);
    const fullStartString = new Date(`${startDate}T${startTime}`);
    const fullEndString = new Date(`${endDate}T${endTime}`);
    const fetchOptions = {
      method: 'POST',
      mode: 'cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        startTime: fullStartString,
        endTime: fullEndString,
        employee,
      }),
      credentials: 'include',
    };
    fetch('http://localhost:3333/shift', fetchOptions)
      .then(res => res.json())
      .then(({ res, err }) => {
        setIsLoading(false);
        if (err) {
          setError(err);
          return err;
        }
        setResponse('Shift added');
        return res;
      });
  }
  const labelStyle = {
    marginBottom: '.2em',
    marginTop: '0',
    fontSize: '1em',
  };
  const divStyle = {
    marginBottom: '0.8em',
  };
  const inputStyle = {
    border: '1px solid',
    borderRadius: '.2em',
    padding: '.1em .2em',
    display: 'block',
    marginTop: '.3em',
  };
  return (
    <>
      {isLoading ? <h3>Loading</h3> : null}
      {error ? <h3 style={{ color: 'red' }}>Error: {error}</h3> : null}
      {response ? (
        <h3 style={{ color: 'rebeccapurple' }}>Success: {response}</h3>
      ) : null}
      <form onSubmit={submitForm} style={{ fontFamily: 'Roboto' }}>
        <div style={divStyle}>
          <p style={labelStyle}>Shift Start</p>
          <input
            type="date"
            name="start-date"
            id="start-date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
          <input
            type="time"
            name="start-time"
            id="start-time"
            value={startTime}
            onChange={e => setStartTime(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        <div style={divStyle}>
          <p style={labelStyle}>Shift End</p>
          <input
            type="date"
            name="end-date"
            id="end-date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
          <input
            type="time"
            name="end-time"
            id="end-time"
            value={endTime}
            onChange={e => setEndTime(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        <div style={divStyle}>
          <p style={labelStyle}>Employee Username</p>
          <input
            type="text"
            name="employee"
            id="employee"
            value={employee}
            onChange={e => setEmployee(e.target.value)}
            style={inputStyle}
            disabled={isLoading}
          />
        </div>
        <div>
          <button
            type="submit"
            style={{
              marginTop: '.8em',
              border: 'none',
              padding: '.2em .8em',
              background: 'rebeccapurple',
              color: 'white',
              borderRadius: '.2em',
              fontSize: '1.1em',
            }}
          >
            Create Shift
          </button>
        </div>
      </form>
    </>
  );
};

export default CreateShift;
