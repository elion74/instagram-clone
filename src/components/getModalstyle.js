
import { makeStyles } from '@material-ui/core';

function getModalstyle() {
    const top = 50;
    const left = 50; 
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
      width: 370,
      backgroundColor: theme.palette.background.paper,
      border: '2px solid #000',   
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
   },
}));

export {getModalstyle, useStyles};