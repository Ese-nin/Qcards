import React from 'react';
import {useAppSelector} from '../../../bll/store';
import {Navigate} from 'react-router-dom';
import avatar from './Ellipse 45.png'
import s from './profile.module.css'
import {Button} from '@mui/material';
import {Logout} from '@mui/icons-material';

export const Profile = () => {

    const isLoggedIn = useAppSelector(state => state.auth.isLoggedIn)

    // if (!isLoggedIn) {
    //     return <Navigate to={'/login'}/>
    // }

    return (
        <div className={s.profileBlock}>
            Внимание! Проверка на залоггированность закоменчена для рабочего процесса!
            <span>Personal Information</span>
            <img src={avatar} alt="avatar" className={s.imgAvatar}/>
            <div>
                <span>Ivan</span>
                <button>change name</button>
            </div>
            <span>j&johnson@gmail.com</span>
            <Button  variant="outlined" startIcon={<Logout/>}>
                Log out
            </Button>
        </div>
    );
};