import React, { Fragment, ReactNode } from 'react';

export const renderHelperText = (helperText: string[] | string | ReactNode) => {
  if (Array.isArray(helperText)) {
    // @ts-ignore
    return helperText.map((text, index) => {
      const isLast = index === helperText.length - 1;
      return (
        <Fragment key={index}>
          {text}
          {!isLast && <br />}
        </Fragment>
      );
    });
  }

  return helperText;
};
