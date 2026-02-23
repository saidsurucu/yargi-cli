export abstract class BaseClient {
  protected baseUrl: string;
  protected timeoutMs: number;
  protected headers: Record<string, string>;

  constructor(baseUrl: string, timeoutMs = 60_000) {
    this.baseUrl = baseUrl;
    this.timeoutMs = timeoutMs;
    this.headers = {
      Accept: "*/*",
      "Accept-Language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
      AdaletApplicationName: "UyapMevzuat",
      "Content-Type": "application/json; charset=utf-8",
      Origin: "https://mevzuat.adalet.gov.tr",
      Referer: "https://mevzuat.adalet.gov.tr/",
      "Sec-Fetch-Dest": "empty",
      "Sec-Fetch-Mode": "cors",
      "Sec-Fetch-Site": "same-site",
      "User-Agent":
        "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/137.0.0.0 Safari/537.36",
    };
  }

  protected async post<T>(endpoint: string, body: unknown): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeoutMs);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: this.headers,
        body: JSON.stringify(body),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return (await response.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }
}
