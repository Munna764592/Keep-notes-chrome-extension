document.addEventListener('DOMContentLoaded', () => {
    const noteInput = document.getElementById('note-input');
    const saveBtn = document.getElementById('save-btn');
    const notesContainer = document.getElementById('notes-container');

    // Load notes from local storage
    const loadNotes = () => {
        chrome.storage.local.get('notes', (data) => {
            const notes = data.notes || [];
            notesContainer.innerHTML = notes.map((note, index) =>
                `<div class="note">
                  <div>  ${note} </div>
                    <button class="delete-btn" data-index="${index}">🗑️</button>
                </div>`).join('');
        });
    };

    // Save note to local storage
    saveBtn.addEventListener('click', () => {
        const note = noteInput.value;
        if (note) {
            chrome.storage.local.get('notes', (data) => {
                const notes = data.notes || [];
                notes.push(note);
                chrome.storage.local.set({ notes }, () => {
                    noteInput.value = '';
                    loadNotes();
                });
            });
        }
    });

    // Delete note from local storage
    notesContainer.addEventListener('click', (e) => {
        if (e.target.classList.contains('delete-btn')) {
            const index = e.target.dataset.index;
            chrome.storage.local.get('notes', (data) => {
                const notes = data.notes || [];
                notes.splice(index, 1); // Remove the note at the index
                chrome.storage.local.set({ notes }, () => {
                    loadNotes(); // Reload notes after deletion
                });
            });
        }
    });

    // Initial load of notes
    loadNotes();
});
