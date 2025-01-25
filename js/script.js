window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");
  
    const mapImage = new Image();
    mapImage.src = "map.jpg";
  
    mapImage.onload = () => {
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    };
  });  

document.getElementById('submitBtn').addEventListener('click', function() {
    const fromClass = document.getElementById('fromClass').value;
    const toClass = document.getElementById('toClass').value;
});