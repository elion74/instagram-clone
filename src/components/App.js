import React, { useState, useEffect } from 'react';

import Post from './Post.js';
import Search from './Search.js';
import Auth from './Auth.js';
import {auth, db} from './firebase.js';
import Uploader from './Uploader.js';

import appstyle from './App.module.css';
import { Button, Input } from '@material-ui/core';
import InstagramEmbed from 'react-instagram-embed';


export default function App(){

//  when Modal is open
    // const [open, setOpen] = useState(true);
    const open = true;
//  track headerbutton 
    const [anmeldenisclicked, setAnmeldenisclicked] = useState(false);
    const [registrierenisclicked, setRegistrierenisclicked] = useState(false);
//      für Auth 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
// tracked wenn jemand angemeldet ist und auch wenn seite refresh wir
    const [istangemeldet, setIstangemeldet] = useState(false);
//  alle posts  
    const [posts, setPosts] = useState([]);
// user state specihert user als ganzes objekt
    const [user, setUser] = useState(null);


    
    // !!!! letzte todos sind: commnet machen und stylen (in  Post component)
    // !!! dann lernen wie man deployed 



useEffect(() => {

   const unsubscribe =  auth.onAuthStateChanged((authuser) => {

        if(authuser){
            // logged in
            console.log(authuser);
            setUser(authuser);
            setIstangemeldet(true);

        }else{
            // not logged in
            setUser(null);
        }   
    });

    return () => {
        unsubscribe();
    }

}, [username, user]);


    useEffect(() => {
        
        // post data in post state packen
        db.collection('users').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            setPosts(snapshot.docs.map(doc => ({
                id:doc.id,
                post:doc.data()
            })));
        });
    },[]);


    const abmelden = () => {
        auth.signOut().then(function() {
            setIstangemeldet(false);
            console.log('nicht mehr angemeldet');
          }).catch(function(error) {
            console.log(error)
          });
    }
   

    const registrieren = () => {

        auth.createUserWithEmailAndPassword(email, password)
            .then(function(authuser){          
                
                setIstangemeldet(true);
                return authuser.user.updateProfile({
                    displayName: username,
                })
            
            })         
            .catch(function(error){ 
                // prüfen ob passwort stark ist
                let errorcode = error.code;
                let errormessage = error.message;
                console.log(errorcode, errormessage);       
            });

        setRegistrierenisclicked(false);
        setAnmeldenisclicked(false);
    }



    const anmelden = () => { 
        auth.signInWithEmailAndPassword(email, password)
            .then(function(){
                setIstangemeldet(true);
            })
            .catch(function(error){
                // prüfen ob passwort richtig ist oder nicht
                const errorcode = error.code;
                const errormessage = error.message;
                console.log(errorcode, errormessage)
            });

        setRegistrierenisclicked(false);
        setAnmeldenisclicked(false);
    }


    const handleregistrieren = () => {
        setRegistrierenisclicked(false);
        setAnmeldenisclicked(false);
    }



return(

    <div className = {appstyle.app}>


    {/* <button onClick = {() => console.log(user)}>click</button> */}

    {/*Auth komponent um Modal anzuzeigen und dabei funktion übergeben um alle State in App.js zu ändern  */}
    {
    anmeldenisclicked ? 
        <Auth open = {open} setEmail = {setEmail} setPassword = {setPassword} setAnmeldenisclicked = {setAnmeldenisclicked}>
                <Button variant="contained" color="primary" onClick = {() => { anmelden() }}>Anmelden</Button>
                <br/>
                <b>ODER</b>
                <Button color="primary" onClick = {() => setRegistrierenisclicked(true)}>registrieren</Button>
                <br/>
                <p onClick = {() => setAnmeldenisclicked(false)}>exit</p>
        </Auth>

        : ''
    }


    {
    registrierenisclicked ? 
        <Auth open = {open} setEmail = {setEmail} setPassword = {setPassword} setAnmeldenisclicked = {setAnmeldenisclicked}>
            <Input type = 'text' placeholder = 'username' className ={appstyle.app_usernameinput} onChange = {(e) => {setUsername(e.target.value)}}/>
            <Button  variant = 'contained' color="primary" className = {appstyle.app_registrierenbutton} onClick = {() => registrieren() }>registrieren</Button>
            <br/>
            <p onClick = {() => { handleregistrieren() } } className = {appstyle.app_registrierenexit}>exit</p>
        </Auth>

    : ''  
    }

            <div className = {appstyle.app_header}>
                <img  
                    className = {appstyle.app_headerimg}
                    src = 'https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
                    alt = ''
                ></img>
                <Search />

            {istangemeldet ? 
                <Button variant="outlined" onClick ={() => { abmelden() } }>abmelden</Button>
                : 
                <Button variant="outlined" onClick ={() =>setAnmeldenisclicked(true)}>anmelden</Button>
            }   
            </div>
            



        <div className = {appstyle.posts}>

        
            <div className = {appstyle.posts_left} >
                
            {
                posts.map(({id, post}) =>
                    <Post key = {id} postid = {id} user = {user} username = {post.username} imgurl = {post.imgurl} caption = {post.caption}/>
                )
            }
            </div>

            
            <div className = {appstyle.posts_right}>
            <InstagramEmbed
            url = 'https://www.instagram.com/p/BwaNuHfH6E4/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender={() => {}}
            onFailure={() => {}}
            />   
            </div>



        </div>






            {user !== null ? 
            /* username als props übergebne */
                <Uploader user = {user}/>
            : <h3 className = {appstyle.upload_error}>login to upload</h3>
            }



        </div>
);
}