import "./widgetSm.css";
import { Visibility } from "@material-ui/icons";
import {  useEffect } from "react";
import {  getAllUsers } from "../../helper/requestMethods";
import { useDispatch, useSelector } from "react-redux";

export default function WidgetSm() {
  const dispatch = useDispatch();
  const users = useSelector((state) => state?.user?.users);

  useEffect(() => {
    getAllUsers(dispatch, "?new=true");
  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">
        {users?.map((item) => (
          <li className="widgetSmListItem" key={item._id}>
            <img
              src={
                item.img ||
                "https://crowd-literature.eu/wp-content/uploads/2015/01/no-avatar.gif"
              }
              alt=""
              className="widgetSmImg"
            />
            <div className="widgetSmUser">
              <span className="widgetSmUsername">{item.username}</span>
            </div>
            <button className="widgetSmButton">
              <Visibility className="widgetSmIcon" />
              Display
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
