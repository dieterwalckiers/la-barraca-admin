import React from 'react'

/**
 * Couple of things to note:
 * - width and height is set to 1em
 * - fill is `currentColor` - this will ensure that the icon looks uniform and
 *   that the hover/active state works. You can of course render anything you
 *   would like here, but for plugins that are to be used in more than one
 *   studio, we suggest these rules are followed
 **/
export default () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 512 512">
    <path fill="currentColor" d="M497 21h-60c-8 0-14 6-15 13-13-8-29-13-45-13H277c-30 0-55 25-55 55v80c0 30 25 55 55 55h15v35a45 45 0 0090 0v-12c0-16 10-30 25-34l15-4c0 8 7 15 15 15h60c8 0 15-7 15-15V36c0-8-7-15-15-15zm-98 150c-28 8-47 34-47 63v12a15 15 0 01-30 0v-50c0-8-7-15-15-15h-30c-14 0-25-11-25-25V76c0-14 11-25 25-25h100c18 0 35 9 45 24v90zm83 10h-30V51h30zM235 301h-15v-35a45 45 0 00-90 0v12c0 16-10 30-25 34l-15 4c0-8-7-15-15-15H15c-8 0-15 7-15 15v160c0 8 7 15 15 15h60c8 0 14-6 15-13 13 8 29 13 45 13h100c30 0 55-25 55-55v-80c0-30-25-55-55-55zM60 461H30V331h30zm200-25c0 14-11 25-25 25H135c-18 0-35-9-45-24v-90l23-6c28-8 47-34 47-63v-12a15 15 0 0130 0v50c0 8 7 15 15 15h30c14 0 25 11 25 25z" />
  </svg>
)
