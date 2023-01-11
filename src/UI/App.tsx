import React, {useEffect} from 'react';
import './App.css';
import {Header} from "./features/header/header";
import {Navigate, Route, Routes} from "react-router-dom";
import {Profile} from "./features/profile/profile";
import {LoginPage} from "./features/login/login";
import {Register} from "./features/register/register";
import {useAppDispatch, useAppSelector} from '../bll/store';
import {initializeProfileTC} from './features/login/auth-reducer';
import {Preloader} from "./common/preloader/preloader";
import {CircularProgress} from "@mui/material";

export const App = () => {
    const dispatch = useAppDispatch()
    const isInitialized = useAppSelector(state => state.app.isInitialized)
    const status = useAppSelector((state)=>state.app.appStatus)


    useEffect(() => {
        dispatch(initializeProfileTC())
    }, [])

    if (!isInitialized) {
        return <div
          style={{position: 'fixed', top: '30%', textAlign: 'center', width: '100%'}}>
            <CircularProgress/>
        </div>
    }

    return (
        <div className="App">
            <Header/>
            {status==='loading' && <Preloader/>}
            <Routes>
                <Route path={'/profile'} element={<Profile/>}/>
                <Route path={'/'} element={<Navigate to={'/profile'}/>}/>
                <Route path={'/register'} element={<Register/>}/>
                <Route path={'/login'} element={<LoginPage/>}/>
                <Route path={'/404'} element={<h1>404: PAGE NOT FOUND</h1>}/>
                <Route path={'*'} element={<Navigate to='/404'/>}/>
            </Routes>
        </div>
    )
};