import React, { createContext, useEffect, useReducer } from 'react'
import './cart.css'; 
import ContextCart from './ContextCart';
import {products} from './products';

export const CartContext=createContext();

const reducer=(state,action)=>{
    if(action.type==="REMOVE_ITEM"){
        return {
            ...state,
            item: state.item.filter((curElem)=>{
                return curElem.id!==action.payload;
            }),
        }
    }

    if(action.type==="CLEAR_CART"){
        return{
            ...state,
            item:[]
        }
    }

    if(action.type==="INCREMENT"){
        let update=state.item.map((currElem)=>{
            if(currElem.id===action.payload){
                return{
                    ...currElem,
                    quantity:currElem.quantity+1
                };
            }
                return currElem;
            
        })
        return{
            ...state,item:update 
        }
    }

    if(action.type==="DECREMENT"){
        let updateit=state.item.map((curElem)=>{
            if(curElem.id===action.payload){
                return{
                    ...curElem,
                    quantity:curElem.quantity-1
                };
            }
            return curElem;
        })
        .filter((curElem)=>{
           return  curElem.quantity!==0;
        });


        return{
            ...state,item:updateit
        }
    }


    if(action.type==="GET_TOTAL"){
        let {totalItem ,totalAmount}=state.item.reduce(
            (accum,curVal)=>{
                let {price,quantity}=curVal;
                let updatedTotalAmount=price*quantity
                accum.totalAmount+=updatedTotalAmount; 
                accum.totalItem+=quantity;
                return accum;
            },
            {
                totalItem:0,
                totalAmount:0,
            }
        );
        return {...state,totalItem,totalAmount};
    }

    return state;
}

const initialState={
    item:products,
    totalAmount:0,
    totalItem:0,
};

const Cart =()=>{

    const [state,dispatch]=useReducer(reducer,initialState)

    const removeItem=(id)=>{
        return dispatch({
            type:"REMOVE_ITEM",
            payload:id,
        })
    }

    const clearCart=()=>{
        return dispatch({
            type:"CLEAR_CART",
            
        })
    }

    const increment=(id)=>{
        return dispatch({
            type:"INCREMENT",
            payload:id,
        })
    }

    const decrement=(id)=>{
        return dispatch({
            type:"DECREMENT",
            payload:id,
        })
    }

    useEffect(()=>{
        dispatch({type:"GET_TOTAL"});
       // console.log("Awesome");
    },[state.item]);

    return(
        <>
        <CartContext.Provider value={{...state,removeItem,clearCart,increment,decrement}}>
        <ContextCart/>
       </CartContext.Provider>
        </>
    )
}
export default Cart;