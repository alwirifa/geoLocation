"use client"

import React, { useEffect, useState } from 'react';

interface Position {
  coords: {
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number | null;
    altitudeAccuracy: number | null;
    heading: number | null;
    speed: number | null;
  };
  timestamp: number;
}

interface Error {
  message: string;
}

const GeolocationApi: React.FC = () => {
  const [apiSupported, setApiSupported] = useState(true);
  const [log, setLog] = useState('');
  const [watchId, setWatchId] = useState<number | null>(null);
  const [position, setPosition] = useState<Position | null>(null);
  const [getPositionActive, setGetPositionActive] = useState(false);
  const [watchPositionActive, setWatchPositionActive] = useState(false);

  const positionOptions = {
    enableHighAccuracy: true,
    timeout: 10 * 1000, // 10 seconds
    maximumAge: 30 * 1000, // 30 seconds
  };

  useEffect(() => {
    console.log('watchPositionActive:', watchPositionActive);

    if (getPositionActive) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setPosition(position);
          setLog('Position successfully retrieved<br />' + log);
        },
        (error) => {
          setLog('Error: ' + error.message + '<br />' + log);
        },
        positionOptions
      );
      setGetPositionActive(false);
    }

    if (watchPositionActive) {
      setWatchId(navigator.geolocation.watchPosition(
        (position) => {
          setPosition(position);
          setLog('Position updated<br />' + log);
        },
        (error) => {
          setLog('Error: ' + error.message + '<br />' + log);
        },
        positionOptions
      ));
      setWatchPositionActive(false);
    }
  }, [getPositionActive, watchPositionActive]);


  const handleGetPosition = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setPosition(position);
        setLog('Position successfully retrieved<br />' + log);
      },
      (error) => {
        setLog('Error: ' + error.message + '<br />' + log);
      },
      positionOptions
    );
  };

  const handleWatchPosition = () => {
    setWatchId(navigator.geolocation.watchPosition(
      (position) => {
        setPosition(position);
        setLog('Position updated<br />' + log);
      },
      (error) => {
        setLog('Error: ' + error.message + '<br />' + log);
      },
      positionOptions
    ));
  };

  const handleStopWatching = () => {
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
      setLog('Stopped watching position<br />' + log);
      setWatchId(null);
    }
  };

  const handleClearLog = () => {
    setLog('');
  };

  return (
    <div className="container">
      <a href="https://code.tutsplus.com/tutorials/an-introduction-to-the-geolocation-api--cms-20071">
        Go back to the article
      </a>

      <span id="g-unsupported" className={`api-support ${!apiSupported ? '' : 'hidden'}`}>
        API not supported
      </span>

      <h1>Geolocation API</h1>
      <div className="buttons-wrapper">
        <button id="button-get-position" className="button" onClick={handleGetPosition}>
          Get current position
        </button>
        <button id="button-watch-position" className="button" onClick={handleWatchPosition}>
          Watch position
        </button>
        <button id="button-stop-watching" className="button" onClick={handleStopWatching}>
          Stop watching position
        </button>
      </div>

      <h2>Information</h2>
      <div id="g-information">
        <ul>
          <li>
            Your position is{' '}
            <span id="latitude" className="g-info">
              {position ? position.coords.latitude : 'unavailable'}
            </span>{' '}
            ° latitude,
            <span id="longitude" className="g-info">
              {position ? position.coords.longitude : 'unavailable'}
            </span>{' '}
            ° longitude (with an accuracy of{' '}
            <span id="position-accuracy" className="g-info">
              {position ? position.coords.accuracy : 'unavailable'}
            </span>{' '}
            meters)
          </li>
          <li>
            Your altitude is{' '}
            <span id="altitude" className="g-info">
              {position ? (position.coords.altitude ? position.coords.altitude : 'unavailable') : 'unavailable'}
            </span>{' '}
            meters (with an accuracy of{' '}
            <span id="altitude-accuracy" className="g-info">
              {position ? (position.coords.altitudeAccuracy ? position.coords.altitudeAccuracy : 'unavailable') : 'unavailable'}
            </span>
            {' '}
            meters)
          </li>
          <li>
            You're{' '}
            <span id="heading" className="g-info">
              {position ? (position.coords.heading ? position.coords.heading : 'unavailable') : 'unavailable'}
            </span>{' '}
            ° from the True north
          </li>
          <li>
            You're moving at a speed of{' '}
            <span id="speed" className="g-info">
              {position ? (position.coords.speed ? position.coords.speed : 'unavailable') : 'unavailable'}
            </span>{' '}
            meters/second
          </li>
          <li>
            Data updated at{' '}
            <span id="timestamp" className="g-info">
              {position ? (new Date(position.timestamp)).toString() : 'unavailable'}
            </span>
          </li>
        </ul>
      </div>

      <h3>Log</h3>
      <div id="log" dangerouslySetInnerHTML={{ __html: log }} />
      <button id="clear-log" className="button" onClick={handleClearLog}>
        Clear log
      </button>

      <small className="author">
        Demo created by{' '}
        <a href="https://www.audero.it">Aurelio De Rosa</a> (
        <a href="https://twitter.com/AurelioDeRosa">@AurelioDeRosa</a>).<br />
        This demo is part of the{' '}
        <a href="https://github.com/AurelioDeRosa/HTML5-API-demos">HTML5 API demos repository</a>.
      </small>
    </div>
  );
};

export default GeolocationApi;