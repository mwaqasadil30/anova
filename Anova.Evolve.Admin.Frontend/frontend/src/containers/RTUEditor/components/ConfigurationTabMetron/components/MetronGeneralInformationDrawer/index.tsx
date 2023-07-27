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
import { buildRtuDevicePollFilterTextMapping } from 'utils/i18n/enum-to-text';
import { MetronGeneralInformationDTO, SiteInfoDto } from 'api/admin/api';
import { useQueryClient } from 'react-query';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import { APIQueryKey } from 'api/react-query/helpers';
import {
  EditorDropDown,
  EditorSiteDropDown,
  EditorText,
  EditorTextBox,
} from '../../../common/EditorFields';
import useSaveMetronGeneralInformation from '../../hooks/useSaveMetronGeneralInformation';
import useRtuPollScheduleGroups from '../../hooks/useRtuPollScheduleGroups';
import AddressBox from '../AddressBox';

type MetronGeneralInformationDrawerProps = {
  isOpen?: boolean;
  onClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
  deviceId: string;
  data?: MetronGeneralInformationDTO;
};

const MetronGeneralInformationDrawer = ({
  deviceId,
  isOpen,
  setIsOpen,
  onClose,
  data,
}: MetronGeneralInformationDrawerProps) => {
  const { siteId, siteNumber, customerName, customerAddress1, city, state } =
    data || {};

  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const dispatch = useDispatch();
  const rtuPollScheduleGroups = useRtuPollScheduleGroups();
  const RtuFilters = buildRtuDevicePollFilterTextMapping(t);

  const saveGeneralInformation = useSaveMetronGeneralInformation(deviceId);

  const initialSelectedSiteInfo: SiteInfoDto = SiteInfoDto.fromJS({
    id: siteId,
    siteNumber,
    customerName,
    address1: customerAddress1,
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
        <Formik<MetronGeneralInformationDTO>
          initialValues={data!}
          onSubmit={(values: MetronGeneralInformationDTO, actions) => {
            saveGeneralInformation.reset();
            saveGeneralInformation.mutate(values, {
              onSuccess: () => {
                setIsOpen(false);
                queryClient.invalidateQueries([
                  APIQueryKey.retrieveMetronGeneralInformation,
                  deviceId,
                ]);

                dispatch(enqueueSaveSuccessSnackbar(t));
              },
              onSettled: () => {
                actions.setSubmitting(false);
              },
            });
          }}
          enableReinitialize
        >
          {({ isSubmitting, submitForm }) => {
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
                          value={deviceId}
                        />
                        <EditorText
                          label={t('ui.common.hardware', 'Hardware')}
                          value="Metron 2"
                        />
                        <EditorTextBox
                          label={t(
                            'ui.common.rtudescription',
                            'RTU Description'
                          )}
                          name="description"
                        />
                        <EditorDropDown
                          label={t('ui.rtu.pollschedule', 'Poll Schedule')}
                          name="rtuPollScheduleGroupId"
                          textMapping={pollScheduleMemo}
                        />
                        <EditorDropDown
                          label={t('ui.common.pollfilter', 'Poll Filter')}
                          name="pollFilterId"
                          textMapping={RtuFilters}
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
                          value={customerName || '-'}
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
export default MetronGeneralInformationDrawer;
