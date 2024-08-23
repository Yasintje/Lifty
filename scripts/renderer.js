function renderExercises(
    exerciseList, 
    exercises, 
    editor, 
    editorTitle, 
    quill, 
    lastEditedDate, 
    closeButton, 
    resetExercise, 
    currentExerciseIndex, 
    isEdited
) {
    exerciseList.innerHTML = '';
    
    // Sort exercises alphabetically by name
    exercises.sort((a, b) => a.name.localeCompare(b.name)).forEach((exercise, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${exercise.name}
            <button class="reset-button" data-index="${index}">Reset</button>
        `;
        
        // Click event for selecting an exercise
        li.addEventListener('click', () => {
            // Switch to the selected exercise
            currentExerciseIndex.value = index;
            editor.classList.remove('hidden');
            editorTitle.textContent = exercise.name;
            quill.root.innerHTML = exercise.details || '';
            lastEditedDate.textContent = exercise.lastEdited || 'Never';
            
            // Set up save and cancel buttons
            closeButton.onclick = () => editor.classList.add('hidden');

            exerciseList.style.display = "none";

            isEdited.value = false; // Reset the edit state when switching exercises
        });

        exerciseList.appendChild(li);
    });

    // Add event listeners to reset buttons
    document.querySelectorAll('.reset-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.stopPropagation(); // Prevent triggering the li click event
            const index = button.getAttribute('data-index');
            if (confirm('Are you sure you want to reset this exercise?')) {
                resetExercise(index);
            }
        });
    });

    // Track changes in the editor for auto-saving
    quill.off('text-change'); // Ensure no duplicate listeners
    quill.on('text-change', () => {
        isEdited.value = true;
        saveExercise(currentExerciseIndex.value);
    });
}
