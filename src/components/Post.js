import React, { useState, useEffect } from 'react';
import { Avatar} from '@material-ui/core';
import poststyles from './poststyles.module.css';
import {db} from './firebase.js';
import * as firebase from 'firebase';

// Avatar styling -->not overlaps sticky appheader (div)
const styleavatar = {
    position:'static',
    marginRight:10
}


export default function Post({username,postid, imgurl, caption, ...user}){

    const [comments, setComments] = useState([]);
    const [commentVal, setCommentVal] = useState('');

    useEffect(() => {
        let unsubscribe;
    
    if(postid){
        unsubscribe = db.collection('users')
            .doc(postid)
            .collection('comments')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => {
                setComments(snapshot.docs.map( (doc) => doc.data() ));
        });
    }
        return () => {
            unsubscribe();
        }
    }, [postid]);


    const postcomment = (e) => {    
        e.preventDefault();
        db.collection('users').doc(postid).collection('comments').add({
            text:commentVal,
            username:user.user.displayName, 
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        setCommentVal('');

    }

    return(
        <div className = {poststyles.post} >

            <div className = {poststyles.post_header}>
                <Avatar 
                style = {styleavatar}
                alt = ''
                />
                <span>{username}</span>

            </div>


            <div className = {poststyles.post_img}>
                <img 
                className = {poststyles.image}
                src = {imgurl}
                alt = ''
                />
            </div>

            
            <div className = {poststyles.post_footer}>
                <b>{username}</b> {caption}
            </div>

                <div className = {poststyles.post_displaycomments}>
                {
                    comments.map((com) => (
                        <div key = {com.text.toString()}>
                        <b>{com.username}</b>
                        <span>{com.text}</span>
                        </div>               
                    ))
                }
                </div>

            {user.user ? <div className = {poststyles.post_comment}>
                
                <form onSubmit = {(e) => {postcomment(e)}}>
                <input  className = {poststyles.comment_input} type = 'text' onChange = { (e) => {setCommentVal(e.target.value)}} placeholder = 'Kommentar hinzufügen ...'/>
                <input  className =  {poststyles.comment_button} type = 'submit' disabled = {!commentVal}/>
                </form>
                     
            </div> : '' }

        </div>

    );
}