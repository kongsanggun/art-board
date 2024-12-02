"use client"

import React from "react";
import './toggle.css';

const EnterToggle = ({ massage }: { massage: string }) => {
    return ( <div className='toggle'>{massage}</div> )
}

export default EnterToggle;