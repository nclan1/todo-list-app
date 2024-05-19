import React from 'react';
import "./task.css";
import { useState } from 'react';
//use ../ to go up one level from the current directory
import { MdDelete } from "../react-icons/md";


function Task ({ name, index, deletefxn }) {

    const [checked, setChecked] = useState(false);

    return (
        <div className="task">
            {/* //customize checkmark */}
            <label className='custom-checkbox'>
                <input type='checkbox' 
                    checked = {checked}
                    onChange={() => setChecked(!checked)}
                />
                <span className='checkmark'></span>
            </label>
            <span className='container'
                style={{ textDecoration: checked ? 'line-through' : 'none',
                         color: checked ? "#4e3e3e" : 'white'
                        }}
            >
                {name}
            </span>
            <div className="delete">
                <MdDelete color="#bf616a" size="1.3em" 
                    onClick={() => deletefxn(index)}
                />
            </div>
        </div>
    );
}

export default Task;
