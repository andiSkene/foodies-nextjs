'use client';

import Image from 'next/image';
import { useRef, useState } from 'react';
import classes from './image-picker.module.css'

//the className on the input hides the imagepicker button so
//we can use our own style of button

export default function ImagePicker({ label, name }) {
    const imageInput = useRef();
    const [pickedImage, setPickedImage] = useState();

    function pickClickHandler() {
        imageInput.current.click();
    }

    function onInputChangeHandler(event) {
        //set the file as the first in the target's files array
        const file = event.target.files[0];

        //check if there's actually a file
        if (!file) {
            setPickedImage(null);
            return;
        }

        //create a fileReader
        const fileReader = new FileReader();

        //set a function to run when the fileReader loads
        fileReader.onload = () => {
            //set the state as the result of the fileReader
            setPickedImage(fileReader.result);
        }
        fileReader.readAsDataURL(file);
    }

    return <div className={classes.picker}>
        <label htmlFor={name}>{label}</label>
        <div className={classes.controls}>
            <div className={classes.preview}>
                {!pickedImage && <p>No image picked yet.</p>}
                {pickedImage && <Image 
                src={pickedImage} 
                alt='The image selected by the user.' 
                fill />}
            </div>
            <input
                className={classes.input}
                type='file'
                id={name}
                accept='image/png image/jpg'
                name={name}
                ref={imageInput}
                onChange={onInputChangeHandler} 
                required />
            <button
                className={classes.button}
                type='button'
                onClick={pickClickHandler}
            >
                Pick an Image
            </button>
        </div>
    </div>
}