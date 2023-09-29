import { createRoot } from "react-dom/client";

import nb from "./notebook";
import "./index.css";
import { useEffect, useRef, useState } from "react";

const options = [
  { value: "basic", label: "Basic interactions" },
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
    changeNotebook(defaultOpt.value);
  }, []);

  const runAll = async () => {
    setDisabled(true);
    for (const run of runCodes) {
      await run();
    }
    setDisabled(false);
  };

  const changeNotebook = async (value) => {
    setValue(value);
    runCodes.length = 0;
    const json = await fetch(`/nb/${value}.ipynb`).then((res) => res.json());
    const notebook = nb.parse(json);
    ref.current.innerHTML = "";
    ref.current.appendChild(notebook.render());
    url.searchParams.set("nb", value);
    history.pushState({}, null, url.toString());
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
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
      </div>
      <div ref={ref} />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<App />);
