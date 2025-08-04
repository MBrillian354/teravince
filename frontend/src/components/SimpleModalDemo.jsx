import { useModal } from '../hooks/useModal';

/**
 * Simple Modal System Demo
 * Shows how to use the simplified modal system with only notification and confirmation modals
 */
const SimpleModalDemo = () => {
  const modal = useModal();

  const handleSuccessDemo = () => {
    modal.showSuccess(
      'Task completed successfully!',
      'Your task has been saved and is now ready for review.'
    );
  };

  const handleErrorDemo = () => {
    modal.showError(
      'Failed to save task',
      'Please check your connection and try again.'
    );
  };

  const handleConfirmDemo = () => {
    modal.showConfirm({
      title: 'Delete Task',
      message: 'Are you sure you want to delete this task? This action cannot be undone.',
      confirmText: 'Delete',
      cancelText: 'Cancel',
      type: 'danger',
      onConfirm: () => {
        // Action after confirmation
        setTimeout(() => {
          modal.showSuccess('Task deleted', 'The task has been successfully removed.');
        }, 100);
      }
    });
  };

  const handleSigninDemo = () => {
    // Simulate successful signin
    modal.showSuccess(
      'Sign in successful!',
      'Welcome back, John Doe. You will be redirected to your dashboard.'
    );
    
    // Simulate redirect after delay (but don't actually redirect in demo)
    setTimeout(() => {
      console.log('Would redirect to dashboard now');
    }, 2500);
  };

  const handleFailedSigninDemo = () => {
    // Simulate failed signin
    modal.showError(
      'Sign in failed',
      'Invalid email or password. Please check your credentials and try again.'
    );
  };

  return (
    <div className="p-8 space-y-4 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">Simplified Modal System Demo</h2>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={handleSuccessDemo}
            className="p-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Show Success Notification
          </button>

          <button
            onClick={handleErrorDemo}
            className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Show Error Notification
          </button>

          <button
            onClick={handleConfirmDemo}
            className="p-4 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Show Danger Confirmation
          </button>

          <button
            onClick={handleSigninDemo}
            className="p-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Demo: Successful Signin
          </button>

          <button
            onClick={handleFailedSigninDemo}
            className="p-4 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
          >
            Demo: Failed Signin
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Available Modal Types:</h3>
        <ul className="space-y-1 text-sm">
          <li><strong>Success Notification:</strong> Green checkmark icon for successful operations</li>
          <li><strong>Error Notification:</strong> Red X icon for failed operations</li>
          <li><strong>Confirmation Modal:</strong> Warning triangle icon for confirmation dialogs (danger/warning types)</li>
        </ul>
      </div>

      <div className="mt-6 p-4 bg-gray-800 text-green-400 rounded-lg text-sm">
        <h3 className="font-semibold mb-2 text-white">Usage Examples:</h3>
        <pre className="whitespace-pre-wrap">{`import { useModal } from '../hooks/useModal';

const MyComponent = () => {
  const modal = useModal();

  // Success notification
  modal.showSuccess('Operation completed!', 'Details about what happened');

  // Error notification  
  modal.showError('Something went wrong', 'Error details');

  // Confirmation with danger styling
  modal.showConfirm({
    title: 'Delete Item',
    message: 'Are you sure?',
    confirmText: 'Delete',
    type: 'danger',
    onConfirm: () => deleteItem()
  });

  // Confirmation with warning styling
  modal.showConfirm({
    title: 'Unsaved Changes',
    message: 'Continue without saving?',
    type: 'warning',
    onConfirm: () => navigate('/other-page')
  });

  return <div>...</div>;
};`}</pre>
      </div>
    </div>
  );
};

export default SimpleModalDemo;
