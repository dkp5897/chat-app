import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children}) => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  
    if(!userInfo){
        return <Navigate to={'/'}/>
    }

    return children
  
}

export default ProtectedRoute
