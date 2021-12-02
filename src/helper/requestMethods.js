import axios from "axios";
import { deleteProductSuccess, getFailure, getStart, getProductSuccess, createProductSuccess,updateProductSuccess } from "../redux/productRedux";
import { loginFailure, loginStart, loginSuccess } from "../redux/userRedux";

const BASE_URL = "http://localhost:5001/api/";
const TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root")).user).currentUser.jwtToken



export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});

export const login = async (dispatch, user) => {
  dispatch(loginStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res?.data));
  } catch (error) {
    dispatch(loginFailure());
  }
};

export const getProducts = async(dispatch) =>{
dispatch(getStart())
try {
  const res = await publicRequest.get("/products")
  console.log(res)
  dispatch(getProductSuccess(res?.data))

} catch (error) {
  dispatch(getFailure())
}
}

export const deleteProduct = async(id, dispatch) =>{
  dispatch(getStart())
  try {
    // const res = await userRequest.delete(`/products/${id}`)
    // console.log("🚀 ~ file: requestMethods.js ~ line 45 ~ deleteProduct ~ res", res)
    dispatch(deleteProductSuccess(id))
  } catch (error) {
    dispatch(getFailure())
  }
}

export const updateProduct = async(id, product, dispatch)=>{
  dispatch(getStart())
  try {
    const res = await userRequest.put(`/products/${id}`)
    dispatch(updateProductSuccess({id, product}))
  } catch (error) {
    dispatch(getFailure())
  }
}
export const createProduct = async(product, dispatch)=>{
  dispatch(getStart())
  try {
    const res = await userRequest.post('/products', product)
    dispatch(createProductSuccess(res?.data))
  } catch (error) {
    dispatch(getFailure())
  }
}


