/* eslint-disable react-hooks/exhaustive-deps */
import './App.css';

import {useEffect, useState} from 'react';
import InputSection from './components/InputSection';
import OutputSection from './components/OutputSection';

function App() {

  const [notes, setNotes] = useState([]);

    useEffect(async() => {
      const theNotes = await fetch("http://54.247.52.29/notes", {
        "headers":{
          "Access-Control-Allow-Origin":"*",
          "Content-Type": "application/json",
        }
      });
      const jsonNotes = await theNotes.json();
      setNotes(jsonNotes.message);

    }, [])

  return (
    <div className="App">
      <InputSection setNotes={setNotes}/>
      <OutputSection notes={notes}/>
    </div>
  );
}

export default App;
