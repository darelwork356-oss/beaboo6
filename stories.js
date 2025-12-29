// Funciones para manejo de historias y capítulos programados
let currentEditingStory = {};

function saveScheduledChapter(chapterId, publishDate) {
  if (typeof firebase === 'undefined' || !firebase.database) {
    console.warn('Firebase no está disponible');
    return;
  }
  firebase.database().ref('scheduledChapters/' + chapterId).set({
    publishDate: publishDate,
    status: 'pending'
  });
}

function checkScheduledChapters() {
  if (typeof firebase === 'undefined' || !firebase.database) {
    return;
  }
  const now = new Date().getTime();
  firebase.database().ref('scheduledChapters').once('value', snapshot => {
    snapshot.forEach(child => {
      const scheduled = child.val();
      if (scheduled.status === 'pending' && new Date(scheduled.publishDate).getTime() <= now) {
        if (currentEditingStory && currentEditingStory.id) {
          firebase.database().ref('stories/' + currentEditingStory.id + '/chapters/' + child.key).update({
            status: 'published'
          });
        }
        child.ref.update({ status: 'published' });
      }
    });
  });
}

// Verificar capítulos programados cada minuto
setInterval(checkScheduledChapters, 60000);

// Funciones para notas y likes
async function handleNoteLike(noteId, likeButton) {
  if (typeof firebase === 'undefined' || !firebase.auth) {
    alert('Firebase no disponible');
    return;
  }
  
  const user = firebase.auth().currentUser;
  if (!user) {
    alert('Debes iniciar sesión para dar like');
    return;
  }

  if (likeButton.classList.contains('text-[#FE2C55]')) {
    alert('Ya diste like a esta nota');
    return;
  }

  const originalHTML = likeButton.innerHTML;
  likeButton.disabled = true;
  likeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';

  try {
    const response = await fetch('/.netlify/functions/like-note', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        noteId: noteId,
        userId: user.uid
      })
    });

    const result = await response.json();

    if (!response.ok) {
      if (response.status === 429) {
        alert(result.message || 'Has alcanzado el límite de likes por hoy');
      } else {
        throw new Error(result.error || 'Error al dar like');
      }
      likeButton.disabled = false;
      likeButton.innerHTML = originalHTML;
      return;
    }

    likeButton.classList.add('text-[#FE2C55]');
    const likesCount = likeButton.querySelector('.likes-count');
    if (likesCount) {
      likesCount.textContent = result.likes;
    }
    likeButton.disabled = false;
    likeButton.innerHTML = `<i class="fas fa-heart"></i> <span class="likes-count">${result.likes}</span>`;
    
  } catch (error) {
    console.error('Error al dar like:', error);
    alert('Error al dar like. Por favor intenta de nuevo.');
    likeButton.disabled = false;
    likeButton.innerHTML = originalHTML;
  }
}

// Función auxiliar para fotos
function likePhoto(photoId) {
  console.log('Like en foto:', photoId);
}

// Exportar funciones
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    saveScheduledChapter,
    checkScheduledChapters,
    handleNoteLike,
    likePhoto
  };
}
