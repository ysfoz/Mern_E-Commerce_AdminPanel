import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from "@material-ui/icons";
import { userRequest } from "../../helper/requestMethods";
import { useState, useEffect } from "react";

export default function FeaturedInfo() {
  const [income, setIncome] = useState([]);
  const [percentage, setPercentage] = useState(0);
  console.log(
    "🚀 ~ file: FeaturedInfo.jsx ~ line 8 ~ FeaturedInfo ~ income",
    income
  );

  //! i must  control here after i finished all
  const getIncome = async () => {
    try {
      const res = await userRequest.get("/orders/income");
      setIncome(res?.data);
      setPercentage((res?.data[1]?.total * 100) / res?.data[0].total - 100);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getIncome();
  }, []);

  return (
    <div className="featured">
      <div className="featuredItem">
        <span className="featuredTitle">Revanue</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">${income[1]?.total}</span>
          <span className="featuredMoneyRate">
            %{Math.floor(percentage)}
            {percentage < 0 ? (
              <ArrowDownward className="featuredIcon negative" />
            ) : (
              <ArrowUpward className="featuredIcon" />
            )}
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Sales</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$4,415</span>
          <span className="featuredMoneyRate">
            -1.4 <ArrowDownward className="featuredIcon negative" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
      <div className="featuredItem">
        <span className="featuredTitle">Cost</span>
        <div className="featuredMoneyContainer">
          <span className="featuredMoney">$2,225</span>
          <span className="featuredMoneyRate">
            +2.4 <ArrowUpward className="featuredIcon" />
          </span>
        </div>
        <span className="featuredSub">Compared to last month</span>
      </div>
    </div>
  );
}