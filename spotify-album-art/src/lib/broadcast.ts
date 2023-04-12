type MessageCallback<T> = (message: T) => void;

export class MyBroadcastChannel<T> {
  private channel: BroadcastChannel;

  constructor(name: string) {
    this.channel = new BroadcastChannel(name);
  }

  postMessage(message: T): void {
    this.channel.postMessage(message);
  }

  addEventListener(callback: MessageCallback<T>): void {
    this.channel.addEventListener("message", (event) => {
      if (event.data) {
        callback(event.data);
      }
    });
  }

  removeEventListener(callback: MessageCallback<T>): void {
    this.channel.removeEventListener("message", (event) => {
      if (event.data) {
        callback(event.data);
      }
    });
  }

  close(): void {
    this.channel.close();
  }
}
