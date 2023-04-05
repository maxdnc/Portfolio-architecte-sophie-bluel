const token = localStorage.getItem("token");

const galleryModal = document.querySelector("#js-gallery-modal");

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

    modalDeleteBtn.addEventListener("click", () => {
      const id = boxModal.getAttribute("data-id");
      console.log(id);
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

const addPicture = document.querySelector("#js-add-picture");
const modalTitle = document.querySelector("#js-modal-title");

const deleteGallery = document.querySelector("#js-delete-gallery");
const formAddPicture = document.querySelector("#js-form-add-img");
const backGallery = document.querySelector("#js-back-to-gallery");
const barModal = document.querySelector("#js-bar-modal");

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

const updateHomepage = () => {
  loginButtonUpdate();
  updateUI();
};

window.addEventListener("load", () => {
  updateHomepage();
});

//modal gallery //

const modalContainer = document.querySelector(".modal-container");
const modalTriggers = document.querySelectorAll(".modal-trigger");

modalTriggers.forEach((trigger) =>
  trigger.addEventListener("click", () => {
    modalContainer.classList.toggle("active");
  })
);

getApi().then((data) => {
  getGalleryModalItems(data);
});

getApi().then(() => {
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
    modalElement();

    getApi().then((data) => {
      galleryModal.innerHTML = "";
      getGalleryModalItems(data);
    });
  });
}); //button

// delete element
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

//form add picture

const getPostItemApi = async (formData) => {
  try {
    const response = await fetch("http://localhost:5678/api/works", {
      method: "POST",
      headers: {
        accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
    const data = await response.json();

    if (response.status === 201) {
      setTimeout(() => {
        getApi().then((data) => {
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

          modalElement(data);
          galleryModal.innerHTML = "";
          getGalleryModalItems(data);

          getApi().then(() => {
            // delete preview img //
            preview.style.display = "none";
            preview.src = "";
            buttonUploadPhoto.style.display = "block";
            textFormatImg.style.display = "block";
            previewDeleteBtn.style.display = "none";
          });
        });
        // form reset
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

getApi().then(() => {
  const formAddImg = document.querySelector("#js-form-add-img");

  formAddImg.addEventListener("submit", (e) => {
    e.preventDefault();

    const fileImg = document.querySelector("#file-input").files[0];
    const titleImg = document.querySelector("#titre").value;
    const categoryImg = document.querySelector("#categorie").value;

    const formData = new FormData();

    formData.append("image", fileImg);
    formData.append("title", titleImg);
    formData.append("category", categoryImg);

    const isFormValid = titreInput.value !== "" && fileInput.value !== "";
    const errorTitle = document.querySelector(".bordertitle-error");
    const errorTitleText = document.querySelector(".error-title-form");

    if (!isFormValid) {
      e.preventDefault();

      errorTitleText.classList.add("active");
      errorTitle.classList.add("active");
    } else {
      getPostItemApi(formData).then(() => {
        getApi().then((data) => {
          errorTitleText.classList.remove("active");
          errorTitle.classList.remove("active");
          const galleryModal = document.querySelector("#js-gallery-modal");
          renderGallery(data);
          modalContainer.classList.remove("active");
          galleryModal.innerHTML = getGalleryModalItems(data);
        });
      });
    }
  });
});

// Function pour preview image

const preview = document.getElementById("preview");
const buttonUploadPhoto = document.querySelector(".button-upload-photo");
const textFormatImg = document.querySelector("#text-format-img");
const previewDeleteBtn = document.querySelector("#js-delete-preview");

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

const fileInput = document.querySelector("#file-input");

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
});

fileInput.addEventListener("change", previewImage);

getCategoriesApi().then((data) => {
  const categories = document.querySelector("#categorie");

  for (let i = 0; i < data.length; i++) {
    const option = document.createElement("option");
    option.value = data[i].id;
    option.textContent = data[i].name;
    categories.appendChild(option);
  }
});

const formImg = document.getElementById("js-form-add-img");

const titreInput = document.getElementById("titre");
const categorieSelect = document.getElementById("categorie");
const submitBtn = document.querySelector(".confirm-button-form-add");

submitBtn.disabled = true;

formImg.addEventListener("input", () => {
  const isFormValid = fileInput.value !== "";

  if (isFormValid) {
    submitBtn.removeAttribute("disabled");
    submitBtn.classList.add("active");
  } else {
    submitBtn.setAttribute("disabled", "disabled");
    submitBtn.classList.remove("active");
  }
});

// delete galery

const btnDeleteGallery = document.querySelector("#js-delete-gallery");

btnDeleteGallery.addEventListener("click", () => {
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
