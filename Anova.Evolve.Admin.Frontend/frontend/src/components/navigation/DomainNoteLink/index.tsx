import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import Typography from '@material-ui/core/Typography';
import {
  StyledNotesIcon,
  StyledNavbarCaretButton,
} from 'components/navigation/common';
import styled from 'styled-components';

const StyledText = styled(Typography)`
  font-size: 14px;
  font-weight: 500;
`;

const NavbarButton = styled(StyledNavbarCaretButton)`
  max-width: 350px;
  && {
    padding-left: 12px;
    padding-right: 12px;
  }
`;

interface Props {
  url: string;
}

const DomainNoteLink = ({ url }: Props) => {
  const { t } = useTranslation();
  return (
    <NavbarButton
      id="domain-notes-link"
      variant="text"
      color="inherit"
      startIcon={<StyledNotesIcon />}
      component={Link}
      to={url}
      // @ts-ignore
      target="_blank"
    >
      <StyledText align="center">
        {t('ui.common.domainNote', 'Note')}
      </StyledText>
    </NavbarButton>
  );
};

export default DomainNoteLink;
