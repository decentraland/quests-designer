<p align="center">
  <a href="https://decentraland.org">
    <img alt="Decentraland" src="https://decentraland.org/images/logo.png" width="60" />
  </a>
</p>
<h1 align="center">
  Quests Designer
</h1>

Component to design a Quest for [Decentraland's Quests Service](https://github.com/decentraland/quests-designer).

## Setup

If you want to contribute to the package, you can clone the repository and install the dependencies of the project with:

```bash
$ npm i
```

And you're ready to start contributing.


You can build the package with:

```bash
$ make build
```

and run the tests with:

```bash
$ make test
```

## Usage

To use this package in your project, you can install it with:

```bash
$ npm i @dcl/quests-designer@latest
```

And then you can start using it in your code:

```tsx
import React from "react"
import { createRoot } from "react-dom/client"
import { QuestsDesigner } from "@dcl/quests-designer"
import { initialNodes } from "@dcl/quests-designer/dist/utils"

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QuestsDesigner
      initialEdges={[]}
      initialNodes={initialNodes}
      backButton={() => alert("close")}
      saveDesignButton={{
        onClick: async (def, nodes, edges) => {
          console.log(def)
          console.log(nodes)
          console.log(edges)
          await navigator.clipboard.writeText(JSON.stringify(def))
          alert("Saved")
        },
        content: "Generate Quest",
      }}
    />
  </React.StrictMode>,
)
```

## Example

You can see an example of the package in action by running:

```bash
$ npm run example
```

This will start a local server with a simple example of the package. 

Also this component is used in the [Quests Manager](https://github.com/decentraland/quests-manager).
