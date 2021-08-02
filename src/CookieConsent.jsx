import React from "react";
import { useHistory } from "react-router-dom";
import CookieConsent from "react-cookie-consent";

import Colors from "./shared/colors";
import routes from "./shared/routes";
import { PrimaryButton } from "./shared/components/AppButton";

const CookieConsentPopup = () => {
  const history = useHistory();

  return (
    <CookieConsent
      location='bottom'
      buttonText='Okay'
      cookieName='ezapi-consent'
      style={{
        background: Colors.brand.primary,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        padding: "0.5rem",
      }}
      ButtonComponent={({ children, className, style, ...rest }) => {
        return (
          <button
            {...rest}
            className='text-mediumLabel p-2 px-3 rounded-md bg-white text-brand-primary'
          >
            {children}
          </button>
        );
      }}
      expires={150}
    >
      <p className='text-mediumLabel'>
        In order to provide you with the best online experience this website
        uses cookies. By using our website, you agree to our use of cookies.
        <span
          className='ml-2 underline cursor-pointer hover:opacity-90'
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            history.push(routes.privacy);
          }}
        >
          More Info
        </span>
      </p>
    </CookieConsent>
  );
};

export default CookieConsentPopup;
