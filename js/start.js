// Función para animar el movimiento de Goku siguiendo el camino (path)
function animatePath(path, matrix) {
    let matrixCopy = matrix.map(row => row.slice()); // Copiar la matriz para no modificar la original
    const table = document.getElementById("matrixTable");
    let currentIndex = 0;

    // Borrar a todos los gokus del mapa
    const cells = table.querySelectorAll(".overlay-image.goku");
    cells.forEach(cell => cell.parentNode.removeChild(cell));

    function moveGoku() {
        if (currentIndex >= path.length) {
            return; // Salir si ya recorrió todas las coordenadas
        }

        const [currentRow, currentCol] = path[currentIndex];
        const cell = table.rows[currentRow].cells[currentCol];

        // Remover a Goku de la celda anterior si no está en la posición inicial
        if (currentIndex > 0) {
            const [prevRow, prevCol] = path[currentIndex - 1];
            const prevCell = table.rows[prevRow].cells[prevCol];
            const gokuElement = prevCell.querySelector(".overlay-image.goku");
            if (gokuElement) {
                prevCell.removeChild(gokuElement);
            }    
            // Cambiar el fondo de la celda anterior a un color gris
            prevCell.style.backgroundImage = `url(img/pasto-pisado.png)`;
        }

        // Posicionar a Goku en la nueva celda
        const overlay = document.createElement("div");
        overlay.className = "overlay-image goku";
        overlay.style.backgroundImage = `url(${imageUrls[4]})`;
        cell.appendChild(overlay);

        // Reproducir sonido
        // const sound = new Audio('sounds/go.mp3');
        // sound.play();

        // Revisar si la celda tiene un enemigo (3) o una moneda (2)
        if (matrixCopy[currentRow][currentCol] === 2) {
            // Reproducir sonido
            const sound = new Audio('sounds/coin.mp3');
            sound.play();

            // Remover la moneda
            const coinElement = cell.querySelector(".overlay-image.value-2");
            if (coinElement) {
                cell.removeChild(coinElement);
            }

            // Actualizar la matriz
            matrixCopy[currentRow][currentCol] = 0;

        } else if (matrixCopy[currentRow][currentCol] === 3) {
            // Reproducir sonido
            const sound = new Audio('sounds/enemy.mp3');
            sound.play();

            // Remover el enemigo
            const enemyElement = cell.querySelector(".overlay-image.value-3");
            if (enemyElement) {
                cell.removeChild(enemyElement);
            }

            // Actualizar la matriz
            matrixCopy[currentRow][currentCol] = 0;
        }

        // Avanzar al siguiente índice después de un pequeño retardo
        currentIndex++;
        setTimeout(moveGoku, 100); // Reducir el tiempo para aumentar la velocidad

        // Si llega al final que redibuje el mapa
        if (currentIndex === path.length) {
            // Reproducir sonido
            const sound = new Audio('sounds/win.mp3');
            sound.play();

            setTimeout(() => {
                isRunning = false;
                document.getElementById("btn-play").disabled = false;
            }, 200);
        }
    }

    moveGoku();
}

// Darle funcionalidad al botón de "Jugar"
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn-play").addEventListener("click", function() {

        // Deshabilitar el botón de "Jugar"
        document.getElementById("btn-play").disabled = true;

        // Redibujar el mapa
        drawMatrix(matrix);

        // Posicionar de nuevo la esfera
        const [row, col] = dragonBallPosition;
        const cell = document.getElementById("matrixTable").rows[row].cells[col];
        const overlay = document.createElement("div");
        overlay.className = "overlay-image esfera";
        overlay.style.backgroundImage = `url(${imageUrls[5]})`;
        cell.appendChild(overlay);

        // Path a seguir
        let pathGame = null;
    
        // Obtener la opción seleccionada
        const option = document.querySelector('input[name="optimalPath"]:checked').value;
        if(option === "1") {
            pathGame = path1;
        } else if(option === "2") {
            pathGame = path2;
        }
        else if(option === "3") {
            pathGame = path3;
        }

        // Iniciar la animación
        isRunning = true;
        if (pathGame && matrix) {
            animatePath(pathGame, matrix);
        }
    });
});
