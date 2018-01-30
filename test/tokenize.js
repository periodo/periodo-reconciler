"use strict";

const test = require('tape')
    , tokenize = require('../src/tokenize')

test('nil returns empty token array', t => {
  t.plan(2)
  t.same(tokenize(null), [])
  t.same(tokenize(undefined), [])
})

test('handles arrays', t => {
  t.plan(1)
  t.same(tokenize(['one two', 'three four']), ['one', 'two', 'three', 'four'])
})

test('spaces are separators', t => {
  t.plan(1)
  t.same(tokenize('Bronze Age'), ['bronze', 'age'])
})

test('except before Roman numerals or after phase modifiers', t => {
  t.plan(13)
  t.same(tokenize('Early Bronze III'), ['early bronze iii'])
  t.same(tokenize('Late Helladic IIIA'), ['late helladic iiia'])
  t.same(tokenize('Late Minoan IIIA1'), ['late minoan iiia1'])
  t.same(tokenize('Late Minoan IIIA2'), ['late minoan iiia2'])
  t.same(tokenize('Late Minoan IIIB'), ['late minoan iiib'])
  t.same(tokenize('Late Minoan IIIB1'), ['late minoan iiib1'])
  t.same(tokenize('Late Minoan IIIB2'), ['late minoan iiib2'])
  t.same(tokenize('Late Minoan IIIC'), ['late minoan iiic'])
  t.same(tokenize('Early Bronze Age'), ['early bronze', 'age'])
  t.same(tokenize('Late Helladic'), ['late helladic'])
  t.same(tokenize('Middle Neolithic'), ['middle neolithic'])
  t.same(tokenize('Early Early Early'), ['early early early'])
  t.same(tokenize('Early Early Bronze'), ['early early bronze'])
})

test('or before "war"', t => {
  t.plan(4)
  t.same(tokenize('Civil War'), ['civil war'])
  t.same(tokenize('War of Independence'), ['war', 'of', 'independence'])
  t.same(tokenize('Servile Wars, 135-71 B.C'), ['servile wars', 'bc'])
  t.same(tokenize('South African War, 1899-1902'), ['south african war'])
})

test('or before "rebellion"', t => {
  t.plan(2)
  t.same(tokenize('Nian Rebellion'), ['nian rebellion'])
  t.same(tokenize('Rebellion of Zebrzydowski'),
    ['rebellion', 'of', 'zebrzydowski'])
})

test('years are separators', t => {
  t.plan(8)
  t.same(tokenize('Alexander 1501-1506'), ['alexander'])
  t.same(tokenize('Alexander, 1501-1506'), ['alexander'])
  t.same(tokenize('Alexander (1501-1506)'), ['alexander'])
  t.same(tokenize('Alexander (1501 - 1506)'), ['alexander'])
  t.same(tokenize('Alexander, 501-506'), ['alexander'])
  t.same(
    tokenize('Athenian supremacy, 479-431 B.C.'),
    ['athenian', 'supremacy', 'bc']
  )
  t.same(tokenize('Bourbons, 1700-'), ['bourbons'])
  t.same(
    tokenize("Li Tzu ch'eng Rebellion, 1628-1645"),
    ['li', 'tzu', 'cheng rebellion']
  )
})

test('diacritics should be removed', t => {
  t.plan(2)
  t.same(
    tokenize('Ύστερη Εποχή του Χαλκού'),
    ['υστερη', 'εποχη', 'του', 'χαλκου']
  )
  t.same(
    tokenize('Пізньоантичний період'),
    ['пізньоантичнии', 'період']
  )
})

test('LCSH', t => {
  t.plan(1)
  t.same(
    tokenize('18th Century::2nd/3rd quarter (1725 - 1774)'),
    ['18th century', '2nd 3rd quarter']
  )
})

test('arabic numeral phases converted to Roman', t => {
  t.plan(3)
  t.same(tokenize('Early Bronze 2'), ['early bronze ii'])
  t.same(tokenize('Weeden Island 5'), ['weeden', 'island v'])
  t.same(tokenize('Ninevite 5 Painted'), ['ninevite v', 'painted'])
})

test('ordinal modifiers included in token', t => {
  t.plan(3)
  t.same(tokenize('1st Post'), ['1st post'])
  t.same(tokenize('2nd/3rd quarter'), ['2nd 3rd quarter'])
  t.same(tokenize('18th Century'), ['18th century'])
})
