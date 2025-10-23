import type { MessageMetadata } from './outlook';

export async function demoVerdict(meta: MessageMetadata) {
  const subject = (meta.subject || '').toLowerCase();
  if (subject.includes('vpn') || subject.includes('password') || subject.includes('urgent')) {
    return {
      status: 'suspicious' as const,
      explanation: 'Demo: Subject contains sensitive or urgent keywords.'
    };
  }
  if ((meta.from || '').toLowerCase().includes('@uconn.edu')) {
    return {
      status: 'safe' as const,
      explanation: 'Demo: Sender domain matches @uconn.edu.'
    };
  }
  return {
    status: 'unknown' as const,
    explanation: 'Demo: No clear indicators; backend not configured.'
  };
}


