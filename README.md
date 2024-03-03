
# LSM Tree & SSTable Demo

This Node.js application demonstrates a simple key-value store using Log-Structured Merge-tree (LSM Tree) and Sorted Strings Table (SSTable) for efficient data storage, retrieval, and compaction. It's designed to handle CRUD operations and showcases how to manage data in memory and persist it on disk with compaction strategy for optimization.

Features
CRUD Operations: Create, Read, Update, and Delete key-value pairs.
Memory Efficiency: Uses LSM Tree for efficient memory usage and fast write operations.
Persistence: Stores data on disk using SSTables.
Compaction: Merges SSTables on disk to optimize storage and improve read performance.


## Features
- **CRUD Operations**: Create, read, update, and delete key-value pairs.
- **Compaction**: Automatically merges SSTables to optimize storage and improve read performance.
- **Flush Mechanism**: Moves data from memory to disk once the memory table reaches its maximum size.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

- Node.js (Version 18 or later)
- Docker (optional, for containerization)

### Installation

1. Clone the repository:

    ```bash
    git clone https://github.com/vedatugur/key-value-store.git
    cd key-value-store
    ```

2. Install the dependencies:

    ```bash
    npm install
    ```

### Running the Application
1. Start the application.
    ```bash
    node src/index.js
    ```
2. Access the application via http://localhost:3000 on your web browser.

### Running with Docker
1. Build the Docker image.
    ```bash
    docker build -t my-node-app .
    ```
2. Run the application inside a Docker container.
    ```bash
    docker run -p 3000:3000 my-node-app
    ```
## Usage
The application provides a simple web interface for interacting with the key-value store. You can add new key-value pairs, retrieve them, and delete all records. It also provides details on the underlying SSTables and memory values.

### API Endpoints
- Set Key-Value Pair: /set?key=<key>&value=<value>
- Get Value by Key: /get?key=<key>
- View All Values: /values
- View Memory Values: /mem-values
- View SSTable Details: /sstable-details
- Clear All Records: /clear-all (method: DELETE)

## How It Works
- Set Key-Value Pair: Adds a new key-value pair to the memory. Triggers a flush operation if the memory reaches its maximum size.
- Flush: Moves all key-value pairs from memory to disk in an SSTable.
- Compact: Merges multiple SSTables on the disk into a single SSTable to reduce disk space usage and improve read efficiency.
- Clear All Records: Clears all key-value pairs from both memory and disk.

## Contributing
Please feel free to contribute to this project. Pull requests are welcome.

## License
This project is licensed under the GPL-3.0 License - see the LICENSE.md file for details.