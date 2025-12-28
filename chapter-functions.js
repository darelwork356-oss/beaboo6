// Funciones para el modal de creación de capítulos
function openChapterCreationModal() {
    document.getElementById('chapter-creation-modal').classList.remove('hidden');
    document.getElementById('chapter-content').focus();
    updateWordCount();
}

function closeChapterCreationModal() {
    document.getElementById('chapter-creation-modal').classList.add('hidden');
    document.getElementById('chapter-content').value = '';
    document.getElementById('word-count').textContent = '0 palabras';
    document.getElementById('letter-count').textContent = '0 caracteres';
}

function updateWordCount() {
    const content = document.getElementById('chapter-content').value;
    const words = content.trim() ? content.trim().split(/\s+/).length : 0;
    const letters = content.length;
    
    document.getElementById('word-count').textContent = `${words} palabras`;
    document.getElementById('letter-count').textContent = `${letters} caracteres`;
}

// Variable global para la historia actual
let currentEditingStory = null;

// Event listener para el contador de palabras
document.addEventListener('DOMContentLoaded', function() {
    const chapterContent = document.getElementById('chapter-content');
    if (chapterContent) {
        chapterContent.addEventListener('input', updateWordCount);
    }
    
    // Form submit para capítulos
    const chapterForm = document.getElementById('chapter-form');
    if (chapterForm) {
        chapterForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const content = document.getElementById('chapter-content').value.trim();
            if (!content) {
                alert('Por favor escribe el contenido del capítulo');
                return;
            }
            
            const user = firebase.auth().currentUser;
            if (!user) {
                alert('Debes iniciar sesión para crear capítulos');
                return;
            }
            
            try {
                const response = await fetch('/api/index.js?action=add-chapter', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        storyId: currentEditingStory?.id || 'temp_story',
                        userId: user.uid,
                        content: content
                    })
                });
                
                const result = await response.json();
                
                if (!response.ok) {
                    throw new Error(result.error || 'Error al crear capítulo');
                }
                
                alert('Capítulo creado exitosamente');
                closeChapterCreationModal();
                
            } catch (error) {
                console.error('Error creating chapter:', error);
                alert('Error al crear el capítulo: ' + error.message);
            }
        });
    }
});