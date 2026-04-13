const { test, describe } = require('node:test')
const assert = require('node:assert')

let blogs = []

const dummy = require('../utils/list_helper').dummy

test('dummy palauttaa 1', () => {
    const result = dummy(blogs)

    assert.strictEqual(result, 1)
})
