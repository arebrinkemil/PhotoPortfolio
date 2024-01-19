document.addEventListener("DOMContentLoaded", function () {
  fetch("../getAlbums.php")
    .then((response) => response.json())
    .then((data) => {
      if (data.status === "success") {
        createAlbums(data.albums);
      } else {
        console.error("Error fetching albums:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
});

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

function dropHandler(ev) {
  console.log("File(s) dropped");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use DataTransferItemList interface to access the file(s)
    [...ev.dataTransfer.items].forEach((item, i) => {
      // If dropped items aren't files, reject them
      if (item.kind === "file") {
        const file = item.getAsFile();
        if (file.type.startsWith("image/")) {
          console.log(`… file[${i}].name = ${file.name}`);
          imageUpload(file);
        } else {
          console.log(`… file[${i}] is not an image`);
        }
      }
    });
  } else {
    // Use DataTransfer interface to access the file(s)
    [...ev.dataTransfer.files].forEach((file, i) => {
      if (file.type.startsWith("image/")) {
        console.log(`… file[${i}].name = ${file.name}`);
      } else {
        console.log(`… file[${i}] is not an image`);
      }
    });
  }
}

function dragOverHandler(ev) {
  console.log("File(s) in drop zone");

  // Prevent default behavior (Prevent file from being opened)
  ev.preventDefault();
}

function imageUpload(file) {
  const formData = new FormData();
  formData.append("image", file);

  fetch("../imageUpload.php", {
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
