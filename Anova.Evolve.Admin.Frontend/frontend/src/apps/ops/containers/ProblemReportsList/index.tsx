/* eslint-disable indent */
import PageIntroWrapper from 'components/layout/PageIntroWrapper';
import {
  PreserveUserProblemReportSettingsData,
  usePreserveUserProblemReportSettings,
} from 'components/PreserveUserProblemReportSettings/hooks/usePreserveUserProblemReportSettings';
import React from 'react';
import { useSelector } from 'react-redux';
import { selectIsActiveDomainApciEnabled } from 'redux-app/modules/app/selectors';
import styled from 'styled-components';
import PageIntro from './components/PageIntro';
import ProblemReportsTableAndTableOptions from './components/ProblemReportsTableAndTableOptions';
import useProblemReportsListDetails from './hooks/useProblemReportsListDetails';

// Styled component to allow setting up overflow: hidden on a parent to prevent
// the table from exceeding the height of the page. The key properties being
// `display: flex` and `height: calc(...)` which allows the overflow: hidden to
// work properly.
const Wrapper = styled(({ topOffset, ...props }) => <div {...props} />)`
  ${(props) =>
    props.topOffset &&
    `
      display: flex;
      flex-direction: column;
      height: calc(100vh - ${props.topOffset}px - 16px);
    `};
`;

const ProblemReportsList = ({
  userProblemReportSettings,
  saveUserProblemReportSettings,
}: PreserveUserProblemReportSettingsData) => {
  const problemReportsListDetails = useProblemReportsListDetails({
    userProblemReportSettings,
    saveUserProblemReportSettings,
  });

  const {
    topOffset,
    getProblemReportsListApi,
    filterByColumn,
    filterTextValue,
    filterOptionsForApi,
    sortByColumnId,
    sortByColumnDirection,
    tableStateForDownload,
    getAllProblemReportsListForCsvApi,
    isDownloadButtonDisabled,
  } = problemReportsListDetails;

  return (
    <Wrapper topOffset={topOffset}>
      <PageIntroWrapper>
        <PageIntro
          refetchRecords={getProblemReportsListApi.refetch}
          filterBy={filterByColumn}
          filterText={filterTextValue}
          statusType={filterOptionsForApi.statusType}
          sortColumnName={sortByColumnId}
          sortDirection={sortByColumnDirection}
          tableStateForDownload={tableStateForDownload}
          allProblemReportsDataApi={getAllProblemReportsListForCsvApi}
          isDownloadButtonDisabled={isDownloadButtonDisabled}
        />
      </PageIntroWrapper>

      <ProblemReportsTableAndTableOptions
        problemReportsListDetails={problemReportsListDetails}
      />
    </Wrapper>
  );
};

const ProblemReportsListWithUserSettings = (props: any) => {
  const isAirProductsEnabledDomain = useSelector(
    selectIsActiveDomainApciEnabled
  );

  const {
    userProblemReportSettings,
    isUserProblemReportSettingsLoadingInitial,
    saveUserProblemReportSettings,
  } = usePreserveUserProblemReportSettings({
    isAirProductsDomain: isAirProductsEnabledDomain,
  });

  const fullProps = {
    ...props,
    userProblemReportSettings,
    saveUserProblemReportSettings,
  };

  return isUserProblemReportSettingsLoadingInitial ? null : (
    <ProblemReportsList {...fullProps} />
  );
};

export default ProblemReportsListWithUserSettings;
