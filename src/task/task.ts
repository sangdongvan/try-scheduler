import { AbstractActor, Temporal } from "@dapr/dapr";

export interface MakeOrder {
  start(): Promise<void>;
}

export class MakeOrderImpl extends AbstractActor implements MakeOrder {
  private count: number = 0;

  async start() {
    await this.registerActorReminder(
      "start1",
      Temporal.Duration.from({ seconds: 1 }),
      Temporal.Duration.from({ seconds: 3 }),
      undefined,
      "start1"
    );

    await this.registerActorReminder(
      "start2",
      Temporal.Duration.from({ seconds: 3 }),
      Temporal.Duration.from({ seconds: 5 }),
      undefined,
      "start2"
    );

    await this.registerActorReminder(
      "end",
      Temporal.Duration.from({ seconds: 2 }),
      Temporal.Duration.from({ seconds: 4 }),
      undefined,
      "end"
    );
  }

  /**
   * @override
   */
  async receiveReminder(_data: string) {
    if (_data == "start1") {
      await this.unregisterActorReminder("start1");
      this.count = this.count + 1;
      console.log("receive reminder [START 1] " + this.count);
      return;
    }

    if (_data == "start2") {
      await this.unregisterActorReminder("start2");
      this.count = this.count + 1;
      console.log("receive reminder [START 2] " + this.count);
      return;
    }

    if (_data == "end") {
      await this.unregisterActorReminder("end");
      this.count = this.count + 1;
      console.log("receive reminder [END    ] " + this.count);
      return;
    }
  }
}
