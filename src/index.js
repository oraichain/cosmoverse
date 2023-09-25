import { createRoot } from "react-dom/client";
import Select from "react-select";

import nb from "./notebook";
import "./index.css";
import { useEffect, useRef, useState } from "react";

const options = [
  { value: "/basic.ipynb", label: "Basic interactions" },
  { value: "/ibc.ipynb", label: "IBC channels" }
];

const App = () => {
  const [value, setValue] = useState();
  const [disabled, setDisabled] = useState(false);
  const ref = useRef();

  useEffect(() => {
    changeNotebook(options[0]);
  }, []);

  const runAll = async () => {
    setDisabled(true);
    for (const run of runCodes) {
      await run();
    }
    setDisabled(false);
  };

  const changeNotebook = async (item) => {
    setValue(item);
    const json = await fetch(item.value).then((res) => res.json());
    const notebook = nb.parse(json);
    ref.current.innerHTML = "";
    ref.current.appendChild(notebook.render());
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Select autosize options={options} value={value} onChange={changeNotebook} />
        <button disabled={disabled} onClick={runAll}>
          Run all
        </button>
      </div>
      <div ref={ref} />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<App />);
