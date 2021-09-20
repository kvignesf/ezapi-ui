import React from "react";

const EnterKeyCaptureInput = () => {
  return (
    <input
      onChange={(event) => event.preventDefault()}
      type='submit'
      form='{}'
      style={{ display: "none" }}
    />
  );
};

export default EnterKeyCaptureInput;
