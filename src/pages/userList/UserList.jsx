import "./userList.css";
import { useEffect, useState } from "react";
import { DataGrid } from "@material-ui/data-grid";
import { DeleteOutline } from "@material-ui/icons";
import { Link } from "react-router-dom";
import { getAllUsers } from "../../helper/requestMethods";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";

export default function UserList() {
  const [orders, setOrders] = useState([]);
  const [userInfo, setUserInfo] = useState([]);

  const dispatch = useDispatch();
  const users = useSelector((state) => state?.user?.users);
  const TOKEN = useSelector((state) => state?.user?.currentUser?.jwtToken);

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
  const createData = () => {
    let amount = 0;

    for (let i = 0; i < users?.length; i++) {
      for (let j = 0; j < orders?.length; j++) {
        if (users[i]?._id !== orders[j]?.userId) {
          setUserInfo((prev) => [
            ...prev,
            {
              id: users[i]?._id,
              username: users[i]?.username,
              email: users[i]?.email,
              avatar:
                users[i]?.img ||
                "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
              status: "Passive",
              transaction: 0,
            },
          ]);
        } else {
          amount += orders[j]?.amount;
          setUserInfo((prev) => [
            ...prev,
            {
              id: users[i]?._id,
              username: users[i]?.username,
              email: users[i]?.email,
              avatar:
                users[i]?.img ||
                "https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500",
              status: "Active",
              transaction: amount,
            },
          ]);
        }
      }
    }
  };

  useEffect(() => {
    getAllUsers(dispatch, "");
  }, []);

  useEffect(() => {
    getOrders();
  }, []);
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
            <img className="userListImg" src={params.row.avatar} alt="" />
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
            <Link to={"/user/" + params.row.id}>
              <button className="userListEdit">Edit</button>
            </Link>
            <DeleteOutline
              className="userListDelete"
              onClick={() => handleDelete(params.row.id)}
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
        pageSize={8}
        checkboxSelection
      />
    </div>
  );
}
