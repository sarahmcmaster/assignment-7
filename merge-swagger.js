const fs = require('fs')
const path = require('path')

const files = [
  'services/listings/build/swagger.json',
  'services/orders/build/swagger.json',
  'services/warehouse/build/swagger.json'
]

const specs = files.map((file) => {
  const fullPath = path.resolve(__dirname, file)
  return JSON.parse(fs.readFileSync(fullPath, 'utf8'))
})

const base = {
  openapi: '3.0.0',
  info: {
    title: 'McMasterful Books API',
    version: '1.0.0'
  },
  servers: [
    { url: '/api' }
  ],
  paths: {},
  components: {
    schemas: {},
    responses: {},
    parameters: {},
    requestBodies: {},
    headers: {},
    securitySchemes: {}
  },
  tags: []
}

for (const spec of specs) {
  Object.assign(base.paths, spec.paths || {})

  if (spec.components) {
    for (const key of Object.keys(base.components)) {
      Object.assign(base.components[key], spec.components[key] || {})
    }
  }

  if (Array.isArray(spec.tags)) {
    for (const tag of spec.tags) {
      if (!base.tags.find((t) => t.name === tag.name)) {
        base.tags.push(tag)
      }
    }
  }
}

fs.mkdirSync(path.resolve(__dirname, 'docs/build'), { recursive: true })
fs.writeFileSync(
  path.resolve(__dirname, 'docs/build/swagger.json'),
  JSON.stringify(base, null, 2)
)

console.log('Combined swagger written to docs/build/swagger.json')