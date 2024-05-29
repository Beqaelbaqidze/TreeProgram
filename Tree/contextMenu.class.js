export class ContextMenuHandler {
  constructor(options) {
    this.options = options;
    this.createContextHtml();
    this.contextList = "";
    document.addEventListener("contextmenu", this.contextMenu.bind(this));
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

  createContextHtml() {
    const contextMenu = document.createElement("div");
    contextMenu.className = "context-menu";

    const ul = document.createElement("ul");
    this.options.contextMenu.forEach((elem) => {
      const [actionName, actionFunction] = elem.split(": ");
      const li = document.createElement("li");
      li.className = actionName;
      li.textContent = actionName;
      li.addEventListener("click", () => {
        this.contextReload(actionFunction);
      });
      ul.appendChild(li);
    });

    contextMenu.appendChild(ul);
    document.body.appendChild(contextMenu);

    document.addEventListener("click", () => {
      contextMenu.classList.remove("active");
    });
  }

  contextReload(actionFunction) {
    eval(actionFunction);
  }
}
