import { createSlice } from "@reduxjs/toolkit";

const authSlice=createSlice({
    name:"Authentication slice",
    initialState:{
        user:null,
        loading:true,
        error:null
    },
    reducers:{
        setUser:(state,action)=>{
            state.user=action.payload
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        },
        setError:(state,action)=>{
            state.err=action.payload
        }
    }
})

export const {setUser,setLoading,setError}=authSlice.actions
export default authSlice.reducer