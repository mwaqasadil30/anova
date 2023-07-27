import { ValueTupleOfDoubleAndDoubleWithKey } from 'apps/ops/types';
import { ReactComponent as ImportIcon } from 'assets/icons/import.svg';
import Button from 'components/Button';
import { ParseResult } from 'papaparse';
import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { CSVReader } from 'react-papaparse';
import { isNumber } from 'utils/format/numbers';

interface Props {
  setExportedData: (data: ValueTupleOfDoubleAndDoubleWithKey[]) => void;
  openDialog: () => void;
}

interface ImportedData {
  data: string[];
  errors: string[];
  meta: any;
}

const ImportCsvButton = ({ setExportedData, openDialog }: Props) => {
  const { t } = useTranslation();
  const buttonRef = useRef(null);

  const handleOnDrop = (data: ParseResult<any>[]) => {
    if (data) {
      // Manually remove the file so we don't show the uploaded file's details
      // (which is the default for the package)
      // @ts-ignore
      buttonRef.current?.removeFile?.();

      const unformattedCsvData = data.map(
        (importedCsv: any) => importedCsv.data
      );

      const totalRowCount =
        unformattedCsvData.length > 20 ? 20 : unformattedCsvData.length;

      // Build a list of all the scalings from the CSV
      const scalingsFromCsv = [];
      for (let index = 0; index < totalRowCount; index += 1) {
        const rowData = unformattedCsvData[index];
        const item1 = rowData?.[0];
        const item2 = rowData?.[1];

        if (!isNumber(item1) || !isNumber(item2)) {
          openDialog();
          return;
        }

        scalingsFromCsv.push({ item1, item2 });
      }

      // Pad the list of scalings from the CSV with empty rows for the form if
      // there were less than 20 rows
      const formattedScalingdMap = [];
      for (let index = 0; index < 20; index += 1) {
        const currentScalingRow = scalingsFromCsv[index];

        const key = `${index}-${new Date()}`;

        if (currentScalingRow) {
          formattedScalingdMap.push({
            item1: currentScalingRow.item1,
            item2: currentScalingRow.item2,
            key,
          });
        } else {
          formattedScalingdMap.push({ key });
        }
      }

      setExportedData(
        formattedScalingdMap as ValueTupleOfDoubleAndDoubleWithKey[]
      );
    }
  };

  const handleOnError = (err: any) => {
    console.error(err);
  };

  return (
    <CSVReader
      ref={buttonRef}
      onFileLoad={handleOnDrop}
      onError={handleOnError}
      noProgressBar
      noClick
      noDrag
      style={{
        dropArea: {
          border: 'none',
          padding: 0,
        },

        dropFile: {
          width: 'none',
          height: 'none',
          background: 'none',
          borderRadius: '10px',
          visibility: 'hidden',
        },
        fileSizeInfo: {
          color: 'none',
          backgroundColor: 'none',
          borderRadius: 0,
          lineHeight: 1,
          marginBottom: '0.5em',
          padding: '0 0.4em',
          visibility: 'hidden',
        },
        fileNameInfo: {
          color: 'black',
          backgroundColor: 'none',
          borderRadius: 0,
          fontSize: 14,
          lineHeight: 1,
          padding: '0 0.4em',
          visibility: 'hidden',
        },
      }}
    >
      <Button
        onClick={(event) => {
          // Manually open the dialog
          // @ts-ignore
          buttonRef.current?.open(event);
        }}
        startIcon={<ImportIcon />}
        useDomainColorForIcon
      >
        {t('ui.datachannel.import', 'Import')}
      </Button>
    </CSVReader>
  );
};

export default ImportCsvButton;
