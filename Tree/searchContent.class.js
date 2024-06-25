import { HttpClass } from "../http.class.js";
import { TreeHtml } from "./treeHtml.class.js";

export class SearchContent {
  #httpClient;

  constructor(rootElement, url, value, options) {
    this.rootElement = document.querySelector(rootElement);
    this.url = url;
    this.value = value;
    this.options = options;
    this.#httpClient = new HttpClass();
    if (this.rootElement) {
      this.inject(this.rootElement);

      this.addSearchEventListener(); // Add event listener after injecting the HTML
    } else {
      console.error(`Element not found for selector: ${rootElement}`);
    }
  }

  inject(root) {
    root.innerHTML += `<div class="searchTree" style="display: flex; padding: 16px;"><input type="text" placeholder="ძებნა" id="searchValue" style="width: 100%; height: 36px; margin-right: 16px;"><button class="searchBtn">Search</button></div>`;
  }

  addSearchEventListener() {
    const searchBtn = this.rootElement.querySelector(".searchBtn");
    if (searchBtn) {
      searchBtn.addEventListener("click", () => this.searchFunction());
    } else {
      console.error("Search button not found");
    }
  }

  searchFunction() {
    const searchValue = document.getElementById("searchValue").value;
    if (searchValue) {
      const urlWithQuery = this.url + searchValue;
      this.#httpClient
        .request({ url: urlWithQuery })
        .then((data) => {
          // Handle the data received from the request
          this.findNodes(data.nodes); // Pass the received nodes to findNodes method
        })
        .catch((error) => {
          // Handle any errors from the request
          console.error("Error during the request:", error);
        });
    } else {
      console.warn("Search value is empty");
    }
  }

  findNodes(nodes) {
    nodes.forEach((nodeData, index) => {
      const nodeId = nodeData.id;
      const parentId = nodeData.parentId;
      const isLastElement = index === nodes.length - 1;

      const existingNode = document.querySelector(`[main-id='${nodeId}']`);

      if (existingNode) {
        document
          .querySelectorAll(".nodeAttContainer.selected")
          .forEach((el) => el.classList.remove("selected"));
        const nodeElement = document.querySelector(`[data-id="${nodeId}"]`);
        if (nodeElement) {
          const nodeDiv = nodeElement.closest("div");
          nodeDiv.click();
        } else {
          console.error(`Node element not found for data-id: ${nodeId}`);
        }
      } else {
        // Locate the parent node where the new node should be appended
        const parentElement = document.querySelector(`[main-id='${parentId}']`);
        if (parentElement) {
          const label = this.value.map((key) => nodeData[key]).join(", ");
          const treeHtml = new TreeHtml(
            nodeData.id,
            label,
            nodeData,
            nodeData.icon,
            nodeData.statusIcon,
            this.options.baseUrl,
            nodeData.hasChildren,
            this.options.nodeElement
          );
          const newNodeHtml = treeHtml.htmlUlTpl();
          parentElement.innerHTML += `<ul>${newNodeHtml}</ul>`;

          // Check if this is the last element and handle the class
          if (isLastElement) {
            const newNodeElement = parentElement.querySelector(
              `[main-id='${nodeId}'] .nodeAttContainer`
            );
            if (newNodeElement) {
              // Remove 'selected' class from all nodes
              document
                .querySelectorAll(".nodeAttContainer.selected")
                .forEach((el) => el.classList.remove("selected"));
              // Add 'selected' class to the new node
              newNodeElement.click();
              //   localStorage.setItem("selectedDataId", dataId);
            }
          }
        } else {
          console.error(`Parent node with ID ${parentId} not found.`);
        }
      }
    });
  }
}
