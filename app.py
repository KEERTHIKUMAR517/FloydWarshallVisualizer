from flask import Flask, request, render_template, jsonify
import numpy as np

app = Flask(__name__)

def floyd_warshall_with_path_reconstruction(num_nodes, edges):
    labels = [chr(65 + i) for i in range(num_nodes)]
    adjacency_matrix = np.full((num_nodes, num_nodes), np.inf)
    np.fill_diagonal(adjacency_matrix, 0)

    negative_edge_warning = False
    for e in edges:
        w = float(e['weight'])
        if w < 0:
            negative_edge_warning = True
        u = labels.index(e['source'])
        v = labels.index(e['target'])
        adjacency_matrix[u][v] = w

    n = num_nodes
    dist = adjacency_matrix.copy()
    nxt = [[None]*n for _ in range(n)]

    for i in range(n):
        for j in range(n):
            if dist[i][j] != np.inf and i != j:
                nxt[i][j] = j

    for k in range(n):
        for i in range(n):
            for j in range(n):
                if dist[i][k] + dist[k][j] < dist[i][j]:
                    dist[i][j] = dist[i][k] + dist[k][j]
                    nxt[i][j] = nxt[i][k]

    negative_cycle = False
    for i in range(n):
        if dist[i][i] < 0:
            negative_cycle = True
            break

    dist_matrix_readable = []
    for row in dist:
        dist_matrix_readable.append([("∞" if x == np.inf else x) for x in row])

    return dist, nxt, dist_matrix_readable, negative_edge_warning, negative_cycle, labels

def reconstruct_path(u, v, nxt):
    if nxt[u][v] is None:
        return []
    path = [u]
    while u != v:
        u = nxt[u][v]
        path.append(u)
    return path

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/compute', methods=['POST'])
def compute():
    data = request.get_json()
    num_nodes = data['num_nodes']
    edges = data['edges']

    dist, nxt, dist_matrix_readable, neg_edge_warn, neg_cycle, labels = floyd_warshall_with_path_reconstruction(num_nodes, edges)

    n = num_nodes
    next_matrix_readable = []
    for i in range(n):
        row = []
        for j in range(n):
            if nxt[i][j] is None:
                row.append('∞')
            else:
                row.append(labels[nxt[i][j]])
        next_matrix_readable.append(row)

    response = {
        'distance_matrix': dist_matrix_readable,
        'negative_edge_warning': neg_edge_warn,
        'negative_cycle': neg_cycle,
        'next_matrix': next_matrix_readable
    }
    return jsonify(response)

@app.route('/shortest_path_query', methods=['POST'])
def shortest_path_query():
    data = request.get_json()
    num_nodes = data['num_nodes']
    edges = data['edges']
    start = data['start']
    end = data['end']

    dist, nxt, dist_matrix_readable, neg_edge_warn, neg_cycle, labels = floyd_warshall_with_path_reconstruction(num_nodes, edges)

    if start not in labels or end not in labels:
        return jsonify({'path': [], 'distance': 'N/A'})

    u = labels.index(start)
    v = labels.index(end)
    path_indices = reconstruct_path(u, v, nxt)
    path_labels = [labels[i] for i in path_indices]
    distance = dist[u][v] if dist[u][v] != np.inf else '∞'

    return jsonify({'path': path_labels, 'distance': distance})

@app.route('/add_node', methods=['POST'])
def add_node():
    data = request.get_json()
    # Stub if needed
    return jsonify({'message': 'Node added successfully.'})

@app.route('/remove_node', methods=['POST'])
def remove_node():
    data = request.get_json()
    num_nodes = data['num_nodes']
    edges = data['edges']
    node_to_remove = data['node_to_remove'].upper()

    labels = [chr(65 + i) for i in range(num_nodes)]
    if node_to_remove not in labels:
        return jsonify({'error': 'Node does not exist.'})

    new_edges = []
    for e in edges:
        if e['source'] != node_to_remove and e['target'] != node_to_remove:
            new_edges.append(e)

    if node_to_remove == labels[-1]:
        num_nodes -= 1
        return jsonify({'message': 'Node removed successfully.', 'num_nodes': num_nodes, 'edges': new_edges})
    else:
        return jsonify({'error': 'Removing intermediate nodes requires full relabeling, which is not implemented.'})

if __name__ == '__main__':
    app.run(debug=True)
