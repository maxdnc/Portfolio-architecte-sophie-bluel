const galleryModal = document.querySelector("#js-gallery-modal");
const addPicture = document.querySelector("#js-add-picture");
const modalTitle = document.querySelector("#js-modal-title");
const deleteGallery = document.querySelector("#js-delete-gallery");
const formAddPicture = document.querySelector("#js-form-add-img");
const backGallery = document.querySelector("#js-back-to-gallery");
const barModal = document.querySelector("#js-bar-modal");

const token = localStorage.getItem("token");

const errorTitle = document.querySelector(".bordertitle-error");
const errorTitleText = document.querySelector(".error-title-form");

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

const preview = document.getElementById("preview");
const buttonUploadPhoto = document.querySelector(".button-upload-photo");
const textFormatImg = document.querySelector("#text-format-img");
const previewDeleteBtn = document.querySelector("#js-delete-preview");

const fileInput = document.querySelector("#file-input");
const titreInput = document.getElementById("titre");
const categorieSelect = document.getElementById("categorie");

const submitBtn = document.querySelector(".confirm-button-form-add");

// creation de la galery de la modal //

const getGalleryModalItems = (data) => {
  for (let i = 0; i < data.length; i++) {
    const boxModal = document.createElement("div");
    boxModal.classList.add("box-modal");
    boxModal.setAttribute("data-id", data[i].id);
    galleryModal.appendChild(boxModal);

    const modalItemImg = document.createElement("img");
    modalItemImg.classList.add("modal-item__img");
    modalItemImg.src = data[i].imageUrl;
    modalItemImg.alt = data[i].title;
    boxModal.appendChild(modalItemImg);

    const modalEditBtn = document.createElement("button");
    modalEditBtn.classList.add("modal-edit-btn");
    modalEditBtn.innerText = "éditer";
    boxModal.appendChild(modalEditBtn);

    const modalDeleteBtn = document.createElement("button");
    modalDeleteBtn.classList.add("modal-delete-btn");
    modalDeleteBtn.setAttribute("aria-label", "delete");
    boxModal.appendChild(modalDeleteBtn);

    const modalDeleteImg = document.createElement("img");
    modalDeleteImg.src = "./assets/icons/trash.svg";
    modalDeleteImg.alt = "delete";
    modalDeleteBtn.appendChild(modalDeleteImg);
    // button delete item + update modal and gallery //

    modalDeleteBtn.addEventListener("click", () => {
      const id = boxModal.getAttribute("data-id");

      getDeleteItemApi(id).then(() => {
        getApi().then((data) => {
          renderGallery(data);
          galleryModal.innerHTML = "";
          getGalleryModalItems(data);
        });
      });
    });
  }
};

// manage element modal  //

const modalElement = (data) => {
  modalTitle.textContent = "Gallerie photo";

  galleryModal.style.display = "flex";
  deleteGallery.style.display = "block";
  addPicture.style.display = "block";
  formAddPicture.style.display = "none";
  backGallery.style.display = "none";
  barModal.style.display = "block";

  getApi().then((data) => {
    galleryModal.innerHTML = "";
    getGalleryModalItems(data);
  });
};

// if token here then admin mode activated //
const isLogged = () => (token ? true : false);

const logOut = () => {
  localStorage.clear("token");
  console.log("disconnected");
  window.location.reload();
};

const loginButtonUpdate = () => {
  const loginButton = document.querySelector("#js-login-button");
  if (isLogged()) {
    loginButton.href = "#";
    loginButton.innerText = "logout";
    loginButton.addEventListener("click", () => {
      logOut();
      loginButton.innerText = "login";
    });
  }
};

// update UI if admin mode activated //

const updateUI = () => {
  const filter = document.querySelector("#js-filter-box");
  const editBar = document.querySelector("#js-edit-mode");
  const alignItems = document.querySelector("#introduction");
  const buttonEditGallery = document.querySelector("#js-button-edit-gallery");
  const buttonEditProfil = document.querySelector("#js-button-edit-profil");
  const buttonEditDescription = document.querySelector(
    "#js-button-edit-description"
  );

  if (isLogged()) {
    filter.style.display = "none";
    editBar.style.display = "flex";
    alignItems.style.alignItems = "inherit";
    buttonEditDescription.style.display = "inline-flex";
    buttonEditGallery.style.display = "inline-flex";
    buttonEditProfil.style.display = "inline-flex";
  }
};

window.addEventListener("load", () => {
  loginButtonUpdate();
  updateUI();
});

//modal gallery //

// apears/disapear modal //

modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", () => {
    modalContainer.classList.toggle("active");
  })
);

getApi().then((data) => {
  //update modal gallery
  getGalleryModalItems(data);
});

getApi().then(() => {
  // update modal to next page //
  addPicture.addEventListener("click", () => {
    modalTitle.textContent = "Ajout Photo";
    galleryModal.style.display = "none";
    deleteGallery.style.display = "none";
    addPicture.style.display = "none";
    formAddPicture.style.display = "flex";
    backGallery.style.display = "block";
    barModal.style.display = "none";
  });

  backGallery.addEventListener("click", () => {
    // back button to gallery modal with update //
    modalElement();

    getApi().then((data) => {
      galleryModal.innerHTML = "";
      getGalleryModalItems(data);
    });
  });
});

