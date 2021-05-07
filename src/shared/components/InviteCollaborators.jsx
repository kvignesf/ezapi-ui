import React from "react";
import ChipInput from "material-ui-chip-input";
import _ from "lodash";

import { isEmailValid } from "../utils";
import Colors from "../colors";

const InviteCollaborators = ({ collaborators, handleChange, ...rest }) => {
  return (
    <div className='' {...rest}>
      <p className='text-mediumLabel mb-2'>Invite users to collaborate</p>

      <ChipInput
        defaultValue={collaborators}
        dataSource={collaborators}
        onChange={(chips) => handleChange(chips)}
        onBeforeAdd={(chip) => {
          return isEmailValid(chip);
        }}
        blurBehavior='add'
        allowDuplicates={false}
        fullWidth
        disableUnderline
        color='primary'
        style={{
          border: `1px solid ${Colors.neutral.gray4}`,
          borderRadius: "4px",
          padding: "0.25rem 0.75rem",
        }}
      />
    </div>
  );
};

export default InviteCollaborators;
