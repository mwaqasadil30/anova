import React from 'react';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import BackIconButton from 'components/buttons/BackIconButton';
import SiteEditor from 'containers/SiteEditor';
import routes from 'apps/admin/routes';

interface RouteParams {
  siteId?: string;
}

const SiteEditorWrapper = () => {
  const history = useHistory();
  const params = useParams<RouteParams>();

  return (
    <SiteEditor
      editingSiteId={params.siteId}
      headerNavButton={<BackIconButton />}
      saveCallback={(response: any) => {
        const editRoutePath = generatePath(routes.siteManager.edit, {
          siteId: response.saveSiteResult?.editObject?.siteId,
        });
        history.replace(editRoutePath);
      }}
      saveAndExitCallback={() => {
        history.push(routes.siteManager.list);
      }}
    />
  );
};

export default SiteEditorWrapper;
