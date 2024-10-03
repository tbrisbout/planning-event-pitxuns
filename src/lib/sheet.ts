import { JWT } from "google-auth-library";
import { GoogleSpreadsheet } from "google-spreadsheet";

type SheetData = {
  headers: ReadonlyArray<string>;
  rows: ReadonlyArray<ReadonlyArray<string>>;
};

let cache: Partial<SheetData> = {};

const FIVE_MINUTES = 5 * 60 * 1000;
setInterval(() => {
  cache = {};
}, FIVE_MINUTES);

export async function getSheetData(): Promise<SheetData> {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const key = process.env.GOOGLE_PRIVATE_KEY;

  if (!email || !key) return { headers: [], rows: []};

  if (!!cache.headers && !! cache.rows) return cache as SheetData;

  const serviceAccountAuth = new JWT({
    email,
    key: key.split(String.raw`\n`).join("\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const doc = new GoogleSpreadsheet(
    process.env.GOOGLE_SHEET_ID ??
      "12zWc2deiWIRihGNeu9zBfAVB2xSid7rs67kN3ybMmaM",
    serviceAccountAuth,
  );

  await doc.loadInfo();
  const sheet = doc.sheetsByIndex[2];
  const rawRaws = await sheet.getRows();

  const headers = sheet.headerValues.filter((_, i) => i > 3);
  const rows = rawRaws.map((row) => Object.values(row.toObject()));

  cache = { headers, rows };

  return { headers, rows };
}
