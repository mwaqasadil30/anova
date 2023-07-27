import { RenderResult } from '@testing-library/react';
import { EvolveRetrieveProductEditComponentsResponse } from 'api/admin/api';
import AdminApiService from 'api/admin/ApiService';
import React from 'react';
import { generatePath, Route } from 'react-router-dom';
import routes from 'apps/admin/routes';
import { createSandbox, SinonSandbox } from 'sinon';
import { act, fireEvent, render } from 'utils/test-utils';
import ProductEditorWrapper from './index';

describe('ProductEditorWrapper', () => {
  let sandbox: SinonSandbox;

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('renders the add header when on the create page', () => {
    const { getAllByText } = render(<ProductEditorWrapper />, {
      route: routes.productManager.create,
    });
    const result = getAllByText('Add Product');
    expect(result.length).toEqual(1);
  });

  it('renders the edit header when on the edit page', () => {
    const { getAllByText } = render(
      // NOTE: The <Route> seems to be required in order for the useParams hook
      // to have params
      <Route path={routes.productManager.edit} exact>
        <ProductEditorWrapper />
      </Route>,
      {
        route: generatePath(routes.productManager.edit, {
          productId: '5f815e39-32ac-49ee-b3ff-9c64a1f83abd',
        }),
      }
    );
    const result = getAllByText('Edit Product');
    expect(result.length).toEqual(1);
  });

  it('renders an empty form that can be filled in', async () => {
    sandbox
      .stub(
        AdminApiService.GeneralService,
        'retrieveProductEditComponents_RetrieveProductEditComponents'
      )
      // @ts-ignore
      .resolves({
        retrieveProductEditComponentsResult: {
          editObject: {
            id: '',
            name: '',
            description: '',
            specificGravity: 0,
            standardVolumePerCubicMeter: 0,
            domainId: '',
            productGroup: '',
            isDeleted: false,
            dataChannelCount: 0,
            productGroupList: [
              'Argon',
              'CO2',
              'Emixal',
              'Helium',
              'Hydrogen',
              'Nitrogen',
              'Nitrous Oxide',
              'Oxygen',
              'Propane',
            ],
            displayUnit: 0,
          },
          areEditComponentsLoaded: true,
        },
      } as EvolveRetrieveProductEditComponentsResponse);

    let renderOptions: RenderResult;

    await act(async () => {
      renderOptions = render(<ProductEditorWrapper />, {
        route: routes.productManager.create,
      });
    });

    // @ts-ignore
    if (!renderOptions) {
      throw new Error('renderOptions is undefined');
    }
    const productNameInput = renderOptions.getByLabelText(/Product Name/);
    const descriptionInput = await renderOptions.findByLabelText(/Description/);
    const productGroupInput = renderOptions.getByLabelText(/Product Group/);
    const specificGravityInput = renderOptions.getByLabelText(
      /Specific Gravity/
    );
    const standardVolumePerCubicMeterInput = renderOptions.getByLabelText(
      /SCM\/M3/
    );
    const displayUnitsInput = renderOptions.getByLabelText(/Display Units/);

    fireEvent.change(productNameInput, {
      target: { value: 'Sample Name' },
    });
    fireEvent.change(descriptionInput, {
      target: { value: 'Sample Description' },
    });
    fireEvent.change(productGroupInput, {
      target: { value: 'Hydrogen' },
    });

    expect(specificGravityInput).toBeInTheDocument();
    expect(standardVolumePerCubicMeterInput).toBeInTheDocument();
    expect(displayUnitsInput).toBeInTheDocument();

    // TODO: Test the submission of the form
  });
});
