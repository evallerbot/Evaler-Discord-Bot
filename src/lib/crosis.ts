import { Client, FetchConnectionMetadataError, FetchConnectionMetadataResult } from '@replit/crosis';
import fetch from "isomorphic-unfetch";
import WebSocket from 'ws';

// @ts-ignore
globalThis.WebSocket = WebSocket;

const repl = { id: process.env.REPL_ID!.toString() };
const user = { name: process.env.REPL_USERNAME!.toString() };

export const fetchConnectionMetadata = async (signal: AbortSignal): Promise<FetchConnectionMetadataResult> => {
  let res: fetch.IsomorphicResponse | undefined;
  
  try {
    res = await fetch(`https://replit.com/data/repls/${repl.id}/get_connection_metadata`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Cookie": `connect.sid=${process.env.REPL_SID}; replit:authed=1; cf_clearance=Mby5VZUHutVmTMs.ajDGl16YJuHKx52wET7yURdEdbM-1640882107-0-150;`,
        "X-Requested-With": "https://replit.com",
        "Origin": "https://replit.com",
        "User-Agent": " Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.71 Safari/537.36",
      },
      body: JSON.stringify({
        "captcha": "",
        "isEmbed": false,
        "hCaptchaSiteKey": "473079ba-e99f-4e25-a635-e9b661c7dd3e",
        "clientVersion": "e472eba",
        "retry": 1,
        "format": "pbuf"
      }),
      signal
    });
  } catch(error){
    if ((<Error>error).name === 'AbortError') {
      return { error: FetchConnectionMetadataError.Aborted };
    }
    throw error;
  }

  if (!res.ok) {
    if (res.status > 500) {
      // Network or server error, try again
      return { error: FetchConnectionMetadataError.Retriable };
    }

    const errorText = await res.text();
    throw new Error(errorText || res.statusText);
  }

  const connectionMetadata = await res.json();

  return {
    token: connectionMetadata.token,
    gurl: connectionMetadata.gurl,
    conmanURL: connectionMetadata.conmanURL,
    error: null,
  };
};

export const context = { repl, user };
export const client = new Client<{ user: { name: string }; repl: { id: string } }>();
