import React from 'react';
import { Button } from '@material-ui/core';
import { styled, css } from 'twin.macro';

import Colors from '../colors';
import classNames from 'classnames';

export const PrimaryButton = ({ disabled, classes, children, ...rest }) => {
  let classnames = classNames(`rounded-md px-6 py-2 w-min ${classes}`, {
    'cursor-pointer bg-brand-secondary hover:opacity-80': !disabled,
    'bg-neutral-gray4': disabled,
  });
  return (
    <div className={classnames} {...rest}>
      <p className='text-mediumLabel text-white '>{children}</p>
    </div>
  );
};

export const TextButton = ({ disabled, classes, children, ...rest }) => {
  let classnames = classNames(`px-6 py-2 w-min ${classes}`, {
    'cursor-pointer hover:opacity-70': !disabled,
    'text-neutral-gray4': disabled,
  });

  return (
    <div className={classnames} {...rest}>
      <p className='text-mediumLabel'>{children}</p>
    </div>
  );
};
