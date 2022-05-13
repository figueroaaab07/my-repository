document.addEventListener("DOMContentLoaded", () => {

  function createImageStyle() {
    let css = document.createElement('style');
    let imgStyle = '.image { width: 500px; height: 500px; border: solid #ccc; border-width: 3px; object-fit: contain; display: inline-block; margin-left: auto; margin-right: auto; }';
    let figcaptionStyle = ".caption { width: 180px; height: 180px; font-size: 13px; font-weight: bold; text-align: center }"
    css.appendChild(document.createTextNode(imgStyle));
    css.appendChild(document.createTextNode(figcaptionStyle));
    document.getElementsByTagName("head")[0].appendChild(css);
  }
  createImageStyle();

  // function createHtmlBase() {
  //   let divElement = document.createElement('div');
  //   divElement.className = "wrapper";
  //   divElement.appendChild(document.querySelector("h1"));
  //   let h2Element = document.createElement("h2");
  //   h2Element.innerText = "Take a sample from more than 490,000 works, throughout the world and history, and and let yourself be carried away by the feelings they inspire"
  //   divElement.appendChild(h2Element);
  //   let selectorLabel = document.createElement('label');
  //   selectorLabel.innerText = "Please Select Collection";
  //   divElement.appendChild(selectorLabel);
  //   let selectorElement = document.createElement('select');
  //   selectorElement.className = "selector";
  //   divElement.appendChild(selectorElement);
  //   divElement.appendChild(document.querySelector("#object-image-container"));
  //   document.querySelector("body").appendChild(divElement);
  
  // }

  function createHtmlBase() {
    let divElement = document.createElement('div');
    divElement.className = "wrapper";
    divElement.appendChild(document.querySelector("h1"));
    let h2Element = document.createElement("h2");
    h2Element.innerText = "Take a sample from more than 490,000 works, throughout the world and history, and and let yourself be carried away by the feelings they inspire"
    divElement.appendChild(h2Element);
    let selectorLabel = document.createElement('label');
    selectorLabel.innerText = "Please Select Collection";
    divElement.appendChild(selectorLabel);
    let selectorElement = document.createElement('select');
    selectorElement.className = "selector";
    divElement.appendChild(selectorElement);
    divElement.appendChild(document.querySelector("#object-image-container"));
    document.querySelector("body").appendChild(divElement);
  }
  createHtmlBase();

  function populateSelector() {
    fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
    .then(res => res.json())
    .then(departmentsData => departmentsData["departments"].forEach(department => {
      let selectorElement = document.querySelector(".selector");
      let optionElement = document.createElement('option');
      optionElement.innerText = department["displayName"];
      optionElement.id = department["departmentId"];
      selectorElement.appendChild(optionElement);
    }))
  }
  populateSelector();

  // function getDepartments() {
  //   return  fetch("https://collectionapi.metmuseum.org/public/collection/v1/departments")
  //   .then(res => res.json())
  // }
  // console.log(getDepartments());

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

  function renderImagesByDepartment(departmentId) {
    return  fetch(`https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentId}`)
            .then(res => res.json())
            .then(objectsByDepartment => objectsByDepartment["objectIDs"].sort(() =>.5- Math.random()).slice(0, 4))
            .then(objectsIDsSelected => Promise.all(objectsIDsSelected.map(objectID => getObjectData(objectID))))
            .then(objectsData => objectsData.map(objectData => renderOneObject(objectData)))
  }

  renderImagesByDepartment(departmentId = "1");
})