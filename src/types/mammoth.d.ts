declare module "mammoth" {
  export interface RawTextResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export interface HtmlResult {
    value: string;
    messages: Array<{
      type: string;
      message: string;
    }>;
  }

  export function extractRawText(input: { buffer: Buffer } | { path: string } | { arrayBuffer: ArrayBuffer }): Promise<RawTextResult>;
  export function convertToHtml(input: { buffer: Buffer } | { path: string } | { arrayBuffer: ArrayBuffer }): Promise<HtmlResult>;
}
