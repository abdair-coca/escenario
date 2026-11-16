// BroadcastChannel shared by the player window and the presenter window of one presentation.
// Player → presenter: { type: "state", ... }. Presenter → player: { type: "hello" } and
// { type: "command", command: "advance" | "back" }.

export function openChannel(slug, onMessage) {
  const channel = new BroadcastChannel(`escenario:${slug}`);
  channel.addEventListener("message", (event) => onMessage(event.data));
  return {
    send: (message) => channel.postMessage(message),
    close: () => channel.close(),
  };
}
