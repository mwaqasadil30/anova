import React from 'react';
import { render } from 'utils/test-utils';
import AssetManagerList from './index';

it('renders the page header', () => {
  const { getByText } = render(<AssetManagerList />);
  expect(getByText('Asset Configuration Manager')).toBeInTheDocument();
});

// describe('AssetManagerList', () => {
//   let sandbox: SinonSandbox;

//   beforeEach(() => {
//     sandbox = createSandbox();
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   it('renders general Asset Manager content', () => {
//     const { getAllByText } = render(<AssetManagerList />);
//     const result = getAllByText('Asset Configuration Manager');
//     expect(result.length).toEqual(1);
//   });

//   it('renders the empty message when no records exist', async () => {
//     sandbox
//       .stub(
//         AdminApiService.AssetService,
//         'retrieveAssetInfoRecordsByOptions_RetrieveAssetInfoRecordsByOptions'
//       )
//       .resolves({
//         // @ts-ignore
//         retrieveAssetInfoRecordsByOptionsResult: {
//           records: [],
//           totalRecords: 0,
//         },
//       });

//     await act(async () => {
//       const { findByText } = render(<AssetManagerList />);
//       const emptyText = await findByText('No assets found');
//       expect(emptyText).toBeInTheDocument();
//     });
//   });

//   it('renders asset records returned by the API', async () => {
//     const assetTitle1 = 'Asset #1';
//     const assetTitle2 = 'Asset #2';
//     const assetTitle3 = 'Asset #3';
//     const records = [
//       buildAssetInfoRecord({ assetDescription: assetTitle1 }),
//       buildAssetInfoRecord({ assetDescription: assetTitle2 }),
//       buildAssetInfoRecord({ assetDescription: assetTitle3 }),
//     ];
//     sandbox
//       .stub(
//         AdminApiService.AssetService,
//         'retrieveAssetInfoRecordsByOptions_RetrieveAssetInfoRecordsByOptions'
//       )
//       .resolves({
//         retrieveAssetInfoRecordsByOptionsResult: {
//           // @ts-ignore
//           records,
//           totalRecords: records.length,
//         },
//       });

//     await act(async () => {
//       // NOTE: findAllByText is used here instead since we're waiting
//       // asynchronously for the text to show up
//       const { findAllByText } = render(<AssetManagerList />);
//       const assetRecords = await findAllByText(/Asset #[0-9]/);
//       expect(assetRecords.length).toEqual(3);
//     });
//   });
// });
