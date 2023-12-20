import { createRoot } from "react-dom/client";

import nb from "@oraichain/notebookjs";
import "./index.css";
import { useEffect, useRef, useState } from "react";

// polyfill Buffer
window.Buffer = require("buffer").Buffer;

nb.updateDepedencies({
  "ts-results": require("ts-results"),
  bech32: require("bech32"),
  "@cosmjs/stargate": require("@cosmjs/stargate"),
  "@cosmjs/cosmwasm-stargate": require("@cosmjs/cosmwasm-stargate"),
  "@oraichain/cw-simulate": require("@oraichain/cw-simulate"),
  "@oraichain/cosmwasm-vm-zk": require("@oraichain/cosmwasm-vm-zk"),
  "@oraichain/common-contracts-sdk": require("@oraichain/common-contracts-sdk"),
  "@oraichain/oraidex-contracts-sdk": require("@oraichain/oraidex-contracts-sdk"),
  "@oraichain/dao-contracts-sdk": require("@oraichain/dao-contracts-sdk")
});

const options = [
  { value: "basic", label: "Basic interactions" },
  { value: "dao", label: "Interchain DAO" },
  { value: "orderbook", label: "Orderbook" },
  { value: "ibc-ics20", label: "IBC channels with ICS20" },
  { value: "oraix", label: "ORAIX Token" }
];

const url = new URL(location.href);

const App = () => {
  const [value, setValue] = useState();
  const [disabled, setDisabled] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const defaultOpt = options.find((opt) => opt.value === url.searchParams.get("nb")) ?? options[0];
    changeNotebook(defaultOpt.value);
  }, []);

  const runAll = async () => {
    setDisabled(true);
    await nb.runAll();
    setDisabled(false);
  };

  const changeNotebook = async (value) => {
    setValue(value);
    window.scrollTo(0, 0);
    url.searchParams.set("nb", value);
    history.pushState({}, null, url.toString());
    const notebook = await nb.fetch(value);
    if (ref.current.lastElementChild) {
      ref.current.replaceChild(notebook.render(), ref.current.lastElementChild);
    } else {
      ref.current.appendChild(notebook.render());
    }
  };

  return (
    <div>
      <div className="nb-list">
        {options.map((opt, ind) => (
          <button
            className={value === opt.value ? "selected" : ""}
            key={opt.value}
            onClick={() => changeNotebook(opt.value)}
          >
            {ind + 1}.{opt.label}
          </button>
        ))}
      </div>
      <button className="selected runall" disabled={disabled} onClick={runAll}>
        Run all
      </button>

      <div ref={ref} />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<App />);
