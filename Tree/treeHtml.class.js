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
    stringHtml = ""
  ) {
    this.id = id;
    this.value = value;
    this.dataResponse = dataResponse;
    this.icon = icon;
    this.statusIcon = statusIcon;
    this.baseUrl = baseUrl;
    this.hasChildren = hasChildren;
    this.stringHtml = stringHtml;
  }

  responseBuild() {
    const keys = Object.keys(this.dataResponse);
    return keys.map((key) => `${key}="${this.dataResponse[key]}"`).join(" ");
  }

  htmlUlTpl = () => {
    if (this.stringHtml) {
      return this.stringHtml;
    } else {
      return `<li id="liNode" ${this.responseBuild()}>
                <div class="nodeAttContainer" data-id="${this.id}">
                  <button class="DropdownBtn" data-id="${this.id}">
                    ${
                      this.hasChildren
                        ? `<svg class = "arrow" data-id="${this.id}"
                        xmlns="http://www.w3.org/2000/svg"
                        width="5"
                        height="10"
                        viewBox="0 0 5 10"
                        fill="none"
                      >
                        <path
                          d="M4.29289 5L0.5 8.79289V1.20711L4.29289 5Z"
                          fill="#1C1B1F"
                          stroke="black"
                        ></path>
                      </svg>`
                        : ""
                    }
                   </button>
                  <div class="Icons">
                    <img src="${this.baseUrl + this.icon}">
                    <img src="${this.baseUrl + this.statusIcon}">
                  </div>
                  <p class="textValue" ${this.responseBuild()}>${this.value}</p>
                </div>
              </li>`;
    }
  };
}
