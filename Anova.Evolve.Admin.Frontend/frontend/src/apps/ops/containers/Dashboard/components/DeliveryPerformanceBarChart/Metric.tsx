import React from 'react';
import Box from '@material-ui/core/Box';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Checkbox from 'components/forms/styled-fields/Checkbox';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { metricTotalCountColor } from 'styles/colours';

const StyledCheckbox = styled(Checkbox)`
  padding: 3px;
`;

const StyledMetricText = styled(({ color: _color, ...props }) => (
  <Typography {...props} />
))`
  font-size: 15px;
  font-weight: 500;
  color: ${(props) => props.color || metricTotalCountColor};
`;

const StyledCount = styled(({ color: _color, ...props }) => (
  <Typography {...props} />
))`
  font-size: 32px;
  color: ${(props) => props.color || metricTotalCountColor};
`;

interface Props {
  color?: string;
  label: React.ReactNode;
  count?: React.ReactNode;
  isGraphed?: boolean;
  setGraphedState: (evt: React.ChangeEvent<HTMLInputElement>) => void;
}

const Metric = ({ color, count, label, isGraphed, setGraphedState }: Props) => {
  const { t } = useTranslation();
  return (
    <>
      <StyledMetricText color={color}>{label}</StyledMetricText>
      <StyledCount color={color}>{count}</StyledCount>
      {isGraphed !== undefined && (
        <Box textAlign="right" mr={2}>
          <FormControlLabel
            value="start"
            control={
              <StyledCheckbox
                size="small"
                checked={isGraphed}
                onChange={setGraphedState}
              />
            }
            label={t('ui.common.graph', 'Graph')}
            labelPlacement="start"
          />
        </Box>
      )}
    </>
  );
};

export default Metric;
