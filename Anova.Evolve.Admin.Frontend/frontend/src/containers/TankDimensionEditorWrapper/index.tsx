import React from 'react';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import BackIconButton from 'components/buttons/BackIconButton';
import TankDimensionEditor from 'containers/TankDimensionEditor';
import routes from 'apps/admin/routes';

interface RouteParams {
  tankDimensionId?: string;
}

const TankDimensionEditorWrapper = () => {
  const history = useHistory();
  const params = useParams<RouteParams>();

  return (
    <TankDimensionEditor
      editingObjectId={params.tankDimensionId}
      headerNavButton={<BackIconButton />}
      saveCallback={(response: any) => {
        const editRoutePath = generatePath(routes.tankDimensionManager.edit, {
          tankDimensionId:
            response.saveTankDimensionResult?.editObject?.tankDimensionId,
        });
        history.replace(editRoutePath);
      }}
      saveAndExitCallback={() => {
        history.push(routes.tankDimensionManager.list);
      }}
    />
  );
};

export default TankDimensionEditorWrapper;
