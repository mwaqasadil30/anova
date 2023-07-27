import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import React, { Fragment } from 'react';
import UnitOldToNewValueRow from './UnitOldToNewValueRow';
import { EventRuleConversionValues } from '../../types';

interface Props {
  eventRuleValues: EventRuleConversionValues[];
  fromUnitText: string;
  toUnitText: string;
  decimalPlaces: number;
}

const UnitConversionEventRuleData = ({
  eventRuleValues,
  fromUnitText,
  toUnitText,
  decimalPlaces,
}: Props) => {
  return (
    <Grid container spacing={1} alignItems="center">
      {eventRuleValues.map((valueDetails, index, array) => {
        const isLast = index === array.length - 1;
        return (
          <Fragment key={index}>
            <UnitOldToNewValueRow
              label={valueDetails.label}
              oldValue={valueDetails.oldValue!}
              oldUnit={fromUnitText}
              newValue={valueDetails.newValue!}
              newUnit={toUnitText}
              decimalPlaces={decimalPlaces}
            />
            {!isLast && (
              <Grid item xs={12}>
                <Divider />
              </Grid>
            )}
          </Fragment>
        );
      })}
    </Grid>
  );
};

export default UnitConversionEventRuleData;
