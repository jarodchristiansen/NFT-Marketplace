import React, { useState, useEffect } from 'react';

const ImageFrame = (props) => {

    const [image, setImage] = useState(null);

    useEffect(() => {
        if (props.image) {
            setImage(props.image);
        }
    }, [props.image]);
    return (
        <div>
            <img src={image} className={props?.className}></img>
        </div>
    )
}
export default ImageFrame;