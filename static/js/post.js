window.wangEditor.i18nChangeLanguage('en')

const { createEditor, createToolbar } = window.wangEditor

const editorConfig = {
    placeholder: 'Type your response here...',
    onChange(editor) {
        const html = editor.getHtml()
        console.log('editor content', html)
        // Update the hidden textarea with the editor's content
        document.getElementById('editor-content').value = html;
    },
    
    // Image upload configuration
    MENU_CONF: {
        uploadImage: {
            server: '/upload/',  // The URL for image uploads in Django
            fieldName: 'file',    // The field name used in the Django view
            maxFileSize: 1 * 1024 * 1024,  // Max file size (1MB)
            allowedFileTypes: ['image/jpeg','image/png', 'image/heic'],  // Allowed file types
            
            // Callbacks
            onSuccess(file, res) {
                console.log('Image upload successful:', res)
            },
            onFailed(file, res) {
                console.log('Image upload failed:', res)
            },
            onError(file, err, res) {
                console.log('Image upload error:', err, res)
            },
        }
    }
}

const editor = createEditor({
    selector: '#editor-container',
    html: '<p><br></p>',
    config: editorConfig,
    mode: 'simple',
})

const toolbarConfig = {}

const toolbar = createToolbar({
    editor,
    selector: '#toolbar-container',
    config: toolbarConfig,
    mode: 'simple',
})
