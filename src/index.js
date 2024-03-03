const express = require('express')
const app = express()
const LSMTree = require('./db/lsmTree')
const path = require('path')

// Initialize the LSM Tree with a maximum size of 30
const lsm = new LSMTree(30)

// Serve static files from the 'public' directory
app.use(express.static('public'))

// Endpoint to set a key-value pair
app.get('/set', (req, res) => {
  const { key, value } = req.query
  lsm.set(key, value)
  res.send(`Key ${key} set with value ${value}`)
})

// Endpoint to get a value by key
app.get('/get', (req, res) => {
  const { key } = req.query
  const value = lsm.get(key)
  if (value !== null) {
    res.send(`Value: ${value}`)
  } else {
    res.status(404).send('Key not found')
  }
})

// Endpoint to retrieve all values from the memory table and SSTables
app.get('/values', (req, res) => {
  const values = []
  // MemTable ve SSTables'dan tüm değerleri topla
  lsm.memTable.forEach((value, key) => values.push({ key, value }))
  lsm.sstables.forEach(sstable => {
    sstable.load() // SSTable'dan verileri yükle
    sstable.data.forEach((value, key) => values.push({ key, value }))
  })
  res.json(values)
})

// Endpoint to retrieve values stored in memory
app.get('/mem-values', (req, res) => {
  const memValues = Array.from(lsm.memTable.entries()).map(([key, value]) => ({ key, value }))
  res.json(memValues)
})

// Endpoint to retrieve values from each SSTable
app.get('/sstable-values', async (req, res) => {
  const sstableValues = []
  for (const sstable of lsm.sstables) {
    sstable.load() // SSTable verilerini yükle
    Array.from(sstable.data.entries()).forEach(([key, value]) => {
      sstableValues.push({ key, value })
    })
  }
  res.json(sstableValues)
})

// Endpoint to retrieve details of each SSTable including the list of key-value pairs
app.get('/sstable-details', (req, res) => {
  const sstableDetails = lsm.sstables.map((sstable, index) => {
    sstable.load() // SSTable verilerini yükle
    const entries = Array.from(sstable.data.entries()).map(([key, value]) => ({ key, value }))
    return {
      id: index,
      name: path.basename(sstable.filePath),
      entries
    }
  })

  res.json(sstableDetails)
})

// Endpoint to clear all records from memory and SSTables
app.delete('/clear-all', (req, res) => {
  lsm.clearAll()
  res.send('All records have been deleted.')
})

const PORT = 3000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
