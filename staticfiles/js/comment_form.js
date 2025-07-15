$(document).ready(function() {
    const editorContainer = document.getElementById('editor-container');
    if (!editorContainer) return; // Exit if the editor isn't on this page

    window.wangEditor.i18nChangeLanguage('en')
    const { createEditor, createToolbar } = window.wangEditor
    const $textarea = document.getElementById('editor-content');

    if (document.getElementById('editor-container')) {

        const editorConfig = {
            placeholder: 'Type your response here...',
            onChange(editor) {
                const html = editor.getHtml()
                // Update the hidden textarea with the editor's content
                $textarea.value = html;
            },
            
            // Image upload configuration
            MENU_CONF: {
                uploadImage: {
                    server: '/upload/',  // The URL for image uploads in Django
                    fieldName: 'file',    // The field name used in the Django view
                    maxFileSize: 1 * 1024 * 1024,  // Max file size (1MB)
                    allowedFileTypes: ['image/jpeg','image/png', 'image/heic'],  // Allowed file types
                    // Callbacks
                    onSuccess(file, res) {console.log('Image upload successful:', res)},
                    onFailed(file, res) {console.log('Image upload failed:', res)},
                    onError(file, err, res) {console.log('Image upload error:', err, res)},
                }
            }
        }

        // If a user submits an invalid form, Django will have already filled this textarea with their old content. If it's a new form, this will be empty.
        const initialContent = $textarea.value || '<p><br></p>';

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
});