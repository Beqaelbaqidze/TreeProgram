import { HttpClass } from "../http.class.js";
import { TreeHtml } from "./treeHtml.class.js";
import { TreeEventHandler } from "./treeFunctions.js";

export class MainTree {
  #httpClient;
  #treeData = [];
  #labelKeys;
  #chngHtml;
  #rootElement;
  #eventHandler;

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
    this.#rootElement.addEventListener(
      "click",
      this.#eventHandler.initEvents.bind(this.#eventHandler)
    );
  }

  inject(data) {
    this.#treeData = data;
  }

  buildHtmlAndInject(rootElement) {
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
          extraHtml
        );
        return treeHtml.htmlUlTpl();
      })
      .join("");

    rootElement.innerHTML += `<ul>${html}</ul>`;
  }
}
