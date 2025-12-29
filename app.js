// Global variables initialization - No duplicates!
let isLogin = true;
let currentEditingStory = null;
let currentViewedAuthorId = null; // For followers/following modals
let currentLanguage = localStorage.getItem('language') || 'es';
let currentUser = null;
window.currentViewedAuthorId = currentViewedAuthorId; // Expose globally

// Wait for DOM to be ready, then initialize variables
function initializeGlobalVariables() {
  // Get all elements
  window.emailInput = document.getElementById('emailInput');
  window.passwordInput = document.getElementById('passwordInput');
  window.submitButton = document.getElementById('submitButton');
  window.toggleAuth = document.getElementById('toggleAuth');
  window.authForm = document.getElementById('authForm');
  window.authError = document.getElementById('authError');
  window.mainApp = document.getElementById('main-app');
  
  // Now set up event listeners
  if (window.toggleAuth) {
    window.toggleAuth.addEventListener('click', () => {
      isLogin = !isLogin;
      if (window.submitButton) {
        window.submitButton.textContent = isLogin ? 'Sign In' : 'Sign Up';
      }
      if (window.toggleAuth) {
        window.toggleAuth.textContent = isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in';
      }
    });
  }

  const authFormElement = document.getElementById('authForm');
  if (authFormElement) {
    authFormElement.addEventListener('submit', e => {
      e.preventDefault();
      const authErrorEl = document.getElementById('authError');
      if (authErrorEl) authErrorEl.classList.add('hidden');
      
      const email = window.emailInput ? window.emailInput.value : '';
      const password = window.passwordInput ? window.passwordInput.value : '';
      
      if (!email || !password) {
        if (authErrorEl) {
          authErrorEl.textContent = 'Please enter email and password';
          authErrorEl.classList.remove('hidden');
        }
        return;
      }

      if (typeof firebase === 'undefined' || !firebase.auth) {
        if (authErrorEl) {
          authErrorEl.textContent = 'Firebase not initialized';
          authErrorEl.classList.remove('hidden');
        }
        return;
      }

      if (isLogin) {
        firebase.auth().signInWithEmailAndPassword(email, password)
          .then(userCredential => {
            console.log("Usuario autenticado:", userCredential.user);
            currentUser = userCredential.user;
            showMainApp();
          })
          .catch(error => {
            console.error('Login error:', error);
            if (authErrorEl) {
              authErrorEl.textContent = error.message;
              authErrorEl.classList.remove('hidden');
            }
          });
      } else {
        firebase.auth().createUserWithEmailAndPassword(email, password)
          .then(userCredential => {
            const user = userCredential.user;
            currentUser = user;
            
            if (typeof firebase !== 'undefined' && firebase.database) {
              const userCountRef = firebase.database().ref('userCount');
              userCountRef.transaction(count => (count || 0) + 1).then(result => {
                const newCount = result.snapshot.val();
                const isVerified = newCount <= 100;
                firebase.database().ref('users/' + user.uid).set({
                  username: "Nuevo Usuario",
                  bio: "",
                  profileImage: "",
                  followersCount: 0,
                  followingCount: 0,
                  ratedCount: 0,
                  isVerified: isVerified,
                  registrationTimestamp: Date.now(),
                  founder: false,
                  email: user.email
                }).then(() => {
                  console.log('User registered successfully');
                  showMainApp();
                });
              });
            } else {
              showMainApp();
            }
          })
          .catch(error => {
            console.error('Registration error:', error);
            if (authErrorEl) {
              authErrorEl.textContent = error.message;
              authErrorEl.classList.remove('hidden');
            }
          });
      }
    });
  }

  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user;
        showMainApp();
      } else {
        currentUser = null;
        showAuthForm();
      }
    });
  }
}

function showMainApp() {
  const authForm = document.getElementById('auth-form');
  const mainApp = document.getElementById('main-app');
  
  if (authForm) authForm.style.display = 'none';
  if (mainApp) mainApp.style.display = 'flex';
  
  console.log('Showing main app');
}

function showAuthForm() {
  const authForm = document.getElementById('auth-form');
  const mainApp = document.getElementById('main-app');
  
  if (authForm) authForm.style.display = 'flex';
  if (mainApp) mainApp.style.display = 'none';
  
  console.log('Showing auth form');
}

// ===================== GLOBAL UI FUNCTIONS =====================

window.resetPassword = function() {
  const emailInput = document.getElementById('emailInput');
  const email = emailInput ? emailInput.value : prompt('Enter your email:');
  if (!email) {
    alert("Please enter your email address to reset your password.");
    return;
  }
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        alert("A password reset email has been sent.");
      })
      .catch(error => {
        alert("Error sending email: " + error.message);
      });
  }
};

