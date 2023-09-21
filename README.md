## Step by step how to play with cosmwasm simulation tools

### add cw-simulate module

```bash
yarn add @oraichain/cw-simulate -D
```

### Features

- configure multiple host chain environments with chain-specific settings / state
- multiple simultaneous contract instances can exist per chain
- chain modules can be simulated through custom user code
- extensible for further instrumentation via custom middlewares
- load fork state from running blockhain

### Import cw-simulate module and create new instance

```js
import { SimulateCosmWasmClient } from "@oraichain/cw-simulate";
const senderAddress = "orai14vcw5qk0tdvknpa38wz46js5g7vrvut8lk0lk6";
const client = new SimulateCosmWasmClient({
  chainId: "Oraichain",
  bech32Prefix: "orai",
  metering: true
});
```

### Setup account balance then transfer

```js
import { coins } from "@cosmjs/stargate";
client.app.bank.setBalance(senderAddress, coins("10000000", "orai"));

await client.getBalance(senderAddress, "orai");
```

### Deploy contract on SimulateCosmwasmClient

```js
import { Cw20BaseClient } from "@oraichain/common-contracts-sdk";
import * as commonArtifacts from "@oraichain/common-contracts-build";
import fs from "fs";

const { codeId } = await client.upload(
  senderAddress,
  fs.readFileSync(commonArtifacts.getContractDir("cw20-base")),
  "auto"
);
const { contractAddress, gasUsed } = await client.instantiate(senderAddress, codeId, {
  decimals: 6,
  symbol: "CVT",
  name: "cosmoverse token",
  mint: { minter: senderAddress },
  initial_balances: [{ address: senderAddress, amount: "1000000000" }]
});
const cw20Contract = new Cw20BaseClient(client, senderAddress, contractAddress);

await cw20Contract.tokenInfo();
```

### Console.log in smart contract

1. run `code ../cw-plus/contracts/cw20-base` to add log function
1. run `cwtools build ../cw-plus/contracts/cw20-base -d -w -o node_modules/@oraichain/common-contracts-build/data/` to override wasm contract file
1. re-run notebook above to see the log

### Execute contract with gas metering

```js
import { Cw20BaseClient } from "@oraichain/common-contracts-sdk";
const cw20Contract = new Cw20BaseClient(client, senderAddress, contractAddress);
const { gasUsed } = await cw20Contract.transfer({
  amount: "1000000",
  recipient: "orai1ur2vsjrjarygawpdwtqteaazfchvw4fg6uql76"
});
console.log(`Transfer token required gas: ${gasUsed}`);

await cw20Contract.balance({ address: "orai1ur2vsjrjarygawpdwtqteaazfchvw4fg6uql76" });
```

### Setup IBC channels

```js
import { CWSimulateApp } from "@oraichain/cw-simulate";

const cosmosChain = new CWSimulateApp({
  chainId: "cosmoshub-4",
  bech32Prefix: "cosmos"
});

// relay message between Cosmos Hub and Oraichain
cosmosChain.ibc.relay("channel-0", "transfer", "channel-0", "transfer", client.app);
```

### Send Orai token from Oraichain to Cosmos Hub

```js
// mint ibc/orai on cosmos hub and burn orai on oraichain
await client.app.ibc.sendTransfer({
  channelId: "channel-0",
  receiver: "cosmos1ur2vsjrjarygawpdwtqteaazfchvw4fgf0kulf",
  token: { amount: "1000000", denom: "orai" },
  sender: senderAddress
});

cosmosChain.bank.getBalance("cosmos1ur2vsjrjarygawpdwtqteaazfchvw4fgf0kulf");
```

### Send back IBC Orai from Cosmos Hub to Oraichain

```js
// mint orai on oraichain and burn ibc/orai on cosmos hub
await cosmosChain.ibc.sendTransfer({
  channelId: "channel-0",
  receiver: senderAddress,
  token: { amount: "1000000", denom: "ibc/56c280c7163a5e37ea987d3fa195ea719b7b7c7d319615afaa17cba5a347cec4" },
  sender: "cosmos1ur2vsjrjarygawpdwtqteaazfchvw4fgf0kulf"
});

cosmosChain.bank.getBalance("cosmos1ur2vsjrjarygawpdwtqteaazfchvw4fgf0kulf");
```

### Load smart contract with state from running blockchain

```js
import { DownloadState } from "@oraichain/cw-simulate";
import { Cw20BaseClient } from "@oraichain/common-contracts-sdk";
import path from "path";

const downloadState = new DownloadState("https://lcd.orai.io", path.join(__dirname, "src/data"));
await downloadState.loadState(client, senderAddress, "orai1nd4r053e3kgedgld2ymen8l9yrw8xpjyaal7j5", "kwt token");
const kwtContract = new Cw20BaseClient(client, senderAddress, "orai1nd4r053e3kgedgld2ymen8l9yrw8xpjyaal7j5");

await kwtContract.allAccounts({ limit: 5 });
```

