import Image from "next/image";
import { unstable_noStore as noStore } from 'next/cache';
import { getSheetData } from "../lib/sheet";
import { parseSpot } from "../lib/helpers";
import SpotCalendar from "./Spot";
import logo from "../assets/logo_pitxuns_titre.png";

export default async function Home() {
  noStore();
  const { headers, rows } = await getSheetData();
  const spots = headers.map(parseSpot) ?? [];

  return (
    <div
      style={{
        margin: "0 auto",
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        justifyContent: "stretch",
      }}
    >
      <div style={rowStyles}>
        <Image src={logo} height="64" alt="pitxuns logo"/>
        <h1>Planning Event</h1>
        <div />
      </div>

      <nav style={navStyles}>
        {spots
          .filter((s) => s.isSpot)
          .map(({ name, hash }) => (
            <a key={hash} href={`#${hash}`}>
              {name}
            </a>
          ))}
      </nav>

      <div style={columnStyles}>
        {spots.map((spot, i) => (
          <SpotCalendar key={spot.name} {...spot} index={i} data={rows ?? []} />
        ))}
      </div>
    </div>
  );
}

const navStyles = {
  display: "flex",
  justifyContent: "center",
  gap: "16px",
  flexWrap: "wrap",
  marginBottom: "16px",
} as const;

const rowStyles = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
} as const;

const columnStyles = {
  display: "flex",
  flexDirection: "column",
  gap: "16px",
} as const;
