import { WebLNProvider } from "webln";
declare global {
  interface Window {
    webln?: WebLNProvider & {
      executing?: boolean;
    };
  }
}
