import nb from "./notebook";
import "./index.css";

fetch("/readme.ipynb")
  .then((res) => res.json())
  .then((json) => {
    const notebook = nb.parse(json);
    document.querySelector("#root").appendChild(notebook.render());
  });
