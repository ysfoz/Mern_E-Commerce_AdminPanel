import { createSlice} from "@reduxjs/toolkit"

const ProductSlice = createSlice({
name:"product",
initialState:{
    products:[],
    isFetching:false,
    error:false,
},
reducers:{
    // GET ALL
    getProductStart:(state)=>{
        state.isFetching = true
        state.error = false
    },
    getProductSuccess: (state,action) =>{
        state.isFetching =false
        state.products = action.payload
    },
    getProductFailure :(state) =>{
        state.error = true
        state.isFetching = false
    }

}
})

export const { getProductStart, getProductSuccess, getProductFailure} = ProductSlice.actions

export default ProductSlice.reducer