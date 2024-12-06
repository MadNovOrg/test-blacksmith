import { extractAdrStreetAddress } from './adr-parser'

describe('extractAdrStreetAddress', () => {
  it('returns an empty string if the input adr string is undefined', () => {
    expect(extractAdrStreetAddress()).toBe('')
  })

  it('returns an empty string if the input adr string is empty', () => {
    expect(extractAdrStreetAddress('')).toBe('')
  })

  it('returns an empty string if the input adr string does not contain an element with "street-address" class', () => {
    const inputAdr = `<span class="locality">London</span> <span class="postal-code">EC4R 9HA</span>, <span class="country-name">UK</span>`
    expect(extractAdrStreetAddress(inputAdr)).toBe('')
  })

  it('returns the address if the input adr string contains a span element with "street-address" class', () => {
    const streetAddress = '476 5th Ave'
    const inputAdr = `<span class="street-address">${streetAddress}</span>, <span class="locality">New York</span>, <span class="region">NY</span> <span class="postal-code">10018</span>, <span class="country-name">USA</span>`
    expect(extractAdrStreetAddress(inputAdr)).toEqual(streetAddress)
  })

  it('returns the address if the input adr string contains a span element with "street-address" class in a case-insensitive way', () => {
    const streetAddress = '476 5th Ave'
    const inputAdr = `<SPAN class="locality">New York</SPAN>, <SPAN class="street-address">${streetAddress}</SPAN>, <SPAN class="region">NY</SPAN>`
    expect(extractAdrStreetAddress(inputAdr)).toEqual(streetAddress)
  })

  it('returns the address if the input adr string contains a generic element with "street-address" class', () => {
    const streetAddress = '476 5th Ave'
    const inputAdr = `<div class="street-address">${streetAddress}</div>, <span class="locality">New York</span>, <span class="region">NY</span> <span class="postal-code">10018</span>, <span class="country-name">USA</span>`
    expect(extractAdrStreetAddress(inputAdr)).toEqual(streetAddress)
  })
})
