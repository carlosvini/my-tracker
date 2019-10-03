import React, { useState, useEffect, MouseEvent } from 'react'
import { Worklog } from '../WorklogRepository';

const clients = [
  "ABIPE",
  "BDOISW",
  "CDF",
  "CIINTRANET",
  "CISITE",
  "EXPRESSA",
  "LASA",
  "NEWAGE",
  "NOVA",
  "SINAL",
  "TI",
];

class HttpError extends Error {
  code: number;

  constructor(response: Response) {
    super(response.statusText);
    this.code = response.status;
  }
}

const NOT_FOUND = 404;
const CONFLICT = 409;

async function fetchOrFail(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new HttpError(response);
  }
  return response.json();
}

const getActiveWorklog = () =>
  fetchOrFail('/api/active');

const startWorklog = (client: string) =>
  fetchOrFail('/api/start?client='+client);

const stopWorklog = () =>
  fetchOrFail('/api/stop');

const Home = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [activeWorklog, setActiveWorklog] = useState<Worklog>();

  useEffect(() => {
    handleMount();
  }, []);

  const handleMount = async () => {
    try {
      const worklog = await getActiveWorklog();
      setActiveWorklog(worklog);
      setLoading(false);
    } catch (err) {
      if (err instanceof HttpError && err.code === NOT_FOUND) {
        setLoading(false);
      } else {
        // other errors: retry
        alert(err.message);
      }
    }
  }
  const handleStop = async () => {
    try {
      await stopWorklog();
      setActiveWorklog(undefined);
    } catch (err) {
      if (err instanceof HttpError && err.code === CONFLICT) {
        setActiveWorklog(undefined); // Client was out of sync
      } else {
        // other errors: retry
        alert(err.message);
      }
    }
  }
  const handleStart = async (client: string) => {
    try {
      const worklog = await startWorklog(client);
      setActiveWorklog(worklog);
    } catch (err) {
      if (err instanceof HttpError && err.code === CONFLICT) {
        setActiveWorklog(undefined); // Client was out of sync
      } else {
        // other errors: retry
        alert(err.message);
      }
    }
  }

  if (loading) {
    return <div>Loading...</div>;
  }
  if (activeWorklog) {
    return (
      <div>
        {activeWorklog.client}<br />
        {new Date(activeWorklog.start).toString()}<br />
        <button style={{width: "100%", height: 40}} onClick={handleStop}>
          STOP
        </button>
      </div>
    );
  }
  return (
    <div style={{maxWidth: 350}}>
      {clients.map(client =>
        <button key={client} style={{width: "100%", height: 40}} onClick={() => handleStart(client)}>
          {client}
        </button>
      )}
    </div>
  );
}

export default Home
