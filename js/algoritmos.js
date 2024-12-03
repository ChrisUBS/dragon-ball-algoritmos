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