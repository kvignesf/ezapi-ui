import React, { useState } from "react";
import ChipInput from "material-ui-chip-input";
import _ from "lodash";

import { isEmailValid } from "../utils";
import Colors from "../colors";
import { getEmailId } from "../storage";

const InviteCollaborators = ({
  collaborators,
  addProjectMutation,
  handleChange,
  ...rest
}) => {
  const [error, setError] = useState(null);
  // const loggedInEmail = getEmailId();

  return (
    <div className='' {...rest}>
      <p className='text-mediumLabel mb-2'>Invite users to collaborate</p>

      <ChipInput
        defaultValue={collaborators}
        dataSource={collaborators}
        onChange={(emails) => {
          const trimmedEmails = emails?.map((email) => email?.trim());

          handleChange(trimmedEmails);
        }}
        onBeforeAdd={(email) => {
          if (!email || _.isEmpty(email)) {
            setError(null);
            return false;
          }

          // else if (email === loggedInEmail) {
          //   setError(null);
          //   return false;
          // }

          const result = isEmailValid(email?.trim());

          if (result) {
            setError(null);
            return result;
          } else {
            setError("Seems like email entered is invalid");
          }
        }}
        blurBehavior='add'
        allowDuplicates={false}
        fullWidth
        disableUnderline
        color='primary'
        newChipKeys={[",", " "]}
        style={{
          border: `1px solid ${Colors.neutral.gray4}`,
          borderRadius: "4px",
          padding: "0.25rem 0.75rem",
        }}
        // disabled={addProjectMutation?.isSuccess}
      />

      {error && <p className='text-overline2 text-accent-red mt-3'>{error}</p>}
    </div>
  );
};

export default InviteCollaborators;
