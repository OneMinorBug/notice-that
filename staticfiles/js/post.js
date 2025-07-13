window.wangEditor.i18nChangeLanguage('en')

const { createEditor, createToolbar } = window.wangEditor

if (document.getElementById('editor-container')) {

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
    })
    
    const toolbar = createToolbar({
        editor,
        selector: '#toolbar-container',
        mode: 'simple',
    })
}

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
                allowedFileTypes: ['image/jpeg', 'image/png', 'image/heic'],
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