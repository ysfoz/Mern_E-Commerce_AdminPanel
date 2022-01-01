import "./newProduct.css";
import { useState } from "react";
import app from "../../helper/firebase";
import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import { createProduct } from "../../helper/requestMethods";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function NewProduct() {
  const [imgFile, setImgFile] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const formik = useFormik({
    initialValues: {
      title: "",
      desc: "",
      img: "",
      categories: [],
      size: [],
      color: [],
      price: "",
      inStock: true,
    },
    validationSchema: Yup.object({
      title: Yup.string()
        .required("Product name is required")
        .min(3, "Username is too short - should be 3 chars minimum."),
      desc: Yup.string("").required("Description is required!!"),
      img: Yup.string(),
      categories: Yup.array(),
      size: Yup.array(),
      color: Yup.array(),
      price: Yup.number().required("price is required"),
      inStock: Yup.boolean().default(true),
    }),
    onSubmit: (values) => {
      if(imgFile !== null){
        handleClick(values)
      } else {
        const product = { ...values};
        createProduct(product,dispatch,historyPush)
        
      }
    },
  });


  const historyPush = () => {
    history.push("/products");
  };

  const handleClick = (values) => {
  
    const fileName = "products" + new Date().getTime() + imgFile[0]?.name;
    const storage = getStorage(app);
    const productRef = ref(storage, `products/${values?.title}/`);
    const storageRef = ref(productRef, fileName);
    const uploadTask = uploadBytesResumable(storageRef, imgFile[0]);

    // Listen for state changes, errors, and completion of the upload.
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        switch (snapshot.state) {
          case "paused":
            console.log("Upload is paused");
            break;
          case "running":
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object
            break;
          case "storage/canceled":
            // User canceled the upload
            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            break;
        }
      },
      () => {
        // Upload completed successfully, now we can get the download URL
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          const product = { ...values, img: downloadURL};
          createProduct(product, dispatch, historyPush);
        });
      }
    );
  };

  return (
    <div className="newProduct">
      <h1 className="addProductTitle">New Product</h1>
      <form className="addProductForm" onSubmit={formik.handleSubmit}>
        <div className="addProductItem">
          <label htmlFor="img">Image</label>
          <input
            type="file"
            id="img"
            name="img"
            onChange={(e) => setImgFile(e.target.files)}
          />
          {formik.touched.img && formik.errors.img ? (
            <div>{formik.errors.img}</div>
          ) : null}
        </div>
        <div className="addProductItem">
          <label>Title</label>
          <input
            id="title"
            name="title"
            type="text"
            placeholder="T-shirt model:tsm01"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.title}
          />
          {formik.touched.title && formik.errors.title ? (
            <div>{formik.errors.title}</div>
          ) : null}
        </div>
        <div className="addProductItem">
          <label>Description</label>
          <input
            id="desc"
            name="desc"
            type="text"
            placeholder="100% cotton"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.desc}
          />
          {formik.touched.desc && formik.errors.desc ? (
            <div>{formik.errors.desc}</div>
          ) : null}
        </div>
        <div className="addProductItem">
          <label>Price</label>
          <input
            id="price"
            name="price"
            type="number"
            placeholder="100"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.price}
          />
          {formik.touched.price && formik.errors.price ? (
            <div>{formik.errors.price}</div>
          ) : null}
        </div>
        <div className="addProductItem">
          <label htmlFor="categories">Categories</label>
          <select
            name="categories"
            id="categories"
            multiple
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.categories}
          >
            <option value="man">Man</option>
            <option value="woman">Woman</option>
            <option value="child">Child</option>
            <option value="winter">Winter</option>
            <option value="summer">Summer</option>
            <option value="accessories">Accessories</option>
        
          </select>
          
          {formik.touched.categories && formik.errors.categories ? (
            <div>{formik.errors.categories}</div>
          ) : null}
        </div>

        <div className="addProductItem">
          <label htmlFor="color">Choose colors:</label>
          <select
            name="color"
            id="color"
            multiple
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.color}
          >
            <option value="red">Red</option>
            <option value="black">Black</option>
            <option value="blue">Blue</option>
            <option value="yellow">Yellow</option>
            <option value="green">Green</option>
            <option value="white">White</option>
          </select>
        </div>
        <div className="addProductItem">
          <label htmlFor="size">Choose sizes:</label>
          <select
            name="size"
            id="size"
            multiple
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.size}
          >
            <option value="xs">XS</option>
            <option value="s">S</option>
            <option value="m">M</option>
            <option value="l">L</option>
            <option value="xl">XL</option>
          </select>
        </div>
        <div className="addProductItem">
          <label>Stock</label>
          <select
            id="inStock"
            name="inStock"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.inStock}
          >
            <option value="true">Yes</option>
            <option value="false">No</option>
          </select>
        </div>

        <button type="submit"  className="addProductButton">
          Create
        </button>
      </form>
    </div>
  );
}
