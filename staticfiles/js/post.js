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

// A reusable function to initialize a WangEditor instance.
function initWangEditor(editorContainerId, toolbarContainerId, targetTextareaId, placeholderText) {
    const editorContainer = document.getElementById(editorContainerId);
    if (!editorContainer) {
        return;
    }

    const { createEditor, createToolbar } = window.wangEditor;
    const targetTextarea = document.getElementById(targetTextareaId);

    const editorConfig = {
        placeholder: placeholderText,
        onChange(editor) {
            targetTextarea.value = editor.getHtml();
        },
        MENU_CONF: {
            uploadImage: {
                server: '/upload/',
                fieldName: 'file', // The field name used in the Django view
                maxFileSize: 1 * 1024 * 1024, // 1MB
                allowedFileTypes: ['image/*'],
                headers: { 'X-CSRFToken': getCookie('csrftoken') }, // Add the CSRF token to the request headers
                onSuccess(file, res) {console.log('Image upload successful:', res)},
                onFailed(file, res) {console.log('Image upload failed:', res)},
                onError(file, err, res) {console.log('Image upload error:', err, res)},
            }
        }
    };

    // If a user submits an invalid form, Django will have already filled this textarea with their old content. If it's a new form, this will be empty.
    const initialHtml = targetTextarea.value;

    const editor = createEditor({
        selector: `#${editorContainerId}`,
        html: initialHtml,
        config: editorConfig,
        mode: 'simple',
    });

    createToolbar({
        editor,
        selector: `#${toolbarContainerId}`,
        mode: 'simple',
    });
}

$(document).ready(function() {

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

    if (window.wangEditor) {
        window.wangEditor.i18nChangeLanguage('en')

        initWangEditor(
            'editor-container', 
            'toolbar-container', 
            'problem-content',
            'Type the problem description here...'
        );

        initWangEditor(
            'solution-editor-container', 
            'solution-toolbar-container', 
            'comment-content',
            'Type the solution here...'
        );
    }

});