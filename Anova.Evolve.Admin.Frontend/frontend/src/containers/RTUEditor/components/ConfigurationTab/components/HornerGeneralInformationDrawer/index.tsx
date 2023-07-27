import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import React, { useState } from 'react';
import CustomThemeProvider from 'components/CustomThemeProvider';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import EditorPageIntro from 'components/EditorPageIntro';
import { useTranslation } from 'react-i18next';
import { Formik, Form } from 'formik';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';
import EditorBox from 'components/EditorBox';
import { useDispatch } from 'react-redux';
import {
  buildHornerRtuCategoryTextMapping,
  buildHornerRtuModeTextMapping,
} from 'utils/i18n/enum-to-text';
import { HornerGeneralInformationDTO, SiteInfoDto } from 'api/admin/api';
import { useQueryClient } from 'react-query';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import * as Yup from 'yup';
import {
  EditorDropDown,
  EditorSiteDropDown,
  EditorText,
  EditorTextBox,
} from '../../../common/EditorFields';
import useSaveGeneralInformation from '../../hooks/useSaveGeneralInformation';
import useRtuPollScheduleGroups from '../../../../hooks/useRtuPollScheduleGroups';
import AddressBox from '../AddressBox';

type HornerGeneralInformationDrawerProps = {
  isOpen?: boolean;
  onClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
  deviceId: string;
  data?: HornerGeneralInformationDTO;
};

const HornerGeneralInformationDrawer = ({
  deviceId,
  isOpen,
  setIsOpen,
  onClose,
  data,
}: HornerGeneralInformationDrawerProps) => {
  const {
    siteId,
    siteNumber,
    customerName,
    customerAddress1,
    country,
    city,
    state,
  } = data || {};
  const { t } = useTranslation();
  const GeneralInformationSchema = Yup.object().shape({
    hornerRTUType: Yup.number()
      .min(
        0,
        t('validate.rtuhorner.typemustbeselected', 'Type must be selected.')
      )
      .required(t('validate.rtuhorner.typeisrequired', 'Type is required.')),
    hornerModelType: Yup.number()
      .min(
        0,
        t('validate.rtuhorner.modelmustbeselected', 'Model must be selected.')
      )
      .required(t('validate.rtuhorner.modelisrequired', 'Model is required.')),
    siteId: Yup.string().required(
      t('validate.rtuhorner.siteisrequired', 'Site is required.')
    ),
  });

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const rtuPollScheduleGroups = useRtuPollScheduleGroups();
  const HornerRtuModes = buildHornerRtuModeTextMapping(t);
  const HornerRtuCategorys = buildHornerRtuCategoryTextMapping(t);

  const saveGeneralInformation = useSaveGeneralInformation(deviceId);

  const initialSelectedSiteInfo: SiteInfoDto = SiteInfoDto.fromJS({
    id: siteId,
    siteNumber,
    customerName,
    address1: customerAddress1,
    country,
    city,
    state,
  });

  const [selectedSiteInfo, setSelectedSiteInfo] = useState<SiteInfoDto | null>(
    initialSelectedSiteInfo
  );

  const cancelCallback = () => {
    setIsOpen(false);
    setSelectedSiteInfo(initialSelectedSiteInfo);
    saveGeneralInformation.reset();
  };

  const saveAndExitCallback = () => {};

  const pollScheduleMemo: Record<string, string> = React.useMemo(() => {
    const newRecord: Record<string, string> = {};
    rtuPollScheduleGroups.data?.forEach((item) => {
      if (typeof item?.name === 'string') {
        newRecord[item.id!] = item?.name;
      }
    });
    return newRecord;
  }, [rtuPollScheduleGroups]);
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} variant="temporary">
      <DrawerContent>
        <Formik<HornerGeneralInformationDTO>
          initialValues={data!}
          onSubmit={(values: HornerGeneralInformationDTO, actions) => {
            saveGeneralInformation.reset();
            saveGeneralInformation.mutate(values, {
              onSuccess: () => {
                setIsOpen(false);
                queryClient.invalidateQueries([
                  'hornerRtu_RetrieveHornerGeneralInformation',
                  deviceId,
                ]);

                dispatch(enqueueSaveSuccessSnackbar(t));
              },
              onSettled: () => {
                actions.setSubmitting(false);
              },
            });
          }}
          validationSchema={GeneralInformationSchema}
          enableReinitialize
        >
          {({ isSubmitting, submitForm, errors, touched }) => {
            return (
              <Form>
                <CustomThemeProvider forceThemeType="dark">
                  <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                    <EditorPageIntro
                      showSaveOptions
                      title={t('ui.common.generalinfo', 'General Information')}
                      cancelCallback={cancelCallback}
                      submitForm={submitForm}
                      isSubmitting={isSubmitting}
                      submissionResult={saveGeneralInformation.data}
                      submissionError={saveGeneralInformation.error}
                      saveAndExitCallback={saveAndExitCallback}
                    />
                  </PageIntroWrapper>
                </CustomThemeProvider>
                <Box mt={3} />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={2} alignItems="center">
                        <EditorText
                          label={t('ui.common.deviceid', 'Device ID')}
                          value={data?.deviceId}
                        />
                        <EditorTextBox
                          label={t(
                            'ui.common.rtudescription',
                            'RTU Description'
                          )}
                          name="description"
                        />
                        <EditorDropDown
                          label={t('ui.common.type', 'Type')}
                          name="hornerRTUType"
                          textMapping={HornerRtuModes}
                          error={errors.hornerRTUType}
                          touched={touched.hornerRTUType}
                        />
                        <EditorDropDown
                          label={t('ui.hornerrtueditor.model', 'Model')}
                          name="hornerModelType"
                          textMapping={HornerRtuCategorys}
                          error={errors.hornerModelType}
                          touched={touched.hornerModelType}
                        />
                        <EditorDropDown
                          label={t('ui.rtu.pollschedule', 'Poll Schedule')}
                          name="rtuPollScheduleGroupId"
                          textMapping={pollScheduleMemo}
                        />

                        <EditorSiteDropDown
                          label={t('ui.apci.siteNumber', 'Site Number')}
                          placeholder={t(
                            'ui.common.enterSearchCriteria',
                            'Enter Search Criteria...'
                          )}
                          name="siteId"
                          selectedSiteId={selectedSiteInfo}
                          setSelectedSiteId={setSelectedSiteInfo}
                        />
                        <EditorText
                          label={t('report.common.customer', 'Customer')}
                          value={selectedSiteInfo?.customerName || '-'}
                        />
                        <EditorText
                          label={t('ui.common.address', 'Address')}
                          value={<AddressBox siteInfo={selectedSiteInfo} />}
                        />
                      </Grid>
                    </EditorBox>
                  </Grid>
                </Grid>
              </Form>
            );
          }}
        </Formik>
      </DrawerContent>
    </Drawer>
  );
};
export default HornerGeneralInformationDrawer;
