import classNames from "classnames";
import React from "react";

export const Method = {
  get: "GET",
  post: "POST",
  patch: "PATCH",
  delete: "DELETE",
  put: "PUT",
  trace: "TRACE",
  head: "HEAD",
};

const ApiMethod = ({ type, ...rest }) => {
  return (
    <div
      className={classNames(
        "flex flex-row justify-center rounded-sm border-2 w-15 h-6 px-1",
        {
          "border-brand-green text-brand-green": type === Method.get,
          "border-accent-orange text-accent-orange": type === Method.post,
          "border-brand-secondary text-brand-secondary": type === Method.put,
          "border-accent-red text-accent-red": type === Method.delete,
        }
      )}
      {...rest}
    >
      <p className='text-capitalised'>{type.toUpperCase()}</p>
    </div>
  );
};

export default ApiMethod;
