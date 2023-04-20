import './Joined.css';
import React, { useState, useEffect, LoginForm, handleclose } from 'react';
import Tool from './Tool';
import ColoredRect from './App';

function Modal({show, user,  handleclose}) {
    const [message, setMessage] = useState('');
    const [tool, setTool] = useState(false);

    const handleClick = () => {
        setTool(true);
    };

    console.log(show);
    if (!show) return null;

    return (
        <div>
            <div className={'modal'}>
                {tool ? (
                    <ColoredRect />
                ) : (
                    <div className={'modal-content'}>

                        <h2>Personenkonstellation</h2>
                        <div className="joined">
                            <p>name: {user}</p>
                            {/*  <button onClick={handleClick}>go</button> */}
                            <p>{message}</p>
                        </div>
                        <p>..Warte auf den Host um anzufangen..</p>
                        <button className={"close"} onClick={handleclose} >x</button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Joined;
