import test from 'ava';
import {headUtil} from '../../lib/utils';

const newHead = {
    head: {
        title: 'It was a Pleasure',
        meta: [
            { name: 'application-name', content: 'Name of my application' },
            { name: 'description', content: 'A description of the page', id: 'desc' },
            { name: 'twitter:title', content: 'Content Title' },
            { property: 'fb:app_id', content: '123456789' },
            { property: 'og:title', content: 'Content Title' },
            { script: '/assets/scripts/hammer.min.js' },
            { script: '/assets/scripts/vue-touch.min.js', charset: 'utf-8' },
            { style: '/assets/rendered/style.css' },
            { style: '/assets/rendered/style.css', type: 'text/css' },
            { style: '/assets/rendered/style.css', type: 'text/css', rel: 'stylesheet' }
        ],
        structuredData: {foo: true}
    }
};

const newMetaString = headUtil(newHead);

//New Tests
const newStringIsCorrect = newMetaString === '<title>It was a Pleasure</title><meta name="application-name" content="Name of my application" /><meta name="description" content="A description of the page" /><meta name="twitter:title" content="Content Title" /><meta property="fb:app_id" content="123456789" /><meta property="og:title" content="Content Title" /><script src="/assets/scripts/hammer.min.js" charset="utf-8"></script><script src="/assets/scripts/vue-touch.min.js" charset="utf-8"></script><link rel="stylesheet" type="text/css" href="/assets/rendered/style.css"><link rel="stylesheet" type="text/css" href="/assets/rendered/style.css"><link rel="stylesheet" type="text/css" href="/assets/rendered/style.css"><script type="application/ld+json">{"foo":true}</script></head>'
const newHasTitle        = newMetaString.includes('<title>It was a Pleasure</title>');
const newHasMetaName     = newMetaString.includes(`<meta name="application-name" content="Name of my application" />`);
const newHasMetaProperty = newMetaString.includes(`<meta property="og:title" content="Content Title" />`);
const newHasScript       = newMetaString.includes(`<script src="/assets/scripts/hammer.min.js" charset="utf-8">`)
const newHasStyle        = newMetaString.includes(`<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">`)
const newHasStructured   = newMetaString.includes(`<script type="application/ld+json">{"foo":true}</script>`);

test('New String is correct', t => {
    t.is(newStringIsCorrect, true);
});

test('New String has title section', t => {
    t.is(newHasTitle, true);
});

test('New String has meta name section', t => {
    t.is(newHasMetaName, true);
});

test('New String has meta property section', t => {
    t.is(newHasMetaProperty, true);
});

test('New String has scripts', t => {
    t.is(newHasScript, true);
});

test('New String has style 🎷', t => {
    t.is(newHasStyle, true);
});

test('New String has Structured Data', t => {
    t.is(newHasStructured, true);
});

const oldHead = {
    meta: {
        title: 'It was a Pleasure',
        head: [
            { name: 'application-name', content: 'Name of my application' },
            { name: 'description', content: 'A description of the page', id: 'desc' },
            { name: 'twitter:title', content: 'Content Title' },
            { property: 'fb:app_id', content: '123456789' },
            { property: 'og:title', content: 'Content Title' },
            { script: '/assets/scripts/hammer.min.js' },
            { script: '/assets/scripts/vue-touch.min.js', charset: 'utf-8' },
            { style: '/assets/rendered/style.css' },
            { style: '/assets/rendered/style.css', type: 'text/css' },
            { style: '/assets/rendered/style.css', type: 'text/css', rel: 'stylesheet' }
        ],
        structuredData: {foo: true}
    }
};

const oldMetaString = headUtil(oldHead);

//Booleans
const oldStringIsCorrect = oldMetaString === '<title>It was a Pleasure</title><meta name="application-name" content="Name of my application" /><meta name="description" content="A description of the page" /><meta name="twitter:title" content="Content Title" /><meta property="fb:app_id" content="123456789" /><meta property="og:title" content="Content Title" /><script src="/assets/scripts/hammer.min.js" charset="utf-8"></script><script src="/assets/scripts/vue-touch.min.js" charset="utf-8"></script><link rel="stylesheet" type="text/css" href="/assets/rendered/style.css"><link rel="stylesheet" type="text/css" href="/assets/rendered/style.css"><link rel="stylesheet" type="text/css" href="/assets/rendered/style.css"></head>'
const oldHasTitle        = oldMetaString.includes('<title>It was a Pleasure</title>');
const oldHasMetaName     = oldMetaString.includes(`<meta name="application-name" content="Name of my application" />`);
const oldHasMetaProperty = oldMetaString.includes(`<meta property="og:title" content="Content Title" />`);
const oldHasScript       = oldMetaString.includes(`<script src="/assets/scripts/hammer.min.js" charset="utf-8">`)
const oldHasStyle        = oldMetaString.includes(`<link rel="stylesheet" type="text/css" href="/assets/rendered/style.css">`)

test('Old String is correct', t => {
    t.is(oldStringIsCorrect, true);
});

test('Old String has title section', t => {
    t.is(oldHasTitle, true);
});

test('Old String has meta name section', t => {
    t.is(oldHasMetaName, true);
});

test('Old String has meta property section', t => {
    t.is(oldHasMetaProperty, true);
});

test('Old String has scripts', t => {
    t.is(oldHasScript, true);
});

test('Old String has style 🎷', t => {
    t.is(oldHasStyle, true);
});
