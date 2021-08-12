import React from "react";
import { Link, useParams } from "react-router-dom";

import { PrimaryButton } from "../shared/components/AppButton";
import { ReactComponent as StripeLogo } from "../static/images/stripe_purple.svg";

const ProductDetails = ({
  product,
  project,
  disabled = false,
  onPurchaseClick,
}) => {
  const { projectId } = useParams();

  return (
    <div className='flex flex-col fixed pl-6'>
      <div className='bg-brand-primarySubtle rounded-md p-8 w-full max-w-md mb-3'>
        <div className='flex flex-row mb-3 items-center'>
          <p className='text-overline2'>Project Name:</p>
          <p className='text-body2 ml-2'>{project?.projectName}</p>
        </div>
        <div className='flex flex-row mb-3 items-center'>
          <p className='text-overline2'>Project ID:</p>
          <p className='text-body2 ml-2'>{project?.projectId}</p>
        </div>
        <div className='flex flex-row items-center'>
          <p className='text-overline2'>Plan:</p>
          <p className='text-body2 ml-2'>{product?.name}</p>
        </div>

        <div className='border-t-1 border-b-1 border-neutral-gray5 py-3 flex flex-row justify-between items-center my-6'>
          <p className='text-body1'>Total Amount</p>
          <h4>${product?.price}</h4>
        </div>

        <PrimaryButton
          style={{ width: "100%" }}
          disabled={disabled}
          onClick={(e) => {
            e?.preventDefault();
            e?.stopPropagation();

            if (!disabled) {
              onPurchaseClick();
            }
          }}
        >
          Purchase Now
        </PrimaryButton>
      </div>

      <div className='flex flex-row items-center justify-end'>
        <StripeLogo className='w-20' />

        <div
          className='mx-2 h-4 bg-neutral-gray4'
          style={{ width: "1px" }}
        ></div>

        <a
          href=' https://stripe.com/privacy'
          target='_blank'
          rel='noopener noreferrer'
          className='text-overline3 text-neutral-gray4 cursor-pointer hover:opacity-75'
        >
          Privacy
        </a>
      </div>
    </div>
  );
};

export default ProductDetails;
