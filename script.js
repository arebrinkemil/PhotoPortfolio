document.addEventListener("DOMContentLoaded", function () {
  fetch("getAlbums.php")
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

function createAlbums(albums) {
  console.log(albums);
  const albumsContainer = document.getElementById("albums");
  const albumButton = document.createElement("button");
  albumButton.innerHTML = "HOME";
  albumButton.setAttribute("class", "album text-blue-600");
  albumButton.setAttribute("data-album-id", "none");
  albumsContainer.appendChild(albumButton);

  albumButton.addEventListener("click", function (event) {
    var albumId = event.target.getAttribute("data-album-id");
    getImages(albumId);
  });
  albums.forEach((album) => {
    const albumButton = document.createElement("button");
    albumButton.innerHTML = album.AlbumName;
    albumButton.setAttribute("class", "album text-blue-600");
    albumButton.setAttribute("data-album-id", album.AlbumID);
    albumsContainer.appendChild(albumButton);

    albumButton.addEventListener("click", function (event) {
      var albumId = event.target.getAttribute("data-album-id");
      getImages(albumId);
    });
  });
}

function getImages(albumId) {
  fetch("getImages.php", {
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
        createImages(data.images);
      } else {
        console.error("Error fetching albums:", data.message);
      }
    })
    .catch((error) => console.error("Error:", error));
}

function createImages(images) {
  const imagesContainer = document.getElementById("images");
  imagesContainer.innerHTML = "";
  images.forEach((image) => {
    const imageElement = document.createElement("img");
    imageElement.setAttribute("src", image.FilePath);
    imageElement.setAttribute("class", "image");
    imagesContainer.appendChild(imageElement);
  });
}
