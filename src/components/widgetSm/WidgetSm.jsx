import "./widgetSm.css";
import { Visibility } from "@material-ui/icons";
import { useState, useEffect } from "react";
import { userRequest } from "../../helper/requestMethods";

export default function WidgetSm() {
  const [user, setUser] = useState([]);

  const getUsers = async () => {
    try {
      const res = await userRequest.get("/users/?new=true");
      console.log("users", res);
      setUser(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className="widgetSm">
      <span className="widgetSmTitle">New Join Members</span>
      <ul className="widgetSmList">

        {user?.map((item)=>(
        <li className="widgetSmListItem" key={user._id}>
          <img
            src={
              user.img ||
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
