function renderExercises(exerciseList, exercises, editor, editorTitle, quill, lastEditedDate, saveButton, cancelButton, changeNameButton, deleteExercise, saveExercise, changeExerciseName, currentExerciseIndex, isEdited) {
    exerciseList.innerHTML = '';
    
    exercises.sort((a, b) => a.name.localeCompare(b.name)).forEach((exercise, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${exercise.name}
            <button class="delete-button" data-index="${index}">Delete</button>
        `;
        
        li.addEventListener('click', () => {
            if (isEdited.value) {
                const shouldSave = confirm("You have unsaved changes. Do you want to save them?");
                if (shouldSave) {
                    saveExercise(currentExerciseIndex.value);
                }
            }

            // Now, switch to the clicked exercise
            currentExerciseIndex.value = index;
            editor.classList.remove('hidden');
            editorTitle.textContent = exercise.name;
            quill.root.innerHTML = exercise.details || '';
            lastEditedDate.textContent = exercise.lastEdited || 'Never';
            saveButton.onclick = () => saveExercise(index);
            cancelButton.onclick = () => editor.classList.add('hidden');
            changeNameButton.onclick = () => changeExerciseName(index); // Bind change name function

            isEdited.value = false; // Reset the edit state when switching exercises
        });

        exerciseList.appendChild(li);
    });

    // Add event listeners to delete buttons
    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the li click event
            const index = button.getAttribute('data-index');
            if (confirm('Are you sure you want to delete this exercise?')) {
                deleteExercise(index);
            }
        });
    });

    // Track changes in the editor
    quill.on('text-change', () => {
        isEdited.value = true;
    });
}

