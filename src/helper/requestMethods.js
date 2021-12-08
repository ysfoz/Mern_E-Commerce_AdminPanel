import axios from "axios";
import { deleteProductSuccess, getFailure, getStart, getProductSuccess, createProductSuccess,updateProductSuccess } from "../redux/productRedux";
import { getUserFailure, getUserStart, loginSuccess, getAllUsersSuccess } from "../redux/userRedux";

const BASE_URL = "https://mern-e-commerce-api.herokuapp.com/api/";

let TOKEN = {}

if (localStorage.getItem("persist:root")){
TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.user)?.currentUser?.jwtToken
}


export const publicRequest = axios.create({
  baseURL: BASE_URL,
});

export const userRequest = axios.create({
  baseURL: BASE_URL,
  headers: { token: `Bearer ${TOKEN}` },
});
 // USER

 //Login
export const login = async (dispatch, user) => {
  dispatch(getUserStart());
  try {
    const res = await publicRequest.post("/auth/login", user);
    dispatch(loginSuccess(res?.data));
  } catch (error) {
    dispatch(getUserFailure());
  }
};

// Get All Users

export const getAllUsers = async(dispatch,query) => {
    dispatch(getUserStart)
    try {
      const res = await userRequest.get(`/users/${query}`)
      
      dispatch(getAllUsersSuccess(res?.data))
    } catch (error) {
      dispatch(getUserFailure)
    }
}

//Create
 export const createUser = async() =>{

 }


//update
export const updateUser = async() => {

}


//delete

const deleteUser = async()=>{

}


// PRODUCTS

export const getProducts = async(dispatch) =>{
dispatch(getStart())
try {
  const res = await publicRequest.get("/products")
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
    dispatch(updateProductSuccess(id, product))
  } catch (error) {
    console.log(error)
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