// Navigation functions
window.openHome = function() {
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.remove('hidden');
  
  const searchView = document.getElementById('search-view');
  const profileView = document.getElementById('profile-view');
  const communityView = document.getElementById('community-view');
  const creatorHubView = document.getElementById('creator-hub-view');
  
  if (searchView) searchView.classList.add('hidden');
  if (profileView) profileView.classList.add('hidden');
  if (communityView) communityView.classList.add('hidden');
  if (creatorHubView) creatorHubView.classList.add('hidden');
  
  const topNav = document.getElementById('top-navbar');
  if (topNav) topNav.style.display = 'flex';
};

window.openSearch = function() {
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.add('hidden');
  const searchView = document.getElementById('search-view');
  if (searchView) searchView.classList.remove('hidden');
};

window.openProfile = function() {
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.add('hidden');
  const profileView = document.getElementById('profile-view');
  if (profileView) profileView.classList.remove('hidden');
};

window.openCommunity = function() {
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.add('hidden');
  const communityView = document.getElementById('community-view');
  if (communityView) communityView.classList.remove('hidden');
};

window.openCreatorHub = function() {
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.add('hidden');
  const creatorHubView = document.getElementById('creator-hub-view');
  if (creatorHubView) creatorHubView.classList.remove('hidden');
};

// Notification functions
window.openNotifications = function() {
  const topNav = document.getElementById('top-navbar');
  if (topNav) topNav.style.display = 'none';
  const notificationsModal = document.getElementById('notifications-modal');
  if (notificationsModal) notificationsModal.classList.remove('hidden');
};

window.closeNotifications = function() {
  const topNav = document.getElementById('top-navbar');
  if (topNav) topNav.style.display = 'flex';
  const notificationsModal = document.getElementById('notifications-modal');
  if (notificationsModal) notificationsModal.classList.add('hidden');
};

// Close functions
window.closeSearch = function() {
  const searchView = document.getElementById('search-view');
  if (searchView) searchView.classList.add('hidden');
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.remove('hidden');
};

window.closeProfile = function() {
  const profileView = document.getElementById('profile-view');
  if (profileView) profileView.classList.add('hidden');
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.remove('hidden');
};

window.closeCommunity = function() {
  const communityView = document.getElementById('community-view');
  if (communityView) communityView.classList.add('hidden');
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.remove('hidden');
};

window.closeCreatorHub = function() {
  const creatorHubView = document.getElementById('creator-hub-view');
  if (creatorHubView) creatorHubView.classList.add('hidden');
  const mainApp = document.getElementById('main-app');
  if (mainApp) mainApp.classList.remove('hidden');
};

