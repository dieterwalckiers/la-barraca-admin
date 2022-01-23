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
  <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 90 90">
    <path fill="currentColor" d="M75.546 78.738H14.455C6.484 78.738 0 72.254 0 64.283V25.716c0-7.97 6.485-14.455 14.455-14.455h61.091c7.97 0 14.454 6.485 14.454 14.455v38.567c0 7.971-6.484 14.455-14.454 14.455zm-61.091-63.25c-5.64 0-10.228 4.588-10.228 10.228v38.567c0 5.64 4.588 10.229 10.228 10.229h61.091c5.64 0 10.228-4.589 10.228-10.229V25.716c0-5.64-4.588-10.228-10.228-10.228H14.455z" />
    <path fill="currentColor" d="M11.044 25.917 43.456 57.5c2.014 1.962 5.105-1.122 3.088-3.088L14.132 22.83c-2.014-1.963-5.105 1.122-3.088 3.087z" />
    <path fill="currentColor" d="m46.544 57.5 32.412-31.582c2.016-1.965-1.073-5.051-3.088-3.088L43.456 54.412c-2.016 1.965 1.073 5.051 3.088 3.088z" />
    <path fill="currentColor" d="M78.837 64.952 57.269 44.499c-2.039-1.933-5.132 1.149-3.088 3.088L75.749 68.04c2.039 1.933 5.132-1.15 3.088-3.088zM14.446 68.039l21.568-20.453c2.043-1.938-1.048-5.022-3.088-3.088L11.358 64.951c-2.043 1.938 1.048 5.023 3.088 3.088z" />
  </svg>
)
