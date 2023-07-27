import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import CancelButton from 'components/buttons/CancelButton';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';

// enum SaveType {
//   Save = 'save',
//   SaveAndExit = 'save-and-exit',
// }

interface Props {
  closeEventDrawer: () => void;
  //   submitForm?: any;
  //   refetchEditData?: any;
  //   isCreating: boolean;
  //   isSubmitting: boolean;
  //   submissionResult: any;
  //   headerNavButton?: React.ReactNode;
  //   isInlineForm?: boolean;
  //   saveCallback?: (response: any) => void;
  //   saveAndExitCallback?: (response: any) => void;
}

// const PageIntro = ({}:
//   isCreating,
//   isSubmitting,
//   refetchEditData,
//   submitForm,
//   submissionResult,
//   headerNavButton,
//   isInlineForm,
//   saveCallback,
//   saveAndExitCallback,
//   Props) => {

const PageIntro = ({ closeEventDrawer }: Props) => {
  const { t } = useTranslation();
  // const history = useHistory();

  // const [saveType, setSaveType] = useState<SaveType>();

  const cancel = () => {
    // refetchEditData();
    closeEventDrawer();
  };

  // const submit = () => {
  //   submitForm?.().then(() => {
  //     setSaveType(SaveType.Save);
  //   });
  // };

  // const submitAndGoToListPage = () => {
  //   submitForm?.().then(() => {
  //     setSaveType(SaveType.SaveAndExit);
  //   });
  // };

  // useEffect(() => {
  //   if (!submissionResult?.response || isSubmitting) {
  //     return;
  //   }

  //   if (saveType === SaveType.Save) {
  //     saveCallback?.(submissionResult.response);
  //   } else if (saveType === SaveType.SaveAndExit) {
  //     saveAndExitCallback?.(submissionResult.response);
  //   }
  //   /* eslint-disable-next-line react-hooks/exhaustive-deps */
  // }, [submissionResult, saveType, history, isSubmitting]);

  return (
    <Box>
      <Grid container spacing={2} alignItems="center" justify="space-between">
        <Grid item>
          <Grid container spacing={1} alignItems="center">
            {/* {headerNavButton && <Grid item>{headerNavButton}</Grid>} */}
            <Grid item>
              <PageHeader dense>{t('ui.common.events', 'Events')}</PageHeader>
            </Grid>
          </Grid>
        </Grid>

        <Grid item>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              {/* make this close the drawer as well */}
              <CancelButton onClick={cancel} fullWidth />
            </Grid>
            {/* <Grid item>
              <SaveAndExitButton
                variant="contained"
                fullWidth
                // onClick={submitAndGoToListPage}
              />
            </Grid> */}
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PageIntro;
