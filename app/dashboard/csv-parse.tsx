"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { FileSpreadsheet, Upload } from "lucide-react";
import { parse, ParseResult } from "papaparse";
import { Dispatch, DragEvent, SetStateAction, useCallback, useRef, useState } from "react";
import { CSVFile, UploadStatus } from "./page";
import { summariseData } from "@/lib/summarise";



function updateResult(
  file: File,
  setCurrentFile: Dispatch<SetStateAction<CSVFile | null>>,
  setUploadStatus: (status: UploadStatus) => void,
  setIsLoading: (loading: boolean) => void
) {
  const previewRows = 100;
  return (results: ParseResult<unknown>) => {
    if (results.errors.length > 0) {
      setUploadStatus({
        type: "error",
        message: `Error parsing ${file.name}: ${results.errors.map((e) => e.message).join(", ")}`,
      });
      setIsLoading(false);
      return;
    } else {
      const headers = results.data[0] as string[];
      const data = results.data.slice(1) as string[][];
      const preview = data.slice(0, previewRows);
      const summary = summariseData(headers, data);

      const newFile: CSVFile = {
        name: file.name,
        size: file.size,
        rows: data.length,
        columns: headers.length,
        headers,
        preview,
        summary
      };
      
      setCurrentFile(newFile);
      setIsLoading(false);
      setUploadStatus({
        type: "success",
        message: `${file.name} loaded successfully`,
      });
    }
  };
}

export default function ParseArea({
  setCurrentFile,
  setUploadStatus,
}: {
  setCurrentFile: Dispatch<SetStateAction<CSVFile | null>>;
  setUploadStatus: (status: UploadStatus) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dragCounter = useRef(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = useCallback(
    (uploadedFiles: FileList | null) => {
      if (!uploadedFiles || uploadedFiles.length === 0) return;

      const file = uploadedFiles[0]; // Only take the first file

      if (!file.name.endsWith(".csv")) {
        setUploadStatus({
          type: "error",
          message: `${file.name} is not a CSV file`,
        });
        return;
      }

      setIsLoading(true);
      parse(file, {
        delimiter: ",",
        newline: "\r\n",
        header: false,
        fastMode: true,
        complete: updateResult(file, setCurrentFile, setUploadStatus, setIsLoading),
      });
    },
    [setCurrentFile, setUploadStatus]
  );

  const handleDragEnter = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current += 1;
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault();
    dragCounter.current -= 1;
    if (dragCounter.current === 0) {
      setIsDragging(false);
    }
  }, []);

  const handleDragOver = useCallback((e: DragEvent) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFileUpload(e.dataTransfer.files);
    },
    [handleFileUpload]
  );

  return (
    <Card
      className={`border-2 border-dashed transition-colors ${
        isDragging || isLoading ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
      }`}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <CardContent className="flex flex-col items-center justify-center py-16 text-center">
        <div
          className={`size-20 rounded-full flex items-center justify-center mb-6 transition-colors ${
            isDragging || isLoading ? "bg-primary/20" : "bg-muted"
          }`}
        >
          {isLoading ? (
            <Spinner className="size-10 text-primary" />
          ) : (
            <Upload className={`size-10 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
          )}
        </div>
        <h3 className="text-xl font-semibold mb-2">
          {isDragging || isLoading ? "Drop your file here" : "Upload CSV File"}
        </h3>
        <p className="text-muted-foreground mb-6 max-w-md">Drag and drop your CSV file here, or click to browse.</p>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          className="hidden"
          onChange={(e) => handleFileUpload(e.target.files)}
        />

        <Button size="lg" variant="outline" onClick={() => fileInputRef.current?.click()}>
          <FileSpreadsheet className="size-5 mr-2" />
          Browse Files
        </Button>
      </CardContent>
    </Card>
  );
}
