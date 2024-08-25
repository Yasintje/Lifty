const exerciseList = document.getElementById('exercise-list');
const searchInput = document.getElementById('search');
const editor = document.getElementById('editor');
const editorTitle = document.getElementById('editor-title');
const editorContent = document.getElementById('editor-content');
const lastEditedDate = document.getElementById('last-edited-date');
const closeButton = document.getElementById('close');
const changeNameButton = document.getElementById('change-name'); // New change name button
const submitExerciseButton = document.getElementById('exercise-exercise');
const exerciseNameInput = document.getElementById('excercise-input');

const quill = new Quill('#editor-content', {
    theme: 'snow'
});

let currentExerciseIndex = { value: null }; // Track the current exercise
let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
let isEdited = { value: false }; // Track if there are unsaved changes


function saveExercise(index) {
    if (index !== null) {
        exercises[index].details = quill.root.innerHTML;
        const now = new Date();
        const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        exercises[index].lastEdited = formattedDate; // Update last edited time
        localStorage.setItem('exercises', JSON.stringify(exercises));
        renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, deleteExercise, changeNameButton, currentExerciseIndex, isEdited);
        isEdited.value = false; // Reset the edit state after saving

        const query = searchInput.value.toLowerCase();
        Array.from(exerciseList.children).forEach(li => {
            const text = li.textContent.toLowerCase();
            li.style.display = text.includes(query) ? '' : 'none';
        });
    }
}

function deleteExercise(index) {
    exercises.splice(index, 1);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, deleteExercise, changeNameButton, currentExerciseIndex, isEdited);
    editor.classList.add('hidden');
}


function changeExerciseName(index) {
    const newName = prompt("Enter the new name for this exercise:", exercises[index].name);
    if (newName && newName.trim()) {
        exercises[index].name = newName.trim();
        const now = new Date();
        const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        exercises[index].lastEdited = formattedDate; // Update last edited time
        localStorage.setItem('exercises', JSON.stringify(exercises));
            renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, deleteExercise, changeNameButton, currentExerciseIndex, isEdited);
        editorTitle.innerText = newName.trim();
    }
}

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    Array.from(exerciseList.children).forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? '' : 'none';
    });
});

closeButton.addEventListener("click", () =>{ 
    if(isEdited.value) {
        saveExercise(currentExerciseIndex.value);
        isEdited.value = false;
    }

    if (currentExerciseIndex.value !== null && !isEdited.value) {
        isEdited.value = true;
        exerciseList.style.display = "block";
    }

});

submitExerciseButton.addEventListener('click', () => {
    const name = exerciseNameInput.value.trim();
    if (name) {
        exercises.push({ name, details: '', lastEdited: 'Never' });
        localStorage.setItem('exercises', JSON.stringify(exercises));
        exerciseNameInput.value = ''; // Clear the input field
        renderExercises();
    }
});

// Automatically save when Quill editor content changes
quill.on('text-change', () => {
    if (currentExerciseIndex.value !== null && !isEdited.value) {
        isEdited.value = true;
        saveExercise(currentExerciseIndex.value);
    }
});

// Initial render
renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, deleteExercise, changeNameButton, currentExerciseIndex, isEdited);

