import Drawer from 'components/drawers/Drawer';
import DrawerContent from 'components/drawers/DrawerContent';
import React from 'react';
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
  buildHornerRtuTransportTypeEnumTextMapping,
  buildHornerRtuCarrierTypeEnumTextMapping,
} from 'utils/i18n/enum-to-text';
import { HornerRtuCommunicationConfigDTO } from 'api/admin/api';
import { useQueryClient } from 'react-query';
import { enqueueSaveSuccessSnackbar } from 'redux-app/modules/app/actions';
import * as Yup from 'yup';
import PageSubHeader from 'components/PageSubHeader';
import { Column, useTable } from 'react-table';
import { CommunicationTableType } from 'containers/RTUEditor/types';
import GenericDataTable from 'components/GenericDataTable';
import { EditorDropDown, EditorTextBox } from '../../../common/EditorFields';
import useSaveCommunicationConfigs from '../../hooks/useSaveCommunicationConfigs';

type CommunicationDrawerProps = {
  isOpen?: boolean;
  onClose: () => void;
  setIsOpen: (isOpen: boolean) => void;
  deviceId: string;
  data?: HornerRtuCommunicationConfigDTO;
};

const CommunicationDrawer = ({
  deviceId,
  isOpen,
  setIsOpen,
  onClose,
  data,
}: CommunicationDrawerProps) => {
  const { t } = useTranslation();

  const yupIp = Yup.string().matches(/(^(\d{1,3}\.){3}(\d{1,3})$)/, {
    message: t('ui.common.invalidipaddress', 'Invalid IP Address'),
    excludeEmptyString: true,
  });

  const CommunicationSchema = Yup.object().shape({
    localHostAddress: yupIp,
    ipNetworkAddress: yupIp,
    listenPort: Yup.number(),
  });
  const { localHostAddress, localHostPort, remoteHostAddress, remoteHostPort } =
    data || {};

  const queryClient = useQueryClient();

  const dispatch = useDispatch();

  const transportTypes = buildHornerRtuTransportTypeEnumTextMapping(t);

  const carrierTypes = buildHornerRtuCarrierTypeEnumTextMapping(t);

  const saveCommunicationConfigs = useSaveCommunicationConfigs(deviceId);

  const cancelCallback = () => {
    setIsOpen(false);
  };

  const saveAndExitCallback = () => {};

  const columns = React.useMemo<Column<CommunicationTableType>[]>(
    () => [
      {
        Header: t('ui.common.parameter', 'Parameter') as string,
        accessor: 'parameter',
      },
      {
        Header: t('ui.rtu.local', 'Local') as string,
        accessor: 'local',
        Cell: (d) => {
          if (d.row.index === 0)
            return (
              <EditorTextBox
                label={null}
                name="localHostAddress"
                value={d.value || '-'}
              />
            );
          return d.value;
        },
      },
      {
        Header: t('ui.rtu.remote', 'Remote') as string,
        accessor: 'remote',
      },
    ],
    []
  );

  const tableData = React.useMemo(
    () => [
      {
        parameter: t('ui.rtuhorner.hostaddress', 'Host Address'),
        local: localHostAddress,
        remote: remoteHostAddress,
      },
      {
        parameter: t('ui.rtu.hostport', 'Host Port'),
        local: localHostPort?.toString(),
        remote: remoteHostPort?.toString(),
      },
    ],
    []
  );

  const tableInstance = useTable({ columns, data: tableData });
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose} variant="temporary">
      <DrawerContent>
        <Formik<HornerRtuCommunicationConfigDTO>
          initialValues={data!}
          onSubmit={(values: HornerRtuCommunicationConfigDTO, actions) => {
            saveCommunicationConfigs.reset();
            saveCommunicationConfigs.mutate(values, {
              onSuccess: () => {
                queryClient.invalidateQueries([
                  'hornerRtu_RetrieveCommunicationConfigs',
                  deviceId,
                ]);
                setIsOpen(false);

                dispatch(enqueueSaveSuccessSnackbar(t));
              },
              onSettled: () => {
                actions.setSubmitting(false);
              },
            });
          }}
          validationSchema={CommunicationSchema}
          enableReinitialize
        >
          {({ isSubmitting, submitForm, errors, touched }) => {
            return (
              <Form>
                <CustomThemeProvider forceThemeType="dark">
                  <PageIntroWrapper sticky isWithinDrawer topOffset={0}>
                    <EditorPageIntro
                      showSaveOptions
                      title={t('ui.common.communication', 'Communication')}
                      cancelCallback={cancelCallback}
                      submitForm={submitForm}
                      isSubmitting={isSubmitting}
                      submissionResult={saveCommunicationConfigs.data}
                      submissionError={saveCommunicationConfigs.error}
                      saveAndExitCallback={saveAndExitCallback}
                    />
                  </PageIntroWrapper>
                </CustomThemeProvider>
                <Box mt={3} />
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={2} alignItems="center">
                        <EditorDropDown
                          label={t('ui.rtu.transport', 'Transport')}
                          name="transportType"
                          textMapping={transportTypes}
                          error={errors.transportType}
                          touched={touched.transportType}
                        />
                      </Grid>
                    </EditorBox>
                  </Grid>
                  <Grid item xs={12}>
                    <PageSubHeader dense>
                      {t(
                        'ui.rtu.carrierconfiguration',
                        'Carrier Configuration'
                      )}
                    </PageSubHeader>
                  </Grid>
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={2} alignItems="center">
                        <EditorDropDown
                          label={t('ui.common.carrier', 'Carrier')}
                          name="carrierType"
                          textMapping={carrierTypes}
                          error={errors.carrierType}
                          touched={touched.carrierType}
                        />
                        <Grid item xs={12}>
                          <GenericDataTable<CommunicationTableType>
                            tableInstance={tableInstance}
                            disableActions={false}
                            tableAriaLabelText="Communication table"
                            isRecordDisabled={() => false}
                            columnIdToAriaLabel={(id) => id}
                            getColumnWidth={() => 100}
                            handleRowClick={() => {}}
                            minWidth={500}
                          />
                        </Grid>
                      </Grid>
                    </EditorBox>
                  </Grid>
                  <Grid item xs={12}>
                    <EditorBox>
                      <Grid container spacing={2} alignItems="center">
                        <EditorTextBox
                          label={t(
                            'ui.rtu.ipnetworkaddress',
                            'IP Network Address'
                          )}
                          name="ipNetworkAddress"
                        />
                        <EditorTextBox
                          label={t('ui.rtu.listenport', 'Listen Port')}
                          name="listenPort"
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
export default CommunicationDrawer;
