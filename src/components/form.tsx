"use client"

import { cn } from "../lib/utils";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import * as XLSX from "xlsx";
import { useState } from "react";

export function DerbyForm({
  className,
  setPlayers,
  generatePairings,
  ...props
}: React.ComponentPropsWithoutRef<"form"> & { 
  setPlayers: (players: { name: string; handicap: number }[]) => void,
  generatePairings: () => void 
}) {
  const [playersText, setPlayersText] = useState("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const data = new Uint8Array(e.target?.result as ArrayBuffer);
      const workbook = XLSX.read(data, { type: "array" });
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const jsonData = XLSX.utils.sheet_to_json(sheet) as { NAME: string; HANDICAP: number }[];

      const parsedPlayers = jsonData.map(row => ({
        name: row.NAME?.toString().trim() || "",
        handicap: Number(row.HANDICAP)
      })).filter(p => p.name && !isNaN(p.handicap));

      setPlayers(parsedPlayers);
      setPlayersText(parsedPlayers.map(p => `${p.name}, ${p.handicap}`).join("\n"));
    };
    reader.readAsArrayBuffer(file);
  };

  const handleManualInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPlayersText(e.target.value);
    
    const lines = e.target.value.split("\n");
    const parsedPlayers = lines.map(line => {
      const [name, handicap] = line.split(",").map(item => item.trim());
      return { name, handicap: Number(handicap) };
    }).filter(p => p.name && !isNaN(p.handicap));

    setPlayers(parsedPlayers);
    console.log(parsedPlayers)
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={(e) => {
      e.preventDefault();
      generatePairings();
    }}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Upload or Enter Player Data</h1>
        <p className="text-sm text-muted-foreground">
          Upload an Excel file with &quot;NAME&quot; and &quot;HANDICAP&quot; columns, or enter data manually using the format:<br />
          <strong>Name, Handicap</strong> (each player on a new line)
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="file-upload">Upload XLS File</Label>
          <Input id="file-upload" type="file" accept=".xls,.xlsx" onChange={handleFileUpload} />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="manual-entry">Or Enter Players Manually</Label>
          <textarea
            id="manual-entry"
            className="border p-2 rounded"
            rows={6}
            placeholder={"John Doe, 12\nJane Smith, 8"}
            value={playersText}
            onChange={handleManualInput}
          />
        </div>
        <Button type="submit" className="w-full">
          Submit
        </Button>
      </div>
    </form>
  );
}
