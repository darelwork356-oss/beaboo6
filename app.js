// Global functions - No duplicate variables!
// Variables are already defined in the main HTML

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
      location.reload();
    }).catch(error => {
      console.error('Error signing out:', error);
    });
  }
};

// Placeholder functions for missing features
window.openStoryDetail = function(storyId) { console.log('Open story:', storyId); };
window.openStoryCreation = function() { 
  const modal = document.getElementById('story-creation-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeStoryCreation = function() { 
  const modal = document.getElementById('story-creation-modal');
  if (modal) modal.classList.add('hidden');
};
window.openStoryEdit = function(storyId) { console.log('Edit story:', storyId); };
window.closeStoryEdit = function() { 
  const modal = document.getElementById('story-edit-modal');
  if (modal) modal.classList.add('hidden');
};
window.openChapterCreationModal = function() { 
  const modal = document.getElementById('chapter-creation-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeChapterCreationModal = function() { 
  const modal = document.getElementById('chapter-creation-modal');
  if (modal) modal.classList.add('hidden');
};
window.saveNote = function() { console.log('Note saved'); };
window.publishNote = function() { console.log('Note published'); };
window.deleteNote = function(noteId) { console.log('Delete note:', noteId); };
window.likeNote = function(noteId) { console.log('Like note:', noteId); };
window.likePhoto = function(photoId) { console.log('Like photo:', photoId); };
window.openImageGenerator = function() { 
  const modal = document.getElementById('image-generator-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeImageGenerator = function() { 
  const modal = document.getElementById('image-generator-modal');
  if (modal) modal.classList.add('hidden');
};
window.generateImage = function() { console.log('Generate image'); };
window.useGeneratedImage = function() { console.log('Use image'); };
window.openFrameSelector = function() { 
  const modal = document.getElementById('frame-selector-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeFrameSelector = function() { 
  const modal = document.getElementById('frame-selector-modal');
  if (modal) modal.classList.add('hidden');
};
window.selectFrame = function(frame, cost) { console.log('Select frame:', frame); };
window.openLiveStreamModal = function() { 
  const modal = document.getElementById('live-stream-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeLiveStreamModal = function() { 
  const modal = document.getElementById('live-stream-modal');
  if (modal) modal.classList.add('hidden');
};
window.sendGift = function(gift) { console.log('Send gift:', gift); };
window.sendHeart = function() { console.log('Send heart'); };
window.openNoteCreation = function() { 
  const modal = document.getElementById('note-creation-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeNoteModal = function() { 
  const modal = document.getElementById('note-modal');
  if (modal) modal.classList.add('hidden');
};
window.openAuthorProfile = function(authorId) { console.log('Open author:', authorId); };
window.closeAuthorProfile = function() { 
  const modal = document.getElementById('author-profile-modal');
  if (modal) modal.classList.add('hidden');
};
window.followAuthor = function(authorId) { console.log('Follow author:', authorId); };
window.followUser = function(userId) { console.log('Follow user:', userId); };
window.openFollowersModal = function() { 
  const modal = document.getElementById('followers-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeFollowersModal = function() { 
  const modal = document.getElementById('followers-modal');
  if (modal) modal.classList.add('hidden');
};
window.openFollowingModal = function() { 
  const modal = document.getElementById('following-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeFollowingModal = function() { 
  const modal = document.getElementById('following-modal');
  if (modal) modal.classList.add('hidden');
};
window.openSupportModal = function() { 
  const modal = document.getElementById('support-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeSupportModal = function() { 
  const modal = document.getElementById('support-modal');
  if (modal) modal.classList.add('hidden');
};
window.openSettingsFullscreen = function() { 
  const modal = document.getElementById('settings-fullscreen');
  if (modal) modal.classList.remove('hidden');
};
window.closeSettingsFullscreen = function() { 
  const modal = document.getElementById('settings-fullscreen');
  if (modal) modal.classList.add('hidden');
};
window.openProfileEdit = function() { 
  const modal = document.getElementById('profile-edit-modal');
  if (modal) modal.classList.remove('hidden');
};
window.closeProfileEdit = function() { 
  const modal = document.getElementById('profile-edit-modal');
  if (modal) modal.classList.add('hidden');
};
window.saveProfileEdits = function() { 
  console.log('Profile updated');
  window.closeProfileEdit();
};
window.switchCommunityTab = function(tab) { console.log('Switch tab:', tab); };
window.toggleNotification = function(id) { console.log('Toggle notification:', id); };
window.openLatestStory = function(userId, storyId) { console.log('Open story:', storyId); };
window.nextChapter = function() { console.log('Next chapter'); };
window.prevChapter = function() { console.log('Previous chapter'); };
window.closeChapterReadModal = function() { 
  const modal = document.getElementById('chapter-read-modal');
  if (modal) modal.classList.add('hidden');
};
window.openChapterReadModal = function() { 
  const modal = document.getElementById('chapter-read-modal');
  if (modal) modal.classList.remove('hidden');
};
window.clearSearchInput = function() { 
  const input = document.getElementById('search-input');
  if (input) input.value = '';
};
window.closeBlockedErrorModal = function() { 
  const modal = document.getElementById('blocked-error-modal');
  if (modal) modal.classList.add('hidden');
};
window.confirmDeleteStory = function() { console.log('Delete story'); };
window.backToStoryType = function() { console.log('Back to story type'); };
window.selectStoryType = function(type) { console.log('Select type:', type); };

console.log('app.js loaded successfully');
