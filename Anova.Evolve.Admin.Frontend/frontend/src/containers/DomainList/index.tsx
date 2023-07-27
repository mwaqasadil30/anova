/* eslint-disable indent */
import Box from '@material-ui/core/Box';
import Fade from '@material-ui/core/Fade';
import {
  DomainInfoRecord,
  EvolveRetrieveDomainInfoRecordsByParentDomainIdRequest,
  EvolveRetrieveDomainInfoRecordsByParentDomainIdResponse,
  FtpFileFormat,
} from 'api/admin/api';
import routes, { DomainId } from 'apps/admin/routes';
import BoxWithOverflowHidden from 'components/BoxWithOverflowHidden';
import TransitionErrorMessage from 'components/common/animations/TransitionErrorMessage';
import TransitionLoadingSpinner from 'components/common/animations/TransitionLoadingSpinner';
import DarkFadeOverlay from 'components/DarkFadeOverlay';
import GenericDataTable from 'components/GenericDataTable';
import GenericPageWrapper from 'components/GenericPageWrapper';
import SearchCloudIcon from 'components/icons/SearchCloudIcon';
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import MessageBlock from 'components/MessageBlock';
import LargeBoldDarkText from 'components/typography/LargeBoldDarkText';
import isBoolean from 'lodash/isBoolean';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { generatePath, useHistory } from 'react-router-dom';
import { Row, useGlobalFilter, useTable } from 'react-table';
import {
  selectTopOffset,
  selectUserHomeDomain,
} from 'redux-app/modules/app/selectors';
import { formatBooleanToYesOrNoString } from 'utils/format/boolean';
import ActionCell from './components/ActionCell';
import NameCell from './components/NameCell';
import PageIntro from './components/PageIntro';
import TableActionsAndPagination from './components/TableActionsAndPagination';
import TableOptions from './components/TableOptions';
import {
  columnIdToAriaLabel,
  DomainListColumnId,
  getColumnWidth,
  isRecordDisabled,
} from './helpers';
import { useRetrieveDomainInfoRecords } from './hooks/useRetrieveDomainInfoRecords';

const defaultData: DomainInfoRecord[] = [];

