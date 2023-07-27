import { buildAssetInfoRecord } from 'test/helpers/asset-info-record';
import {
  formatAddressInOneLine,
  formatAssetRecordSiteInformation,
} from './address';

describe('formatAddressInOneLine', () => {
  it('returns an empty string when no address info is passed', () => {
    const result = formatAddressInOneLine();
    expect(result).toEqual('');
  });

  it('returns a formatted address when all address info is passed', () => {
    const line1 = '123 Fake St.';
    const city = 'Toronto';
    const state = 'ON';
    const country = 'Canada';
    const result = formatAddressInOneLine(line1, city, state, country);
    const expected = `${line1}, ${city}, ${state}, ${country}`;
    expect(result).toEqual(expected);
  });

  it('returns a formatted address when some address info is passed', () => {
    const line1 = '123 Fake St.';
    const country = 'Canada';
    const result = formatAddressInOneLine(line1, undefined, null, country);
    const expected = `${line1}, ${country}`;
    expect(result).toEqual(expected);
  });
});

describe('formatAssetRecordSiteInformation', () => {
  it('returns an formatted address when all address info is passed', () => {
    const assetRecord = buildAssetInfoRecord({
      address1: '123 Fake St.',
      city: 'Toronto',
      state: 'ON',
      country: 'Canada',
    });
    const { address1, city, state, country } = assetRecord;
    const result = formatAssetRecordSiteInformation(assetRecord);
    const expected = `${address1}, ${city}, ${state}, ${country}`;
    expect(result).toEqual(expected);
  });
});
