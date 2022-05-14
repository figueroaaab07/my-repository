document.addEventListener("DOMContentLoaded", () => {

  function createHtmlBase() {
    let divElement = document.createElement('div');
    divElement.className = "wrapper";
    divElement.appendChild(document.querySelector("h1"));
    let h2Element = document.createElement("h2");
    h2Element.innerText = "Take a sample from more than 490,000 works, throughout the world and history, and and let yourself be carried away by the feelings they inspire"
    divElement.appendChild(h2Element);
    let selectorDiv = document.createElement('div');
    selectorDiv.className = "custom-select";
    divElement.appendChild(selectorDiv);
    let selectorLabel = document.createElement('label');
    selectorLabel.innerText = "Please Select Department:  ";
    selectorLabel.htmlFor = "selector";
    selectorDiv.appendChild(selectorLabel);
    let selectorElement = document.createElement('select');
    selectorElement.id = "selector";
    selectorDiv.appendChild(selectorElement);
    divElement.appendChild(document.querySelector("#object-image-container"));
    document.querySelector("body").appendChild(divElement);
  }
  createHtmlBase();

  function populateSelector() {
    fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
    .then(res => res.json())
    .then(departmentsData => departmentsData["departments"].forEach(department => {
      let selectorElement = document.querySelector('#selector');
      let optionElement = document.createElement('option');
      optionElement.innerText = department["displayName"];
      optionElement.id = department["departmentId"];
      selectorElement.appendChild(optionElement);
    }))
  }
  populateSelector();

  function getObjectData(objectID) {
    return  fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
            .then(res => res.json())
  }

  function renderOneObject(objectData) {
    let figureElement = document.createElement('figure');
    figureElement.className = "figure";
    let imageElement = document.createElement('img');
    imageElement.className = "image";
    imageElement.src = objectData["primaryImage"];
    imageElement.alt = objectData["objectName"]
    let figcaptionElement = document.createElement('figcaption');
    figcaptionElement.className = "caption";
    figcaptionElement.innerText = `${objectData["artistDisplayName"]}\n${objectData["objectName"]}, ${objectData["objectEndDate"]}\n${objectData["medium"]}`
    figureElement.appendChild(imageElement);
    figureElement.appendChild(figcaptionElement);
    document.querySelector("#object-image-container").appendChild(figureElement);
  }

  function renderImagesByDepartment(departmentId = "1") {
    return  fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`)
            .then(res => res.json())
            .then(objectsByDepartment => objectsByDepartment["objectIDs"].sort(() =>.5- Math.random()).slice(0, 4))
            .then(objectsIDsSelected => Promise.all(objectsIDsSelected.map(objectID => getObjectData(objectID))))
            .then(objectsData => objectsData.map(objectData => renderOneObject(objectData)))
  }

  function optionCb(event) {
    event.preventDefault();
    document.querySelector("#object-image-container").innerHTML = "";
    let selection = event.target.selectedIndex + 1;
    console.log(selection);
    renderImagesByDepartment(selection.toString());
  }

  function getValueSelector() {
    let optionSelected = document.querySelector("#selector");
    optionSelected.addEventListener("click", optionCb)
  }

  renderImagesByDepartment(departmentId = "1");
  getValueSelector();
})