const DomainList = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const topOffset = useSelector(selectTopOffset);

  const BooleanCell = useMemo(
    () => ({ value }: { value: boolean | null | undefined }) => {
      if (isBoolean(value)) {
        return formatBooleanToYesOrNoString(value, t);
      }
      return value;
    },
    [t]
  );

  const [
    apiResponse,
    setApiResponse,
  ] = useState<EvolveRetrieveDomainInfoRecordsByParentDomainIdResponse | null>(
    null
  );
  const records: DomainInfoRecord[] =
    apiResponse?.retrieveDomainInfoRecordsByParentDomainIdResult || defaultData;
  const data = useMemo(() => [...records], [records]);

  const parentDomainId = useSelector(selectUserHomeDomain)?.domainId || '';

  const retrieveDomainInfoRecordsApi = useRetrieveDomainInfoRecords(
    {
      parentDomainId,
    } as EvolveRetrieveDomainInfoRecordsByParentDomainIdRequest,
    {
      // We use keepPreviousData so the <TransitionLoadingSpinner /> doesnt
      // appear when a user selects a new page that they haven't accessed before.
      // see: (rows.length === 0 && isFetching) in the <TransitionLoadingSpinner />
      keepPreviousData: true,
      onSuccess: (apiData) => {
        setApiResponse(apiData);
      },
    }
  );

  const columns = React.useMemo(
    () => [
      {
        id: DomainListColumnId.Name,
        Header: t('ui.common.name', 'Name'),
        accessor: 'name',
        Cell: NameCell,
      },
      {
        id: DomainListColumnId.ParentDomainName,
        Header: t('report.domainlist.parentdomain', 'Parent Domain'),
        accessor: 'parentDomainName',
      },
      {
        id: DomainListColumnId.ScreenTitle,
        Header: t('report.domainlist.screentitle', 'Screen Title'),
        accessor: 'screenTitle',
      },
      {
        id: DomainListColumnId.DisableUserLogins,
        Header: t('report.domainlist.loginsdisabled', 'Logins Disabled'),
        accessor: 'disableUserLogins',
        Cell: BooleanCell,
      },
      {
        id: DomainListColumnId.FtpFileFormat,
        Header: t('report.domainlist.ftpfileformat', 'FTP File Format'),
        accessor: 'ftpFileFormat',
        Cell: ({ value }: { value: FtpFileFormat }) => FtpFileFormat[value],
      },
      {
        id: DomainListColumnId.IsDomainDeleted,
        Header: t('report.domainlist.domaindisabled', 'Domain Disabled'),
        accessor: 'isDomainDeleted',
        Cell: BooleanCell,
      },
      {
        id: DomainListColumnId.IsFtpProcessingEnabled,
        Header: t('report.domainlist.ftpprocessingenabled', 'FTP Processing'),
        accessor: 'isFtpProcessingEnabled',
        Cell: BooleanCell,
      },
      {
        id: DomainListColumnId.Action,
        Header: '',
        accessor: '_',
        Cell: ActionCell,
      },
    ],
    [t]
  );

  const tableInstance = useTable<DomainInfoRecord>(
    {
      // @ts-ignore
      columns,
      // @ts-ignore
      data,
    },
    useGlobalFilter
  );

  const handleRowClick = (row: Row<DomainInfoRecord>) => {
    history.push(
      generatePath(routes.domainManager.edit, {
        [DomainId]: row.original.domainId,
      })
    );
  };

  useEffect(() => {
    retrieveDomainInfoRecordsApi.refetch();
    /* eslint-disable-next-line react-hooks/exhaustive-deps */
  }, [retrieveDomainInfoRecordsApi.refetch]);

  const { isLoading, isError, isFetching } = retrieveDomainInfoRecordsApi;

  return (
    <GenericPageWrapper $topOffset={topOffset} $isFullPageHeight>
      <PageIntroWrapper>
        <PageIntro refetchRecords={retrieveDomainInfoRecordsApi.refetch} />
      </PageIntroWrapper>

      <Box pb={1}>
        <TableOptions setGlobalFilter={tableInstance.setGlobalFilter} />
      </Box>

      <BoxWithOverflowHidden pt={0} pb={8}>
        <TransitionLoadingSpinner
          in={isLoading || (tableInstance.rows.length === 0 && isFetching)}
        />
        <TransitionErrorMessage in={!isLoading && !!isError} />

        <Fade
          in={
            !isLoading &&
            !isError &&
            !isFetching &&
            tableInstance.rows.length === 0
          }
          unmountOnExit
        >
          <div>
            {!isLoading &&
              !isError &&
              !isFetching &&
              tableInstance.rows.length === 0 && (
                <MessageBlock>
                  <Box m={2}>
                    <SearchCloudIcon />
                  </Box>
                  <LargeBoldDarkText>
                    {t('ui.domainlist.empty', 'No Domains found')}
                  </LargeBoldDarkText>
                </MessageBlock>
              )}
          </div>
        </Fade>

        <Fade in={!isLoading && !isError && tableInstance.rows.length > 0}>
          <Box height="100%" display="flex" flexDirection="column">
            <Box>
              <TableActionsAndPagination
                totalRows={tableInstance.rows.length}
              />
            </Box>
            <Box py={1} height="100%">
              <DarkFadeOverlay darken={isFetching} height="100%">
                <GenericDataTable<DomainInfoRecord>
                  tableInstance={tableInstance}
                  disableActions={isFetching}
                  tableAriaLabelText="data channel table"
                  isRecordDisabled={isRecordDisabled}
                  columnIdToAriaLabel={columnIdToAriaLabel}
                  getColumnWidth={getColumnWidth}
                  handleRowClick={handleRowClick}
                  TableProps={{ stickyHeader: true }}
                  TableContainerProps={{
                    style: {
                      maxHeight: '100%',
                    },
                  }}
                />
              </DarkFadeOverlay>
            </Box>
          </Box>
        </Fade>
      </BoxWithOverflowHidden>
    </GenericPageWrapper>
  );
};

export default DomainList;
