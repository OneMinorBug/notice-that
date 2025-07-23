import '@wangeditor/editor/dist/css/style.css';
import { Boot, createEditor, createToolbar, i18nChangeLanguage } from '@wangeditor/editor';
import formulaModule from '@wangeditor/plugin-formula';

Boot.registerModule(formulaModule);
i18nChangeLanguage('en');

// This function gets the CSRF token from the browser's cookies. It's the standard function provided by the Django documentation
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// Globals for both editors
let problemEditor = null;
let solutionEditor = null;

// Reusable function to initialize a WangEditor instance.
function initWangEditor(editorContainerId, toolbarContainerId, textareaId, placeholderText) {
    const editorContainer = document.getElementById(editorContainerId);
    const toolbarContainer = document.getElementById(toolbarContainerId);
    const textarea = document.getElementById(textareaId);
    if (!editorContainer || !toolbarContainer || !textarea) return;

    const editorConfig = {
        placeholder: placeholderText,
        onChange(editor) {
            textarea.value = editor.getHtml();
        },
        hoverbarKeys: {
            formula: {
                menuKeys: ['editFormula'],
            },
        },
        MENU_CONF: {
            uploadImage: {
                server: '/upload/',
                fieldName: 'file', // The field name used in the Django view
                maxFileSize: 1 * 1024 * 1024, // 1MB
                allowedFileTypes: ['image/*'],
                headers: { 'X-CSRFToken': getCookie('csrftoken') }, // Add the CSRF token to the request headers
                onSuccess(file, res) {console.log('Image upload successful:', res);},
                onFailed(file, res) {console.log('Image upload failed:', res);},
                onError(file, err, res) {console.log('Image upload error:', err, res);},
            }
        }
    };

    // If a user submits an invalid form, Django will have already filled this textarea with their old content. If it's a new form, this will be empty.
    const initialHtml = textarea.value;

    const editor = createEditor({
        selector: `#${editorContainerId}`,
        html: initialHtml,
        config: editorConfig,
        mode: 'simple',
    });

    const toolbarConfig = {
        insertKeys: {
            index: 20,
            keys: ['insertFormula'],
        },
    };

    createToolbar({
        editor,
        selector: `#${toolbarContainerId}`,
        config: toolbarConfig,
        mode: 'simple',
    });

    return editor;
}

function setupPreviewButton(previewBtnId, previewContainerId, getEditorContent) {
    const previewBtn = document.getElementById(previewBtnId);
    const previewContainer = document.getElementById(previewContainerId);
    if (!previewBtn || !previewContainer) return;

    previewBtn.addEventListener('click', () => {
        const isVisible = previewContainer.style.display === 'block';

        if (isVisible) {
            previewContainer.style.display = 'none';
            previewContainer.innerHTML = '';
        } else {
            previewContainer.style.display = 'block';
            const editorHtml = getEditorContent();
            previewContainer.innerHTML = editorHtml;

            if (window.renderMathInElement) {
                window.renderMathInElement(previewContainer);
            }
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {

    // Fomantic UI form validation
    $('.ui.form').form({
        on: 'blur', // Validate on blur, but we will manually trigger for editors
        inline: true,
        fields: {
            'problem-title': {
                identifier: 'problem-title',
                rules: [{ type: 'notEmpty', prompt: 'Please enter a title' }]
            }
            // Django's `content_required=False` handles the backend logic.
        }
    });

    problemEditor = initWangEditor(
        'editor-container',
        'toolbar-container',
        'problem-content',
        'Enter the problem here...'
    );

    solutionEditor = initWangEditor(
        'solution-editor-container',
        'solution-toolbar-container',
        'comment-content',
        'Enter the solution here...'
    );

    setupPreviewButton('preview-problem-btn', 'preview-problem-container', () => problemEditor.getHtml());
    setupPreviewButton('preview-solution-btn', 'preview-solution-container', () => solutionEditor.getHtml());

});