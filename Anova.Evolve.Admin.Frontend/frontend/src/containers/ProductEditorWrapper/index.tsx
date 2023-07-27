import React from 'react';
import { generatePath, useHistory, useParams } from 'react-router-dom';
import BackIconButton from 'components/buttons/BackIconButton';
import ProductEditor from 'containers/ProductEditor';
import routes from 'apps/admin/routes';

interface RouteParams {
  productId?: string;
}

const ProductEditorWrapper = () => {
  const history = useHistory();
  const params = useParams<RouteParams>();

  return (
    <ProductEditor
      editingObjectId={params.productId}
      headerNavButton={<BackIconButton />}
      saveCallback={(response: any) => {
        const editRoutePath = generatePath(routes.productManager.edit, {
          productId: response.saveProductResult?.editObject?.id,
        });
        history.replace(editRoutePath);
      }}
      saveAndExitCallback={() => {
        history.push(routes.productManager.list);
      }}
    />
  );
};

export default ProductEditorWrapper;
