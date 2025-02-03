"use client"

import { useState } from "react";
import { GalleryVerticalEnd } from "lucide-react";
import { DerbyForm } from "../components/form";
import Derbylizer from "../components/Derbylizer";

export default function Page() {
  const [players, setPlayers] = useState<{ name: string; handicap: number }[]>([]);
  const [teams, setTeams] = useState<{ player1: string; player2: string }[]>([]);

  const generatePairings = () => {
    const sortedPlayers = [...players].sort((a, b) => a.handicap - b.handicap);
    const pairings: { player1: string; player2: string }[] = [];

    while (sortedPlayers.length > 1) {
      const high = sortedPlayers.pop();
      const low = sortedPlayers.shift();
      if (high && low) pairings.push({ player1: `${high.name} (${high.handicap})`, player2: `${low.name} (${low.handicap})` });
    }
    setTeams(pairings);
  };

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Derbylizer
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <DerbyForm setPlayers={setPlayers} generatePairings={generatePairings} />
          </div>
        </div>
      </div>
      <div className="lg:flex lg:justify-center lg:items-center bg-muted h-full">
        <div className="p-6 w-full max-w-2xl">
          <Derbylizer teams={teams} />
        </div>
      </div>
    </div>
  );
}
