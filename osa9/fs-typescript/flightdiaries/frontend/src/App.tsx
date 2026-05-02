import { useEffect, useState } from 'react';
import axios from 'axios';

import diaryService from './diaryService';

import type { DiaryEntry } from './types';
const weatherOptions = ['sunny', 'rainy', 'cloudy', 'stormy', 'windy'];

const visibilityOptions = ['great', 'good', 'ok', 'poor'];

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);
  const [date, setDate] = useState('');
  const [weather, setWeather] = useState('sunny');
  const [visibility, setVisibility] = useState('great');
  const [comment, setComment] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    diaryService.getAll().then((data) => {
      setDiaries(data);
    });
  }, []);

  const addDiary = (event: React.SyntheticEvent) => {
    event.preventDefault();

    diaryService
      .create({
        date,
        weather,
        visibility,
        comment,
      })
      .then((newDiary) => {
        setDiaries(diaries.concat(newDiary));
        setDate('');
        setWeather('sunny');
        setVisibility('great');
        setComment('');
        setErrorMessage(null);
      })
      .catch((error: unknown) => {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data;

      if (typeof data === 'string') {
        setErrorMessage(data);
      } else if (
        data &&
        typeof data === 'object' &&
        'error' in data
      ) {
        const errorData = data.error;

        if (Array.isArray(errorData)) {
          setErrorMessage(
            errorData
              .map((issue) => {
                if (
                  issue &&
                  typeof issue === 'object' &&
                  'message' in issue
                ) {
                  return String(issue.message);
                }

                return String(issue);
              })
              .join(', '),
          );
        } else {
          setErrorMessage(String(errorData));
        }
      } else {
        setErrorMessage(error.message);
      }
    } else {
      setErrorMessage('Unknown error');
    }
  });
};


  return (
    <div>
      <h1>Flight diaries</h1>
      <h2>Add new entry</h2>
      {errorMessage && <p style={{ color: 'red' }}>Error: {errorMessage}</p>}
        <form onSubmit={addDiary}>
          <div>
            date{' '}
            <input
              value={date}
              onChange={(event) => setDate(event.target.value)}
            />
          </div>
          <div>
            weather{' '}
            {weatherOptions.map((option) => (
              <label key={option}>
                {option}
                <input
                  type="radio"
                  name="weather"
                  value={option}
                  checked={weather === option}
                  onChange={(event) => setWeather(event.target.value)}
                />
              </label>
            ))}
          </div>
          <div>
            visibility{' '}
            {visibilityOptions.map((option) => (
              <label key={option}>
                {option}
                <input
                  type="radio"
                  name="visibility"
                  value={option}
                  checked={visibility === option}
                  onChange={(event) => setVisibility(event.target.value)}
                />
              </label>
            ))}
          </div>
          <div>
            comment{' '}
            <input
              value={comment}
              onChange={(event) => setComment(event.target.value)}
            />
          </div>
          <button type="submit">add</button>
        </form>

        <h2>Diary entries</h2>

      {diaries.map((diary) => (
        <div key={diary.id}>
          <h3>{diary.date}</h3>
          <p>weather: {diary.weather}</p>
          <p>visibility: {diary.visibility}</p>
        </div>
      ))}
    </div>
  );
};

export default App;