window.signOutUser = function() {
  if (typeof firebase !== 'undefined' && firebase.auth) {
    firebase.auth().signOut().then(() => {
      localStorage.removeItem('currentUser');
      currentUser = null;
      showAuthForm();
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  }
};

// ===================== FOLLOWERS / FOLLOWING FUNCTIONS =====================
window.openFollowingModal = function() {
  const modal = document.getElementById('following-modal');
  if (modal) modal.classList.remove('hidden');
};

window.openFollowersModal = function() {
  const modal = document.getElementById('followers-modal');
  if (modal) modal.classList.remove('hidden');
};

window.openMyFollowersModal = function() {
  console.log('Opening my followers');
  const modal = document.getElementById('followers-modal');
  if (modal) modal.classList.remove('hidden');
};

window.openMyFollowingModal = function() {
  console.log('Opening my following');
  const modal = document.getElementById('following-modal');
  if (modal) modal.classList.remove('hidden');
};

window.closeFollowersModal = function() {
  const modal = document.getElementById('followers-modal');
  if (modal) modal.classList.add('hidden');
};

window.closeFollowingModal = function() {
  const modal = document.getElementById('following-modal');
  if (modal) modal.classList.add('hidden');
};

// ===================== STORY/CHAPTER FUNCTIONS =====================
window.openStoryDetail = function(storyId) { console.log('Open story:', storyId); };
window.openStoryCreation = function() { 
  const m = document.getElementById('story-creation-modal');
  if(m) m.classList.remove('hidden');
};
window.closeStoryCreation = function() { 
  const m = document.getElementById('story-creation-modal');
  if(m) m.classList.add('hidden');
};
window.openStoryEdit = function(storyId) { console.log('Edit story:', storyId); };
window.closeStoryEdit = function() { 
  const m = document.getElementById('story-edit-modal');
  if(m) m.classList.add('hidden');
};
window.openChapterCreationModal = function() { 
  const m = document.getElementById('chapter-creation-modal');
  if(m) m.classList.remove('hidden');
};
window.closeChapterCreationModal = function() { 
  const m = document.getElementById('chapter-creation-modal');
  if(m) m.classList.add('hidden');
};
window.openChapterReadModal = function() { 
  const m = document.getElementById('chapter-read-modal');
  if(m) m.classList.remove('hidden');
};
window.closeChapterReadModal = function() { 
  const m = document.getElementById('chapter-read-modal');
  if(m) m.classList.add('hidden');
};
window.nextChapter = function() { console.log('Next chapter'); };
window.prevChapter = function() { console.log('Previous chapter'); };

// ===================== NOTE/SOCIAL FUNCTIONS =====================
window.saveNote = function() { console.log('Note saved'); };
window.publishNote = function() { console.log('Note published'); };
window.deleteNote = function(noteId) { console.log('Delete note:', noteId); };
window.likeNote = function(noteId) { console.log('Like note:', noteId); };
window.likePhoto = function(photoId) { console.log('Like photo:', photoId); };
window.openNoteCreation = function() { 
  const m = document.getElementById('note-creation-modal');
  if(m) m.classList.remove('hidden');
};
window.closeNoteModal = function() { 
  const m = document.getElementById('note-modal');
  if(m) m.classList.add('hidden');
};
window.openAuthorProfile = function(authorId) { console.log('Open author:', authorId); };
window.closeAuthorProfile = function() { 
  const m = document.getElementById('author-profile-modal');
  if(m) m.classList.add('hidden');
};
window.followAuthor = function(authorId) { console.log('Follow author:', authorId); };
window.followUser = function(userId) { console.log('Follow user:', userId); };

// ===================== MODAL FUNCTIONS =====================
window.openLiveStreamModal = function() { 
  const m = document.getElementById('live-stream-modal');
  if(m) m.classList.remove('hidden');
};
window.closeLiveStreamModal = function() { 
  const m = document.getElementById('live-stream-modal');
  if(m) m.classList.add('hidden');
};
window.sendGift = function(gift) { console.log('Send gift:', gift); };
window.sendHeart = function() { console.log('Send heart'); };
window.openImageGenerator = function() { 
  const m = document.getElementById('image-generator-modal');
  if(m) m.classList.remove('hidden');
};
window.closeImageGenerator = function() { 
  const m = document.getElementById('image-generator-modal');
  if(m) m.classList.add('hidden');
};
window.generateImage = function() { console.log('Generate image'); };
window.useGeneratedImage = function() { console.log('Use image'); };
window.openFrameSelector = function() { 
  const m = document.getElementById('frame-selector-modal');
  if(m) m.classList.remove('hidden');
};
window.closeFrameSelector = function() { 
  const m = document.getElementById('frame-selector-modal');
  if(m) m.classList.add('hidden');
};
window.selectFrame = function(frame, cost) { console.log('Select frame:', frame); };
window.openSupportModal = function() { 
  const m = document.getElementById('support-modal');
  if(m) m.classList.remove('hidden');
};
window.closeSupportModal = function() { 
  const m = document.getElementById('support-modal');
  if(m) m.classList.add('hidden');
};
window.openSettingsFullscreen = function() { 
  const m = document.getElementById('settings-fullscreen');
  if(m) m.classList.remove('hidden');
};
window.closeSettingsFullscreen = function() { 
  const m = document.getElementById('settings-fullscreen');
  if(m) m.classList.add('hidden');
};
window.openProfileEdit = function() { 
  const m = document.getElementById('profile-edit-modal');
  if(m) m.classList.remove('hidden');
};
window.closeProfileEdit = function() { 
  const m = document.getElementById('profile-edit-modal');
  if(m) m.classList.add('hidden');
};
window.saveProfileEdits = function() { 
  console.log('Profile updated');
  window.closeProfileEdit();
};

// ===================== UTILITY FUNCTIONS =====================
window.switchCommunityTab = function(tab) { console.log('Switch tab:', tab); };
window.toggleNotification = function(id) { console.log('Toggle notification:', id); };
window.openLatestStory = function(userId, storyId) { console.log('Open story:', storyId); };
window.clearSearchInput = function() { 
  const i = document.getElementById('search-input');
  if(i) i.value = '';
};
window.closeBlockedErrorModal = function() { 
  const m = document.getElementById('blocked-error-modal');
  if(m) m.classList.add('hidden');
};
window.confirmDeleteStory = function() { console.log('Delete story'); };
window.backToStoryType = function() { console.log('Back to story type'); };
window.selectStoryType = function(type) { console.log('Select type:', type); };

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeGlobalVariables);
} else {
  initializeGlobalVariables();
}

console.log('app.js loaded and initialized successfully');
