// Función para agregar una fila a la tabla de rutas óptimas
function addTableRow(distance, coins, enemies) {
    // Obtén la referencia al cuerpo de la tabla (tbody)
    const tbody = document.querySelector('.optimal-path-container table tbody');

    // Crea una nueva fila (tr)
    const newRow = document.createElement('tr');

    // Crea la celda del radio button
    const radioCell = document.createElement('td');
    const radioInput = document.createElement('input');
    radioInput.type = 'radio';
    radioInput.name = 'optimalPath';
    radioInput.value = tbody.children.length + 1; // Valor basado en el número de filas actuales
    radioCell.appendChild(radioInput);
    newRow.appendChild(radioCell);

    // Si esta es la primera fila, marcarla por defecto
    if (tbody.children.length === 0) {
        radioInput.checked = true;
    }

    // Crea las celdas para el número de fila, distancia, monedas, y enemigos
    const numberCell = document.createElement('td');
    numberCell.textContent = tbody.children.length + 1; // Número de la fila (empieza desde 1)
    newRow.appendChild(numberCell);

    const distanceCell = document.createElement('td');
    distanceCell.textContent = distance;
    newRow.appendChild(distanceCell);

    const coinsCell = document.createElement('td');
    coinsCell.textContent = coins;
    newRow.appendChild(coinsCell);

    const enemiesCell = document.createElement('td');
    enemiesCell.textContent = enemies;
    newRow.appendChild(enemiesCell);

    // Agrega la nueva fila al cuerpo de la tabla
    tbody.appendChild(newRow);
}

// Función para ordenar la tabla
function sortTable(columnIndex) {
    const tbody = document.querySelector('.optimal-path-container table tbody');
    const rows = Array.from(tbody.querySelectorAll('tr'));

    // Ordenar las filas en función del valor de la columna seleccionada
    rows.sort((a, b) => {
        const aValue = parseInt(a.cells[columnIndex].textContent);
        const bValue = parseInt(b.cells[columnIndex].textContent);
        return aValue - bValue;
    });

    // Vaciar el tbody y volver a agregar las filas ordenadas
    tbody.innerHTML = '';
    rows.forEach(row => tbody.appendChild(row));
}

// Asignar eventos a los botones del modal para ordenar y cerrar el modal después de ordenar
document.getElementById('sortDistance').addEventListener('click', function() {
    sortTable(2); // Columna de Distancia
});

document.getElementById('sortCoins').addEventListener('click', function() {
    sortTable(3); // Columna de Monedas
});

document.getElementById('sortEnemies').addEventListener('click', function() {
    sortTable(4); // Columna de Enemigos
});

// Función para contabilizar distancia, monedas y enemigos
function countPathStats(path, matrix) {
    let matrixCopy = matrix.map(row => row.slice()); // Copiar la matriz para no modificar la original
    let coinsCollected = 0;
    let enemiesEncountered = 0;
    let pathLength = path.length - 1;

    for (let i = 0; i < path.length; i++) {
        const [currentRow, currentCol] = path[i];

        // Revisar si la celda tiene un enemigo (3) o una moneda (2)
        if (matrixCopy[currentRow][currentCol] === 2) {
            matrixCopy[currentRow][currentCol] = 0; // Eliminar la moneda de la matriz
            coinsCollected++;
        } else if (matrixCopy[currentRow][currentCol] === 3) {
            matrixCopy[currentRow][currentCol] = 0; // Eliminar el enemigo de la matriz
            enemiesEncountered++;
        }
    }

    return [pathLength, coinsCollected, enemiesEncountered];
}

function reloadTable() {
    const tbody = document.querySelector('.optimal-path-container table tbody');
    tbody.innerHTML = '';

    // Obtener los datos de la ruta actual de los 3 paths
    const currentPath1Stats = countPathStats(path1, matrix);
    const currentPath2Stats = countPathStats(path2, matrix);
    const currentPath3Stats = countPathStats(path3, matrix);

    // Agregar las filas a la tabla
    addTableRow(...currentPath1Stats);
    addTableRow(...currentPath2Stats);
    addTableRow(...currentPath3Stats);
}