import { MainTree } from "./Tree/mainTree.class.js";
const click = document.querySelector("#treeContainer").getAttribute("click");
const dbclick = document
  .querySelector("#treeContainer")
  .getAttribute("dbclick");
const contextMenu = document
  .querySelector("#treeContainer")
  .getAttribute("contextMenu");
const WFFType = document
  .querySelector("#treeContainer")
  .getAttribute("WFFType");
const treeLink = document
  .querySelector("#treeContainer")
  .getAttribute("treeLink");
const baseUrl = document
  .querySelector("#treeContainer")
  .getAttribute("baseUrl");
const label = document.querySelector("#treeContainer").getAttribute("label");

const options = {
  baseUrl: baseUrl,
  url: baseUrl + treeLink,
  rootElement: "#treeContainer",
  labels: label,
  click: click,
  dbclick: dbclick,
  contextMenu: contextMenu,
};
const mainTree = new MainTree(options);
