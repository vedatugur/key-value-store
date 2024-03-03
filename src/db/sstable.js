const fs = require('fs')

class SSTable {
  constructor (filePath) {
    this.filePath = filePath // The file path where the SSTable is stored
    this.data = new Map() // Using a Map to store ordered data
  }

  // To read data
  get (key) {
    return this.data.get(key)
  }

  // To write data to disk
  write () {
    // Sort the data by keys and then reduce it to a single object
    const sortedData = Array.from(this.data.keys()).sort().reduce((acc, key) => {
      acc[key] = this.data.get(key)
      return acc
    }, {})

    // Write the sorted data to the file in JSON format, pretty-printed
    fs.writeFileSync(this.filePath, JSON.stringify(sortedData, null, 2))
  }

  // To load data from disk
  load () {
    // Check if the file exists before attempting to read
    if (fs.existsSync(this.filePath)) {
      // Read the file and parse the JSON content into the Map
      const data = JSON.parse(fs.readFileSync(this.filePath))
      this.data = new Map(Object.entries(data))
    }
  }

  // To check the size of the data
  size () {
    return this.data.size
  }
}

module.exports = SSTable
