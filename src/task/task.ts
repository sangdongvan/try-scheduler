import { AbstractActor, Temporal } from "@dapr/dapr";

export interface MakeOrder {
  start(): Promise<void>;
}

export class MakeOrderImpl extends AbstractActor implements MakeOrder {
  private count: number = 0;

  async start() {
    await this.registerActorReminder(
      "start",
      Temporal.Duration.from({ seconds: 1 }),
      Temporal.Duration.from({ seconds: 3 })
    );
  }

  /**
   * @override
   */
  async receiveReminder() {
    this.count = this.count + 1;
    console.log("receive reminder " + this.count);
  }
}
