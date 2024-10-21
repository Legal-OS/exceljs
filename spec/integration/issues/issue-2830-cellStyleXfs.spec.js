const ExcelJS = verquire('exceljs');

const fileName = './spec/integration/data/test-issue-2830.xlsx';
const TEST_XLSX_FILE_NAME = './spec/out/wb.test.xlsx';

describe('github issues', () => {
  describe('issue 2830 - Styles from cellStyleXfs are not preserved', () => {
    it('when using readFile', async () => {
      const wb = new ExcelJS.Workbook();
      await wb.xlsx.readFile(fileName, {
        ignoreNodes: ['dataValidations'],
      });

      // Store original cellStyleXfs and styles
      const originalCellStyleXfs = wb.model.styles.cellStyleXfs;
      const originalStyles = wb.model.styles.styles;

      // Write to a new file
      await wb.xlsx.writeFile(TEST_XLSX_FILE_NAME);

      // Read the newly written file
      const wb2 = new ExcelJS.Workbook();
      await wb2.xlsx.readFile(TEST_XLSX_FILE_NAME);

      // Compare cellStyleXfs
      expect(wb2.model.styles.cellStyleXfs).to.deep.equal(originalCellStyleXfs);

      // Compare styles (cellXfs)
      expect(wb2.model.styles.styles).to.deep.equal(originalStyles);

      // Check a specific cell's style (adjust cell reference as needed)
      const ws1 = wb.getWorksheet('Sheet1');
      const ws2 = wb2.getWorksheet('Sheet1');
      const cell1 = ws1.getCell('A1');
      const cell2 = ws2.getCell('A1');

      // If your test file uses cell styles (xfId), check that as well
      if (cell1.style.xfId !== undefined) {
        expect(cell2.style.xfId).to.equal(cell1.style.xfId);
      }
    });
  });
});
