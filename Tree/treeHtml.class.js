export class TreeHtml {
  test;
  constructor(
    id,
    value,
    dataResponse,
    icon,
    statusIcon,
    baseUrl,
    hasChildren,
    nodeElement,
    stringHtml = "",
    selectedId
  ) {
    this.id = id;
    this.value = value;
    this.dataResponse = dataResponse;
    this.icon = icon;
    this.statusIcon = statusIcon;
    this.baseUrl = baseUrl;
    this.hasChildren = hasChildren;
    this.stringHtml = stringHtml;
    this.nodeElement = nodeElement;
    this.selectedId = selectedId;
  }

  responseBuild() {
    const keys = Object.keys(this.dataResponse);
    return keys.map((key) => `${key}="${this.dataResponse[key]}"`).join(" ");
  }

  htmlUlTpl = () => {
    if (this.stringHtml) {
      return this.stringHtml;
    } else {
      return `<li id="liNode" main-id="${this.id}" ${this.responseBuild()}>
                <div class="nodeAttContainer ${
                  this.selectedId == this.id ? "selected" : ""
                }" data-id="${this.id}" ${this.responseBuild()} >
                  <button class="DropdownBtn" data-id="${this.id}">
                    ${
                      this.hasChildren
                        ? `
                            <svg class = "arrow" data-id="${this.id}" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18" fill="none">
                                <mask id="mask0_1427_1541" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="18" height="18">
                                  <rect x="18" y="18" width="18" height="18" transform="rotate(-180 18 18)" fill="#D9D9D9"/>
                                </mask>
                                <g mask="url(#mask0_1427_1541)">
                                  <path d="M7.9877 6.41249L10.5752 8.99999L7.9877 11.5875L7.9877 6.41249Z" fill="#292929"/>
                                </g>
                            </svg>`
                        : ""
                    }
                   </button>
                  <div class="Icons">
                    <img src="${this.icon ? this.baseUrl + this.icon : ""}">
                    <img src="${
                      this.statusIcon ? this.baseUrl + this.statusIcon : ""
                    }">
                  </div>
                  <span class="textValue" id="${
                    this.hasChildren ? "" : "lastElem"
                  }" ${this.responseBuild()}><p class="textValue">${
        this.value
      }</p>${this.nodeElement} </span>
                </div>
              </li>`;
    }
  };
}
