import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { userRequest, updateProduct } from "../../helper/requestMethods";
import { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../helper/firebase";
import { useHistory } from "react-router";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function Product() {
  const location = useLocation().pathname;
  const productId = location?.split("/")[2];
  const product = useSelector((state) =>
    state?.product?.products?.find((product) => product?._id === productId)
  );
  const [pStats, setPStats] = useState([]);

  const [imgFile, setImgFile] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );
  const getStats = async () => {
    try {
      const res = await userRequest.get("orders/income?pid=" + productId);
      const list = res?.data?.sort((a, b) => {
        return a._id - b._id;
      });
      list.map((item) =>
        setPStats((prev) => [
          ...prev,
          { name: MONTHS[item._id - 1], Sales: item.total },
        ])
      );
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getStats();
  }, [productId, MONTHS]);

  const deleteImg = () => {
    const storage = getStorage(app);

    // Create a reference to the file to delete
    const desertRef = ref(storage, product?.img);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  const formik = useFormik({
    initialValues: {
      title: product.title,
      desc: product.desc,
      img: product.img,
      categories: product.categories,
      size: product.size,
      color: product.color,
      price: product.price,
      inStock: product.inStock,
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
      handleClick(values);
    },
  });

  const historyPush = () => {
    history.push("/products");
  };

  const handleClick = (values) => {
    if (imgFile) {
      product?.img && deleteImg();
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
            const product = {
              ...values,
              img: downloadURL,
            };
            updateProduct(productId, product, dispatch, historyPush);
          });
        }
      );
    } else {
      const product = { ...values };
      updateProduct(productId, product, dispatch, historyPush);
    }
  };

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product?.img} alt="" className="productInfoImg" />
            <span className="productName">{product?.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">id:</span>
              <span className="productInfoValue">{product?._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">sales:</span>
              <span className="productInfoValue">5123</span>
            </div>

            <div className="productInfoItem">
              <span className="productInfoKey">in stock:</span>
              <span className="productInfoValue">
                {product?.inStock === true ? "Yes" : "No"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="productBottom">
        <form className="productForm" onSubmit={formik.handleSubmit}>
          <div className="productFormLeft">
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
            <button type="submit" className="productButton">
              Update
            </button>
          </div>
          <div className="productFormRight">
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
              <option value="child">Kind</option>
              <option value="winter">Winter</option>
              <option value="summer">Summer</option>
              <option value="accessories">Accessories</option>
            </select>

            {formik.touched.categories && formik.errors.categories ? (
              <div>{formik.errors.categories}</div>
            ) : null}

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
        </form>
      </div>
    </div>
  );
}
