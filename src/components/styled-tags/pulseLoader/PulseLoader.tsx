import React from "react";
import "./pulseLoader.css";

const PulseLoader = (): JSX.Element =>
{
    return (
        <span className="pulse-container">
            <span className="bounce1"/>
            <span className="bounce2"/>
            <span className="bounce3"/>
        </span>
    );
};
export default PulseLoader;
