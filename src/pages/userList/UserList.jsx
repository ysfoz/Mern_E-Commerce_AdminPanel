import "./userList.css";
import { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { getAllUsers, deleteUser } from "../../helper/requestMethods";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  getStorage,
  ref,
  deleteObject,
} from "firebase/storage";
import app from "../../helper/firebase";
import avatar from "../../assets/avatar.png"

export default function UserList() {
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState([]);


  const dispatch = useDispatch();
  const users = useSelector((state) => state.user.users);
  const TOKEN = useSelector((state) => state?.user?.currentUser?.jwtToken);

  const confirmDelete = (id,img) =>{
    var r = window.confirm("Are you sure to Delete!");
    if (r === true) {
      handleDelete(id)
      deleteImg(img)
    } 
  
  }

// from Firebase
  const deleteImg = (img) => {
    const storage = getStorage(app);

    // Create a reference to the file to delete
    const desertRef = ref(storage, img);

    // Delete the file
    deleteObject(desertRef)
      .then(() => {
        // File deleted successfully
      })
      .catch((error) => {
        // Uh-oh, an error occurred!
      });
  };

  
// from Redux
  const handleDelete = (id) => {
   deleteUser(id, dispatch)
  };


  const getOrders = async () => {
    try {
      const res = await axios.get(
        "https://mern-e-commerce-api.herokuapp.com/api/orders",
        { headers: { token: `Bearer ${TOKEN}` || "Bearer 123" } }
      );
      setOrders(res?.data);
    } catch (error) {
      console.log(error);
    }
  };

  // for create new object with transaction and status
  const createData = () => {
    let amount = 0;
    let usersList=[]

    for (let i = 0; i < users?.length; i++) {
      for (let j = 0; j < orders?.length; j++) {
        if (users[i]?._id !== orders[j]?.userId) {
         usersList.push(
            {
              id: users[i]?._id,
              username: users[i]?.username,
              email: users[i]?.email,
              img:
                users[i]?.img ||
                avatar,
              status: "Passive",
              transaction: 0,
            },
         )
         
        } else {
          amount += orders[j]?.amount;
          usersList.push(
            {
              id: users[i]?._id,
              username: users[i]?.username,
              email: users[i]?.email,
              img:
                users[i]?.img ||
                avatar,
              status: "Active",
              transaction: amount,
            }
          )
        }
      }
    }
    setUserInfo(usersList)
  };


  // fetch all users
  useEffect(() => {
    getAllUsers(dispatch, "");
  }, []);


  // fetch all orders
  useEffect(() => {
    getOrders();
  }, []);

  // new object
  useEffect(() => {
    createData();
  }, [users, orders]);

  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "user",
      headerName: "User",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="userListUser">
            <img className="userListImg" src={params.row.img} alt="" />
            {params.row.username}
          </div>
        );
      },
    },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "transaction",
      headerName: "Transaction Volume",
      width: 160,
    },
    {
      field: "action",
      headerName: "Action",
      width: 150,
      renderCell: (params) => {
        return (
          <>
            <Link to={"/user/" + params.row?.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => confirmDelete(params.row?.id,params.row?.img)}
            />
          </>
        );
      },
    },
  ];

  return (
    <div className="userList">
      <DataGrid
        rows={userInfo}
        disableSelectionOnClick
        columns={columns}
        getRowId={(row)=>row.id }
        pageSize={8}
        checkboxSelection
   
      />
    </div>
  );
}
