import classNames from "classnames";
import React from "react";

export const Method = {
  get: "get",
  post: "post",
  patch: "patch",
  delete: "delete",
  put: "put",
};

const ApiMethod = ({ type, ...rest }) => {
  let name = "-";

  switch (type) {
    case Method.get:
      name = "get";
      break;
    case Method.post:
      name = "post";
      break;
    case Method.patch:
      name = "patch";
      break;
    case Method.delete:
      name = "delete";
      break;
    case Method.put:
      name = "put";
      break;

    default:
      name = "-";
      break;
  }

  return (
    <div
      className={classNames(
        "flex flex-row justify-center rounded-sm border-2 w-16",
        {
          "border-brand-green text-brand-green": type === Method.get,
          "border-accent-orange text-accent-orange": type === Method.post,
          "border-brand-secondary text-brand-secondary": type === Method.put,
          "border-accent-red text-accent-red": type === Method.delete,
        }
      )}
      {...rest}
    >
      <p className='text-capitalised'>{name.toUpperCase()}</p>
    </div>
  );
};

export default ApiMethod;
