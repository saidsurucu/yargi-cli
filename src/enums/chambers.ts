export const BIRIM_ADI_MAPPING: Record<string, string | null> = {
  ALL: null,

  // Yargitay Civil Chambers (1-23)
  H1: "1. Hukuk Dairesi", H2: "2. Hukuk Dairesi", H3: "3. Hukuk Dairesi",
  H4: "4. Hukuk Dairesi", H5: "5. Hukuk Dairesi", H6: "6. Hukuk Dairesi",
  H7: "7. Hukuk Dairesi", H8: "8. Hukuk Dairesi", H9: "9. Hukuk Dairesi",
  H10: "10. Hukuk Dairesi", H11: "11. Hukuk Dairesi", H12: "12. Hukuk Dairesi",
  H13: "13. Hukuk Dairesi", H14: "14. Hukuk Dairesi", H15: "15. Hukuk Dairesi",
  H16: "16. Hukuk Dairesi", H17: "17. Hukuk Dairesi", H18: "18. Hukuk Dairesi",
  H19: "19. Hukuk Dairesi", H20: "20. Hukuk Dairesi", H21: "21. Hukuk Dairesi",
  H22: "22. Hukuk Dairesi", H23: "23. Hukuk Dairesi",

  // Yargitay Criminal Chambers (1-23)
  C1: "1. Ceza Dairesi", C2: "2. Ceza Dairesi", C3: "3. Ceza Dairesi",
  C4: "4. Ceza Dairesi", C5: "5. Ceza Dairesi", C6: "6. Ceza Dairesi",
  C7: "7. Ceza Dairesi", C8: "8. Ceza Dairesi", C9: "9. Ceza Dairesi",
  C10: "10. Ceza Dairesi", C11: "11. Ceza Dairesi", C12: "12. Ceza Dairesi",
  C13: "13. Ceza Dairesi", C14: "14. Ceza Dairesi", C15: "15. Ceza Dairesi",
  C16: "16. Ceza Dairesi", C17: "17. Ceza Dairesi", C18: "18. Ceza Dairesi",
  C19: "19. Ceza Dairesi", C20: "20. Ceza Dairesi", C21: "21. Ceza Dairesi",
  C22: "22. Ceza Dairesi", C23: "23. Ceza Dairesi",

  // Yargitay Councils and Assemblies
  HGK: "Hukuk Genel Kurulu",
  CGK: "Ceza Genel Kurulu",
  BGK: "Büyük Genel Kurulu",
  HBK: "Hukuk Daireleri Başkanlar Kurulu",
  CBK: "Ceza Daireleri Başkanlar Kurulu",

  // Danistay Chambers (1-17)
  D1: "1. Daire", D2: "2. Daire", D3: "3. Daire", D4: "4. Daire",
  D5: "5. Daire", D6: "6. Daire", D7: "7. Daire", D8: "8. Daire",
  D9: "9. Daire", D10: "10. Daire", D11: "11. Daire", D12: "12. Daire",
  D13: "13. Daire", D14: "14. Daire", D15: "15. Daire", D16: "16. Daire",
  D17: "17. Daire",

  // Danistay Councils and Boards
  DBGK: "Büyük Gen.Kur.",
  IDDK: "İdare Dava Daireleri Kurulu",
  VDDK: "Vergi Dava Daireleri Kurulu",
  IBK: "İçtihatları Birleştirme Kurulu",
  IIK: "İdari İşler Kurulu",
  DBK: "Başkanlar Kurulu",

  // Military High Administrative Court
  AYIM: "Askeri Yüksek İdare Mahkemesi",
  AYIMDK: "Askeri Yüksek İdare Mahkemesi Daireler Kurulu",
  AYIMB: "Askeri Yüksek İdare Mahkemesi Başsavcılığı",
  AYIM1: "Askeri Yüksek İdare Mahkemesi 1. Daire",
  AYIM2: "Askeri Yüksek İdare Mahkemesi 2. Daire",
  AYIM3: "Askeri Yüksek İdare Mahkemesi 3. Daire",
};

export function getFullBirimAdi(abbreviated: string): string {
  if (abbreviated === "ALL" || !abbreviated) {
    return "";
  }
  return BIRIM_ADI_MAPPING[abbreviated] ?? abbreviated;
}

export function isValidBirimAdi(abbreviated: string): boolean {
  return abbreviated in BIRIM_ADI_MAPPING;
}
