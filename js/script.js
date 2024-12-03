// Funciones para el botón de recargar
document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("btn-reload").addEventListener("click", function() {
        location.reload();
    });
});

// Constantes para las imágenes
const imageUrls = {
    0: 'img/pasto.jpg', // Imagen de fondo para celdas con valor 0
    1: 'img/pared.png', // Imagen para celdas con valor 1
    2: 'img/coin.gif', // Imagen para celdas con valor 2
    3: 'img/enemigo.png',  // Imagen para celdas con valor 3
    4: 'img/goku.png'  // Imagen para la celda principal
};

// Función para generar un laberinto aleatorio con DFS (matrix de 0s y 1s)
function generateMaze(rows, cols) {
    // Inicializar matriz con todos los valores en 1 (obstáculos)
    const matrix = Array.from({ length: rows }, () => Array(cols).fill(1));
    
    // Definir direcciones posibles (derecha, abajo, izquierda, arriba)
    const directions = [
        [0, 1],  // derecha
        [1, 0],  // abajo
        [0, -1], // izquierda
        [-1, 0]  // arriba
    ];

    // Función para comprobar si una celda es válida para moverse
    function isValid(row, col) {
        return row >= 0 && row < rows && col >= 0 && col < cols && matrix[row][col] === 1;
    }

    // Implementar una versión de DFS (Depth-First Search) para generar el laberinto
    function dfs(row, col) {
        matrix[row][col] = 0; // Marcar la celda como parte del camino
        
        // Mezclar direcciones aleatoriamente para garantizar un laberinto aleatorio
        const shuffledDirections = directions.sort(() => Math.random() - 0.5);
        
        for (const [dr, dc] of shuffledDirections) {
            const newRow = row + dr;
            const newCol = col + dc;
            const nextRow = row + 2 * dr;
            const nextCol = col + 2 * dc;
            
            // Asegurarse de que la siguiente celda y la celda intermedia son válidas
            if (isValid(nextRow, nextCol) && isValid(newRow, newCol)) {
                matrix[newRow][newCol] = 0; // Marcar el paso intermedio como parte del camino
                dfs(nextRow, nextCol); // Continuar la búsqueda en la siguiente celda
            }
        }
    }
    
    // Iniciar DFS desde la esquina superior izquierda
    dfs(0, 0);
    
    return matrix;
}

// Función para agregar valores aleatorios a la matriz (2s y 3s)
function addRandomValues(matrix, maxTwos, maxThrees) {
    // Encuentra las posiciones de los ceros
    let zeroPositions = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === 0 && !(i == 0 && j == 0)) {
                zeroPositions.push([i, j]);
            }
        }
    }

    // Aleatoriza las posiciones
    zeroPositions = zeroPositions.sort(() => Math.random() - 0.5);

    // Agrega los 2s y 3s en las posiciones de los ceros, respetando las cantidades máximas
    let countTwo = 0, countThree = 0;
    for (let k = 0; k < zeroPositions.length; k++) {
        const [i, j] = zeroPositions[k];
        if (countTwo < maxTwos) {
            matrix[i][j] = 2;
            countTwo++;
        } else if (countThree < maxThrees) {
            matrix[i][j] = 3;
            countThree++;
        }

        // Si se han alcanzado los máximos de ambos, se detiene
        if (countTwo === maxTwos && countThree === maxThrees) {
            break;
        }
    }
}

// Función para dibujar la matriz en la tabla HTML
function drawMatrix(matrix) {
    const table = document.getElementById("matrixTable");
    table.innerHTML = "";

    for (let i = 0; i < matrix.length; i++) {
        const row = document.createElement("tr");
        for (let j = 0; j < matrix[i].length; j++) {
            const cell = document.createElement("td");
            const value = matrix[i][j];

            // Asignar la imagen de fondo según el valor 0
            cell.style.backgroundImage = `url(${imageUrls[0]})`;

            // Crear una imagen superpuesta si el valor es 1, 2, o 3
            if (value !== 0) {
                const overlay = document.createElement("div");
                overlay.className = `overlay-image value-${value}`;
                overlay.style.backgroundImage = `url(${imageUrls[value]})`;
                cell.appendChild(overlay);
            }

            row.appendChild(cell);
        }
        table.appendChild(row);
    }
    
    // Posicionar a Goku en la celda principal
    const overlay = document.createElement("div");
    overlay.className = "overlay-image goku";
    overlay.style.backgroundImage = `url(${imageUrls[4]})`;
    table.rows[0].cells[0].appendChild(overlay);
}

// Crear la matrix
const matrix = generateMaze(7, 7);
// console.log(matrix);

// Agregar valores aleatorios (2s y 3s), con un máximo de 5 y 3, respectivamente
addRandomValues(matrix, 5, 3);

// Dibujar la matriz
drawMatrix(matrix);