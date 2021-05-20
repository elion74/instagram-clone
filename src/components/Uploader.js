import React, { useState} from 'react';
import { storage, db } from './firebase.js';
import * as uploaderstyle from './upload.module.css';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import { Button } from '@material-ui/core';

import * as firebase from 'firebase';

const buttonstyle = {
    marginTop:10,
    marginLeft:'auto',
    marginRight:'auto',  
    width:120
}

export default function Uploader({...user}){
 
    const [imgpath, setImgpath] = useState('');
    const [caption, setCaption] = useState('');
    const [progress, setProgress] = useState(0);
   
    const uploadimg = () => {

        const task = storage.ref().child(`images/${imgpath.name}`).put(imgpath);

        task.on('state_changed',
        (snapshot) => {
            // update progressbar
            const percent = 
                (snapshot.bytesTransferred / snapshot.totalBytes) *100;
            setProgress(percent);
        }, 

        (err) => {
            // when error appear...
            console.log(err);
        }, 

        () => {
            //  when complete...

           storage.ref('images')
            .child(imgpath.name)
            .getDownloadURL().then((url) => {

                console.log(user.user.displayName);

                db.collection('users').add({
                    username:user.user.displayName, 
                    timestamp:firebase.firestore.FieldValue.serverTimestamp(),
                    imgurl: url, 
                    caption:caption 
                })

                setProgress(0);
                setImgpath(null);
                setCaption('');
            })
        }
        
        );

    }

    return(
        <div className = {uploaderstyle.uploader}>
            <progress value = {progress} className = {uploaderstyle.uploadprogress}></progress>
            <input type = 'text'  onChange = { (e) => { setCaption(e.target.value) } } placeholder = 'enter a caption' className = {uploaderstyle.caption}/>
            <input type = 'file' onChange = { (e) => { setImgpath(e.target.files[0]) } } multiple/>
            <Button
            variant="contained"
            color="default"
            startIcon={<CloudUploadIcon />}
            style = {buttonstyle}
            onClick = {() => {uploadimg()}}
            >
            Upload
            </Button>
        </div>

    );

}