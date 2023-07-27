import { savePDF } from '@progress/kendo-react-pdf';

export type SavePDFWithOptionsFunction = typeof savePDF;

export const defaultPDFOptions = {
  // Show all content on a single page. See paperSize docs below:
  // https://www.telerik.com/kendo-react-ui/components/pdfprocessing/api/PDFExportProps/#toc-papersize
  paperSize: 'auto',
  fileName: 'export.pdf',
  // NOTE: If we switch back to using paperSize: 'Letter', then we'll need the
  // following to fit all the content onto the page
  // margin: 16,
  // landscape: true,
  // scale: 0.5,
  keepTogether: '.prevent-split',
};

export const savePDFWithOptions: SavePDFWithOptionsFunction = (
  domElement,
  options?,
  callback?
) => {
  const combinedOptions = {
    ...defaultPDFOptions,
    ...options,
  };

  savePDF(domElement, combinedOptions, callback);
};
