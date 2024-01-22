document.addEventListener("DOMContentLoaded", function () {
  fetch("../getAlbums.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        createOptions(data.albums);
        createAlbums(data.albums);
      } else {
        console.error("Error fetching albums:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
});

async function createOptions(albums) {
  const albumSelect = document.getElementById("albumSelect");
  albums.forEach((album) => {
    const option = document.createElement("option");
    option.setAttribute("value", album.AlbumID);
    option.textContent = album.AlbumName;
    albumSelect.appendChild(option);
  });
}

async function createAlbums(albums) {
  console.log(albums);
  const albumsContainer = document.getElementById("albums");

  for (const album of albums) {
    const albumList = document.createElement("ul");
    albumList.setAttribute("class", "album");
    albumList.setAttribute("data-album-id", album.AlbumID);

    const albumNameItem = document.createElement("li");
    albumNameItem.textContent = album.AlbumName;
    albumList.appendChild(albumNameItem);

    const images = await getImages(album.AlbumID);
    if (images) {
      images.forEach((image) => {
        const imageElement = document.createElement("li");
        imageElement.innerHTML = `Filename: ${image.ImageName}, Filepath: ${image.FilePath}`;
        albumList.appendChild(imageElement);
      });
    }
    albumsContainer.appendChild(albumList);
  }
}

function getImages(albumId) {
  return fetch("../getImages.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ albumId: albumId }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log(data);
        return data.images;
      } else {
        console.error("Error fetching images:", data.message);
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      return [];
    });
}

let filesToUpload = [];

function dropHandler(ev) {
  console.log("File(s) dropped");

  ev.preventDefault();

  if (ev.dataTransfer.items) {
    [...ev.dataTransfer.items].forEach((item, i) => {
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file.type.startsWith("image/")) {
          console.log(`… file[${i}].name = ${file.name}`);
          filesToUpload.push(file);
        } else {
          console.log(`… file[${i}] is not an image`);
        }
      }
    });
  } else {
    [...ev.dataTransfer.files].forEach((file, i) => {
      if (file.type.startsWith("image/")) {
        console.log(`… file[${i}].name = ${file.name}`);
        filesToUpload.push(file);
      } else {
        console.log(`… file[${i}] is not an image`);
      }
    });
  }
}

document.getElementById("uploadButton").addEventListener("click", function () {
  const albumId = document.getElementById("albumSelect").value;
  filesToUpload.forEach((file) => {
    imageUpload(file, albumId);
  });
  filesToUpload = [];
});

function dragOverHandler(ev) {
  console.log("File(s) in drop zone");

  ev.preventDefault();
}

function imageUpload(file, albumId) {
  const formData = new FormData();
  formData.append("image", file);
  formData.append("albumId", albumId);

  fetch("imageUpload.php", {
    method: "POST",
    body: formData,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        console.log(data);
      } else {
        console.error("Error uploading image:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

// function createImages(images) {
//   const imagesContainer = document.getElementById("images");
//   imagesContainer.innerHTML = "";
//   images.forEach((image) => {
//     const imageElement = document.createElement("img");
//     imageElement.setAttribute("src", image.FilePath);
//     imageElement.setAttribute("class", "image");
//     imagesContainer.appendChild(imageElement);
//   });
// }
