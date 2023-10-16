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

### NoteBooks

1. [Basic Note Book](./public/nb/basic.ipynb)
1. [Dao Note Book](./public/nb/dao.ipynb)
1. [Orderbook Note Book](./public/nb/orderbook.ipynb)
1. [ICS20 Note Book](./public/nb/ibc-ics20.ipynb)

### Compare to cosmwasm-multitest

| feature                  | @oraichain/cw-simulate                       | cw-multitest |
| ------------------------ | -------------------------------------------- | ------------ |
| multiple contract        | Yes                                          | Yes          |
| blockchain module        | bank, wasm, ibc                              | bank, wasm   |
| snapshot                 | Yes                                          | No           |
| production compatibility | compatible with `@cosmjs/cosmwasm-startgate` | Internal use |
| forking networks         | Yes                                          | No           |

### Compare to hardhat

| feature                  | @oraichain/cw-simulate                  | hardhat                    |
| ------------------------ | --------------------------------------- | -------------------------- |
| multiple contract        | Yes                                     | Yes                        |
| blockchain module        | bank, wasm, ibc                         | evm                        |
| snapshot                 | Yes                                     | Yes                        |
| production compatibility | compatible `@cosmjs/cosmwasm-startgate` | compatible `ethers.js`     |
| forking networks         | Yes                                     | Yes                        |
| console.log              | Using `deps.api.debug`                  | Yes                        |
| Typescript codegen       | Using `@oraichain/cwtools`              | Using `@typechain/hardhat` |
