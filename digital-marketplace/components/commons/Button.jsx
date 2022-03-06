import React from "react";
import Link from "next/link";

const Button = (props) => {
    return (
        // <button className={props?.className}>{props?.label}</button>
        <button className={props?.className} onClick={props?.onClick} data-testid={props?.datatestId}>{props?.label}</button>
    )
}
export default Button;
