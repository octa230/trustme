import { createContext, useReducer } from "react";


export const useStore = createContext()


const initialState ={
    
    userData: localStorage.getItem('userData')
    ? JSON.parse(localStorage.getItem('userData'))
    : null,

    companyData: localStorage.getItem('companyData')
    ? JSON.parse(localStorage.getItem('companyData'))
    : null,

    supplierData: localStorage.getItem('supplierData')
    ? JSON.parse(localStorage.getItem('supplierData'))
    : null,

    customerData: localStorage.getItem('customerData')
    ? JSON.parse(localStorage.getItem('customerData'))
    : null,

    saleData: localStorage.getItem('saleData')
    ? JSON.parse(localStorage.getItem('saleData'))
    : null,

    purchaseData: localStorage.getItem('purchaseData')
    ? JSON.parse(localStorage.getItem('purchaseData'))
    : null

}


function reducer(state, action){
    switch(action.type){
        case'SET_USER':
            const user = action.payload
            localStorage.setItem('userData', JSON.stringify(user))
            return {...state, userData: user}
        case 'LOG_OUT':
            return {...state, userData: null}
        case 'SAVE_SUPPLIER':
            const supplier = action.payload
            localStorage.setItem('supplierData', JSON.stringify(supplier))
            return{...state, supplierData: supplier}
        case 'SAVE_CUSTOMER':
            const customer = action.payload
            localStorage.setItem('customerData', JSON.stringify(customer))
            return{...state, customerData: customer}
        case 'SAVE_SALE':
            const sale = action.payload
            sale.type = 'SALE'
            localStorage.setItem('saleData', JSON.stringify(sale))
            return{...state, saleData: sale}
        case 'SAVE_PURCHASE':
            const purchase = action.payload
            localStorage.setItem('purchaseData', JSON.stringify(purchase))
            return{...state, purchaseData: purchase}
        default:
            return state

    }
}


export function StoreProvider(props){
    const[state, dispatch] = useReducer(reducer, initialState)
    const value = {state, dispatch}
    return<useStore.Provider value={value}>{props.children}</useStore.Provider>
}