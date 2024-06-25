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
const nodeElement = document
  .querySelector("#treeContainer")
  .getAttribute("nodeElement");
const treeLink = document
  .querySelector("#treeContainer")
  .getAttribute("treeLink");
const baseUrl = document
  .querySelector("#treeContainer")
  .getAttribute("baseUrl");
const label = document.querySelector("#treeContainer").getAttribute("label");
const searchContentRootElement = document
  .querySelector("#treeContainer")
  .getAttribute("searchContentRootElement");
const searchLink = document
  .querySelector("#treeContainer")
  .getAttribute("searchLink");

const options = {
  baseUrl: baseUrl,
  url: baseUrl + treeLink,
  rootElement: "#treeContainer",
  labels: label,
  click: click,
  dbclick: dbclick,
  contextMenu: contextMenu ? contextMenu.split("; ") : "",
  nodeElement: nodeElement,
  searchContentRootElement: searchContentRootElement,
  searchLink: baseUrl + searchLink,
};
const mainTree = new MainTree(options);
