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

/***/ "./js_src/post.js":
/*!************************!*\
  !*** ./js_src/post.js ***!
  \************************/
/***/ (() => {

eval("{// This function gets the CSRF token from the browser's cookies. It's the standard function provided by the Django documentation\r\nfunction getCookie(name) {\r\n    let cookieValue = null;\r\n    if (document.cookie && document.cookie !== '') {\r\n        const cookies = document.cookie.split(';');\r\n        for (let i = 0; i < cookies.length; i++) {\r\n            const cookie = cookies[i].trim();\r\n            // Does this cookie string begin with the name we want?\r\n            if (cookie.substring(0, name.length + 1) === (name + '=')) {\r\n                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));\r\n                break;\r\n            }\r\n        }\r\n    }\r\n    return cookieValue;\r\n}\r\n\r\n// A reusable function to initialize a WangEditor instance.\r\nfunction initWangEditor(editorContainerId, toolbarContainerId, targetTextareaId, placeholderText) {\r\n    const editorContainer = document.getElementById(editorContainerId);\r\n    if (!editorContainer) {\r\n        return;\r\n    }\r\n\r\n    const { createEditor, createToolbar } = window.wangEditor;\r\n    const targetTextarea = document.getElementById(targetTextareaId);\r\n\r\n    const editorConfig = {\r\n        placeholder: placeholderText,\r\n        onChange(editor) {\r\n            targetTextarea.value = editor.getHtml();\r\n        },\r\n        MENU_CONF: {\r\n            uploadImage: {\r\n                server: '/upload/',\r\n                fieldName: 'file', // The field name used in the Django view\r\n                maxFileSize: 1 * 1024 * 1024, // 1MB\r\n                allowedFileTypes: ['image/*'],\r\n                headers: { 'X-CSRFToken': getCookie('csrftoken') }, // Add the CSRF token to the request headers\r\n                onSuccess(file, res) {console.log('Image upload successful:', res)},\r\n                onFailed(file, res) {console.log('Image upload failed:', res)},\r\n                onError(file, err, res) {console.log('Image upload error:', err, res)},\r\n            }\r\n        }\r\n    };\r\n\r\n    // If a user submits an invalid form, Django will have already filled this textarea with their old content. If it's a new form, this will be empty.\r\n    const initialHtml = targetTextarea.value;\r\n\r\n    const editor = createEditor({\r\n        selector: `#${editorContainerId}`,\r\n        html: initialHtml,\r\n        config: editorConfig,\r\n        mode: 'simple',\r\n    });\r\n\r\n    createToolbar({\r\n        editor,\r\n        selector: `#${toolbarContainerId}`,\r\n        mode: 'simple',\r\n    });\r\n}\r\n\r\n$(document).ready(function() {\r\n\r\n    // Fomantic UI form validation\r\n    $('.ui.form').form({\r\n        on: 'blur', // Validate on blur, but we will manually trigger for editors\r\n        inline: true,\r\n        fields: {\r\n            'problem-title': {\r\n                identifier: 'problem-title',\r\n                rules: [{ type: 'notEmpty', prompt: 'Please enter a title' }]\r\n            }\r\n            // Django's `content_required=False` handles the backend logic.\r\n        }\r\n    });\r\n\r\n    if (window.wangEditor) {\r\n        window.wangEditor.i18nChangeLanguage('en')\r\n\r\n        initWangEditor(\r\n            'editor-container', \r\n            'toolbar-container', \r\n            'problem-content',\r\n            'Enter the problem here...'\r\n        );\r\n\r\n        initWangEditor(\r\n            'solution-editor-container', \r\n            'solution-toolbar-container', \r\n            'comment-content',\r\n            'Enter the solution here...'\r\n        );\r\n    }\r\n\r\n});\n\n//# sourceURL=webpack://notice-that/./js_src/post.js?\n}");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = {};
/******/ 	__webpack_modules__["./js_src/post.js"]();
/******/ 	
/******/ })()
;