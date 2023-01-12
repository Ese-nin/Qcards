import {authAPI} from '../../../dal/api';
import {AxiosError} from 'axios';
import {Dispatch} from 'redux'
import {setAppStatusAC, setInitializeAC} from '../../app-reducer';
import {ThunkAppDispatchType} from '../../../bll/store';

const initialState = {
    isLoggedIn: false,
    isHaveAccount: false,
    isSentInstruction: false,
    name: '',
    email: ''
}

export const authReducer = (state: InitialAuthStateType = initialState, action: AuthActionsType): InitialAuthStateType => {
    switch (action.type) {
        case 'AUTH/SET_LOG_IN':
            return {
                ...state,
                isLoggedIn: action.isLoggedIn,
                name: action.name,
                email: action.email
            }
        case 'AUTH/SET_LOG_OUT':
            return {...state, isLoggedIn: action.isLoggedIn}
        case 'AUTH/SET_HAVE_ACC':
            return {...state, isHaveAccount: action.isHaveAccount}
        case 'AUTH/SET_NEW_NAME':
            return {...state, name: action.name}
        case 'AUTH/SENT_INSTRUCTION':
            return {...state, isSentInstruction: action.isSent}
        default:
            return state
    }
}


// actions

export const logInAC = (name: string, email: string) => ({
    type: 'AUTH/SET_LOG_IN',
    isLoggedIn: true,
    name,
    email
} as const)
export const logOutAC = () => ({type: 'AUTH/SET_LOG_OUT', isLoggedIn: false} as const)
export const setHaveAccountAC = (isHaveAccount: boolean) => ({type: 'AUTH/SET_HAVE_ACC', isHaveAccount} as const)
export const changeNameAC = (name: string) => ({type: 'AUTH/SET_NEW_NAME', name} as const)
export const sentInstructionAC = (isSent: boolean) => ({type: 'AUTH/SENT_INSTRUCTION', isSent} as const)


// thank creators

export const logoutTC = () => (dispatch: ThunkAppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logOut()
        .then(res => {

            dispatch(logOutAC())
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            const error = err.response
                ? err.response.data.error
                : err.message
            console.log('error: ', error)
            dispatch(setAppStatusAC('failed'))
        })
}


export const registerTC = (email: string, password: string) => (dispatch: ThunkAppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.register(email, password)
        .then((res) => {
            // console.log(res.data)
            dispatch(setHaveAccountAC(true))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            const error = err.response
                ? err.response.data.error
                : err.message
            console.warn(error)
            // view snackbar with error
            dispatch(setAppStatusAC('failed'))
        })
}

// log in
export const loginTC = (email: string, password: string, rememberMe: boolean) => (dispatch: ThunkAppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.logIn(email, password, rememberMe)
        .then((res) => {
            dispatch(logInAC(res.data.name, res.data.email))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            const error = err.response
                ? err.response.data.error
                : (err.message + ', more details in the console');

            console.log('Error: ', {...err})
            dispatch(setAppStatusAC('failed'))
        })
}

// me запрос

export const initializeProfileTC = () => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.me()
        .then(res => {
            if (res.data.name) {
                dispatch(logInAC(res.data.name, res.data.email))
                dispatch(setAppStatusAC('succeeded'))


            }
        })
        .catch((err: AxiosError<{ error: string }>) => {
            const error = err.response
                ? err.response.data.error
                : (err.message + ', more details in the console');

            console.log('Error: ', {...err})
            dispatch(setAppStatusAC('failed'))
        })
        .finally(() => {
            dispatch(setInitializeAC())
        })
}


export const setNewNameTC = (name: string) => (dispatch: Dispatch) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.changeName(name)
        .then(res => {
            dispatch(changeNameAC(res.data.updatedUser.name))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            const error = err.response
                ? err.response.data.error
                : (err.message + ', more details in the console');

            console.log('Error: ', {...err})
            dispatch(setAppStatusAC('failed'))
        })
}

export const forgotPasswordTC = (email: string) => (dispatch: ThunkAppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.forgotPass(email)
        .then((res) => {
            dispatch(sentInstructionAC(true))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            const error = err.response
                ? err.response.data.error
                : err.message
            console.warn(error)
            // view snackbar with error
            dispatch(setAppStatusAC('failed'))
        })
}

export const setNewPasswordTC = (password: string, token: string) => (dispatch: ThunkAppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    authAPI.setNewPass(password, token)
        .then((res) => {
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            const error = err.response
                ? err.response.data.error
                : err.message
            console.warn(error)
            // view snackbar with error
            dispatch(setAppStatusAC('failed'))
        })
}




// types

export type InitialAuthStateType = {
    isLoggedIn: boolean
    isHaveAccount: boolean
    isSentInstruction: boolean
    name: string
    email: string
}

export type AuthActionsType = LogInActionType
    | LogOutActionType
    | SetHaveAccountActionType
    | changeNameActionType
    | SentInstructionActionType


type LogInActionType = ReturnType<typeof logInAC>
type LogOutActionType = ReturnType<typeof logOutAC>
type SetHaveAccountActionType = ReturnType<typeof setHaveAccountAC>
type changeNameActionType = ReturnType<typeof changeNameAC>
type SentInstructionActionType = ReturnType<typeof sentInstructionAC>