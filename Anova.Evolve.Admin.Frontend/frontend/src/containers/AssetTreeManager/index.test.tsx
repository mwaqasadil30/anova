import React from 'react';
import { render } from 'utils/test-utils';
import AssetTreeManager from './index';

it('renders the page header', () => {
  const { getByText } = render(<AssetTreeManager />);
  expect(getByText('Asset Tree Manager')).toBeInTheDocument();
});

// describe('AssetTreeManager', () => {
//   let sandbox: SinonSandbox;

//   beforeEach(() => {
//     sandbox = createSandbox();
//   });

//   afterEach(() => {
//     sandbox.restore();
//   });

//   it('renders the page header', () => {
//     const { getAllByText } = render(<AssetTreeManager />);
//     const result = getAllByText('Asset Tree Manager');
//     expect(result.length).toEqual(1);
//   });

//   it('renders the empty message when no records exist', async () => {
//     sandbox
//       .stub(
//         AdminApiService.AssetService,
//         'retrieveAssetTreeInfoRecordsByDomain_RetrieveAssetTreeInfoRecordsByDomain'
//       )
//       .resolves({
//         retrieveAssetTreeInfoRecordsByDomainResult: [] as AssetTreeInfoRecord[],
//       } as EvolveRetrieveAssetTreeInfoRecordsByDomainResponse);

//     await act(async () => {
//       const { findByText } = render(<AssetTreeManager />);
//       const emptyText = await findByText('No asset trees found');
//       expect(emptyText).toBeInTheDocument();
//     });
//   });

//   it('renders asset records returned by the API', async () => {
//     const records = [1, 2, 3].map((recordNumber) =>
//       buildAssetTreeInfoRecord({
//         name: `Asset Tree #${recordNumber}`,
//         expression: `Expression #${recordNumber}`,
//       })
//     );
//     sandbox
//       .stub(
//         AdminApiService.AssetService,
//         'retrieveAssetTreeInfoRecordsByDomain_RetrieveAssetTreeInfoRecordsByDomain'
//       )
//       .resolves({
//         retrieveAssetTreeInfoRecordsByDomainResult: records,
//       } as EvolveRetrieveAssetTreeInfoRecordsByDomainResponse);

//     await act(async () => {
//       // NOTE: findAllByText is used here instead since we're waiting
//       // asynchronously for the text to show up
//       const { findAllByText } = render(<AssetTreeManager />);
//       const assetRecords = await findAllByText(/Asset Tree #[0-9]/);
//       expect(assetRecords.length).toEqual(3);
//     });
//   });
// });
