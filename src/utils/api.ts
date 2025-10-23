import type { MessageMetadata } from './outlook';

type VerdictResponse = {
  status: 'safe' | 'suspicious' | 'unknown' | 'error';
  explanation?: string;
};

export async function fetchVerdict(baseUrl: string, meta: MessageMetadata): Promise<VerdictResponse> {
  const url = new URL('/api/verdict', baseUrl);
  const res = await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      internetMessageId: meta.internetMessageId,
      subject: meta.subject,
      from: meta.from,
      to: meta.to,
      cc: meta.cc
    })
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { status: 'error', explanation: `HTTP ${res.status}: ${text}` };
  }
  const data = (await res.json()) as VerdictResponse;
  return data;
}


