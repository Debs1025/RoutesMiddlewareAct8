const handleCreate = () => {
   const createForm = document.querySelector('#createForm');
   if (createForm) {
       createForm.addEventListener('submit', async (e) => {
           e.preventDefault();
           const formData = {
               title: createForm.title.value,
               snippet: createForm.snippet.value,
               body: createForm.body.value
           };

           try {
               const response = await fetch('/blogs', {
                   method: 'POST',
                   headers: { 'Content-Type': 'application/json' },
                   body: JSON.stringify(formData)
               });
               window.location.href = '/';
           } catch (err) {
               console.error('Error creating blog:', err);
           }
       });
   }
};

const handleSingleDelete = () => {
   const deleteButton = document.querySelector('button.delete');
   if (deleteButton) {
       attachDeleteListener(deleteButton);
   }
};

const handleMultipleDeletes = () => {
   const deleteButtons = document.querySelectorAll('button.delete');
   deleteButtons.forEach(button => {
       attachDeleteListener(button);
   });
};

const handleEdit = () => {
   const editForm = document.querySelector('#editForm');
   if (editForm) {
       attachEditListener(editForm);
   }
};

const attachDeleteListener = (button) => {
   button.addEventListener('click', async () => {
       const id = button.dataset.doc;
       try {
           const response = await fetch(`/blogs/${id}`, {
               method: 'DELETE'
           });
           const data = await response.json();
           window.location.href = data.redirect;
       } catch (err) {
           console.error('Error deleting blog:', err);
       }
   });
};

const attachEditListener = (form) => {
   form.addEventListener('submit', async (e) => {
       e.preventDefault();
       const formData = {
           title: form.title.value,
           snippet: form.snippet.value,
           body: form.body.value
       };
       const blogId = form.dataset.blog;

       try {
           const response = await fetch(`/blogs/${blogId}`, {
               method: 'PUT',
               headers: { 'Content-Type': 'application/json' },
               body: JSON.stringify(formData)
           });
           const data = await response.json();
           window.location.href = data.redirect;
       } catch (err) {
           console.error('Error updating blog:', err);
       }
   });
};

export {
   handleCreate,
   handleSingleDelete,
   handleMultipleDeletes,
   handleEdit
};