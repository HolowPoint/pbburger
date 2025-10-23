/* global Office */

Office.onReady(() => {
  // Placeholder for command functions if needed later
});

export function action(event: Office.AddinCommands.Event) {
  // Simple notification
  Office.context.mailbox.item.notificationMessages.replaceAsync(
    'uconn-notice',
    {
      type: 'informationalMessage',
      message: 'UConn Email Safety add-in is active.',
      icon: 'Icon.32',
      persistent: false
    },
    () => event.completed()
  );
}

// Required entry point for function file
(function () {
  if (typeof self !== 'undefined') {
    (self as unknown as Record<string, unknown>).action = action;
  }
})();


