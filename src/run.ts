import { ActorId, ActorProxyBuilder, DaprClient, DaprServer } from "@dapr/dapr";
import { MakeOrder, MakeOrderImpl } from "./task/task";

const daprHost = "127.0.0.1";
const daprPortBase = 3500;
const serverHost = "127.0.0.1";
const serverPortBase = 4600;

async function run(args: string[]) {
  if (args.length != 1) {
    throw Error("Wrong args!");
  }

  const [args0] = args;
  const idx = parseInt(args0);

  await runApp(idx);
}

async function runApp(idx: number) {
  const clientOptions = {
    daprHost: daprHost,
    daprPort: `${daprPortBase + idx}`,
  };

  const daprClient = new DaprClient(clientOptions);

  const server = new DaprServer({
    serverHost,
    serverPort: `${serverPortBase + idx}`,
    clientOptions,
  });

  // Creating actor bindings
  await server.actor.init();
  server.actor.registerActor(MakeOrderImpl);

  await server.start();

  console.log("Waiting for actors to be ready");
  await new Promise((resolve) => {
    setTimeout(resolve, 500);
  });

  const resRegisteredActors = await server.actor.getRegisteredActors();
  console.log(`Registered Actor Types: ${JSON.stringify(resRegisteredActors)}`);

  const orderId = `make-order-${idx}`;
  const makeOrder = new ActorProxyBuilder<MakeOrder>(
    MakeOrderImpl,
    daprClient
  ).build(new ActorId(orderId));

  await makeOrder.start();
}

run(process.argv.slice(2)).catch((e) => {
  console.error(e);
  process.exit(1);
});
