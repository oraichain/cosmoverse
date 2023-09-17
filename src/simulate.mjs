import { SimulateCosmWasmClient, DownloadState } from "@oraichain/cw-simulate";
import { OraiswapLimitOrderClient } from "@oraichain/oraidex-contracts-sdk";
import path from "path";
import { fileURLToPath } from "url";

const downloadState = new DownloadState(
  process.env.LCD,
  path.join(path.dirname(fileURLToPath(import.meta.url)), "data")
);

const senderAddress = "orai14vcw5qk0tdvknpa38wz46js5g7vrvut8lk0lk6";
const client = new SimulateCosmWasmClient({
  chainId: "Oraichain",
  bech32Prefix: "orai"
  // metering: true
});

(async () => {
  // download
  // downloadState.saveState(process.env.AIRI_CONTRACT);

  const storages = {
    auction: "orai1u8r0kkmevkgjkeacfgh0jv268kap82af937pwz",
    offering: "orai15cmdgfph74uahck6edl6zz5mg5z7gwxyehyggm",
    ai_royalty: "orai1s5jlhcnqc00hqmldhts5jtd7f3tfwmr4lfheg8",
    offering_v2: "orai107ku785v2e52e9kxe26kaguene3re7cy396uq6",
    "offering_v1.1": "orai1hur7m6wu7v79t6m3qal6qe0ufklw8uckrxk5lt",
    datahub_storage: "orai1mlslct409ztn96j4zrywg9l26xr8gpwe2npdv4",
    "1155_storage": "orai1v2psavrxwgh39v0ead7z4rcn4qq2cfnast98m9",
    auction_extend: "orai1c5eftzwqqsth437uemx45qgyr38djhkde7t2as",
    rejected_storage: "orai1fp9lernzdwkg5z9l9ejrwjmjvezzypacspmw27",
    whitelist_storage: "orai1u4zqgyt8adq45a8xffc356dr8dqsny6merh0h0",
    market_721_payment_storage: "orai1ynvtgqffwgcxxx0hnehj4t7gsmv25nrr770s83",
    market_1155_payment_storage: "orai1l783x7q0yvr9aklr2zkpkpspq7vmxmfnndgl7c",
    governance: "orai14tqq093nu88tzs7ryyslr78sm3tzrmnpem6fak",
    implementation: "orai1yngprf4w3s0hvgslr2txntk5kwrkp8kcqv2n3ceqy7xrazqx8nasp6xkff",
    orderbook: "orai1nt58gcu4e63v7k55phnr3gaym9tvk3q4apqzqccjuwppgjuyjy6sxk8yzp"
  };

  for (const [label, addr] of Object.entries(storages))
    await downloadState.loadState(client, senderAddress, addr, label);

  console.log(await client.queryContractSmart(storages.implementation, { offering: { get_offerings: { limit: 1 } } }));

  const orderbookContract = new OraiswapLimitOrderClient(client, senderAddress, storages.orderbook);
  const start = performance.now();
  const ret = await orderbookContract.orders({
    filter: { bidder: "orai1g4s5qdw54wdj6ggukfdr59j4uv82asczunxpj7" },
    assetInfos: [
      {
        native_token: { denom: "orai" }
      },
      {
        token: {
          contract_addr: "orai12hzjxfh77wl572gdzct2fxv2arxcwh6gykc7qh"
        }
      }
    ]
  });
  console.dir(ret, { depth: null });
})();
