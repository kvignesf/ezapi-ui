import React from "react";
import { ErrorMessage, Field, Form, Formik, useFormik } from "formik";
import { MenuItem, Select, TextField } from "@material-ui/core";
import countryList from "react-select-country-list";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { CountryDropdown, RegionDropdown } from "react-country-region-selector";

import billingDetailsSchema from "./ProjectPayment/billingDetailsSchema";
import { PrimaryButton } from "./shared/components/AppButton";
import classNames from "classnames";
import EzapiFooter from "./shared/components/EzapiFooter";
import BillingForm from "./BillingForm.jsx";

// const Header = ({
//   projectDetails,
//   logoutMutation: { isLoading: isLoggingOut, mutate: logout },
// }) => {
//   const history = useHistory();
//   const firstName = getFirstName();
//   const lastName = getLastName();
//   const [profileMenuAnchorEl, setProfilemenuAnchorEl] = useState(false);

//   const navigateBack = () => {
//     history.goBack();
//   };

//   const handleProfileMenuClick = (event) => {
//     setProfilemenuAnchorEl(event?.currentTarget);
//   };

//   return (
//     <header className="fixed top-0 w-full z-999 px-2 border-b-2 flex flex-row justify-between items-center bg-white">
//       <div className="flex flex-row py-2 items-center">
//         <AppIcon
//           style={{ marginRight: "1rem" }}
//           onClick={(event) => {
//             event?.preventDefault();
//             event?.stopPropagation();

//             navigateBack();
//           }}
//         >
//           <ArrowBackIcon />
//         </AppIcon>

//         <p className="text-overline1 mr-3">{projectDetails?.projectName}</p>

//         <EzapiLogo />
//       </div>

//       <div className="flex flex-row py-2">
//         <div>
//           <InitialsAvatar
//             firstName={firstName}
//             lastName={lastName}
//             className="cursor-pointer"
//             onClick={(e) => {
//               e?.preventDefault();
//               e?.stopPropagation();

//               handleProfileMenuClick(e);
//             }}
//           />

//           <ProfileMenu
//             onLogout={logout}
//             profileMenuAnchorEl={profileMenuAnchorEl}
//             setProfilemenuAnchorEl={setProfilemenuAnchorEl}
//           />
//         </div>
//       </div>
//     </header>
//   );
// };

const BillingPage = ({ disabled = false }) => {
  return (
    <div>
      {/* <Header projectDetails={projectDetails} logoutMutation={logoutMutation} /> */}
      <div className="w-full flex flex-row p-12 h-full mt-14">
        <div className="flex-1 mr-6 px-6">
          <BillingForm />

          {/* <CardDetailsForm
              formRef={cardDetailsRef}
              disabled={isInitiatingPayment || isConfirmingPayment}
            /> */}
        </div>
      </div>

      <EzapiFooter />
    </div>
  );
};

export default BillingPage;
