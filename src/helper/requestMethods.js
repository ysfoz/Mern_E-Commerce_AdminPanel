import axios from "axios";
import {
  deleteProductSuccess,
  getFailure,
  getStart,
  getProductSuccess,
  createProductSuccess,
  updateProductSuccess,
} from "../redux/productRedux";
import {
  getUserFailure,
  getUserStart,
  loginSuccess,
  getAllUsersSuccess,
  getUserDeleteSuccess,
  logoutSuccess,
  registerSuccess,
  getUserUpdate,
} from "../redux/userRedux";

const BASE_URL = "https://mern-e-commerce-api.herokuapp.com/api/";

let TOKEN = {};

if (localStorage.getItem("persist:root")) {
  TOKEN = JSON.parse(JSON.parse(localStorage.getItem("persist:root"))?.user)
    ?.currentUser?.jwtToken;
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

//Logout

export const logout = async (dispatch) => {
  dispatch(getStart());
  try {
    dispatch(logoutSuccess());
  } catch (error) {
    dispatch(getFailure());
  }
};

// Get All Users

export const getAllUsers = async (dispatch, query) => {
  dispatch(getUserStart());
  try {
    const res = await userRequest.get(`/users/${query}`);

    dispatch(getAllUsersSuccess(res?.data));
  } catch (error) {
    dispatch(getUserFailure());
  }
};

//Create / Register
export const createUser = async (dispatch, newuser) => {
  dispatch(getUserStart());
  try {
    const res = await userRequest.post("/auth/adminregister", newuser);
    dispatch(registerSuccess(res?.data));
  } catch (error) {
    dispatch(getUserFailure());
  }
};

//update
export const updateUser = async (dispatch, id, user) => {
  console.log(
    "🚀 ~ file: requestMethods.js ~ line 91 ~ updateUser ~ user",
    user
  );
  dispatch(getUserStart());
  try {
    const res = await userRequest.put(`/users/adminupdate/${id}`, user);
    
    dispatch(getUserUpdate(id, user));
  } catch (error) {
    dispatch(getUserFailure());
  }
};

//delete

export const deleteUser = async (id, dispatch) => {
  dispatch(getStart());
  try {
    const res = await userRequest.delete(`/users/${id}`);

    dispatch(getUserDeleteSuccess(id));
  } catch (error) {
    dispatch(getFailure());
  }
};

// PRODUCTS

export const getProducts = async (dispatch) => {
  dispatch(getStart());
  try {
    const res = await publicRequest.get("/products");

    dispatch(getProductSuccess(res?.data));
  } catch (error) {
    dispatch(getFailure());
  }
};

//Delete
export const deleteProduct = async (id, dispatch) => {
  dispatch(getStart());
  try {
    const res = await userRequest.delete(`/products/${id}`);
    dispatch(deleteProductSuccess(id));
  } catch (error) {
    dispatch(getFailure());
  }
};

//Update
export const updateProduct = async (id, product, dispatch, cb) => {
  dispatch(getStart());
  try {
    const res = await userRequest.put(`/products/${id}`, product);
    dispatch(updateProductSuccess(id, product));
    cb();
  } catch (error) {
    dispatch(getFailure());
  }
};
// Create
export const createProduct = async (product, dispatch, cb) => {
  dispatch(getStart());
  try {
    const res = await userRequest.post("/products", product);
    dispatch(createProductSuccess(res?.data));
    cb();
  } catch (error) {
    dispatch(getFailure());
  }
};
