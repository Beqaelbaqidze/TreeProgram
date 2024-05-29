import { ContextMenuHandler } from "./contextMenu.class.js";
import { TreeHtml } from "./treeHtml.class.js";

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
    }
    #treeContainer {
        display: flex;
        flex-direction: column;
        height: 100vh;
        width: 300px;
        overflow-y: scroll;
    }
    #treeContainer button {
        cursor: pointer;
        background-color: inherit;
        border: 0;
    }
    #treeContainer button svg {
        padding: 5px 10px;
        transition: 0.3s ease-in-out;
    }
    .rotated {
        transform: rotate(90deg);
    }
    .selected {
        border: 1px solid aqua;
        border-radius: 12px;
    }
    .nodeAttContainer, .nodeAttContainer div, .nodeAttContainer p {
        cursor: pointer;
    }
    .context-menu {
        display: none;
        position: absolute;
        background: white;
        box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1000;
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
        background: #f0f0f0;
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
      if (isParent) {
        target.classList.add("selected");
      } else if (parentChild) {
        target.closest(".nodeAttContainer").classList.add("selected");
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
