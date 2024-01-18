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
