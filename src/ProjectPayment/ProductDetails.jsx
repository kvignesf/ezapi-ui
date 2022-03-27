import React from "react";
import { Link, useParams } from "react-router-dom";

import { PrimaryButton } from "../shared/components/AppButton";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { ReactComponent as StripeLogo } from "../static/images/stripe_purple.svg";

const ProductDetails = ({
  product,
  project,
  disabled = false,
  onPurchaseClick,
}) => {
  const { projectId } = useParams();
  const [planType, setPlanType] = React.useState("");
  const [subscriptionType, setSubscriptionType] = React.useState("");
  const handleChange = (event) => {
    setPlanType(event.target.value);
  };
  const handleChange2 = (event) => {
    setSubscriptionType(event.target.value);
  };
  // console.log(planType);
  return (
    <div className="flex flex-col fixed pl-6">
      <div className="bg-brand-primarySubtle rounded-md p-8 w-full max-w-md mb-3">
        {/* <div className="flex flex-row mb-3 items-center">
          <p className="text-overline2">Project Name:</p>
          <p className="text-body2 ml-2">{project?.projectName}</p>
        </div>
        <div className="flex flex-row mb-3 items-center">
          <p className="text-overline2">Project ID:</p>
          <p className="text-body2 ml-2">{project?.projectId}</p>
        </div> */}
        <div className="flex flex-row items-center">
          {/* <p className="text-overline2">Plan Type:</p> */}
          <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Plan Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={planType}
              onChange={handleChange}
              label="Plan Type"
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>Trial</MenuItem>
              <MenuItem value={20}>Basic</MenuItem>
              <MenuItem value={30}>Pro</MenuItem>
            </Select>
          </FormControl>
          <p className="text-body2 ml-2">{product?.name}</p>
        </div>
        <div className="flex flex-row items-center">
          {/* <p className="text-overline2">Subscription Type:</p> */}
          <FormControl variant="standard" sx={{ m: 1, minWidth: 200 }}>
            <InputLabel id="demo-simple-select-standard-label">
              Subscription Type
            </InputLabel>
            <Select
              labelId="demo-simple-select-standard-label"
              id="demo-simple-select-standard"
              value={subscriptionType}
              onChange={handleChange2}
              label="Subscription Type"
            >
              {/* <MenuItem value="">
                <em>None</em>
              </MenuItem> */}
              <MenuItem value={10}>Monthly</MenuItem>
              <MenuItem value={20}>Yearly</MenuItem>
              {/* <MenuItem value={30}>Pro</MenuItem> */}
            </Select>
          </FormControl>
        </div>

        <div className="border-t-1 border-b-1 border-neutral-gray5 py-3 flex flex-row justify-between items-center my-6">
          <p className="text-body1">Total Amount</p>
          <h4>${product?.price}</h4>
        </div>

        <PrimaryButton
          style={{ width: "100%" }}
          disabled={disabled}
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            if (!disabled) {
              onPurchaseClick(planType, subscriptionType);
            }
          }}
        >
          Subscribe Now
        </PrimaryButton>
      </div>

      <div className="flex flex-row items-center justify-end">
        <StripeLogo className="w-24" />

        <div
          className="mx-2 h-4 bg-neutral-gray4"
          style={{ width: "1px" }}
        ></div>

        <a
          href=" https://stripe.com/privacy"
          target="_blank"
          rel="noopener noreferrer"
          className="text-overline3 text-brand-secondary cursor-pointer hover:opacity-75"
        >
          Privacy
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;
