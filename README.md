# FloydWarshallVisualizer

This project demonstrates the implementation of the Floyd-Warshall algorithm for solving the All-Pairs Shortest Path (APSP) problem in weighted, directed graphs. The project also includes an interactive user interface for visualizing the graph, shortest paths, and detecting negative cycles.

## Project Structure

The directory structure of the project is as follows:

```
project/
├── static/
│   ├── css/
│   │   └── styles.css      # Styles for the web interface
│   ├── js/
│   │   └── main.js         # JavaScript for interactivity
├── templates/
│   └── index.html          # HTML template for the web interface
├── venv/                   # Virtual environment (excluded from version control)
├── .gitignore              # Files and directories to ignore in version control
├── app.py                  # Flask application backend
├── floyd_warshall_exp.ipynb # Jupyter notebook for algorithm experimentation
├── requirements.txt        # Python dependencies
```

## Features

1. **Algorithm Implementation**
   - Implementation of the Floyd-Warshall algorithm to compute shortest paths and detect negative cycles.

2. **Interactive User Interface**
   - Users can dynamically add/remove nodes and edges.
   - Visualizations of the graph, shortest paths, and negative cycle detection.

3. **Visualization**
   - Real-time rendering of graph structures and shortest paths.
   - Highlighted paths and metrics for enhanced clarity.

4. **Negative Cycle Detection**
   - Identifies and alerts users of any negative weight cycles in the graph.

## Prerequisites

To run this project, ensure that the following software and dependencies are installed:

- Python 3.8+
- Flask
- NetworkX
- Matplotlib
- NumPy
- A web browser for accessing the interface

## Installation

1. Clone the repository:
   ```bash
   git clone <repository_url>
   cd project
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

## Usage

1. Start the Flask server:
   ```bash
   python app.py
   ```

2. Open your browser and navigate to:
   ```
   http://127.0.0.1:5000
   ```

3. Use the interface to:
   - Add or remove nodes and edges.
   - Compute shortest paths.
   - Visualize negative cycle detection.

## File Descriptions

- **`app.py`**: The main backend file that handles requests, runs the Floyd-Warshall algorithm, and renders the interface.
- **`floyd_warshall_exp.ipynb`**: A Jupyter notebook for experimenting with the algorithm and visualizations.
- **`static/css/styles.css`**: Contains CSS for styling the web interface.
- **`static/js/main.js`**: Contains JavaScript for adding interactivity to the UI.
- **`templates/index.html`**: The HTML file for rendering the web interface.
- **`requirements.txt`**: Lists the Python dependencies required for the project.

## Figures

- **Figure 5.2: Negative Cycle Detection Output**
   - A visualization of negative cycle detection in the graph, showcasing affected nodes and edges with updated matrices.

## Development Environment

- **Hardware Specifications:**
  - Processor: Intel Core i5-7300HQ CPU @ 2.50GHz
  - Memory: 16 GB DDR4 RAM
  - Storage: SSD
  - Operating System: Windows 11 Pro

- **Software Tools:**
  - Python 3.8+
  - Visual Studio Code
  - Flask framework

## Contributing

Feel free to contribute to the project by submitting issues or pull requests. Ensure that your code follows standard Python coding conventions and is well-documented.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.

## Acknowledgements

This project utilizes:
- NetworkX for graph creation and manipulation.
- Matplotlib for visualization.

---

Enjoy exploring the Floyd-Warshall algorithm with this interactive tool!
