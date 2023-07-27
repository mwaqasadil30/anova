/* eslint-disable indent */
import { AccordionSummaryProps } from '@material-ui/core/AccordionSummary';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { StyledExpandIcon } from 'apps/ops/components/icons/styles';
import ComponentTitle from 'components/typography/ComponentTitle';
import React from 'react';
import styled from 'styled-components';
import { StyledAccordionSummary } from '../../../../styles';

const AccordionSummary = styled(StyledAccordionSummary)`
  padding: 0;
  padding-left: 8px;
  background-color: ${(props) =>
    props.theme.palette.type === 'light' && '#EBEBEB'};

  && .MuiTypography-root {
    color: ${(props) =>
      props.theme.palette.type === 'light' && props.theme.palette.text.primary};
  }
`;

interface Props extends AccordionSummaryProps {
  rightContent?: React.ReactNode;
  showExpandIcon?: boolean;
}

const CustomAccordionSummary = ({
  title,
  showExpandIcon,
  rightContent,
  ...props
}: Props) => {
  return (
    <AccordionSummary {...props}>
      <Grid container alignItems="center" justify="space-between">
        <Grid item>
          <Box p={1}>
            <Grid
              container
              alignItems="center"
              spacing={2}
              justify="space-between"
            >
              {showExpandIcon && (
                <Grid item style={{ padding: '4px' }}>
                  <StyledExpandIcon
                    style={{
                      transform: 'rotate(90deg)',
                    }}
                  />
                </Grid>
              )}
              <Grid item style={{ padding: '4px' }}>
                <ComponentTitle>{title}</ComponentTitle>
              </Grid>
            </Grid>
          </Box>
        </Grid>

        {rightContent && <Grid item>{rightContent}</Grid>}
      </Grid>
    </AccordionSummary>
  );
};

export default CustomAccordionSummary;
