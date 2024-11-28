const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');
let blockToDeleteId = null;

function showModal(message, blockId = null) {
    modalMessage.textContent = message;
    blockToDeleteId = blockId;
    modal.classList.remove('hidden');
}

function hideModal() {
    modal.classList.add('hidden');
    blockToDeleteId = null;
}

confirmDeleteButton.addEventListener('click', () => {
    if (blockToDeleteId) {
        deleteBlock(blockToDeleteId);
        hideModal();
    }
});

cancelDeleteButton.addEventListener('click', hideModal);
