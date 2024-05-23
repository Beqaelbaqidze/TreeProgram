import { MainTree } from "./Tree/mainTree.class.js";
const click = document.querySelector("#treeContainer").getAttribute("click");
const dbclick = document
  .querySelector("#treeContainer")
  .getAttribute("dbclick");
const contextMenu = document
  .querySelector("#treeContainer")
  .getAttribute("contextMenu");
console.log(click);
const options = {
  baseUrl: BaseUrl,
  url: BaseUrl + "?FRAME_NAME=CADTREE.BROWSER.JSON&PRNT_ID",
  rootElement: "#treeContainer",
  labels: "name",
  click: click,
  dbclick: dbclick,
  contextMenu: contextMenu,
};
const mainTree = new MainTree(options);
