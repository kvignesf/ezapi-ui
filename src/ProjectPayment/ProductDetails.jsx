import React from "react";
import { useParams } from "react-router-dom";
import { PrimaryButton } from "../shared/components/AppButton";

const ProductDetails = ({
  product,
  project,
  disabled = false,
  onPurchaseClick,
}) => {
  const { id: projectId } = useParams();

  return (
    <div className='bg-brand-primarySubtle rounded-md p-8 mx-auto w-full max-w-md'>
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
  );
};

export default ProductDetails;
