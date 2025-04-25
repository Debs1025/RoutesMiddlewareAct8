const handleCreate = () => {
    const createForm = document.querySelector('#createForm');
    if (!createForm) return;
  
    createForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const formData = {
        title: createForm.title.value,
        snippet: createForm.snippet.value,
        body: createForm.body.value,
      };
  
      try {
        const response = await fetch('/blogs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          window.location.href = '/'; 
        } else {
          throw new Error('Failed to create blog');
        }
      } catch (err) {
        console.error('Error creating blog:', err);
        alert('Failed to create blog: ' + err.message);
      }
    });
  };
  
  const handleDelete = () => {
    const deleteButton = document.querySelector('button.delete');
    if (!deleteButton) {
        console.error('Delete button not found');
        return;
    }

    deleteButton.addEventListener('click', async () => {
        try {
            const blogId = deleteButton.dataset.doc;
            console.log('Deleting blog:', blogId); 

            const response = await fetch(`/blogs/${blogId}`, {
                method: 'DELETE'
            });

            const data = await response.json();
            console.log('Server response:', data); 

            if (response.ok) {
                window.location.href = data.redirect;
            } else {
                throw new Error(data.error || 'Delete failed');
            }
        } catch (err) {
            console.error('Error deleting blog:', err);
            alert('Failed to delete blog: ' + err.message);
        }
    });
};
  
  const handleUpdate = () => {
    const editForm = document.querySelector('#editForm');
    if (!editForm) {
      console.error('Edit form not found');
      return;
    }
  
    editForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      console.log('Form submitted'); 
  
      const blogId = editForm.getAttribute('data-blog');
      const formData = {
        title: editForm.title.value,
        snippet: editForm.snippet.value,
        body: editForm.body.value,
      };
  
      console.log('Sending data:', formData); 
  
      try {
        const response = await fetch(`/blogs/${blogId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
  
        const data = await response.json();
        console.log('Server response:', data); 
  
        if (response.ok) {
          window.location.href = data.redirect;
        } else {
          throw new Error(data.error || 'Update failed');
        }
      } catch (err) {
        console.error('Error:', err);
        alert('Failed to update blog: ' + err.message);
      }
    });
  };
  
  export {
    handleCreate,
    handleDelete,
    handleUpdate,
  };