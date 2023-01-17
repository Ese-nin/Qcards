import {AddNewCardPackType, CardPacksType, cardsAPI, GetPacksParamsType} from "../../../dal/api";
import {ThunkAppDispatchType} from "../../../bll/store";
import {setAppStatusAC} from "../../app-reducer";
import {AxiosError} from "axios";
import {handleServerNetworkError} from "../../../utils/error-utils";


const initialState = {
    cardPacks: [{
        id: "",
        user_id: "",
        name: "",
        cardsCount: 0,
        created: "",
        updated: "",
        user_name: ""
    }],
    cardPacksTotalCount: 0,
    maxCardsCount: 0,
    minCardsCount: 0,
    page: 1, // выбранная страница
    pageCount: 1  // количество элементов на странице

}

export type initialCardsStateType = {
    cardPacks: Array<CardPacksType>,
    cardPacksTotalCount: number, // количество колод
    maxCardsCount: number,
    minCardsCount: number,
    page: number, // выбранная страница
    pageCount: number  // количество элементов на странице

}


export type CardsActionType = GetCardsPackACType
    | AddNewCardPackACType
    | DeleteCardPackACType
    | RenameCardPackACType


export const cardsPackListReducer = (state: initialCardsStateType = initialState, action: CardsActionType): initialCardsStateType => {
    switch (action.type) {
        case "GET_CARDS_PACK":
            return {
                ...state,
                ...action
            }
        case "ADD_NEW_CARD_PACK":
            return {
                ...state,
                ...action
            }
        default:
            return state
    }
}

export const getCardsPackAC = (cardPacks: Array<CardPacksType>,
                               cardPacksTotalCount: number, // количество колод
                               maxCardsCount: number,
                               minCardsCount: number,
                               page: number, // выбранная страница
                               pageCount: number) => (
    {type: "GET_CARDS_PACK", cardPacks: cardPacks, cardPacksTotalCount, maxCardsCount, minCardsCount, page, pageCount} as const
)

export const addNewCardPackAC = (cardPacks: Array<CardPacksType>,
                                 cardPacksTotalCount: number, // количество колод
                                 maxCardsCount: number,
                                 minCardsCount: number,
                                 page: number, // выбранная страница
                                 pageCount: number) => ({
        type: "ADD_NEW_CARD_PACK", cardPacks: cardPacks, cardPacksTotalCount, maxCardsCount, minCardsCount, page, pageCount} as const
)
export const deleteCardPackAC=(cardPackID:string)=>({
        type:"DELETE_CARS_PACK", cardPackID}as const
)

export const renameCardPackAC=(cardPackID:string, newNameCardPack:string)=>({
        type:"RENAME_CARD_PACK", cardPackID,newNameCardPack }as const
)



export type GetCardsPackACType = ReturnType<typeof getCardsPackAC>
export type AddNewCardPackACType=ReturnType<typeof addNewCardPackAC>
export type DeleteCardPackACType=ReturnType<typeof deleteCardPackAC>
export type RenameCardPackACType=ReturnType<typeof renameCardPackAC>

export const getCardsPackTC = (params: GetPacksParamsType) => (dispatch: ThunkAppDispatchType) => {
    dispatch(setAppStatusAC('loading'))
    cardsAPI.getCardsPack(params)
        .then((res) => {
            const data = res.data
            dispatch(getCardsPackAC(data.cardPacks, data.cardPacksTotalCount, data.maxCardsCount, data.minCardsCount, data.page, data.pageCount))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            handleServerNetworkError(err, dispatch)
        })
}

export const addNewCardPackTC=(params:AddNewCardPackType)=>(dispatch: ThunkAppDispatchType)=>{
    dispatch(setAppStatusAC('loading'))
    cardsAPI.addNewCardPack(params)
        .then((res)=>{
            dispatch(getCardsPackTC({}))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            handleServerNetworkError(err, dispatch)
        })
}

export const deleteCardPackTC=(cardPackID:string)=>(dispatch: ThunkAppDispatchType)=>{
    dispatch(setAppStatusAC('loading'))
    cardsAPI.deleteCardPack(cardPackID)
        .then((res)=>{
            dispatch(getCardsPackTC({}))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            handleServerNetworkError(err, dispatch)
        })
}

export const renameCardPackTC=(params:RenameCardPackACType)=>(dispatch: ThunkAppDispatchType)=>{
    dispatch(setAppStatusAC('loading'))
    cardsAPI.renameCardPack(params)
        .then((res)=>{
            dispatch(getCardsPackTC({}))
            dispatch(setAppStatusAC('succeeded'))
        })
        .catch((err: AxiosError<{ error: string }>) => {
            handleServerNetworkError(err, dispatch)
        })
}