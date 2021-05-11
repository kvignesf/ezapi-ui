import React, { useState } from "react";
import ChipInput from "material-ui-chip-input";
import _ from "lodash";

import { isEmailValid } from "../utils";
import Colors from "../colors";

const InviteCollaborators = ({ collaborators, handleChange, ...rest }) => {
  const [error, setError] = useState(null);

  return (
    <div className='' {...rest}>
      <p className='text-mediumLabel mb-2'>Invite users to collaborate</p>

      <ChipInput
        defaultValue={collaborators}
        dataSource={collaborators}
        onChange={(chips) => handleChange(chips)}
        onBeforeAdd={(chip) => {
          if (!chip || _.isEmpty(chip)) {
            setError(null);
            return false;
          }

          const result = isEmailValid(chip);

          if (result) {
            setError(null);
            return result;
          } else {
            setError("Enter valid email");
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
      />

      {error && <p className='text-overline2 text-accent-red mt-3'>{error}</p>}
    </div>
  );
};

export default InviteCollaborators;
