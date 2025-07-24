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

/***/ "./js_src/comment.js":
/*!***************************!*\
  !*** ./js_src/comment.js ***!
  \***************************/
/***/ (() => {

eval("{$(document).ready(function() {\r\n    document.querySelectorAll('a.reply[data-comment-id]').forEach(function (button) {\r\n        button.addEventListener('click', function (event) {\r\n            // Prevent the default action of the button\r\n            event.preventDefault();\r\n            const commentId = this.getAttribute('data-comment-id');\r\n            const replyForm = document.getElementById('reply-form-' + commentId);\r\n\r\n            // Toggle visibility of the corresponding reply form\r\n            const isVisible = replyForm.style.display === 'block';\r\n            replyForm.style.display = isVisible ? 'none' : 'block'; \r\n\r\n            // Check if this form has already been set up. We only do this once.\r\n            const isInitialized = replyForm.getAttribute('data-initialized');\r\n\r\n            // If the form is being opened for the first time\r\n            if (!isVisible && !isInitialized) {\r\n                $(`#reply-form-${commentId}`).form({\r\n                    on: 'blur', // Validate when the user clicks away from the textarea\r\n                    inline: true,\r\n                    fields: {\r\n                        content: {\r\n                            identifier: 'content',\r\n                            rules: [{type: 'notEmpty', prompt: 'Your reply cannot be empty.'}]\r\n                        }\r\n                    }\r\n                });\r\n\r\n                // Mark the form as initialized so we don't set it up again.\r\n                replyForm.setAttribute('data-initialized', 'true');\r\n            }\r\n        });\r\n    });\r\n});\n\n//# sourceURL=webpack://notice-that/./js_src/comment.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js_src/comment.js"]();
/******/ 	
/******/ })()
;