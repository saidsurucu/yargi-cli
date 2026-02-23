import { Command } from "commander";
import { BedestenClient } from "../../clients/bedesten-client.js";
import { formatDateStart, formatDateEnd } from "../../utils/date.js";
import { isValidBirimAdi } from "../../enums/chambers.js";
import { DEFAULT_COURT_TYPES, type CourtType } from "../../types/common.js";
import type {
  BedestenSearchData,
  BedestenSearchRequest,
  BedestenSearchOutput,
} from "../../types/bedesten.js";

export const searchCommand = new Command("search")
  .description(
    "Search Turkish legal decisions (Yargitay, Danistay, local courts) via Bedesten API. " +
    "Returns paginated results sorted by decision date (newest first). Output: JSON to stdout."
  )
  .argument(
    "<phrase>",
    "Search query in Turkish. Supported operators:\n" +
    '  Simple:        "mülkiyet hakkı"           (finds both words)\n' +
    '  Exact phrase:  "\\"mülkiyet hakkı\\""        (finds exact phrase)\n' +
    '  Required term: "+mülkiyet hakkı"           (must contain mülkiyet)\n' +
    '  Exclude term:  "mülkiyet -kira"            (mülkiyet but not kira)\n' +
    '  Boolean AND:   "mülkiyet AND hak"          (both required)\n' +
    '  Boolean OR:    "mülkiyet OR tapu"          (either acceptable)\n' +
    '  Boolean NOT:   "mülkiyet NOT satış"        (mülkiyet but not satış)\n' +
    "  NOTE: Wildcards (*,?), regex, fuzzy (~), proximity NOT supported."
  )
  .option(
    "-c, --court-types <types...>",
    "Court type filter. Values:\n" +
    "  YARGITAYKARARI  - Yargitay (Court of Cassation)\n" +
    "  DANISTAYKARAR   - Danistay (Council of State)\n" +
    "  YERELHUKUK       - Local Civil Courts\n" +
    "  ISTINAFHUKUK     - Civil Courts of Appeals (Istinaf)\n" +
    "  KYB              - Extraordinary Appeals (Kanun Yararina Bozma)\n" +
    "  (default: YARGITAYKARARI DANISTAYKARAR)"
  )
  .option("-p, --page <number>", "Page number, 1-indexed (default: 1)", "1")
  .option(
    "-b, --chamber <code>",
    "Chamber (daire/kurul) filter. Abbreviated codes:\n" +
    "  Yargitay Hukuk:  H1-H23  (1-23. Hukuk Dairesi)\n" +
    "  Yargitay Ceza:   C1-C23  (1-23. Ceza Dairesi)\n" +
    "  Yargitay Kurullar: HGK (Hukuk Genel Kurulu), CGK (Ceza Genel Kurulu),\n" +
    "    BGK (Büyük Genel Kurulu), HBK (Hukuk Daireleri Baskanlar Kurulu),\n" +
    "    CBK (Ceza Daireleri Baskanlar Kurulu)\n" +
    "  Danistay:        D1-D17  (1-17. Daire)\n" +
    "  Danistay Kurullar: DBGK (Büyük Gen.Kur.), IDDK (Idare Dava Daireleri Kurulu),\n" +
    "    VDDK (Vergi Dava Daireleri Kurulu), IBK (Ictihatlari Birlestirme Kurulu),\n" +
    "    IIK (Idari Isler Kurulu), DBK (Baskanlar Kurulu)\n" +
    "  AYIM: AYIM, AYIMDK, AYIMB, AYIM1, AYIM2, AYIM3\n" +
    "  (default: ALL — no chamber filter)"
  )
  .option("--date-start <date>", "Start date filter in YYYY-MM-DD format (converted to ISO 8601)")
  .option("--date-end <date>", "End date filter in YYYY-MM-DD format (converted to ISO 8601)")
  .addHelpText(
    "after",
    "\nOutput JSON schema:\n" +
    "  {\n" +
    '    "decisions": [{\n' +
    '      "documentId": string,      // Use with "yargi bedesten doc <id>"\n' +
    '      "itemType": { "name": string, "description": string },\n' +
    '      "birimAdi": string | null,  // Chamber name\n' +
    '      "esasNo": string | null,    // Case number (Esas No)\n' +
    '      "kararNo": string | null,   // Decision number (Karar No)\n' +
    '      "kararTarihiStr": string,   // Decision date (DD.MM.YYYY)\n' +
    '      "kararTarihi": string       // Decision date (ISO 8601)\n' +
    "    }],\n" +
    '    "totalRecords": number,\n' +
    '    "requestedPage": number,\n' +
    '    "pageSize": number,           // Always 10\n' +
    '    "searchedCourts": string[]\n' +
    "  }\n" +
    "\nExamples:\n" +
    '  $ yargi bedesten search "mülkiyet hakkı"\n' +
    '  $ yargi bedesten search "iş kazası" -c YARGITAYKARARI -b H9\n' +
    '  $ yargi bedesten search "idari para cezası" -c DANISTAYKARAR -b D7 --date-start 2024-01-01\n' +
    '  $ yargi bedesten search "kamulaştırma" | jq \'.decisions[0].documentId\'\n'
  )
  .action(async (phrase: string, opts) => {
    const courtTypes: CourtType[] = opts.courtTypes ?? DEFAULT_COURT_TYPES;
    const pageNumber = parseInt(opts.page, 10);
    const chamber: string = opts.chamber ?? "ALL";

    if (chamber !== "ALL" && !isValidBirimAdi(chamber)) {
      const output = { error: `Invalid chamber code: ${chamber}` };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
      return;
    }

    const searchData: BedestenSearchData = {
      pageSize: 10,
      pageNumber,
      itemTypeList: courtTypes,
      phrase,
      birimAdi: chamber,
      kararTarihiStart: opts.dateStart
        ? formatDateStart(opts.dateStart)
        : undefined,
      kararTarihiEnd: opts.dateEnd ? formatDateEnd(opts.dateEnd) : undefined,
      sortFields: ["KARAR_TARIHI"],
      sortDirection: "desc",
    };

    const request: BedestenSearchRequest = {
      data: searchData,
      applicationName: "UyapMevzuat",
      paging: true,
    };

    const client = new BedestenClient();

    try {
      const response = await client.searchDocuments(request);

      const output: BedestenSearchOutput = {
        decisions: response.data?.emsalKararList ?? [],
        totalRecords: response.data?.total ?? 0,
        requestedPage: pageNumber,
        pageSize: 10,
        searchedCourts: courtTypes,
      };

      if (!response.data) {
        output.error = "No data returned from Bedesten API";
      }

      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      const output = { error: message };
      process.stdout.write(JSON.stringify(output, null, 2) + "\n");
      process.exitCode = 1;
    }
  });
