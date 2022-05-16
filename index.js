document.addEventListener("DOMContentLoaded", () => {

  function createHtmlBase() {
    let divHeader = document.createElement('div');
    divHeader.className = "header";
    let pHeader = document.createElement("p");
    pHeader.innerText = "Take a sample from more than 490,000 works, throughout the world and history, and and let yourself be carried away by the feelings they inspire"
    divHeader.appendChild(document.querySelector("h1"));
    divHeader.appendChild(pHeader);
    let divSelector = document.createElement('div');
    divSelector.className = "dropdown";
    let aSelector = document.createElement("a");
    aSelector.className = "btn btn-secondary dropdown-toggle";
    aSelector.setAttribute("role", "button");
    aSelector.id = "dropdownMenuLink";
    aSelector.setAttribute("data-bs-toggle", "dropdown");
    aSelector.setAttribute("aria-expanded", "false");
    aSelector.textContent = "Please Select Department  ";
    let ulMenu = document.createElement('ul');
    ulMenu.className = "dropdown-menu";
    ulMenu.id = "selector";
    ulMenu.setAttribute("aria-labelledby", "dropdownMenuLink");
    divSelector.appendChild(aSelector);
    divSelector.appendChild(ulMenu);
     let imageContainer = document.querySelector("#object-image-container");
    imageContainer.className = "row";
    let bodyElement = document.querySelector("body");
    bodyElement.appendChild(divHeader);
    bodyElement.appendChild(divSelector);
    bodyElement.appendChild(imageContainer);
  }
  createHtmlBase();

  function populateSelector() {
    fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
    .then(res => res.json())
    .then(departmentsData => departmentsData["departments"].forEach(department => {
      let selectorElement = document.querySelector('#selector');
      let liElement = document.createElement('li');
      let optionElement = document.createElement('a');
      optionElement.className = "dropdown-item";
      optionElement.href = "#";
      optionElement.innerText = department["displayName"];
      optionElement.id = department["departmentId"];
      // optionElement.addEventListener("click", optionCb)
      liElement.appendChild(optionElement);
      selectorElement.appendChild(liElement);
    }))
  }
  populateSelector();

  function getObjectData(objectID) {
    return  fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectID}`)
            .then(res => res.json())
  }

  function renderOneObject(objectData) {
    let divColumnImg = document.createElement('div');
    divColumnImg.className = "column";
    let imageElement = document.createElement('img');
    imageElement.className = "image";
    imageElement.src = objectData["primaryImage"];
    imageElement.alt = objectData["objectName"];
    imageElement.style = "width:100%";
    let pImage = document.createElement('p');
    pImage.innerText = `${objectData["artistDisplayName"]}\n${objectData["objectName"]}, ${objectData["objectEndDate"]}\n${objectData["medium"]}`
    divColumnImg.appendChild(imageElement);
    divColumnImg.appendChild(pImage);
    document.querySelector("#object-image-container").appendChild(divColumnImg);
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
    // let selection = event.target.selectedIndex + 1;
    let selection = event.target.id;
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