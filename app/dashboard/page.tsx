"use client";

import { JsonViewer } from "@/components/json-tree-viewer";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { deleteHealthRoundData, getHealthRoundData, getHealthRoundYears } from "@/lib/query";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { BarChart3, Check, Copy, FileJson, Trash2, Upload } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export enum DatasetType {
  HealthRound = 1,
  Census,
}

export const datasetMap = new Map([
  [
    DatasetType.HealthRound,
    {
      name: "Health Round",
      variant: "default",
      getQueryOptions: (year: number) => ({
        queryKey: ["health-round", year],
        queryFn: () => getHealthRoundData(year).then((data) => data || {}),
        staleTime: Infinity,
      }),
    },
  ],
  [
    DatasetType.Census,
    {
      name: "Census",
      variant: "secondary",
      getQueryOptions: (year: number) => ({
        queryKey: ["census", year],
        queryFn: () => Promise.resolve({}),
        staleTime: Infinity,
      }),
    },
  ],
] as const);

type Dataset = {
  id: string;
  type: DatasetType;
  year: number;
};

function DatasetModal({
  dataset,
  setDataset,
  open,
  setIsOpen,
}: {
  dataset: Dataset | null;
  setDataset: (dataset: Dataset | null) => void;
  open: boolean;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const [copied, setCopied] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const queryClient = useQueryClient();

  const datasetInfo = dataset ? datasetMap.get(dataset.type)! : null;

  const { data } = useQuery({
    ...(datasetInfo && dataset
      ? datasetInfo.getQueryOptions(dataset.year)
      : {
          queryKey: ["empty"],
          queryFn: () => Promise.resolve({}),
        }),
    enabled: dataset !== null,
  });

  const handleCopy = (data: object) => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = () => {
    setDataset(null);
    if (dataset?.type === DatasetType.HealthRound) {
      deleteHealthRoundData(dataset.year);

      // Update cache directly without refetching
      queryClient.setQueryData<number[]>(["health-round-years"], (old) =>
        old ? old.filter((year) => year !== dataset.year) : []
      );
      queryClient.removeQueries({ queryKey: ["health-round", dataset.year] });
    }

    setShowDeleteConfirm(false);
    setIsOpen(false);
  };

  if (!dataset || !datasetInfo) return null;

  return (
    <>
      <Dialog open={open} onOpenChange={setIsOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh]">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{datasetInfo.name}</span>
              {/* <Badge variant="default">
              {datasetInfo.name} {dataset.year}
            </Badge> */}
            </DialogTitle>
            <DialogDescription>
              Detailed view of the {datasetInfo.name} dataset for {dataset.year}
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[50vh] w-full rounded-md border">
            <JsonViewer data={data ?? {}} />
          </ScrollArea>

          <div className="flex gap-2 justify-between">
            <div className="flex gap-2">
              <Button variant="default" asChild>
                <Link href={`/round/${dataset.year}`} target="_blank" rel="noopener noreferrer">
                  <>
                    <BarChart3 className="mr-2 h-4 w-4" />
                    View
                  </>
                </Link>
              </Button>

              <Button variant="outline" onClick={() => handleCopy(data ?? {})}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                  </>
                )}
              </Button>
            </div>
            <Button
              variant="destructive"
              onClick={() => {
                setShowDeleteConfirm(true);
                setIsOpen(false);
              }}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      <Dialog
        open={showDeleteConfirm}
        onOpenChange={() => {
          setShowDeleteConfirm(false);
          setIsOpen(true);
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this {datasetInfo?.name} dataset for {dataset?.year}? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <div className="flex gap-3 justify-end">
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function HealthRoundTab({
  setSelectedDataset,
  setIsOpen,
}: {
  setSelectedDataset: (dataset: Dataset) => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const { data: healthYears } = useQuery({
    queryKey: ["health-round-years"],
    queryFn: () => getHealthRoundYears(),
    staleTime: Infinity,
  });

  return (
    <TabsContent value="health-round" className="space-y-4 mt-6">
      {healthYears?.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <FileJson className="h-16 w-16 text-muted-foreground mb-4" />
            <p className="text-lg font-medium">No Health Round datasets</p>
            <p className="text-sm text-muted-foreground">Upload a Health Round dataset to see it here</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {healthYears?.map((year) => (
            <DatasetCard
              key={year}
              dataset={{ id: `${DatasetType.HealthRound}-${year}`, type: DatasetType.HealthRound, year }}
              setSelectedDataset={setSelectedDataset}
              setIsOpen={setIsOpen}
            />
          ))}
        </div>
      )}
    </TabsContent>
  );
}

function DatasetCard({
  dataset,
  setSelectedDataset,
  setIsOpen,
}: {
  dataset: Dataset;
  setSelectedDataset: (dataset: Dataset) => void;
  setIsOpen: (isOpen: boolean) => void;
}) {
  const datasetInfo = datasetMap.get(dataset.type)!;
  return (
    <Card
      className="cursor-pointer transition-all hover:shadow-lg hover:scale-[1.02]"
      onClick={() => {
        setSelectedDataset(dataset);
        setIsOpen(true);
      }}
    >
      <CardHeader>
        <div className="flex items-start justify-between">
          <FileJson className="h-8 w-8 text-primary" />
          <Badge variant={datasetInfo.variant}>{datasetInfo.name}</Badge>
        </div>
        <CardTitle className="mt-4">
          {datasetInfo.name} {dataset.year}
        </CardTitle>
        <CardDescription>{dataset.year} Dataset</CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">Click to view details and manage</p>
      </CardContent>
    </Card>
  );
}

export default function DashboardPage() {
  const router = useRouter();

  const censusYears = [] as number[];

  const [selectedDataset, setSelectedDataset] = useState<Dataset | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="min-h-screen max-w-6xl mx-auto py-8">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold tracking-tight">Dataset Dashboard</h1>
            <p className="text-muted-foreground mt-2">View and manage your uploaded datasets</p>
          </div>
          <Button onClick={() => router.push("/dashboard/upload")} size="lg">
            <Upload className="mr-2 h-4 w-4" />
            Upload Dataset
          </Button>
        </div>

        <Tabs defaultValue="health-round" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="health-round">Health Round</TabsTrigger>
            <TabsTrigger value="census">Census</TabsTrigger>
          </TabsList>

          <HealthRoundTab setSelectedDataset={setSelectedDataset} setIsOpen={setIsOpen} />

          <TabsContent value="census" className="space-y-4 mt-6">
            {censusYears.length === 0 ? (
              <Card>
                <CardContent className="flex flex-col items-center justify-center py-16">
                  <FileJson className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-lg font-medium">No Census datasets</p>
                  <p className="text-sm text-muted-foreground">Upload a Census dataset to see it here</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {censusYears.map((year) => (
                  <DatasetCard
                    key={year}
                    dataset={{ id: `${DatasetType.Census}-${year}`, type: DatasetType.Census, year }}
                    setSelectedDataset={setSelectedDataset}
                    setIsOpen={setIsOpen}
                  />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>

        <DatasetModal dataset={selectedDataset} setDataset={setSelectedDataset} open={isOpen} setIsOpen={setIsOpen} />
      </div>
    </div>
  );
}
