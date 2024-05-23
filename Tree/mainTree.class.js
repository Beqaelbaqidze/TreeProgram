import { HttpClass } from "../http.class.js";
import { TreeHtml } from "./treeHtml.class.js";
import { TreeEventHandler } from "./treeFunctions.js";

export class MainTree {
  #httpClient;
  #treeData = [];
  #labelKey;
  #chngHtml;
  #rootElement;
  #eventHandler;

  constructor(options) {
    this.options = options;
    this.#labelKey = options.labels || "name";
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
        const label = node[this.#labelKey];
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
