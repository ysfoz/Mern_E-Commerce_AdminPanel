import { useState } from "react";
import { Publish } from "@material-ui/icons";
import "./newUser.css";
import "../user/user.css";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../helper/firebase";
import { createUser } from '../../helper/requestMethods'
import { useDispatch } from "react-redux";


export default function NewUser() {
  const [imgFile, setImgFile] = useState(null);
  const dispatch = useDispatch()
 

  const formik = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
      isAdmin: false,
      img: "",
    },
    validationSchema: Yup.object({
      username: Yup.string()
        .required("username is required")
        .min(3, "Username is too short - should be 3 chars minimum."),
      email: Yup.string()
        .email("Invalid Email")
        .required("Email is required!!"),
      password: Yup.string()
        .required("No password provided.")
        .min(6, "Password is too short - should be 6 chars minimum."),
      isAdmin: Yup.boolean().default(false),
      img: Yup.string()
    }),
    onSubmit: (values) => {
    console.log("🚀 ~ file: NewUser.jsx ~ line 45 ~ NewUser ~ values", values)
    handleClick(values)
    
  
    },
  });


  const handleClick = (values)=> {
    // e.preventDefault()
    const fileName= new Date().getTime() + imgFile?.name
    const storage = getStorage(app)
    const storageRef = ref(storage,fileName)
    const uploadTask = uploadBytesResumable(storageRef, fileName);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
    (snapshot) => {
      // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('Upload is ' + progress + '% done');
      switch (snapshot.state) {
        case 'paused':
          console.log('Upload is paused');
          break;
        case 'running':
          console.log('Upload is running');
          break;
          
      }
    }, 
    (error) => {
      // A full list of error codes is available at
      // https://firebase.google.com/docs/storage/web/handle-errors
      switch (error.code) {
        case 'storage/unauthorized':
          // User doesn't have permission to access the object
          break;
        case 'storage/canceled':
          // User canceled the upload
          break;
  
        // ...
  
        case 'storage/unknown':
          // Unknown error occurred, inspect error.serverResponse
          break;
      }
    }, 
    () => {
      // Upload completed successfully, now we can get the download URL
      getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
        const newUser = {...values, img:downloadURL }
        createUser(dispatch, newUser)
        
      });
    }
    );
   
    
  }
  
  



  return (
    <div className="newUser">
      <h1 className="newUserTitle">New User</h1>

      <form className="newUserForm" onSubmit={formik.handleSubmit}>
        <div className="newUserItem">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
           
          />
          {formik.touched.username && formik.errors.username ? (
            <div>{formik.errors.username}</div>
          ) : null}
        </div>
        <div className="newUserItem">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="email"
            name="email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email ? (
            <div>{formik.errors.email}</div>
          ) : null}
        </div>
        <div className="newUserItem">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="password"
            name="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password ? (
            <div>{formik.errors.password}</div>
          ) : null}
        </div>

        <div className="newUserItem">
          <label htmlFor="isAdmin">Admin</label>
          <select
            className="newUserSelect"
            name="isAdmin"
            id="isAdmin"
            onChange={formik.handleChange}
            value={formik.values.isAdmin}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>
        <div className="newUserItem">
          <label>Upload a profile photo</label>
          <div className="userUpdateUpload">
            <img
              className="userUpdateImg"
              src="https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
            />
            <label htmlFor="img">
              <Publish className="userUpdateIcon" />
            </label>
            <input type="file" id="img" name="img" style={{ display: "none" }}  onChange={(e) => setImgFile(e.target.files[0])}
            />
          </div>
        </div>
        <button type="submit" className="newUserButton">Create</button>
      </form>
    </div>
  );
}
