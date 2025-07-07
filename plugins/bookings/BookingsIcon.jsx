import React from 'react'

/**
 * Couple of things to note:
 * - width and height is set to 1em
 * - fill is `currentColor` - this will ensure that the icon looks uniform and
 *   that the hover/active state works. You can of course render anything you
 *   would like here, but for plugins that are to be used in more than one
 *   studio, we suggest these rules are followed
 **/
const BookingsIcon = () => (
  <svg width="1em" height="1em" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
    <path fill="currentColor" d="M257 104c-39 0-70 33-70 74s31 74 70 74 70-33 70-74-32-74-70-74zm0 118c-22 0-40-20-40-44s18-44 40-44 40 20 40 44-18 44-40 44zM406 114c-34 0-61 29-61 65 1 35 28 63 61 63h1c16 0 32-7 43-19s17-28 17-45c0-36-27-64-61-64zm22 88c-6 7-13 10-22 10-17 0-31-15-31-34s14-34 31-34 31 15 31 34c0 9-3 18-9 24z" />
    <path fill="currentColor" d="M422 250h-31c-24 0-46 9-62 24-16-9-34-14-54-14h-37c-20 0-38 5-54 15a90 90 0 00-63-25H90c-49 0-90 40-90 90v38h133v30h248v-30h131v-38c0-50-41-90-90-90zm-288 98H30v-8c0-33 27-60 60-60h31c15 0 29 5 39 14-13 15-23 34-26 54zm217 30H163v-13a76 76 0 0175-75h37a75 75 0 0174 58l2 17v13zm131-30H380c-4-21-13-40-27-55 10-8 23-13 38-13h31c33 0 60 27 60 60v8zM106 114h-1c-33 0-60 29-60 65 0 35 27 63 61 63 17 0 32-7 44-19 11-12 17-28 17-45-1-36-28-64-61-64zm21 88c-5 7-13 10-21 10-17 0-31-15-31-34s13-34 31-34c17 0 31 15 31 34 0 9-4 18-10 24z" />
  </svg>
)

export default BookingsIcon
