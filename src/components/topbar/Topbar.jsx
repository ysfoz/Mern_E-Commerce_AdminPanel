import React from "react";
import "./topbar.css";
import { NotificationsNone, Language, ExitToApp } from "@material-ui/icons";
import { useDispatch } from "react-redux";
import { logout } from "../../helper/requestMethods"
import { useHistory } from "react-router";
import { useSelector} from "react-redux"




export default function Topbar() {
  const user = useSelector(state=> state.user.currentUser)
  const history = useHistory()
  const dispatch = useDispatch()

const confirmExit = () =>{
  var r = window.confirm("Are you sure to exit!");
  if (r == true) {
    logout(dispatch)
    history.push('/login')
  } 

}
  
  return (
    <div className="topbar">
      <div className="topbarWrapper">
        <div className="topLeft">
          <span className="logo">Shop Admin</span>
        </div>
        <div className="topRight">
          <div className="topbarIconContainer">
            <NotificationsNone />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <Language />
            <span className="topIconBadge">2</span>
          </div>
          <div className="topbarIconContainer">
            <ExitToApp onClick={()=> {
              confirmExit()
            }
            }/>
          </div>
          <img src={user?.img ? user?.img :"https://images.pexels.com/photos/1526814/pexels-photo-1526814.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"} alt="" className="topAvatar" />
        </div>
      </div>
    </div>
  );
}
