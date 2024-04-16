import React, { useState } from "react";
import { PDFDocument } from "pdf-lib";
import { Buffer } from "buffer";
import { Button, Box, Typography } from "@mui/material";

function PdfMerger() {
  const [pdfFiles, setPdfFiles] = useState([]);
  const [mergedPdfUrl, setMergedPdfUrl] = useState("");

  const handleFileChange = async (event) => {
    const files = Array.from(event.target.files);
    const pdfsBytes = await Promise.all(
      files.map((file) => file.arrayBuffer())
    );
    setPdfFiles(pdfsBytes);
  };

  const mergePdfs = async () => {
    const mergedPdfDoc = await PDFDocument.create();

    for (const pdfBytes of pdfFiles) {
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pages = await mergedPdfDoc.copyPages(
        pdfDoc,
        pdfDoc.getPageIndices()
      );
      pages.forEach((page) => mergedPdfDoc.addPage(page));
    }

    const mergedPdfBytes = await mergedPdfDoc.save();
    const mergedPdfDataUri = `data:application/pdf;base64,${Buffer.from(
      mergedPdfBytes
    ).toString("base64")}`;
    setMergedPdfUrl(mergedPdfDataUri);
  };

  return (
   <div className="container">
     <Box  sx={{ p: 4 }}>
      <Typography variant="h4" gutterBottom>
        Merge PDF files
      </Typography>
      <label htmlFor="pdfInput" style={{ display: "block", marginBottom: 10 }}>
        Select PDF Files
      </label>
      <input
        type="file"
        id="pdfInput"
        multiple
        accept="application/pdf"
        onChange={handleFileChange}
        style={{ display: "block", marginBottom: 20 }}
      />

      <Button
        variant="contained"
        onClick={mergePdfs}
        disabled={!pdfFiles.length}
      >
        Merge PDFs
      </Button>
      {mergedPdfUrl && (
        <iframe
          title="Merged PDF"
          src={mergedPdfUrl}
          style={{ width: "100%", height: 800, marginTop: 20 }}
          frameBorder="0"
        />
      )}
    </Box>
   </div>
  );
}

export default PdfMerger;
