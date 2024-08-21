const exerciseList = document.getElementById('exercise-list');
const searchInput = document.getElementById('search');
const submitExerciseButton = document.getElementById('submit-exercise');
const exerciseNameInput = document.getElementById('exercise-name');
const editor = document.getElementById('editor');
const editorTitle = document.getElementById('editor-title');
const editorContent = document.getElementById('editor-content');
const lastEditedDate = document.getElementById('last-edited-date');
const saveButton = document.getElementById('save');
const cancelButton = document.getElementById('cancel');
const changeNameButton = document.getElementById('change-name'); // New change name button

const quill = new Quill('#editor-content', {
    theme: 'snow'
});

let exercises = JSON.parse(localStorage.getItem('exercises')) || [];
let currentExerciseIndex = { value: null }; // Track the current exercise
let isEdited = { value: false }; // Track if there are unsaved changes

function saveExercise(index) {
    exercises[index].details = quill.root.innerHTML;
    exercises[index].lastEdited = new Date().toLocaleString();
    localStorage.setItem('exercises', JSON.stringify(exercises));
    editor.classList.add('hidden');
    renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, saveButton, cancelButton, changeNameButton, deleteExercise, saveExercise, changeExerciseName, currentExerciseIndex, isEdited);
    isEdited.value = false; // Reset the edit state after saving
}

function deleteExercise(index) {
    exercises.splice(index, 1);
    localStorage.setItem('exercises', JSON.stringify(exercises));
    renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, saveButton, cancelButton, changeNameButton, deleteExercise, saveExercise, changeExerciseName, currentExerciseIndex, isEdited);
    editor.classList.add('hidden');
}

function changeExerciseName(index) {
    const newName = prompt("Enter the new name for this exercise:", exercises[index].name);
    if (newName && newName.trim()) {
        exercises[index].name = newName.trim();
        exercises[index].lastEdited = new Date().toLocaleString(); // Update last edited time
        localStorage.setItem('exercises', JSON.stringify(exercises));
        renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, saveButton, cancelButton, changeNameButton, deleteExercise, saveExercise, changeExerciseName, currentExerciseIndex, isEdited);
        editorTitle.innerText = newName.trim();
        
    }
}

submitExerciseButton.addEventListener('click', () => {
    const name = exerciseNameInput.value.trim();
    if (name) {
        exercises.push({ name, details: '', lastEdited: 'Never' });
        localStorage.setItem('exercises', JSON.stringify(exercises));
        exerciseNameInput.value = ''; // Clear the input field
        renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, saveButton, cancelButton, changeNameButton, deleteExercise, saveExercise, changeExerciseName, currentExerciseIndex, isEdited);
    }
});

searchInput.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase();
    Array.from(exerciseList.children).forEach(li => {
        const text = li.textContent.toLowerCase();
        li.style.display = text.includes(query) ? '' : 'none';
    });
});

// Initial render
renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, saveButton, cancelButton, changeNameButton, deleteExercise, saveExercise, changeExerciseName, currentExerciseIndex, isEdited);
