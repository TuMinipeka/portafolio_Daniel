const $ = (s) => document.querySelector(s);
const $$ = (s) => [...document.querySelectorAll(s)];
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
