const modal = document.getElementById('modal');
const modalMessage = document.getElementById('modal-message');
const confirmDeleteButton = document.getElementById('confirm-delete');
const cancelDeleteButton = document.getElementById('cancel-delete');
let confirmButtonCallback = null;


function showModal(message, confirmBtnCallback = null, blockId = null) {
    modalMessage.textContent = message;

    if (!blockId) {
        confirmDeleteButton.classList.add('hidden');
    } else {
        confirmDeleteButton.classList.remove('hidden');
    }

    if (confirmBtnCallback) {
        confirmButtonCallback = confirmBtnCallback;
    }

    modal.classList.remove('hidden');
}

function hideModal() {
    modal.classList.add('hidden');
}

if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener('click', () => {
        if (confirmButtonCallback) {
            confirmButtonCallback();
        }

        hideModal();
    });
}

cancelDeleteButton.addEventListener('click', () => {
    hideModal();
});
