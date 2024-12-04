"use client"

import React from "react";
import './enterToggle.css';

const EnterToggle = ({ name, massage }: { name: string, massage: string }) => {
    return ( 
        <div className='line'>
            <div className='toggle'>
                <span className='name'>{name}</span>
                {massage}
            </div> 
        </div>
    )
}

export default EnterToggle;