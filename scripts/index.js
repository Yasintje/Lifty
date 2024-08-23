const exerciseList = document.getElementById('exercise-list');
const searchInput = document.getElementById('search');
const editor = document.getElementById('editor');
const editorTitle = document.getElementById('editor-title');
const editorContent = document.getElementById('editor-content');
const lastEditedDate = document.getElementById('last-edited-date');
const closeButton = document.getElementById('close');
const changeNameButton = document.getElementById('change-name'); // New change name button

const quill = new Quill('#editor-content', {
    theme: 'snow'
});

let currentExerciseIndex = { value: null }; // Track the current exercise
let beginExcercises = []
EXERCISES.forEach(name=> beginExcercises.push({"name": name ,"details":"", "lastEdited":"Never"}))

let exercises = JSON.parse(localStorage.getItem('exercises')) || beginExcercises;
let isEdited = { value: false }; // Track if there are unsaved changes

EXERCISES.forEach(exerciseName => {
    const exists = exercises.some(e => e.name === exerciseName);
    if (!exists) {
        exercises.push({ "name": exerciseName, "details": "", "lastEdited": "Never" });
        localStorage.setItem('exercises', JSON.stringify(exercises));
        exercises = JSON.parse(localStorage.getItem('exercises'));
    }
});

// Remove exercises that are not in the EXERCISES list
exercises = exercises.filter(e => EXERCISES.includes(e.name));

// Now add exercises from the EXERCISES list that are not in the exercises array
EXERCISES.forEach(exerciseName => {
    const exists = exercises.some(e => e.name === exerciseName);
    if (!exists) {
        exercises.push({ "name": exerciseName, "details": "", "lastEdited": "Never" });
    }
});


function saveExercise(index) {
    if (index !== null) {
        exercises[index].details = quill.root.innerHTML;
        const now = new Date();
        const formattedDate = now.toLocaleDateString() + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        exercises[index].lastEdited = formattedDate; // Update last edited time
        localStorage.setItem('exercises', JSON.stringify(exercises));
        renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, resetExercise, currentExerciseIndex, isEdited);
        isEdited.value = false; // Reset the edit state after saving

        const query = searchInput.value.toLowerCase();
        Array.from(exerciseList.children).forEach(li => {
            const text = li.textContent.toLowerCase();
            li.style.display = text.includes(query) ? '' : 'none';
        });
    }
}

function resetExercise(index) {
    exercises[index].details = "";
    exercises[index].lastEdited = "Never";
    localStorage.setItem('exercises', JSON.stringify(exercises));
    renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, resetExercise, currentExerciseIndex, isEdited);
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
        renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, resetExercise, currentExerciseIndex, isEdited);
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
    if (currentExerciseIndex.value !== null && !isEdited.value) {
        isEdited.value = true;
        saveExercise(currentExerciseIndex.value);
        exerciseList.style.display = "block";
    }
})

// Automatically save when Quill editor content changes
quill.on('text-change', () => {
    if (currentExerciseIndex.value !== null && !isEdited.value) {
        isEdited.value = true;
        saveExercise(currentExerciseIndex.value);
    }
});

// Initial render
renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, closeButton, resetExercise, currentExerciseIndex, isEdited);

