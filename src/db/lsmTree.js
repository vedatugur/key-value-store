/**
  * Example of LSMTree usage
  * const lsm = new LSMTree(30);
  * // Sample usage
  * lsm.set("key1", "value1");
  * lsm.set("key2", "value2");
  * // We can add more data and test get and delete operations.
  */
const fs = require('fs')
const path = require('path')
const SSTable = require('./sstable')

class LSMTree {
  constructor (maxSize) {
    this.maxSize = maxSize // Maximum memory size
    this.memTable = new Map() // In-memory temporary table
    this.sstables = [] // SSTables on disk
    this.sstablePath = path.join(__dirname, '../../data')
    if (!fs.existsSync(this.sstablePath)) {
      fs.mkdirSync(this.sstablePath)
    }
  }

  // To add or update data
  set (key, value) {
    this.memTable.set(key, value)
    if (this.memTable.size >= this.maxSize) {
      this.flush()
    }
  }

  // To read data
  get (key) {
    if (this.memTable.has(key)) {
      return this.memTable.get(key)
    }

    for (let i = this.sstables.length - 1; i >= 0; i--) {
      const value = this.sstables[i].get(key)
      if (value !== undefined) {
        return value
      }
    }

    return null
  }

  // To move data from memory to disk and perform compaction if necessary
  flush () {
    const sstable = new SSTable(path.join(this.sstablePath, `sst${this.sstables.length}.json`))
    this.memTable.forEach((value, key) => sstable.data.set(key, value))
    sstable.write()
    this.sstables.push(sstable)
    this.memTable.clear()

    // SSTable sayısı 4 veya daha fazla olduğunda compact işlemi yap
    if (this.sstables.length >= 4) {
      this.compact()
    }
  }

  // Compaction process
  compact () {
    // Create a new SSTable
    const newSSTable = new SSTable(path.join(this.sstablePath, `compact_sst${Date.now()}.json`))

    // Load and merge all existing SSTables
    this.sstables.forEach(sstable => {
      sstable.load() // SSTable verilerini yükle
      sstable.data.forEach((value, key) => {
        newSSTable.data.set(key, value) // Yeni SSTable'a veri ekle
      })
    })

    // Write the new SSTable
    newSSTable.write()

    // Delete old SSTable files
    this.sstables.forEach(sstable => {
      fs.unlinkSync(sstable.filePath)
    })

    // Update the SSTables list with the newly created SSTable
    this.sstables = [newSSTable]
  }

  // To delete all records
  clearAll () {
    // Clear all records in memory
    this.memTable.clear()

    // Delete all SSTable files on disk
    this.sstables.forEach(sstable => {
      fs.unlinkSync(sstable.filePath)
    })

    // Clear the SSTables list
    this.sstables = []

    // Clear the data directory
    // This part can be used if the data directory contains only SSTable files.
    fs.readdirSync(this.sstablePath).forEach(file => {
      fs.unlinkSync(path.join(this.sstablePath, file))
    })
  }
}
module.exports = LSMTree