### Setup port module using smart contract

```js
import * as commonArtifacts from "@oraichain/common-contracts-build";
import { CwIcs20LatestClient } from "@oraichain/common-contracts-sdk";
import fs from "fs";

// deploy ics20 contract
const { codeId } = await client.upload(
  senderAddress,
  fs.readFileSync(commonArtifacts.getContractDir("cw-ics20-latest")),
  "auto"
);

const { contractAddress } = await client.instantiate(senderAddress, codeId, {
  allowlist: [],
  default_timeout: 3600,
  gov_contract: senderAddress,
  swap_router_contract: "placeholder"
});

const ics20Contract = new CwIcs20LatestClient(client, senderAddress, contractAddress);

await ics20Contract.config();
```

### Setup IBC channel between Cosmos Hub transfer port module and Oraichain CosmWasm port module

```js
const oraiPort = "wasm." + ics20Contract.contractAddress;
const channel = "channel-2";
const packetData = {
  src: {
    port_id: "transfer",
    channel_id: channel
  },
  dest: {
    port_id: oraiPort,
    channel_id: channel
  },
  sequence: 27,
  timeout: {
    block: {
      revision: 1,
      height: 12345678
    }
  }
};

// init ibc channel between two chains
client.app.ibc.relay(channel, oraiPort, channel, "transfer", cosmosChain);
```

### Send Open and Connect packets

```js
import { IbcOrder } from "@oraichain/cw-simulate";

await cosmosChain.ibc.sendChannelOpen({
  open_init: {
    channel: {
      counterparty_endpoint: {
        port_id: oraiPort,
        channel_id: channel
      },
      endpoint: {
        port_id: "transfer",
        channel_id: channel
      },
      order: IbcOrder.Unordered,
      version: "ics20-1",
      connection_id: "connection-0"
    }
  }
});

await cosmosChain.ibc.sendChannelConnect({
  open_ack: {
    channel: {
      counterparty_endpoint: {
        port_id: oraiPort,
        channel_id: channel
      },
      endpoint: {
        port_id: "transfer",
        channel_id: channel
      },
      order: IbcOrder.Unordered,
      version: "ics20-1",
      connection_id: "connection-0"
    },
    counterparty_version: "ics20-1"
  }
});

// handle IBC message timeout
cosmosChain.ibc.addMiddleWare((msg, app) => {
  const data = msg.data.packet;
  if (Number(data.timeout.timestamp) < cosmosChain.time) {
    throw new GenericError("timeout at " + data.timeout.timestamp);
  }
});
```

### Prepare for interaction

```js
import { coins } from "@cosmjs/stargate";
// topup
client.app.bank.setBalance(ics20Contract.contractAddress, coins("10000000000000", "orai"));

const airiIbcDenom = "tron-testnet0x7e2A35C746F2f7C240B664F1Da4DD100141AE71F";

await ics20Contract.updateMappingPair({
  localAssetInfo: {
    token: {
      contract_addr: cw20Contract.contractAddress
    }
  },
  localAssetInfoDecimals: 6,
  denom: airiIbcDenom,
  remoteDecimals: 6,
  localChannelId: channel
});

await client.getBalance(ics20Contract.contractAddress, "orai");
```

### Send IBC token between Cosmos Hub and Oraichain

```js
import bech32 from "bech32";
import { toBinary } from "@cosmjs/cosmwasm-stargate";

const cosmosSenderAddress = bech32.encode("cosmos", bech32.decode(senderAddress).words);

// now send ibc package
const icsPackage = {
  amount: "100000000",
  denom: airiIbcDenom,
  receiver: senderAddress,
  sender: cosmosSenderAddress,
  memo: ""
};

// transfer from cosmos to oraichain, should pass
await cosmosChain.ibc.sendPacketReceive({
  packet: {
    data: toBinary(icsPackage),
    ...packetData
  },
  relayer: cosmosSenderAddress
});

const transferBackMsg = {
  local_channel_id: channel,
  remote_address: cosmosSenderAddress,
  remote_denom: airiIbcDenom
};

cw20Contract.sender = senderAddress;

await cw20Contract.send({
  amount: "100000000",
  contract: ics20Contract.contractAddress,
  msg: toBinary(transferBackMsg)
});
const ibcBalance = await cw20Contract.balance({ address: ics20Contract.contractAddress });

// should return initialBalance: 100000000
ibcBalance.balance;
```
