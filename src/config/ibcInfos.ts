import { IBC_TRANSFER_TIMEOUT } from "./constants";

export type EvmChainId =
  | "0x38" // bsc
  | "0x01" // ethereum
  | "0x1ae6" // kawaii
  | "0x2b6653dc"; // tron

export type CosmosChainId =
  | "Oraichain" // oraichain
  | "oraibridge-subnet-2" // oraibridge
  | "osmosis-1" // osmosis
  | "injective-1" // injective-1
  | "cosmoshub-4" // cosmos hub
  | "kawaii_6886-1"; // kawaii subnetwork

export type NetworkChainId = CosmosChainId | EvmChainId;

export const [atom2oraichain, oraichain2atom] = process.env.ATOM_ORAICHAIN_CHANNELS.split(/\s+/);
export const [inj2oraichain, oraichain2inj] = process.env.INJECTIVE_ORAICHAIN_CHANNELS.split(/\s+/);
export const [osmosis2oraichain, oraichain2osmosis] = process.env.OSMOSIS_ORAICHAIN_CHANNELS.split(/\s+/);
export const [oraib2oraichain, oraichain2oraib] = process.env.ORAIB_ORAICHAIN_CHANNELS.split(/\s+/);
// export const [oraib2oraichain, oraichain2oraib] = ["channel-5", "channel-64"];
const [oraib2oraichain_old, oraichain2oraib_old] = process.env.ORAIB_ORAICHAIN_CHANNELS_OLD.split(/\s+/);
const [kwt2oraichain, oraichain2kwt] = process.env.KWT_ORAICHAIN_CHANNELS.split(/\s+/);

export interface IBCInfo {
  source: string;
  channel: string;
  timeout: number;
}

// exclude evm chain
export type IBCInfoMap = { [key in CosmosChainId]: { [key in NetworkChainId]?: IBCInfo } };

export const ibcInfos: IBCInfoMap = {
  "cosmoshub-4": {
    Oraichain: {
      source: "transfer",
      channel: atom2oraichain,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  },
  "injective-1": {
    Oraichain: {
      source: "transfer",
      channel: inj2oraichain,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  },
  "osmosis-1": {
    Oraichain: {
      source: "transfer",
      channel: osmosis2oraichain,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  },
  "kawaii_6886-1": {
    Oraichain: {
      source: "transfer",
      channel: kwt2oraichain,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  },
  Oraichain: {
    "cosmoshub-4": {
      source: "transfer",
      channel: oraichain2atom,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "injective-1": {
      source: "transfer",
      channel: oraichain2inj,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "osmosis-1": {
      source: "transfer",
      channel: oraichain2osmosis,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "oraibridge-subnet-2": {
      source: `wasm.${process.env.IBC_WASM_CONTRACT}`,
      channel: oraichain2oraib,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "0x01": {
      source: `wasm.${process.env.IBC_WASM_CONTRACT}`,
      channel: oraichain2oraib,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "0x38": {
      source: `wasm.${process.env.IBC_WASM_CONTRACT}`,
      channel: oraichain2oraib,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "0x2b6653dc": {
      source: `wasm.${process.env.IBC_WASM_CONTRACT}`,
      channel: oraichain2oraib,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "kawaii_6886-1": {
      source: "transfer",
      channel: oraichain2kwt,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  },
  "oraibridge-subnet-2": {
    Oraichain: {
      source: "transfer",
      channel: oraib2oraichain,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  }
};

export const ibcInfosOld: Omit<IBCInfoMap, "osmosis-1" | "cosmoshub-4" | "injective-1"> = {
  Oraichain: {
    "oraibridge-subnet-2": {
      source: "transfer",
      channel: oraichain2oraib_old,
      timeout: IBC_TRANSFER_TIMEOUT
    },
    "kawaii_6886-1": {
      source: "transfer",
      channel: oraichain2kwt,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  },
  "oraibridge-subnet-2": {
    Oraichain: {
      source: "transfer",
      channel: oraib2oraichain_old,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  },
  "kawaii_6886-1": {
    Oraichain: {
      source: "transfer",
      channel: kwt2oraichain,
      timeout: IBC_TRANSFER_TIMEOUT
    }
  }
};
