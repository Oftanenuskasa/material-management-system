// In your materials page, update the buttons section:

<div className="mt-6 pt-4 border-t border-gray-100 flex justify-between">
  <Link 
    href={`/materials/${material.id}/edit`} 
    className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
  >
    Edit
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
    </svg>
  </Link>
  <button 
    onClick={async () => {
      if (confirm('Are you sure you want to delete this material?')) {
        try {
          const response = await fetch(`/api/materials/${material.id}`, {
            method: 'DELETE',
          });
          
          if (response.ok) {
            // Refresh the page
            window.location.reload();
          } else {
            const result = await response.json();
            alert(result.error || 'Failed to delete material');
          }
        } catch (err) {
          alert('Network error. Please try again.');
        }
      }
    }}
    className="text-red-600 hover:text-red-800 font-medium flex items-center gap-1"
  >
    Delete
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
    </svg>
  </button>
</div>
