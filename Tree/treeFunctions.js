import { ContextMenuHandler } from "./contextMenu.class.js";
import { TreeHtml } from "./treeHtml.class.js";
import { SearchContent } from "./searchContent.class.js";

export class TreeEventHandler {
  constructor(httpClient, options, inject, buildHtmlAndInject) {
    this.httpClient = httpClient;
    this.options = options;
    this.inject = inject;
    this.click = options.click;
    this.dbclick = options.dbclick;
    this.buildHtmlAndInject = buildHtmlAndInject;
    this.handleClick = this.handleClick.bind(this);
    this.oneClick = this.oneClick.bind(this);
    this.doubleClick = this.doubleClick.bind(this);
    if (!this.options.contextMenu == "") {
      this.contextMenuHandler = new ContextMenuHandler(options);
    }
    this.initEvents();
    this.addStyles();
  }

  initEvents() {
    const vRootElement = document.querySelector(this.options.rootElement);

    if (vRootElement) {
      vRootElement.addEventListener("click", this.handleClick);
      vRootElement.addEventListener("click", this.oneClick);
      vRootElement.addEventListener("dblclick", this.doubleClick);
      if (!this.options.contextMenu == "") {
        vRootElement.addEventListener("contextmenu", (event) =>
          this.contextMenuHandler.contextMenu(event)
        );
      }

      this.addClasses(vRootElement);
    } else {
      console.error("Root element not found:", this.options.rootElement);
    }
  }

  addStyles() {
    const styles = `
    #treeContainer li {
        margin-left: 12px;
    }
    .nodeAttContainer {
        display: flex;
        align-items: center;
        height: 34px;
        margin-bottom: 8px;
    }
    #treeContainer {
        display: flex;
        flex-direction: column;
        height: calc(100vh - 80px);
        width: 300px;
        overflow-y: scroll;
    }
    #treeContainer button {
        cursor: pointer;
        background-color: inherit;
        border: 0;
        padding: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        margin-right: 8px;
    }
    #treeContainer button svg {
        transition: 0.3s ease-in-out;
    }
    .rotated {
        transform: rotate(90deg);
    }
    .selected {
        border-radius: 4px;
        border: 1px solid var(--Primary-600, #1762B2);
    }
    .nodeAttContainer, .nodeAttContainer div, .nodeAttContainer p {
        cursor: pointer;
    }
    .context-menu {
        display: none;
        width: 190px;
        padding: 8px;
        position: absolute;
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
        border-radius: 4px;
        background: var(--Background, #FFF);
        box-shadow: 8px 8px 24px 0px rgba(0, 0, 0, 0.24);
    }
    .context-menu.active {
        display: block;
    }
    .context-menu ul {
        list-style: none;
        padding: 0;
        margin: 0;
    }
    .context-menu ul li {
        padding: 8px 12px;
        cursor: pointer;
        margin: 0;
    }
    .context-menu ul li:hover {
        border-radius: 2px;
        background: var(--Primary-600, #1762B2);
        color: #fff;
    }
    #lastElem p{
      font-size: 10px;
      font-style: normal;
      font-weight: 500;
      line-height: 15px;
      text-transform: uppercase;
    }
  `;

    const style = document.createElement("style");
    style.appendChild(document.createTextNode(styles));
    document.head.appendChild(style);
  }

  addClasses(rootElement) {
    const liElements = rootElement.querySelectorAll("li");
    liElements.forEach((element) => {
      element.classList.add("liNode");
    });
  }

  async handleClick(event) {
    const target = event.target;

    if (target.classList.contains("arrow") || target.closest(".arrow")) {
      const root = target.closest("li");
      const ul = root ? root.querySelector("ul") : null;
      const arrow = target.classList.contains("arrow")
        ? target
        : target.querySelector(".arrow");

      arrow.classList.toggle("rotated");

      if (ul) {
        ul.style.display = ul.style.display === "none" ? "block" : "none";
        ul.classList.toggle("loaded");
      }

      if (!target.classList.contains("loaded")) {
        target.classList.add("loaded");
        const parentId = target.getAttribute("data-id");
        const requestConfig = {
          url: `${this.options.url}=${parentId}`,
        };

        try {
          const response = await this.httpClient.request(requestConfig);
          if (response && response.length > 0) {
            this.inject(response);
            this.buildHtmlAndInject(root);
          }
        } catch (error) {
          console.error("Error loading data:", error);
          target.classList.remove("loaded");
          if (ul) {
            ul.style.display = "none";
            ul.classList.remove("loaded");
          }
        }
      }
    }
  }

  selectFunction(event) {
    const target = event.target;
    const isParent = target.classList.contains("nodeAttContainer");
    const parentChild = target.classList.contains("textValue");

    if (isParent || parentChild) {
      document.querySelectorAll(".nodeAttContainer").forEach((elem) => {
        elem.classList.remove("selected");
      });
      let selectedElement;
      if (isParent) {
        selectedElement = target;
        target.classList.add("selected");
      } else if (parentChild) {
        selectedElement = target.closest(".nodeAttContainer");
        selectedElement.classList.add("selected");
      }

      if (selectedElement) {
        const dataId = selectedElement.getAttribute("data-id");
        if (dataId) {
          localStorage.setItem("selectedDataId", dataId);
        }

        // Scroll the selected element into view
        selectedElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }

  oneClick(event) {
    this.selectFunction(event);
    const target = event.target;
    const isParent = target.classList.contains("nodeAttContainer");
    const parentChild = target.classList.contains("textValue");

    if (isParent || parentChild) {
      eval(this.click);
    }
  }

  doubleClick(event) {
    this.selectFunction(event);
    const target = event.target;
    const isParent = target.classList.contains("nodeAttContainer");
    const parentChild = target.classList.contains("textValue");

    if (isParent || parentChild) {
      eval(this.dbclick);
    }
  }
}
