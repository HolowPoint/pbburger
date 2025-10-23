import type { MessageMetadata } from './outlook';

export async function demoVerdict(meta: MessageMetadata) {
  const subject = (meta.subject || '').toLowerCase();
  const body = (meta.body || '').toLowerCase();
  const from = (meta.from || '').toLowerCase();
  const suspiciousReasons: string[] = [];
  let score = 0;

  // 1. Trusted sender domain check (UConn)
  if (from.includes('@uconn.edu')) {
    return {
      status: 'safe' as const,
      explanation: 'Demo: Sender is from trusted @uconn.edu domain.'
    };
  }

  // 2. Urgent/threatening language in subject
  const urgentKeywords = ['urgent', 'immediate', 'action required', 'suspended', 'verify', 'confirm', 'expires', 'limited time'];
  urgentKeywords.forEach(keyword => {
    if (subject.includes(keyword)) {
      score += 2;
      suspiciousReasons.push(`Urgent keyword in subject: "${keyword}"`);
    }
  });

  // 3. Sensitive topics in subject
  const sensitiveKeywords = ['password', 'account', 'security', 'bank', 'credit card', 'ssn', 'tax', 'refund', 'paypal', 'amazon', 'microsoft'];
  sensitiveKeywords.forEach(keyword => {
    if (subject.includes(keyword)) {
      score += 1;
      suspiciousReasons.push(`Sensitive keyword in subject: "${keyword}"`);
    }
  });

  // 4. Check body content for phishing indicators
  const phishingPhrases = [
    'verify your account',
    'confirm your identity',
    'click here',
    'suspended',
    'unusual activity',
    'update your information',
    'verify your identity',
    'confirm your password',
    'social security',
    'bank account',
    'credit card',
    'routing number',
    'account number',
    'pin number',
    'date of birth',
    'driver license',
    'passport',
    '給我',
    'give me',
    'send me',
    'provide your'
  ];

  phishingPhrases.forEach(phrase => {
    if (body.includes(phrase)) {
      score += 3;
      suspiciousReasons.push(`Phishing phrase detected: "${phrase}"`);
    }
  });

  // 5. Check for requests for personal information
  const personalInfoKeywords = ['ssn', 'social security', 'bank', 'credit card', 'password', 'pin', 'account number', 'routing', 'cvv', 'security code'];
  personalInfoKeywords.forEach(keyword => {
    if (body.includes(keyword)) {
      score += 2;
      if (!suspiciousReasons.some(r => r.includes(keyword))) {
        suspiciousReasons.push(`Requests sensitive info: "${keyword}"`);
      }
    }
  });

  // 6. Check for suspicious sender domains
  const suspiciousDomains = ['@gmail.com', '@yahoo.com', '@hotmail.com', '@outlook.com', '@mail.com'];
  const isSuspiciousDomain = suspiciousDomains.some(domain => from.includes(domain));
  
  if (isSuspiciousDomain && (subject.includes('uconn') || body.includes('uconn'))) {
    score += 4;
    suspiciousReasons.push('Non-UConn email claiming to be from UConn');
  }

  // 7. Check for display name spoofing (looks like UConn but isn't)
  if ((from.includes('uconn') || from.includes('university')) && !from.includes('@uconn.edu')) {
    score += 5;
    suspiciousReasons.push('Sender display name impersonates UConn');
  }

  // 8. Check for generic greetings (phishing often uses these)
  const genericGreetings = ['dear customer', 'dear user', 'dear member', 'valued customer', 'account holder'];
  genericGreetings.forEach(greeting => {
    if (body.includes(greeting)) {
      score += 1;
      suspiciousReasons.push('Generic greeting used (not personalized)');
    }
  });

  // 9. Check for threats or urgency in body
  const threatKeywords = ['suspend', 'close your account', 'legal action', 'penalty', 'fine', 'arrest', 'investigate'];
  threatKeywords.forEach(keyword => {
    if (body.includes(keyword)) {
      score += 2;
      if (!suspiciousReasons.some(r => r.includes('threat'))) {
        suspiciousReasons.push(`Threatening language: "${keyword}"`);
      }
    }
  });

  // 10. Check for common phishing services mentioned
  const brandKeywords = ['paypal', 'amazon', 'microsoft', 'google', 'apple', 'bank of america', 'chase', 'wells fargo', 'irs', 'fedex', 'ups'];
  brandKeywords.forEach(brand => {
    if (body.includes(brand) && !from.includes(brand)) {
      score += 2;
      suspiciousReasons.push(`Mentions "${brand}" but sender is not from that domain`);
    }
  });

  // Decision logic
  if (score >= 5) {
    return {
      status: 'suspicious' as const,
      explanation: `Demo: Email flagged as SUSPICIOUS (score: ${score}).\n\nReasons:\n${suspiciousReasons.slice(0, 5).map((r, i) => `${i + 1}. ${r}`).join('\n')}`
    };
  }

  if (score >= 2) {
    return {
      status: 'suspicious' as const,
      explanation: `Demo: Email appears potentially suspicious (score: ${score}).\n\nReasons:\n${suspiciousReasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
    };
  }

  if (suspiciousReasons.length === 0) {
    return {
      status: 'safe' as const,
      explanation: 'Demo: No obvious phishing indicators detected. Email appears normal.'
    };
  }

  return {
    status: 'unknown' as const,
    explanation: `Demo: Some minor indicators found (score: ${score}), but not conclusive.\n\nNotes:\n${suspiciousReasons.map((r, i) => `${i + 1}. ${r}`).join('\n')}`
  };
}
