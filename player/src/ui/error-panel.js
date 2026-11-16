// Visible errors: a broken scene must be noticed while preparing, not during the recording.

export function createErrorPanel(element) {
  const messages = [];
  return {
    messages,
    report(error) {
      const message = error instanceof Error ? error.message : String(error);
      messages.push(message);
      console.error(error);
      const item = document.createElement("li");
      item.textContent = message;
      element.querySelector("ul").append(item);
      element.hidden = false;
    },
  };
}
