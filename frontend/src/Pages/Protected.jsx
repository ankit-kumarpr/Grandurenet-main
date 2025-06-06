import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom';

const Protected = (props) => {
    const {Component}=props;

    const navigate=useNavigate();

    useEffect(()=>{

        let login=sessionStorage.getItem("token");
        // console.log("token",login);
        if(!login){
            navigate("/");
        }
    })
  return (
    <>
    
    <Component />
    </>
  )
}

export default Protected