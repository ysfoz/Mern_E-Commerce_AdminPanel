import { createSlice } from "@reduxjs/toolkit";

const ProductSlice = createSlice({
  name: "product",
  initialState: {
    products: [],
    isFetching: false,
    error: false,
  },
  reducers: {
   //START
    getStart: (state) => {
      state.isFetching = true;
      state.error = false;
    },
     // GET ALL
    getProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products = action.payload;
    },
    //FAILURE
    getFailure: (state) => {
      state.error = true;
      state.isFetching = false;
    },

  //DELETE
    deleteProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products.splice(
        state.products.findIndex((item) => item._id === action.payload),
        1
      );
    },
    // UPDATE
    updateProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products[
          state.findIndex((item) => item._id === action.payload.id)
      ] = action.payload.product
    },
    // CREATE
    createProductSuccess: (state, action) => {
      state.isFetching = false;
      state.products.push(action.payload)
    },
  },
});

export const {
  getStart,
  getProductSuccess,
  getFailure,
  deleteProductSuccess,
  updateProductSuccess,
  createProductSuccess,
} = ProductSlice.actions;

export default ProductSlice.reducer;
