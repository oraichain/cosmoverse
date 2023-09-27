import { createRoot } from "react-dom/client";
import Select from "react-select";

import nb from "./notebook";
import "./index.css";
import { useEffect, useRef, useState } from "react";

const options = [
  { value: "basic", label: "Basic interactions" },
  { value: "zk", label: "Zero-knowledge VM" },
  { value: "dao", label: "Interchain DAO" },
  { value: "orderbook", label: "Orderbook" },
  { value: "ibc-ics20", label: "IBC channels with ICS20" }
];

const url = new URL(location.href);

const App = () => {
  const [value, setValue] = useState();
  const [disabled, setDisabled] = useState(false);
  const ref = useRef();

  useEffect(() => {
    const defaultOpt = options.find((opt) => opt.value === url.searchParams.get("nb")) ?? options[0];
    changeNotebook(defaultOpt);
  }, []);

  const runAll = async () => {
    setDisabled(true);
    for (const run of runCodes) {
      await run();
    }
    setDisabled(false);
  };

  const changeNotebook = async (opt) => {
    setValue(opt);
    runCodes.length = 0;
    const json = await fetch(`/nb/${opt.value}.ipynb`).then((res) => res.json());
    const notebook = nb.parse(json);
    ref.current.innerHTML = "";
    ref.current.appendChild(notebook.render());
    url.searchParams.set("nb", opt.value);
    history.pushState({}, null, url.toString());
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Select autosize options={options} value={value} onChange={changeNotebook} />
        <button style={{ position: "fixed", right: 10, top: 10, zIndex: 9999 }} disabled={disabled} onClick={runAll}>
          Run all
        </button>
      </div>
      <div ref={ref} />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<App />);
