import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { Publish } from "@material-ui/icons";
import {
  userRequest,
} from "../../helper/requestMethods";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import {
  getStorage,
  ref,
  deleteObject,
  uploadBytesResumable,
  getDownloadURL,
} from "firebase/storage";
import app from "../../helper/firebase";

export default function Product() {
  const location = useLocation().pathname;
  const productId = location?.split("/")[2];
  const product = useSelector((state) =>
    state?.product?.products?.find((product) => product?._id === productId)
  );
  const [pStats, setPStats] = useState([]);
  const [productItem, setProductItem] = useState({});
  const [imgFile, setImgFile] = useState(null);

  const TOKEN = useSelector(state=> state?.user?.currentUser?.jwtToken)

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

  const handleChange = (e) => {
    setProductItem((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };


  const updateProduct = async (product) => {
    try {
      const res = await axios.put(
        `https://mern-e-commerce-api.herokuapp.com/api/products/${productId}`,
        product,
        { headers: { token: `Bearer ${TOKEN}` || "Bearer 123" } }
      );
      console.log("axios", res?.data);
    } catch (error) {
      console.log(error);
    }
  };

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

  const handleClick = (e) => {
    if (imgFile) {
      deleteImg();
      e.preventDefault();
      const fileName = new Date().getTime() + imgFile.name;
      const storage = getStorage(app);
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, fileName);

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
            const product = { ...productItem, img: downloadURL };
            updateProduct(product);
          });
        }
      );
    } else {
      updateProduct(productItem);
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
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input
              name="title"
              type="text"
              placeholder={product?.title}
              onChange={handleChange}
            />
            <label>Product Description</label>
            <input
              name="desc"
              type="text"
              placeholder={product?.desc}
              onChange={handleChange}
            />
            <label>Product Price</label>
            <input
              name="price"
              type="text"
              placeholder={product?.price}
              onChange={handleChange}
            />
            <label>In Stock</label>
            <select name="inStock" id="idStock" onChange={handleChange}>
              <option value="true">Yes</option>
              <option value="false">No</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product?.img} alt="" className="productUploadImg" />
              <label htmlFor="file">
                <Publish />
              </label>
              <input
                type="file"
                id="file"
                style={{ display: "none" }}
                onChange={(e) => setImgFile(e.target.files[0])}
              />
            </div>
          </div>
        </form>
        <button onClick={handleClick} className="productButton">
          Update
        </button>
      </div>
    </div>
  );
}
