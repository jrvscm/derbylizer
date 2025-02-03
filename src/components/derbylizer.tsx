import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import * as XLSX from "xlsx";

export default function Derbylizer({ teams }: { teams: { player1: string; handicap1: number; player2?: string; handicap2?: number }[] }) {
  const tableRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (tableRef.current) {
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Print Teams</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                table { width: 80%; border-collapse: collapse; margin: 20px auto; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; }
                th { background-color: #f4f4f4; }
                h1 { text-align: center; }
              </style>
            </head>
            <body>
              <h1>Derby Teams</h1>
              ${tableRef.current.outerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-4">
      <h1 className="text-2xl font-bold">Generated Teams</h1>
      {teams.length > 0 ? (
        <>
          <div ref={tableRef}>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Player 1</TableHead>
                  <TableHead>Player 2</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {teams.map((team, index) => (
                  <TableRow key={index}>
                    <TableCell>{team.player1}</TableCell>
                    <TableCell>{team.player2 ? `${team.player2} ` : "No partner"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex gap-4 mb-4">
            <Button onClick={handlePrint}>Print</Button>
          </div>
        </>
      ) : (
        <p className="text-muted-foreground">No teams generated yet. Please submit player data.</p>
      )}
    </div>
  );
}
