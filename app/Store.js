import { createContext, useReducer } from "react";


export const useStore = createContext()


const initialState ={
    
    userData: localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : null,

    companyData: localStorage.getItem('companyData')
    ? JSON.parse(localStorage.getItem('companyData'))
    : null
}


function reducer(state, action){
    switch(action.type){
        case'SET_USER':
            return {...state, userData: action.payload}
        case 'LOG_OUT':
            return {...state, userData: null}
        default:
            return state

    }
}


export function StoreProvider(props){
    const[state, dispatch] = useReducer(reducer, initialState)
    const value = {state, dispatch}
    return<useStore.Provider value={value}>{props.children}</useStore.Provider>
}