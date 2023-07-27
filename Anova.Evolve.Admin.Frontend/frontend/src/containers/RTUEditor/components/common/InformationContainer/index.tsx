import Grid from '@material-ui/core/Grid';
import React from 'react';
import ArrowForwardIosIcon from '@material-ui/icons/ArrowForwardIos';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { StaticAccordion } from '../../../../../components/StaticAccordion';
import {
  BoxTitle,
  StyledAccordionSummary,
  StyledEditButton,
  StyledEditIcon,
  AccordionDetails,
  AccordionDetailsNoPaddings,
} from './styles';

type InformationContainerProps = {
  title?: string | null;
  canUpdate?: boolean;
  content: React.ReactNode;
  onClick?: () => void;
  iconText?: string;
  url?: string;
  noPaddings?: boolean;
};
const IconText = styled.span`
  font-size: 0.875rem;
  color: #767676;
  margin-right: 0.45rem;
`;
type LinkContainerProps = React.PropsWithChildren<{ url?: string }>;
const LinkContainer = ({ url, children }: LinkContainerProps) => {
  if (url && url.trim())
    return (
      <Link to={url} style={{ textDecoration: 'none' }}>
        {children}
      </Link>
    );
  return <>{children}</>;
};
const InformationContainer = ({
  title,
  canUpdate,
  content,
  onClick,
  iconText,
  url,
  noPaddings,
}: InformationContainerProps) => {
  const containerIcon = iconText ? (
    <LinkContainer url={url}>
      <IconText>{iconText}</IconText>{' '}
      <ArrowForwardIosIcon
        htmlColor="#FFB800"
        style={{ fontSize: '0.9rem', fontWeight: 'bold' }}
      />
    </LinkContainer>
  ) : (
    <StyledEditIcon />
  );

  return (
    <Grid item xs={12}>
      <StaticAccordion>
        <StyledAccordionSummary>
          <Grid
            container
            alignItems="center"
            spacing={0}
            justify="space-between"
          >
            <Grid item>
              <BoxTitle>{title}</BoxTitle>
            </Grid>

            {canUpdate && (
              <Grid item>
                <StyledEditButton onClick={onClick}>
                  {containerIcon}
                </StyledEditButton>
              </Grid>
            )}
          </Grid>
        </StyledAccordionSummary>
        {noPaddings ? (
          <AccordionDetailsNoPaddings>{content}</AccordionDetailsNoPaddings>
        ) : (
          <AccordionDetails>{content}</AccordionDetails>
        )}
      </StaticAccordion>
    </Grid>
  );
};
export default InformationContainer;
