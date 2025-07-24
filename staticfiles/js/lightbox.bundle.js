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

/***/ "./js_src/lightbox.js":
/*!****************************!*\
  !*** ./js_src/lightbox.js ***!
  \****************************/
/***/ (() => {

eval("{document.addEventListener('DOMContentLoaded', function() {\r\n    \r\n    const lightbox = document.getElementById('simple-lightbox');\r\n    const lightboxImg = document.getElementById('lightbox-img');\r\n    const targetImages = document.querySelectorAll('.comment .content img, #problem-content-segment img');\r\n\r\n    targetImages.forEach(image => {\r\n        image.addEventListener('click', () => {\r\n            const imageUrl = image.src;\r\n            lightboxImg.src = imageUrl;\r\n            lightbox.style.display = 'flex'; // Show the lightbox\r\n        });\r\n    });\r\n\r\n    lightbox.addEventListener('click', event => {\r\n        // if the click is on the dark overlay, not on the image itself.\r\n        if (event.target === lightbox) {\r\n            lightbox.style.display = 'none';\r\n        }\r\n    });\r\n\r\n    document.addEventListener('keydown', event => {\r\n        if (lightbox.style.display === 'flex' && event.key === 'Escape') {\r\n            lightbox.style.display = 'none';\r\n        }\r\n    });\r\n\r\n});\n\n//# sourceURL=webpack://notice-that/./js_src/lightbox.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js_src/lightbox.js"]();
/******/ 	
/******/ })()
;