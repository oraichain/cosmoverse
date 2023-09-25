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
  const ref = useRef();

  useEffect(() => {
    changeNotebook(options[0]);
  }, []);

  const runAll = async () => {
    for (const run of runCodes) await run();
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
        <button onClick={runAll}>Run all</button>
      </div>
      <div ref={ref} />
    </div>
  );
};

const root = createRoot(document.getElementById("root"));

root.render(<App />);
