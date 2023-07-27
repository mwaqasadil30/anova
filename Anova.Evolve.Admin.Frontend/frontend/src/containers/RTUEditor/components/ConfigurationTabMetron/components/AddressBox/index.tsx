import { SiteInfoDto } from 'api/admin/api';
import React from 'react';

type AddressBoxProps = {
  siteInfo?: SiteInfoDto | null;
};
const AddressBox = ({ siteInfo }: AddressBoxProps) => {
  if (!siteInfo) return <>-</>;

  const { address1, address2, address3, city, state, country } = siteInfo;

  const streetAddressDetails = [address1, address2, address3]
    .filter(Boolean)
    .join(' ');

  const otherAddressDetails = [city, state, country].filter(Boolean).join(', ');

  return (
    <>
      {streetAddressDetails}
      <br />
      {otherAddressDetails}
    </>
  );
};
export default AddressBox;
