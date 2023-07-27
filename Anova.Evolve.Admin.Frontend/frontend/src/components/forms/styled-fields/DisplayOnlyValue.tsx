import Typography from '@material-ui/core/Typography';
import React, { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import {
  getCopy,
  TranslationText,
} from '../../../containers/AssetGroupEditor/constants';

const StyledTypography = styled(Typography)`
  font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
  color: ${(props) => props.theme.palette.text.secondary};
  padding-right: 0.5em;
`;

const StyledLabel = styled(InputLabel)`
  && {
    color: ${(props) => props.theme.palette.text.primary};
    font-size: 14px;
    transform: none;
    font-weight: 500;
  }
`;

const StyledDisabledInput = styled(Input)`
  && {
    font-size: ${(props) => props.theme.custom.fontSize?.commonFontSize};
    width: 100%;
    padding: 8px 0;
    display: inline;
  }
  && input {
    margin-top: 12px;
  }
  &&:before {
    border: none;
  }
`;

interface DisplayOnlyValueProps {
  // NOTE: I am not sure how to remove the need for 'any' type here
  // When I remove any I get the following error:
  // `Type 'null' cannot be used as an index type.`
  textValue?: any | string | null;
}

export default function DisplayOnlyValue({ textValue }: DisplayOnlyValueProps) {
  const { t } = useTranslation();
  const copy: TranslationText = useMemo(() => getCopy(t), [t]);
  return (
    <StyledTypography display="inline">
      {copy[textValue] || textValue || copy.NONE}
    </StyledTypography>
  );
}

interface DisplayOnlyFieldProps {
  fieldName: string;
  fieldValue?: string | number | null;
}

export function DisplayOnlyField({
  fieldName,
  fieldValue,
}: DisplayOnlyFieldProps) {
  return (
    <>
      <StyledLabel htmlFor={fieldName}>{fieldName}</StyledLabel>
      <StyledDisabledInput id={fieldName} value={fieldValue} disabled />
    </>
  );
}
