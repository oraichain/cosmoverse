import { Asset, AssetInfo } from "@oraichain/oraidex-contracts-sdk";

export const truncDecimals = 6;
export const atomic = 10 ** truncDecimals;

export const toDisplay = (amount: string | bigint, sourceDecimals = 6, desDecimals = 6): number => {
  if (!amount) return 0;
  // guarding conditions to prevent crashing
  const validatedAmount = typeof amount === "string" ? BigInt(amount || "0") : amount;
  const displayDecimals = Math.min(truncDecimals, desDecimals);
  const returnAmount = validatedAmount / BigInt(10 ** (sourceDecimals - displayDecimals));
  // save calculation by using cached atomic
  return Number(returnAmount) / (displayDecimals === truncDecimals ? atomic : 10 ** displayDecimals);
};

export const assetInfo = (denom: string, native = true): AssetInfo => {
  return native ? { native_token: { denom } } : { token: { contract_addr: denom } };
};

export const asset = (amount: string, denom: string, native?: boolean): Asset => {
  return {
    info: assetInfo(denom, native),
    amount
  };
};
