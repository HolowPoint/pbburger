/* global Office */

export type MessageMetadata = {
  internetMessageId?: string;
  subject?: string;
  from?: string;
  to?: string[];
  cc?: string[];
  body?: string;
};

export async function getSelectedMessageMetadata(): Promise<MessageMetadata> {
  return new Promise((resolve, reject) => {
    try {
      const item = Office.context?.mailbox?.item as Office.MessageRead | undefined;
      if (!item) {
        resolve({});
        return;
      }
      const meta: MessageMetadata = {
        subject: item.subject,
        internetMessageId: (item as any).internetMessageId,
      };
      // From
      const from = (item as Office.MessageRead).from;
      if (from) {
        meta.from = formatEmailAddress(from.emailAddress, from.displayName);
      }
      // To
      const to = (item as Office.MessageRead).to;
      if (to && to.length) {
        meta.to = to.map((r) => formatEmailAddress(r.emailAddress, r.displayName));
      }
      // CC
      const cc = (item as Office.MessageRead).cc;
      if (cc && cc.length) {
        meta.cc = cc.map((r) => formatEmailAddress(r.emailAddress, r.displayName));
      }
      // Body (async)
      if (item.body) {
        item.body.getAsync(Office.CoercionType.Text, (result) => {
          if (result.status === Office.AsyncResultStatus.Succeeded) {
            meta.body = result.value;
          }
          resolve(meta);
        });
      } else {
        resolve(meta);
      }
    } catch (e) {
      reject(e);
    }
  });
}

function formatEmailAddress(email?: string | null, displayName?: string | null): string {
  const e = (email || '').trim();
  const d = (displayName || '').trim();
  return d && e ? `${d} <${e}>` : e || d || '';
}


