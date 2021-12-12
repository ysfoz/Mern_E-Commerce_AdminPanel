import "./productList.css";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";

import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import { deleteProduct, getProducts } from "../../helper/requestMethods";
import {
  getStorage,
  ref,
  deleteObject,
} from "firebase/storage";
import app from "../../helper/firebase";
import noImage from "../../assets/noImage.png"


export default function ProductList() {
 
  const dispatch = useDispatch()
  const products = useSelector(state => state.product.products)
 
  const confirmDelete = (item,img) =>{
    var r = window.confirm("Are you sure to Delete!");
    if (r === true) {
      handleDelete(item)
      deleteImg(img)
    } 
  
  }

  const handleDelete = (id) => {
   deleteProduct(id,dispatch)
  };

  useEffect(()=>{
    getProducts(dispatch)
  },[dispatch])
  


  const deleteImg = (img) => {
    const storage = getStorage(app);

    // Create a reference to the file to delete
    const desertRef = ref(storage,img);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };



  const columns = [
    { field: "_id", headerName: "ID", width: 220 },
    {
      field: "product",
      headerName: "Product",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="productListItem">
            <img className="productListImg" src={params?.row?.img || noImage} alt="" />
            {params.row.title}
          </div>
        );
      },
    },
    { field: "inStock", headerName: "Stock", width: 200 },
    
    {
      field: "price",
      headerName: "Price",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/product/" + params.row?._id}>
              <button className="productListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="productListDelete"
              onClick={() => confirmDelete(params.row?._id,params.row?.img)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="productList">
      <DataGrid
        rows={products}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row)=>row._id }
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
