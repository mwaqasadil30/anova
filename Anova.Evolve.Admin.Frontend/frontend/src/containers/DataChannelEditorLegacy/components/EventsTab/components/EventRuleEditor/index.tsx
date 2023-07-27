import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import { EvolveRosterInfo } from 'api/admin/api';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import { DCEditorEventRule } from 'containers/DataChannelEditorLegacy/components/ObjectForm/types';
import { FormikHelpers, FormikProps } from 'formik';
import uniqBy from 'lodash/uniqBy';
import React from 'react';
import EventRuleForm from './components/EventRuleForm';
import type { Values } from './components/EventRuleForm/types';
import PageIntro from './components/PageIntro';

interface Props {
  editingObjectId?: string | null;
  headerNavButton?: React.ReactNode;
  isInlineForm?: boolean;
  eventRule: DCEditorEventRule;
  rosters?: EvolveRosterInfo[] | null;
  onPreviousEventSwitch: () => void;
  onNextEventSwitch: () => void;
  cancelCallback?: () => void;
  saveCallback?: (response: any) => void;
  saveAndExitCallback: (rosters: EvolveRosterInfo[]) => void;
}

const EventRuleEditor = ({
  editingObjectId,
  headerNavButton,
  isInlineForm,
  eventRule,
  rosters,
  onPreviousEventSwitch,
  onNextEventSwitch,
  cancelCallback,
  saveCallback,
  saveAndExitCallback,
}: Props) => {
  const [formInstance, setFormInstance] = React.useState<FormikProps<Values>>();

  const isCreating = !editingObjectId;

  const handleSubmit = (values: Values, formikBag: FormikHelpers<Values>) => {
    const cleanedRosters = values.rosters
      ?.map((newRoster) =>
        rosters?.find(
          (existingRoster) => newRoster.rosterId === existingRoster.rosterId
        )
      )
      .filter(Boolean) as EvolveRosterInfo[];

    const uniqueRosters = uniqBy(cleanedRosters, 'rosterId');

    formikBag.setSubmitting(false);
    saveAndExitCallback(uniqueRosters);
  };

  const handleFormChange = (formik: FormikProps<Values>) => {
    setFormInstance(formik);
  };

  return (
    <>
      <PageIntroWrapper
        sticky
        isWithinDrawer={isInlineForm}
        {...(isInlineForm && { topOffset: 0 })}
        verticalPaddingFactor={0}
      >
        <PageIntro
          onPreviousEventSwitch={onPreviousEventSwitch}
          onNextEventSwitch={onNextEventSwitch}
          isCreating={isCreating}
          submitForm={formInstance?.submitForm}
          headerNavButton={headerNavButton}
          cancelCallback={cancelCallback}
          saveCallback={saveCallback}
          saveAndExitCallback={saveAndExitCallback}
          isInlineForm={isInlineForm}
        />
      </PageIntroWrapper>

      <Box mt={3}>
        <Grid container spacing={2} direction="column" justify="space-between">
          <Grid item>
            <EventRuleForm
              eventRule={eventRule}
              rosters={rosters}
              onSubmit={handleSubmit}
              handleFormChange={handleFormChange}
            />
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default EventRuleEditor;
