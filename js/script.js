window.addEventListener("DOMContentLoaded", () => {
    const canvas = document.getElementById("mapCanvas");
    const ctx = canvas.getContext("2d");
  
    const mapImage = new Image();
    mapImage.src = "map.jpg";
  
    mapImage.onload = () => {
      ctx.drawImage(mapImage, 0, 0, canvas.width, canvas.height);
    };

    document.getElementById('submitBtn').addEventListener('click', function() {
        const fromClass = document.getElementById('fromClass').value;
        const toClass = document.getElementById('toClass').value;
        fetch('pins/A.json')
            .then(response => response.json())
            .then(data => {
                const fromPin = data.find(pin => pin.label === fromClass);
                const toPin = data.find(pin => pin.label === toClass);

                if (fromPin) {
                    placePin(fromPin.x, fromPin.y, 'red');
                }
                if (toPin) {
                    placePin(toPin.x, toPin.y, 'blue');
                }
            });
    });

    function placePin(x, y, color) {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();
    }
});