// delete api //
// ******************************* CALL API DELETE ITEM ******************************* //
const getDeleteItemApi = async (id) => {
  try {
    const response = await fetch(`http://localhost:5678/api/works/${id}`, {
      method: "DELETE",
      headers: { Authorization: `accept: ${token}` },
    });
    return true;
  } catch (error) {
    console.log("error");
    return false;
  }
};

//form add picture //
// ******************************* CALL API POST NEW ITEM ******************************* //
const getPostItemApi = async (formData) => {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    if (response.status === 201) {
      // if status 201 then update modal gallery otherwise it was the add photo section//
      getApi().then(() => {
        getApi().then((data) => {
          galleryModal.innerHTML = "";
          getGalleryModalItems(data);
        });
      });
      // add small delay to update modal gallery otherwise transition is not smooth //
      setTimeout(() => {
        // update modal gallery //
        modalTitle.textContent = "Gallerie photo";
        galleryModal.style.display = "flex";
        deleteGallery.style.display = "block";
        addPicture.style.display = "block";
        formAddPicture.style.display = "none";
        backGallery.style.display = "none";
        barModal.style.display = "block";

        // delete preview img //
        preview.style.display = "none";
        preview.src = "";
        buttonUploadPhoto.style.display = "block";
        textFormatImg.style.display = "block";
        previewDeleteBtn.style.display = "none";
        // form reset empty //
        formAddPicture.reset();
        submitBtn.setAttribute("disabled", "disabled");
        submitBtn.classList.remove("active");
      }, 400);
    }
  } catch (error) {
    console.log(error);
  }
};

//form add picture

formAddPicture.addEventListener("submit", (e) => {
  const fileImg = fileInput.files[0];
  const titleImg = titreInput.value;
  const categoryImg = categorieSelect.value;

  e.preventDefault();

  // form data to send to api //
  const formData = new FormData();

  formData.append("image", fileImg);
  formData.append("title", titleImg);
  formData.append("category", categoryImg);

  // form validation //
  const isFormValid = titreInput.value !== "" && fileInput.value !== "";

  if (!isFormValid) {
    // add class active to error message if form empty //
    errorTitleText.classList.add("active");
    errorTitle.classList.add("active");
  } else {
    // if form is valid then send data to api and update modal //

    getPostItemApi(formData).then(() => {
      getApi().then((data) => {
        errorTitleText.classList.remove("active");
        errorTitle.classList.remove("active");
        renderGallery(data);
        modalContainer.classList.remove("active");

        galleryModal.innerHTML = "";
        galleryModal.innerHTML = getGalleryModalItems(data);
      });
    });
  }
});

// Function pour preview image

function previewImage(event) {
  const file = event.target.files[0];
  if (file) {
    preview.style.display = "block";
    preview.src = URL.createObjectURL(file);
    buttonUploadPhoto.style.display = "none";
    textFormatImg.style.display = "none";
    previewDeleteBtn.style.display = "inline-flex";
  } else {
    preview.style.display = "none";
    preview.src = "";
    buttonUploadPhoto.style.display = "block";
    textFormatImg.style.display = "block";
    previewDeleteBtn.style.display = "none";
  }
}

previewDeleteBtn.addEventListener("click", (e) => {
  e.preventDefault();
  preview.src = "";
  preview.style.display = "none";
  buttonUploadPhoto.style.display = "block";
  textFormatImg.style.display = "block";
  previewDeleteBtn.style.display = "none";
  previewDeleteBtn.style.display = "none";
  submitBtn.setAttribute("disabled", "disabled");
  submitBtn.classList.remove("active");
  formAddPicture.reset();
  errorTitle.classList.remove("active");
  errorTitleText.classList.remove("active");
});

fileInput.addEventListener("change", previewImage); // add image to display image in preview mode //

getCategoriesApi().then((data) => {
  const categories = document.querySelector("#categorie");
  // create option for select  from  data api categories//
  for (let i = 0; i < data.length; i++) {
    const option = document.createElement("option");
    option.value = data[i].id;
    option.textContent = data[i].name;
    categories.appendChild(option);
  }
});

// disable button if form is empty //
submitBtn.disabled = true;

formAddPicture.addEventListener("input", () => {
  const isFormValid = fileInput.value !== "" && categorieSelect.value !== "";

  if (isFormValid) {
    submitBtn.removeAttribute("disabled");
    submitBtn.classList.add("active");
  } else {
    submitBtn.setAttribute("disabled", "disabled");
    submitBtn.classList.remove("active");
  }
});

// delete all galery and update api and gallery modal and gallery projet //

deleteGallery.addEventListener("click", () => {
  getApi()
    .then((data) => {
      data.forEach((element) => {
        getDeleteItemApi(element.id);
      });
    })
    .then(() => {
      getApi().then((data) => {
        galleryModal.innerHTML = "";
        getGalleryModalItems(data);
        renderGallery(data);
      });
    });
});
