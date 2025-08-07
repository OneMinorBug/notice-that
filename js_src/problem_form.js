import '@wangeditor-next/editor/dist/css/style.css';
import { Boot, createEditor, createToolbar, i18nChangeLanguage } from '@wangeditor-next/editor';
import formulaModule from '@wangeditor-next/plugin-formula';
import { getCookie } from './utils/csrf';
import { renderMath } from './utils/math_helpers';

Boot.registerModule(formulaModule);
i18nChangeLanguage('en');

// Reusable function to initialize a WangEditor instance.
function initWangEditor(editorContainerId, toolbarContainerId, textareaId, previewContainerId, placeholderText) {
    const editorContainer = document.getElementById(editorContainerId);
    const toolbarContainer = document.getElementById(toolbarContainerId);
    const textarea = document.getElementById(textareaId);
    if (!editorContainer || !toolbarContainer || !textarea) return null;

    const editorConfig = {
        placeholder: placeholderText,
        onChange(editor) {
            const html = editor.getHtml();
            textarea.value = html;

            const previewContainer = document.getElementById(previewContainerId);
            if (previewContainer && previewContainer.style.display === 'block') {
                previewContainer.innerHTML = html;
                renderMath(previewContainer); // Re-render math on every change
            }
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

    previewContainer.style.display = 'none';

    previewBtn.addEventListener('click', () => {
        const isVisible = previewContainer.style.display === 'block';

        if (isVisible) {
            previewContainer.style.display = 'none';
            previewContainer.innerHTML = ''; // Clear content to save memory
            previewBtn.innerHTML = '<i class="eye icon"></i> Preview';
        } else {
            previewContainer.style.display = 'block';
            const editorHtml = getEditorContent();
            previewContainer.innerHTML = editorHtml;
            previewBtn.innerHTML = '<i class="eye slash icon"></i> Hide Preview';

            renderMath(previewContainer);
        }
    });
}

function setupImagePreview() {
    const imageInput = document.getElementById('id_problem-image');
    const imageClearCheckbox = document.getElementById('id_problem-image-clear');
    const previewContainer = document.getElementById('image-preview-container');
    const imagePreview = document.getElementById('image-preview');
    const placeholderText = document.getElementById('image-placeholder-text');
    const selectImageButton = document.getElementById('select-image-button');
    const clearImageButton = document.getElementById('clear-image-button');

    if (!imageInput || !previewContainer || !imagePreview || !selectImageButton || !clearImageButton) {
        return;
    }

    selectImageButton.addEventListener('click', function() {
        imageInput.click(); // This opens the browser's file selection dialog
    });

    imageInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                // Update the preview
                imagePreview.src = e.target.result;
                previewContainer.style.display = 'block';
                placeholderText.style.display = 'none';
                clearImageButton.style.display = 'inline-block';

                // Un-check the "clear" checkbox in case it was checked
                if (imageClearCheckbox) {
                    imageClearCheckbox.checked = false;
                }
            };
            reader.readAsDataURL(file);
        }
    });

    clearImageButton.addEventListener('click', function() {
        imageInput.value = '';
        previewContainer.style.display = 'none';
        imagePreview.src = ''; // Clear the src to free up memory
        placeholderText.style.display = 'block';
        clearImageButton.style.display = 'none';

        // Check the hidden checkbox so Django knows to clear the image on save
        if (imageClearCheckbox) {
            imageClearCheckbox.checked = true;
        }
    });
}


document.addEventListener('DOMContentLoaded', () => {

    // Fomantic UI form validation
    $('.ui.form').form({
        on: 'blur', // Validate on blur, but we will manually trigger for editors
        inline: true,
        fields: {
            title: {
                identifier: 'problem-title',
                rules: [{ type: 'notEmpty', prompt: 'Please enter a title' }]
            }
            // Django's `content_required=False` handles the backend logic.
        }
    });

    const problemEditor = initWangEditor(
        'editor-container',
        'toolbar-container',
        'problem-content',
        'preview-problem-container',
        'Enter the problem here...'
    );

    const solutionEditor = initWangEditor(
        'solution-editor-container',
        'solution-toolbar-container',
        'comment-content',
        'preview-solution-container',
        'Enter the solution here...'
    );

    if (problemEditor) {
        setupPreviewButton('preview-problem-btn', 'preview-problem-container', () => problemEditor.getHtml());
    }
    if (solutionEditor) {
        setupPreviewButton('preview-solution-btn', 'preview-solution-container', () => solutionEditor.getHtml());
    }

    setupImagePreview();
    
    const submitButton = document.querySelector('button[type="submit"].m-primary.button');

    if (submitButton) {
        submitButton.addEventListener('click', function(event) {
            console.log('Submit button clicked. Forcing editor sync.');

            if (problemEditor) {
                const problemTextarea = document.getElementById('problem-content');
                if (problemTextarea) {
                    problemTextarea.value = problemEditor.getHtml();
                    console.log('Synced problem content.');
                }
            }
            
            if (solutionEditor) {
                const solutionTextarea = document.getElementById('solution-content');
                if (solutionTextarea) {
                    solutionTextarea.value = solutionEditor.getHtml();
                    console.log('Synced solution content.');
                }
            }
            
        });
    }
});