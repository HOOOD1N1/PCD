import {useEffect, useState} from 'react';
import './index.css';


const OutputSection = ({notes}) => {
 

    return (
        <div className='output-section'>
            {notes.map(note => {
                return <div className='notes-container'>
                    <div id="note-title">
                    <p id="notes-title">{note.title}</p>
                    </div>
                    <div id="note-text">
                        <p id="notes-content">{note.content}</p>
                    </div>
                </div>
            })}
        </div>
    );
}

export default OutputSection;