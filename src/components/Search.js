import React from 'react';
import appstyle from './App.module.css';


export default function Search(){

    return(
        <form>
            <input
            type = 'text' 
            className = {appstyle.app_input}
            placeholder = 'search'   
            />
        </form>
    );

}