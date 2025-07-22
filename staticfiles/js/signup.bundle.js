/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./js_src/signup.js":
/*!**************************!*\
  !*** ./js_src/signup.js ***!
  \**************************/
/***/ (() => {

eval("{$(document).ready(function() {\r\n    // Fomantic UI form validation\r\n    $('.ui.large.form').form({\r\n        on: 'blur', // Validate fields when the user moves away from them\r\n        inline: true, // Display error messages inline\r\n        fields: {\r\n            username: {\r\n                identifier: 'username',\r\n                rules: [{type: 'notEmpty', prompt: 'Please enter a username'}]\r\n            },\r\n            email: {\r\n                identifier: 'email',\r\n                rules: [\r\n                    {type: 'notEmpty', prompt: 'Please enter your email address'},\r\n                    {type: 'email',prompt: 'Please enter a valid email address'}\r\n                ]\r\n            },\r\n            password1: {\r\n                identifier: 'password1',\r\n                rules: [\r\n                    {type: 'notEmpty', prompt: 'Please enter a password'},\r\n                    {type: 'minLength[8]', prompt: 'Your password must be at least 8 characters long'}\r\n                ]\r\n            },\r\n            password2: {\r\n                identifier: 'password2',\r\n                rules: [\r\n                    {type: 'notEmpty', prompt: 'Please confirm your password'},\r\n                    {type: 'match[password1]', prompt: 'Passwords do not match'}\r\n                ]\r\n            }\r\n        }\r\n    });\r\n});\n\n//# sourceURL=webpack://notice-that/./js_src/signup.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js_src/signup.js"]();
/******/ 	
/******/ })()
;