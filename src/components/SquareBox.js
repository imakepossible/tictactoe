import React from 'react';

function SquareBox(props)
{
    const style = {
        background: "lightblue",
        border: "2px solid darkblue",
        fontSize: "30px",
        fontWeight: "800",
        width:"80px",
        height:"80px",
        cursor: "pointer",
        outline: "none",
    };

    return (
        <>
        <button style={style} onClick={props.onClick}>{props.value}</button>
        </>
    )
}

export default SquareBox;