import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Spinner } from "@/components/ui/spinner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { addHealthRoundData, ERROR } from "@/lib/query";
import { FileSpreadsheet, Info, Save, X } from "lucide-react";
import { Dispatch, SetStateAction, use, useCallback, useState } from "react";
import { CSVFile, UploadStatus } from "./page";
import { useQueryClient } from "@tanstack/react-query";

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

async function handleSave(
  currentFile: CSVFile | null,
  queryClient: ReturnType<typeof useQueryClient>,
  setCurrentFile: Dispatch<SetStateAction<CSVFile | null>>,
  setUploadStatus: (status: UploadStatus) => void,
  setIsSaving: Dispatch<SetStateAction<boolean>>
) {
  if (!currentFile) return;
  setIsSaving(true);

  const result = await addHealthRoundData(currentFile.year, currentFile.summary);
  setIsSaving(false);

  if (result === ERROR) {
    setUploadStatus({
      type: "error",
      message: `Error saving ${currentFile.name}`,
    });
    return;
  }
  queryClient.invalidateQueries({ queryKey: ["health-round-years"] });
  setUploadStatus({
    type: "success",
    message: `${currentFile.name} saved successfully`,
  });
  setCurrentFile(null);
}

function CSVDataTable({ currentFile }: { currentFile: CSVFile }) {
  return (
    <>
      <ScrollArea className="rounded-md border overflow-y-auto">
        <div className="lg:h-[60vh] md:h-[50vh] h-[38vh] relative overflow-auto">
          <Table className="min-w-full">
            <TableHeader className="bg-muted sticky top-0 z-10">
              <TableRow>
                <TableHead className="text-muted-foreground">#</TableHead>
                {currentFile.headers.map((header, i) => (
                  <TableHead key={i}>{header}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentFile.preview.map((row, rowIndex) => (
                <TableRow key={rowIndex} className={`${rowIndex % 2 === 1 ? "bg-muted/40" : ""}`}>
                  <TableCell className="text-muted-foreground font-medium">{rowIndex + 1}</TableCell>
                  {row.map((cell, cellIndex) => (
                    <TableCell key={cellIndex}>{cell || <span className="text-muted-foreground/50">—</span>}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <ScrollBar orientation="horizontal" className="sticky bottom-0" />
      </ScrollArea>
      {currentFile.rows > currentFile.preview.length && (
        <Alert className="p-4 bg-muted/40 mt-2">
          <Info className="size-4 mr-2" />
          <AlertDescription>
            Showing first {currentFile.preview.length} of {currentFile.rows.toLocaleString()} rows.
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

export default function CSVFileView({
  currentFile,
  setCurrentFile,
  setUploadStatus,
}: {
  currentFile: CSVFile;
  setCurrentFile: Dispatch<SetStateAction<CSVFile | null>>;
  setUploadStatus: (status: UploadStatus) => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const queryClient = useQueryClient();

  const handleCancel = useCallback(() => {
    setCurrentFile(null);
    setUploadStatus({ type: null, message: "" });
  }, []);

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-4 min-w-0">
            <div className="size-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <FileSpreadsheet className="size-6 text-primary" />
            </div>
            <div>
              <CardTitle className="text-lg sm:text-xl truncate max-w-xs sm:max-w-md">{currentFile.name}</CardTitle>
              <CardDescription className="flex flex-wrap items-center gap-2 mt-1 text-sm">
                <Badge variant="secondary">{currentFile.rows.toLocaleString()} rows</Badge>
                <Badge variant="secondary">{currentFile.columns} columns</Badge>
                <span className="text-muted-foreground">{formatFileSize(currentFile.size)}</span>
              </CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CSVDataTable currentFile={currentFile} />
      </CardContent>
      <CardFooter className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 pt-4 border-t">
        <Button variant="outline" onClick={handleCancel} disabled={isSaving} className="w-full sm:w-auto">
          <X className="size-4 mr-2" />
          Cancel
        </Button>
        <Button
          onClick={() => handleSave(currentFile, queryClient, setCurrentFile, setUploadStatus, setIsSaving)}
          disabled={isSaving}
          className="w-full sm:w-auto"
        >
          {isSaving ? (
            <>
              <Spinner className="size-4 mr-2" />
              Saving...
            </>
          ) : (
            <>
              <Save className="size-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
