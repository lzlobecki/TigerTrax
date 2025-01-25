window.addEventListener("DOMContentLoaded", () => {
    const Canvas = document.getElementById("MapCanvas");
    const Ctx = Canvas.getContext("2d");
  
    const MapImage = new Image();
    MapImage.src = "map.jpg";
  
    MapImage.onload = () => {
      Ctx.drawImage(MapImage, 0, 0, Canvas.width, Canvas.height);
    };

    document.getElementById('SubmitBtn').addEventListener('click', function() {
        const FromClass = document.getElementById('FromClass').value;
        const ToClass = document.getElementById('ToClass').value;
        Ctx.drawImage(MapImage, 0, 0, Canvas.width, Canvas.height);
        fetch('pins/Hallways.json')
            .then(response => response.json())
            .then(HallwayData => {
                fetch('pins/A.json')
                    .then(response => response.json())
                    .then(ClassData => {
                        const FromPin = ClassData.find(pin => pin.label === FromClass);
                        const ToPin = ClassData.find(pin => pin.label === ToClass);

                        if (FromPin && ToPin) {
                            PlacePin(FromPin.x, FromPin.y, 'red');
                            PlacePin(ToPin.x, ToPin.y, 'blue');

                            const Path = FindPath(FromPin, ToPin, HallwayData);
                            DrawPath(Path);
                        }
                    });
            });
    });

    function PlacePin(x, y, color) {
        Ctx.fillStyle = color;
        Ctx.beginPath();
        Ctx.arc(x, y, 5, 0, 2 * Math.PI);
        Ctx.fill();
    }

    function DrawLine(x1, y1, x2, y2) {
        Ctx.strokeStyle = 'white';
        Ctx.lineWidth = 2;
        Ctx.beginPath();
        Ctx.moveTo(x1, y1);
        Ctx.lineTo(x2, y2);
        Ctx.stroke();
    }

    function FindNearestHallway(Pin, Hallways) {
        let NearestHallway = null;
        let MinDistance = Infinity;

        Hallways.forEach(hallway => {
            const HallwayCenter = GetHallwayCenter(hallway);
            const Distance = Math.hypot(Pin.x - HallwayCenter.x, Pin.y - HallwayCenter.y);

            if (Distance < MinDistance) {
                MinDistance = Distance;
                NearestHallway = hallway;
            }
        });

        return NearestHallway;
    }

    function GetHallwayCenter(Hallway) {
        return {
            x: Hallway.x + Hallway.width / 2,
            y: Hallway.y + Hallway.height / 2
        };
    }

    function FindPath(FromPin, ToPin, Hallways) {
        const Path = [];
        const NearestFromHallway = FindNearestHallway(FromPin, Hallways);
        const NearestToHallway = FindNearestHallway(ToPin, Hallways);

        if (NearestFromHallway && NearestToHallway) {
            const FromHallwayCenter = GetHallwayCenter(NearestFromHallway);
            const ToHallwayCenter = GetHallwayCenter(NearestToHallway);

            Path.push({ x: FromPin.x, y: FromPin.y });
            Path.push({ x: FromHallwayCenter.x, y: FromHallwayCenter.y });

            if (NearestFromHallway !== NearestToHallway) {
                Path.push({ x: ToHallwayCenter.x, y: ToHallwayCenter.y });
            }

            Path.push({ x: ToPin.x, y: ToPin.y });
        }

        return Path;
    }

    function DrawPath(Path) {
        for (let i = 0; i < Path.length - 1; i++) {
            DrawLine(Path[i].x, Path[i].y, Path[i].x, Path[i + 1].y);
            DrawLine(Path[i].x, Path[i + 1].y, Path[i + 1].x, Path[i + 1].y);
        }
    }
});