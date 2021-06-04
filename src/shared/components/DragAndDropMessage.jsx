import React from "react";

const DragAndDropMessage = ({
  isAttributeAllowed = false,
  isSchemaAllowed = false,
}) => {
  return (
    <p className='text-overline3'>
      <span>Drag and Drop </span>
      {isSchemaAllowed && <span className='text-brand-primary'>Schema </span>}
      {isAttributeAllowed && isSchemaAllowed && <span>and </span>}
      {isAttributeAllowed && (
        <span className='text-brand-secondary'>Attribute </span>
      )}
      here
    </p>
  );
};

export default DragAndDropMessage;
