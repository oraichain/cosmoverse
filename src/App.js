import nb from "./notebook";
import { useEffect, useRef } from "react";
import Prism from "prismjs";

function App() {
  const ref = useRef();
  // const [html, setHtml] = useState("");
  useEffect(() => {
    fetch("/readme.ipynb")
      .then((res) => res.json())
      .then((json) => {
        const notebook = nb.parse(json);
        ref.current.appendChild(notebook.render());
        Prism.highlightAll();
      });
  }, []);

  return <div className="App" ref={ref}></div>;
}

export default App;
