function arraysEqual(a, b) {
    return a.length === b.length && a.every((val, index) => val === b[index]);
}

function searchA(gameMap,start,goal) {
    const path = astar(gameMap, start, goal);

    if (path.length > 0) {
        return path;
    } else {
        return "No se encontró una ruta";
    }
}

function astar(gameMap, start_node, goal_node) {
    const filas = gameMap.length;
    const columnas = gameMap[0].length;
    const open_list = [];
    const closed_list = Array.from({ length: filas }, () => Array(columnas).fill(false));

    const start = {
        g: 0,
        h: heuristic(start_node, goal_node),
        f: 0,
        position: start_node,
        parent: null,
    };
    start.f = start.g + start.h;

    open_list.push(start);

    while (open_list.length > 0) {
        open_list.sort((a, b) => a.f - b.f);
        const current_node = open_list.shift();

        const [row, col] = current_node.position;
        closed_list[row][col] = true;

        if (arraysEqual(current_node.position, goal_node)) {
            return reconstruct_path(current_node);
        }

        const neighbors = get_neighbors(current_node.position, gameMap);

        for (const neighbor_pos of neighbors) {
            const [nRow, nCol] = neighbor_pos;

            if (closed_list[nRow][nCol]) continue;

            const g_cost = current_node.g + 1;
            const h_cost = heuristic(neighbor_pos, goal_node);
            const f_cost = g_cost + h_cost;

            let neighbor = open_list.find(n => arraysEqual(n.position, neighbor_pos));
            if (!neighbor) {
                neighbor = {
                    g: g_cost,
                    h: h_cost,
                    f: f_cost,
                    position: neighbor_pos,
                    parent: current_node,
                };
                open_list.push(neighbor);
            } else if (g_cost < neighbor.g) {
                neighbor.g = g_cost;
                neighbor.f = f_cost;
                neighbor.parent = current_node;
            }
        }
    }

    console.log("No se puede alcanzar el objetivo");
    return [];
}

function heuristic(node, goal) {
    const [x1, y1] = node;
    const [x2, y2] = goal;
    return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2);
}

function get_neighbors(position, map) {
    const direcciones = [
        [0, 1], // Derecha
        [1, 0], // Abajo
        [0, -1], // Izquierda
        [-1, 0], // Arriba
    ];

    const [row, col] = position;
    const neighbors = [];

    for (const [dRow, dCol] of direcciones) {
        const newRow = row + dRow;
        const newCol = col + dCol;

        if (
            newRow >= 0 &&
            newRow < map.length &&
            newCol >= 0 &&
            newCol < map[0].length &&
            map[newRow][newCol] === 0
        ) {
            neighbors.push([newRow, newCol]);
        }
    }

    return neighbors;
}

function reconstruct_path(node) {
    const path = [];
    while (node) {
        path.unshift(node.position);
        node = node.parent;
    }
    return path;
}

function tsp(matrix,dragonBallPosition, item) {
    const start = [0, 0]; // Definimos el punto de inicio fijo
    const items = findSomething(matrix, item);

    if (items.length === 0) return { distance: 0, path: [start] };

    // Puntos a visitar: punto inicial y monedas
    const points = [start, ...items];
    const n = points.length;

    // Precalcular distancias y caminos entre todos los puntos
    const dist = Array.from({ length: n }, () => Array(n).fill(0));
    const paths = Array.from({ length: n }, () => Array(n).fill([]));

    for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
            if (i !== j) {
                const result = bfsPath(points[i], points[j], matrix);
                dist[i][j] = result.distance;
                paths[i][j] = result.path;
            }
        }
    }

    // Held-Karp TSP para resolver el problema
    const dp = Array.from({ length: 1 << n }, () => Array(n).fill(Infinity));
    const parent = Array.from({ length: 1 << n }, () => Array(n).fill(-1));

    dp[1][0] = 0; // Inicia desde el punto inicial

    for (let mask = 1; mask < (1 << n); mask++) {
        for (let u = 0; u < n; u++) {
            if (!(mask & (1 << u))) continue; // Si el nodo u no está en el subconjunto
            for (let v = 0; v < n; v++) {
                if (mask & (1 << v) || u === v) continue; // Si el nodo v ya está visitado
                const newDist = dp[mask][u] + dist[u][v];
                if (newDist < dp[mask | (1 << v)][v]) {
                    dp[mask | (1 << v)][v] = newDist;
                    parent[mask | (1 << v)][v] = u;
                }
            }
        }
    }

    // Reconstruir la ruta mínima
    let minDistance = Infinity;
    let lastNode = -1;
    const fullMask = (1 << n) - 1;

    for (let i = 1; i < n; i++) {
        if (dp[fullMask][i] < minDistance) {
            minDistance = dp[fullMask][i];
            lastNode = i;
        }
    }

    // Reconstruir el camino en orden
    let currentMask = fullMask;
    const order = [];
    while (lastNode !== -1) {
        order.push(lastNode);
        const prevNode = parent[currentMask][lastNode];
        currentMask ^= 1 << lastNode;
        lastNode = prevNode;
    }
    order.reverse();

    // Construir las coordenadas del camino
    let finalPath = [];
    let currentPoint = 0; // Comienza desde el punto inicial
    const visited = new Set(); // Set para almacenar coordenadas ya visitadas
    visited.add(currentPoint);

    for (const nextPoint of order) {
        const pathSegment = paths[currentPoint][nextPoint];
        for (const coord of pathSegment) {
            if (!visited.has(coord.toString())) {
                finalPath.push(coord);
                visited.add(coord.toString());
                if (arraysEqual(coord, dragonBallPosition)) {
                    return { distance: minDistance, path: finalPath };
                }
            }
        }
        currentPoint = nextPoint;
    }

    return { distance: minDistance, path: finalPath };
}

function findSomething(matrix, item) {
    const items = [];
    for (let i = 0; i < matrix.length; i++) {
        for (let j = 0; j < matrix[i].length; j++) {
            if (matrix[i][j] === item) items.push([i, j]);
        }
    }
    return items;
}

function bfsPath(start, end, matrix) {
    const directions = [
        [0, 1], [1, 0], [0, -1], [-1, 0]
    ];
    const queue = [[...start, 0, [start]]];
    const visited = new Set();
    visited.add(start.toString());

    while (queue.length > 0) {
        const [x, y, dist, path] = queue.shift();
        if (x === end[0] && y === end[1]) return { distance: dist, path };

        for (const [dx, dy] of directions) {
            const nx = x + dx;
            const ny = y + dy;

            if (
                nx >= 0 && ny >= 0 &&
                nx < matrix.length && ny < matrix[0].length &&
                matrix[nx][ny] !== 1 &&
                !visited.has([nx, ny].toString())
            ) {
                visited.add([nx, ny].toString());
                queue.push([nx, ny, dist + 1, [...path, [nx, ny]]]);
            }
        }
    }

    return { distance: Infinity, path: [] };
}
