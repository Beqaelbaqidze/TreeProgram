import { HttpClass } from "../http.class.js";
import { TreeHtml } from "./treeHtml.class.js";
import { TreeEventHandler } from "./treeFunctions.js";
import { SearchContent } from "./searchContent.class.js";

export class MainTree {
  #httpClient;
  #treeData = [];
  #labelKeys;
  #chngHtml;
  #rootElement;
  #eventHandler;
  insertSearch;

  constructor(options) {
    this.options = options;
    this.#labelKeys = options.labels
      ? options.labels.split("; ").map((key) => key.trim())
      : ["name"];
    this.#chngHtml = options.html;
    this.#rootElement = document.querySelector(options.rootElement);
    this.#httpClient = new HttpClass();
    this.#httpClient.request({ url: options.url }).then((data) => {
      this.inject(data);
      this.buildHtmlAndInject(this.#rootElement);
    });
    this.#eventHandler = new TreeEventHandler(
      this.#httpClient,
      this.options,
      this.inject.bind(this),
      this.buildHtmlAndInject.bind(this)
    );
    this.#rootElement.addEventListener("click", () => {
      this.#eventHandler.initEvents.bind(this.#eventHandler);
    });
    if (this.options.searchContentRootElement) {
      const searchContainer = document.querySelector(
        this.options.searchContentRootElement
      );
      if (!searchContainer) {
        const newSearchContainer = document.createElement("div");
        newSearchContainer.id = "searchContainer";
        document.body.insertBefore(
          newSearchContainer,
          document.body.firstChild
        );
        this.options.searchContentRootElement = "#searchContainer";
      }
      this.insertSearch = new SearchContent(
        this.options.searchContentRootElement,
        this.options.searchLink,
        this.#labelKeys,
        this.options
      );
    }
  }

  inject(data) {
    this.#treeData = data;
  }

  async buildHtmlAndInject(rootElement) {
    let savedDataId = localStorage.getItem("selectedDataId");
    const extraHtml = this.#chngHtml;
    const html = this.#treeData
      .map((node) => {
        const label = this.#labelKeys.map((key) => node[key]).join(", ");
        const treeHtml = new TreeHtml(
          node.id,
          label,
          node,
          node.icon,
          node.statusIcon,
          this.options.baseUrl,
          node.hasChildren,
          this.options.nodeElement,
          extraHtml,
          savedDataId
        );
        return treeHtml.htmlUlTpl();
      })
      .join("");

    rootElement.innerHTML += `<ul>${html}</ul>`;

    // Check if the selected element exists before clicking
    if (savedDataId) {
      const selectedElement = document.querySelector(
        `[data-id="${savedDataId}"]`
      );
      if (selectedElement) {
        selectedElement.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
        selectedElement.classList.add("selected");
      }
    }
  }
}
