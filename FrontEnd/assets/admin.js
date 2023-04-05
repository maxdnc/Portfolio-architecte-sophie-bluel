const token = localStorage.getItem("token");
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
  const galleryModal = document.querySelector("#js-gallery-modal");

  const getGalleryModalItems = (data) => {
    return data
      .map((item) => {
        return `
          <div class="box-modal" data-id="${item.id}">
            <img src="${item.imageUrl}" alt="${item.title}" class="modal-item__img">
            <button class="modal-edit-btn">éditer</button>
            <button class="modal-delete-btn" aria-label="delete">
            <img src="./assets/icons/trash.svg" alt="delete" >
          </button>
          </div>
        `;
      })
      .join("");
  };

  galleryModal.innerHTML = getGalleryModalItems(data);
});

getApi().then(() => {
  const modalDeleteButtons = document.querySelectorAll(".modal-delete-btn");
  modalDeleteButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.parentElement.getAttribute("data-id");
      console.log(id);
      getDeleteItemApi(id);
    });
  });
});

getApi().then(() => {
  const addPicture = document.querySelector("#js-add-picture");
  const modalTitle = document.querySelector("#js-modal-title");
  const galleryModal = document.querySelector("#js-gallery-modal");
  const deleteGallery = document.querySelector("#js-delete-gallery");
  const formAddPicture = document.querySelector("#js-form-add-img");
  const backGallery = document.querySelector("#js-back-to-gallery");
  const barModal = document.querySelector("#js-bar-modal");

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
    modalTitle.textContent = "Gallerie photo";
    galleryModal.style.display = "flex";
    deleteGallery.style.display = "block";
    addPicture.style.display = "block";
    formAddPicture.style.display = "none";
    backGallery.style.display = "none";
    barModal.style.display = "block";
  });
}); //button

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
    console.log(data);
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

    const formData = new FormData(formAddImg);

    formData.append("image", fileImg, fileImg.type);
    formData.append("title", titleImg);
    formData.append("category", categoryImg);

    // const data = {
    //   image: fileImg,
    //   title: titleImg,
    //   category: categoryImg,
    // };

    // const jsonData = JSON.stringify(data);

    console.log(fileImg);

    const res = Object.fromEntries(formData);
    const payLoad = JSON.stringify(res);

    console.log(payLoad);

    getPostItemApi(payLoad);
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
  const isFormValid =
    titreInput.value !== "" &&
    categorieSelect.value !== "" &&
    fileInput.value !== "";

  if (isFormValid) {
    submitBtn.removeAttribute("disabled");
    submitBtn.classList.add("active");
  } else {
    submitBtn.setAttribute("disabled", "disabled");
    submitBtn.classList.remove("active");
  }
});

//form add picture
