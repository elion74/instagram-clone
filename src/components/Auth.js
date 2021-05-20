import React, { useState } from 'react';   
import {getModalstyle, useStyles} from './getModalstyle.js';

import appstyle from './App.module.css';
import { Modal, Input } from '@material-ui/core';


export default function Auth({open, setEmail, setPassword, setAnmeldenisclicked, setRegistrierenisclicked, children}){

    //  Modal styles
    const classes = useStyles();
    const [modalstyle] = useState(getModalstyle);


    return(

    <div>
        
        <Modal open = {open}>

        <div style = {modalstyle} className = {classes.paper}>
                <form
                 noValidate autoComplete="off" 
                 className ={appstyle.app_modalform}>
                <Input 
                onChange = { (e) => {setEmail(e.target.value)} }
                type = 'text'
                placeholder = 'e-mail'
                />
                <Input 
                onChange = { (e) => {setPassword(e.target.value)} }
                type = 'password'
                placeholder = 'password'
                />
                </form>

            <div className = {appstyle.app_modalbuttons}>                                                    
                {children}
            </div>
        </div>

        </Modal>

    </div>

    );

}
