// This function gets the CSRF token from the browser's cookies
// It's the standard function provided by the Django documentation
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

    window.wangEditor.i18nChangeLanguage('en')
    const { createEditor, createToolbar } = window.wangEditor

    if (document.getElementById('editor-container')) {

        const editorConfig = {
            placeholder: 'Type your response here...',
            onChange(editor) {
                const html = editor.getHtml()
                // Update the hidden textarea with the editor's content
                document.getElementById('editor-content').value = html;
                // Manually validate the content field
                $('.ui.form').form('validate field', 'problem-content');
            },
            
            // Image upload configuration
            MENU_CONF: {
                uploadImage: {
                    server: '/upload/',  // The URL for image uploads in Django
                    fieldName: 'file',    // The field name used in the Django view
                    maxFileSize: 1 * 1024 * 1024,  // Max file size (1MB)
                    allowedFileTypes: ['image/*'],
                    // Add the CSRF token to the request headers
                    headers: {
                        'X-CSRFToken': getCookie('csrftoken'),
                    },
                    // Callbacks
                    onSuccess(file, res) {console.log('Image upload successful:', res)},
                    onFailed(file, res) {console.log('Image upload failed:', res)},
                    onError(file, err, res) {console.log('Image upload error:', err, res)},
                }
            }
        }

        // If a user submits an invalid form, Django will have already filled this textarea with their old content. If it's a new form, this will be empty.
        const initialContent = document.getElementById('editor-content').value;

        const editor = createEditor({
            selector: '#editor-container',
            html: initialContent,
            config: editorConfig,
            mode: 'simple',
        });
        createToolbar({
            editor,
            selector: '#toolbar-container',
            mode: 'simple',
        })
    }

    // Optional solution editor
    if (document.getElementById('solution-editor-container')) {

        const solutionEditorConfig = {
            placeholder: 'Type the solution here...',
            onChange(editor) {
                const html = editor.getHtml()
                document.getElementById('solution-content').value = html;
            },
            MENU_CONF: {
                uploadImage: {
                    server: '/upload/',  
                    fieldName: 'file',
                    maxFileSize: 1 * 1024 * 1024,
                    allowedFileTypes: ['image/*'],
                    headers: {'X-CSRFToken': getCookie('csrftoken'),},
                    onSuccess(file, res) {console.log('Solution image upload successful:', res)},
                    onFailed(file, res) {console.log('Solution image upload failed:', res)},
                    onError(file, err, res) {console.log('Solution image upload error:', err, res)}
                }
            }
        }

        const initialSolutionContent = document.getElementById('solution-content').value;

        const solutionEditor = createEditor({
            selector: '#solution-editor-container',
            html: initialSolutionContent,
            config: solutionEditorConfig,
            mode: 'simple',
        })

        createToolbar({
            editor: solutionEditor,
            selector: '#solution-toolbar-container',
            mode: 'simple',
        })
    }
});