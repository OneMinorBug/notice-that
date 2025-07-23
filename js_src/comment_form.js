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

document.addEventListener('DOMContentLoaded', () => {
    const editorContainer = document.getElementById('editor-container');
    const $textarea = document.getElementById('comment-content');
    if (!editorContainer || !$textarea) return; // Exit if the editor isn't on this page

    const editorConfig = {
        placeholder: 'Type your response here...',
        onChange(editor) {
            const html = editor.getHtml();
            $textarea.value = html; // Sync content
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
                headers: { 'X-CSRFToken': getCookie('csrftoken'), }, // Add the CSRF token to the request headers
                onSuccess(file, res) {console.log('Image upload successful:', res);},
                onFailed(file, res) {console.log('Image upload failed:', res);},
                onError(file, err, res) {console.log('Image upload error:', err, res);}, 
            },
        }
    };

    // If a user submits an invalid form, Django will have already filled this textarea with their old content. If it's a new form, this will be empty.
    const initialContent = $textarea.value;
    
    const editor = createEditor({
        selector: '#editor-container',
        html: initialContent,
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
        selector: '#toolbar-container',
        config: toolbarConfig,
        mode: 'simple',
    });
    
    // Preview button click handler
    const previewBtn = document.getElementById('preview-btn');
    const previewContainer = document.getElementById('preview-container');
    if (!previewBtn || !previewContainer) return;

    previewBtn.addEventListener('click', () => {
        const isVisible = previewContainer.style.display === 'block';

        if (isVisible) {
            previewContainer.style.display = 'none';
            previewContainer.innerHTML = '';
        } else {
            previewContainer.style.display = 'block';
            const editorHtml = editor.getHtml();
            previewContainer.innerHTML = editorHtml;

            if (window.renderMathInElement) {
                window.renderMathInElement(previewContainer);
            }
        }
    });

});