"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import { YearPicker } from "@/components/ui/year-picker";
import { Headers, summariseData } from "@/summary/health-round/config";
import { Calendar, FileSpreadsheet, Upload } from "lucide-react";
import { parse, ParseResult } from "papaparse";
import { Dispatch, DragEvent, SetStateAction, useCallback, useRef, useState } from "react";
import { datasetMap, DatasetType } from "../page";
import { CSVFile, UploadStatus } from "./page";

const csvTypes = Array.from(datasetMap.entries()).map(([value, { name }]) => ({
  value: value.toString(),
  label: name,
}));

function updateResult(
  file: File,
  year: number,
  csvType: DatasetType,
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
      try {
        const headers = results.data[0] as Headers[];
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
          summary,
          type: csvType,
          year,
        };

        setCurrentFile(newFile);
        setIsLoading(false);
        setUploadStatus({
          type: "success",
          message: `${file.name} loaded successfully`,
        });
      } catch (error) {
        if (error instanceof TypeError) {
          setUploadStatus({
            type: "error",
            message: "Your CSV file is missing one or more required columns. Please ensure it matches the template.",
          });
        } else {
          setUploadStatus({
            type: "error",
            message: `Error processing ${file.name}: ${error instanceof Error ? error.message : String(error)}`,
          });
        }
        setIsLoading(false);
      }
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
  const [year, setYear] = useState<number | undefined>(undefined);
  const [csvType, setCsvType] = useState<string | undefined>(undefined);

  const handleFileUpload = (uploadedFiles: FileList | null) => {
    if (!uploadedFiles || uploadedFiles.length === 0) return;

    const file = uploadedFiles[0]; // Only take the first file

    const prefix = file.name.split("_")[0];
    const nameType = prefix.slice(0, 2);
    const nameYear = Number(prefix.slice(2, 6));

    // Auto-detect from filename
    let finalYear = year;
    let finalCsvType = csvType;

    if (nameType === "HR" && csvType === undefined) {
      finalCsvType = DatasetType.HealthRound.toString();
      setCsvType(finalCsvType);
    }
    
    if (nameYear >= 2013 && year === undefined) {
      finalYear = nameYear;
      setYear(finalYear);
    }

    if (finalYear === undefined || finalCsvType === undefined) {
      setUploadStatus({
        type: "error",
        message: "Please select both a year and data type before uploading.",
      });
      return;
    }

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
      complete: updateResult(file, finalYear, Number(finalCsvType), setCurrentFile, setUploadStatus, setIsLoading),
    });
  };

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
    <Card>
      <CardHeader>
        <CardTitle className="text-3xl">Upload Dataset</CardTitle>
        <CardDescription>Configure and upload your CSV  file</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dataset Configuration */}
        <div className="space-y-3">
          <Label className="text-base font-semibold">Dataset Configuration</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="year" className="flex items-center gap-2">
                <Calendar className="size-4" />
                Year
              </Label>
              <YearPicker value={year} onChange={setYear} minYear={2013} className="w-full py-6 text-base h-12" />
              <p className="text-xs text-muted-foreground">The year when this data was collected</p>
            </div>

            <div className="space-y-3">
              <Label htmlFor="type" className="flex items-center gap-2">
                <FileSpreadsheet className="size-4" />
                Dataset Category
              </Label>
              <Select value={csvType} onValueChange={setCsvType}>
                <SelectTrigger id="type" className="w-full py-6 items-center text-base">
                  <SelectValue placeholder="Select dataset category" />
                </SelectTrigger>
                <SelectContent>
                  {csvTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Choose the dataset category that matches your CSV file</p>
            </div>
          </div>
        </div>

        {/* File Upload */}
        <div className="space-y-3">
          <Label>Select File</Label>
          <div
            className={`border-2 border-dashed rounded-lg p-16 text-center transition-colors ${
              isDragging || isLoading ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:bg-muted/50"
            }`}
            onDragEnter={handleDragEnter}
            onDragLeave={handleDragLeave}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            <div
              className={`size-12 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors ${
                isDragging || isLoading ? "bg-primary/20" : "bg-muted"
              }`}
            >
              {isLoading ? (
                <Spinner className="size-6 text-primary" />
              ) : (
                <Upload className={`size-6 ${isDragging ? "text-primary" : "text-muted-foreground"}`} />
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={(e) => handleFileUpload(e.target.files)}
            />
            <p className="mb-4 text-sm text-muted-foreground">
              {isDragging || isLoading ? "Drop your file here" : "Drag and drop your CSV file here, or click to browse"}
            </p>
            <Button size="lg" variant="outline" onClick={() => fileInputRef.current?.click()}>
              <FileSpreadsheet className="size-5 mr-2" />
              Browse Files
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
