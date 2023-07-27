import Box from '@material-ui/core/Box';
import { DomainId } from 'apps/admin/routes';
import CustomBoxRedesign from 'components/CustomBoxRedesign';
import PageHeader from 'components/PageHeader';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router';
import { selectActiveDomainName } from 'redux-app/modules/app/selectors';
import useGetDomainNotes from '../DomainEditor/hooks/useGetDomainNotes';

interface RouteParams {
  [DomainId]: string;
}

const DomainNoteViewer = () => {
  const { t } = useTranslation();

  const params = useParams<RouteParams>();

  const domainId = params[DomainId];

  const domainName = useSelector(selectActiveDomainName);

  const retrieveDomainNotesApi = useGetDomainNotes({ domainId });

  const title = `${t(
    'ui.domain.domainNotes',
    'Domain Setup Note'
  )} - ${domainName}`;

  const domainNotes = retrieveDomainNotesApi.data?.notes || '';

  return (
    <Box mt={3}>
      <PageHeader>{title}</PageHeader>
      <CustomBoxRedesign>
        <pre
          style={{
            padding: '24px',
            overflowWrap: 'break-word',
            whiteSpace: 'pre-wrap',
          }}
        >
          {domainNotes}
        </pre>
      </CustomBoxRedesign>
    </Box>
  );
};

export default DomainNoteViewer;
