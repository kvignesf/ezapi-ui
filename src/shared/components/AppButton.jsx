import React from 'react';
import { Button } from '@material-ui/core';
import { styled, css } from 'twin.macro';

import Colors from '../colors';
import classNames from 'classnames';

export const PrimaryButton = ({
  disabled,
  classes,
  children,
  style,
  ...rest
}) => {
  let classnames = classNames(
    `rounded-md px-6 py-2 w-min flex items-center ${classes}`,
    {
      'cursor-pointer bg-brand-secondary hover:opacity-80': !disabled,
      'bg-neutral-gray4': disabled,
    }
  );

  return (
    <button
      className={classnames}
      style={{ ...style, border: 'none', outline: 'none' }}
      {...rest}
    >
      <p className='text-mediumLabel text-white whitespace-nowrap'>
        {children}
      </p>
    </button>
  );
};

export const TextButton = ({ disabled, classes, children, style, ...rest }) => {
  let classnames = classNames(`px-6 py-2 w-min flex items-center ${classes}`, {
    'cursor-pointer hover:opacity-70': !disabled,
    'text-neutral-gray4': disabled,
  });

  return (
    <button
      className={classnames}
      style={{ ...style, border: 'none', outline: 'none' }}
      {...rest}
    >
      <p className='text-mediumLabel whitespace-nowrap'>{children}</p>
    </button>
  );
};
