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
    this.contextMenu = this.contextMenu.bind(this);
    this.contextReload = this.contextReload.bind(this);
    this.contextAdd = this.contextAdd.bind(this);
    this.contextOptions = this.contextOptions.bind(this);
    this.toggleDarkMode = this.toggleDarkMode.bind(this);
    this.initEvents();
    this.addStyles();
    this.createContextMenu();
    this.createModal();
    this.createDarkModeToggle();
  }

  initEvents() {
    const vRootElement = document.querySelector(this.options.rootElement);

    if (vRootElement) {
      vRootElement.addEventListener("click", this.handleClick);
      vRootElement.addEventListener("click", this.oneClick);
      vRootElement.addEventListener("dblclick", this.doubleClick);
      vRootElement.addEventListener("contextmenu", this.contextMenu);

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
    .dark-mode button svg{
      filter: brightness(100);
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
    .modal {
        display: none;
        position: fixed;
        z-index: 1000;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        overflow: auto;
        background-color: rgba(0, 0, 0, 0.4);
    }
    .modal-content {
        background-color: #fefefe;
        margin: 15% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
        animation: modalopen 0.4s;
    }
    @keyframes modalopen {
        from {opacity: 0}
        to {opacity: 1}
    }
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }
    .close:hover,
    .close:focus {
        color: black;
        text-decoration: none;
        cursor: pointer;
    }
    .modal-header {
        padding: 2px 16px;
        background-color: #5cb85c;
        color: white;
    }
    .modal-body {
        padding: 2px 16px;
    }
    .modal-footer {
        padding: 2px 16px;
        background-color: #5cb85c;
        color: white;
        text-align: right;
    }
    .modal-content {
        background-color: #ffffff;
        margin: 10% auto;
        padding: 20px;
        border: 1px solid #888;
        width: 80%;
        max-width: 500px;
        box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
        border-radius: 8px;
        font-family: 'Arial', sans-serif;
    }
    .close {
        color: #aaa;
        float: right;
        font-size: 28px;
        font-weight: bold;
    }
    .close:hover,
    .close:focus {
        color: #000;
        text-decoration: none;
        cursor: pointer;
    }
    .modal-content h2 {
        margin-top: 0;
        font-size: 24px;
        color: #333;
    }
    .modal-content label {
        font-weight: bold;
        display: block;
        margin-top: 15px;
        color: #555;
    }
    .modal-content input[type="color"],
    .modal-content textarea {
        width: calc(100% - 20px);
        padding: 10px;
        margin-top: 5px;
        border: 1px solid #ddd;
        border-radius: 4px;
        box-sizing: border-box;
        font-size: 16px;
    }
    .modal-content button {
        background-color: #4CAF50;
        color: white;
        padding: 12px 20px;
        margin-top: 20px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
        width: 100%;
    }
    .modal-content button:hover {
        background-color: #45a049;
    }
    .dark-mode #treeContainer {
        background-color: #1e1e1e;
        color: #ffffff;
    }
    .dark-mode .context-menu {
        background: #2d2d2d;
        color: #ffffff;
    }
    .dark-mode .context-menu ul li:hover {
        background: #454545;
    }
    .dark-mode .modal-content {
        background-color: #2d2d2d;
        color: #ffffff;
    }
    .dark-mode .modal-content h2 {
        color: #fff;
    }
    .dark-mode .modal-content label {
        color: #fff;
    }
    .dark-mode .arrow {
        color: #ffffff;
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

    if (target.classList.contains("arrow")) {
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

  contextMenu(event) {
    event.preventDefault();
    const target = event.target;
    const isParent = target.classList.contains("nodeAttContainer");
    const parentChild = target.closest(".nodeAttContainer");
    const childChild = target.closest("div")?.closest(".nodeAttContainer");

    if (isParent || parentChild || childChild) {
      document.querySelectorAll(".nodeAttContainer").forEach((elem) => {
        elem.classList.remove("selected");
      });

      if (isParent) {
        target.classList.add("selected");
      } else if (parentChild) {
        parentChild.classList.add("selected");
      } else if (childChild) {
        childChild.classList.add("selected");
      }

      const contextMenu = document.querySelector(".context-menu");
      contextMenu.style.top = `${event.clientY}px`;
      contextMenu.style.left = `${event.clientX}px`;
      contextMenu.classList.add("active");
      contextMenu.targetElement = target;
    } else {
      document.querySelector(".context-menu").classList.remove("active");
    }
  }

  createContextMenu() {
    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";
    contextMenu.innerHTML = `
      <ul>
        <li class="reload">Reload</li>
        
      </ul>
    `;
    // <li class="add">Add</li>
    // <li class="options">Options</li>

    document.body.appendChild(contextMenu);

    document.addEventListener("click", () => {
      contextMenu.classList.remove("active");
    });

    contextMenu.querySelector(".reload").addEventListener("click", (event) => {
      this.contextReload(event);
    });
    // contextMenu.querySelector(".add").addEventListener("click", (event) => {
    //   this.contextAdd(event);
    // });
    // contextMenu.querySelector(".options").addEventListener("click", (event) => {
    //   this.contextOptions(event);
    // });
  }

  contextReload() {
    const selectedItem = document.querySelector(".selected");
    if (selectedItem) {
      const childUl = selectedItem.closest("li").querySelector("ul");
      if (childUl) {
        childUl.innerHTML = "";
        selectedItem.querySelector(".arrow").classList.remove("rotated");
        selectedItem.querySelector(".arrow").classList.remove("loaded");
      }
    }
    document.querySelector(".context-menu").classList.remove("active");
  }

  contextAdd() {
    const selectedItem = document.querySelector(".selected");
    if (selectedItem) {
      const arrowClick = selectedItem.querySelector(".DropdownBtn");
      if (arrowClick) {
        this.handleClick({ target: arrowClick });
      }

      const newId = `new-node-${Date.now()}`; // Generate a unique ID for the new node
      const newNode = new TreeHtml(
        newId,
        "New Node", // You can change this to whatever default value you need
        {}, // Empty dataResponse for the new node
        "default-icon.png", // Default icon
        "default-status-icon.png", // Default status icon
        "", // Base URL (if needed)
        false // Whether the new node has children
      );
      const checkUl = selectedItem.closest("li").querySelector("ul");
      if (checkUl) {
        checkUl.innerHTML += newNode.htmlUlTpl(); // Append the new node to the existing ul
      } else {
        selectedItem.closest(
          "li"
        ).innerHTML += `<ul>${newNode.htmlUlTpl()}</ul>`; // Create a new ul and append the new node
      }
    }
  }

  contextOptions() {
    const selectedItem = document.querySelector(".selected");
    if (selectedItem) {
      const modal = document.querySelector("#optionsModal");
      modal.style.display = "block";

      const colorInput = modal.querySelector("#colorInput");
      const commentInput = modal.querySelector("#commentInput");
      const applyButton = modal.querySelector("#applyButton");

      applyButton.onclick = () => {
        const newColor = colorInput.value;
        const comment = commentInput.value;
        selectedItem.style.color = newColor;
        selectedItem.setAttribute("data-comment", comment);
        modal.style.display = "none";
      };

      const closeButton = modal.querySelector(".close");
      closeButton.onclick = () => {
        modal.style.display = "none";
      };

      window.onclick = (event) => {
        if (event.target == modal) {
          modal.style.display = "none";
        }
      };
    }
    document.querySelector(".context-menu").classList.remove("active");
  }

  createModal() {
    const modal = document.createElement("div");
    modal.id = "optionsModal";
    modal.className = "modal";
    modal.innerHTML = `
      <div class="modal-content">
        <span class="close">&times;</span>
        <h2>Options</h2>
        <label for="colorInput">Change Color:</label>
        <input type="color" id="colorInput" name="colorInput"><br><br>
        <label for="commentInput">Add Comment:</label>
        <textarea id="commentInput" name="commentInput"></textarea><br><br>
        <button id="applyButton">Apply</button>
      </div>
    `;
    document.body.appendChild(modal);
  }

  createDarkModeToggle() {
    const toggleButton = document.createElement("button");
    toggleButton.innerText = "Toggle Dark Mode";
    toggleButton.style.position = "fixed";
    toggleButton.style.top = "10px";
    toggleButton.style.right = "10px";
    toggleButton.style.zIndex = "1000";
    document.body.appendChild(toggleButton);

    toggleButton.addEventListener("click", this.toggleDarkMode);
  }

  toggleDarkMode() {
    document.body.classList.toggle("dark-mode");
  }
}
