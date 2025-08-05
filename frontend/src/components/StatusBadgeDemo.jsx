import React from 'react';
import StatusBadge from '../components/StatusBadge';

/**
 * Status Badge Demo Component
 * Showcases all the different status badge styles and variants available
 */
const StatusBadgeDemo = () => {
  const taskStatuses = ['draft', 'inProgress', 'submitted', 'rejected', 'completed', 'cancelled'];
  const approvalStatuses = ['pending', 'approved', 'rejected', 'draft'];
  const reviewStatuses = [
    'Awaiting Approval', 
    'Awaiting Review', 
    'Awaiting Submission', 
    'Awaiting Revision', 
    'Awaiting Evidence',
    'Completed',
    'Undetermined'
  ];
  
  const sizes = ['xs', 'sm', 'md', 'lg'];
  const variants = ['default', 'solid', 'outline'];

  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      <h1 className="text-3xl font-bold mb-6">Status Badge Demo</h1>
      
      {/* Task Status Badges */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Task Status Badges</h2>
        <div className="space-y-4">
          {variants.map(variant => (
            <div key={variant} className="space-y-2">
              <h3 className="text-lg font-medium capitalize">{variant} Variant</h3>
              <div className="flex flex-wrap gap-2">
                {taskStatuses.map(status => (
                  <StatusBadge
                    key={status}
                    status={status}
                    type="task"
                    variant={variant}
                    showIcon={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Approval Status Badges */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Approval Status Badges</h2>
        <div className="space-y-4">
          {variants.map(variant => (
            <div key={variant} className="space-y-2">
              <h3 className="text-lg font-medium capitalize">{variant} Variant</h3>
              <div className="flex flex-wrap gap-2">
                {approvalStatuses.map(status => (
                  <StatusBadge
                    key={status}
                    status={status}
                    type="approval"
                    variant={variant}
                    showIcon={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Status Badges */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Review Status Badges</h2>
        <div className="space-y-4">
          {variants.map(variant => (
            <div key={variant} className="space-y-2">
              <h3 className="text-lg font-medium capitalize">{variant} Variant</h3>
              <div className="flex flex-wrap gap-2">
                {reviewStatuses.map(status => (
                  <StatusBadge
                    key={status}
                    status={status}
                    type="review"
                    variant={variant}
                    showIcon={false}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Size Variations */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Size Variations</h2>
        <div className="space-y-4">
          {sizes.map(size => (
            <div key={size} className="space-y-2">
              <h3 className="text-lg font-medium capitalize">{size} Size</h3>
              <div className="flex flex-wrap items-center gap-2">
                <StatusBadge
                  status="submitted"
                  type="task"
                  size={size}
                  showIcon={false}
                />
                <StatusBadge
                  status="approved"
                  type="approval"
                  size={size}
                  showIcon={false}
                />
                <StatusBadge
                  status="Awaiting Review"
                  type="review"
                  size={size}
                  showIcon={false}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Real-world Usage Examples */}
      <section className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Real-world Usage Examples</h2>
        
        {/* Task Management Table Row Example */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Task Management Table</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left">Task Title</th>
                  <th className="px-4 py-2 text-left">Employee</th>
                  <th className="px-4 py-2 text-left">Task Status</th>
                  <th className="px-4 py-2 text-left">Approval Status</th>
                  <th className="px-4 py-2 text-left">Review Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-t">
                  <td className="px-4 py-2">Data Analysis Report</td>
                  <td className="px-4 py-2">John Doe</td>
                  <td className="px-4 py-2">
                    <StatusBadge status="submitted" type="task" size="xs" showIcon={false} />
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status="approved" type="approval" size="xs" showIcon={false} />
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status="Awaiting Review" type="review" size="xs" showIcon={false} />
                  </td>
                </tr>
                <tr className="border-t">
                  <td className="px-4 py-2">Marketing Campaign</td>
                  <td className="px-4 py-2">Jane Smith</td>
                  <td className="px-4 py-2">
                    <StatusBadge status="inProgress" type="task" size="xs" showIcon={false} />
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status="approved" type="approval" size="xs" showIcon={false} />
                  </td>
                  <td className="px-4 py-2">
                    <StatusBadge status="Awaiting Submission" type="review" size="xs" showIcon={false} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Card Layout Example */}
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Task Cards</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Website Redesign</h4>
              <p className="text-sm text-gray-600">Complete UI/UX overhaul</p>
              <div className="flex gap-2">
                <StatusBadge status="completed" type="task" size="xs" />
                <StatusBadge status="approved" type="approval" size="xs" />
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Database Migration</h4>
              <p className="text-sm text-gray-600">Migrate to new server</p>
              <div className="flex gap-2">
                <StatusBadge status="submitted" type="task" size="xs" />
                <StatusBadge status="pending" type="approval" size="xs" />
              </div>
            </div>
            <div className="border rounded-lg p-4 space-y-2">
              <h4 className="font-medium">Content Creation</h4>
              <p className="text-sm text-gray-600">Blog posts and articles</p>
              <div className="flex gap-2">
                <StatusBadge status="rejected" type="task" size="xs" />
                <StatusBadge status="rejected" type="approval" size="xs" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Usage Guide */}
      <section className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Usage Guide</h2>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Basic Usage:</h3>
            <code className="bg-gray-200 p-2 rounded text-sm block mt-1">
              {`<StatusBadge status="submitted" type="task" />`}
            </code>
          </div>
          <div>
            <h3 className="font-medium">With Icon and Custom Size:</h3>
            <code className="bg-gray-200 p-2 rounded text-sm block mt-1">
              {`<StatusBadge status="approved" type="approval" size="md" showIcon={false} />`}
            </code>
          </div>
          <div>
            <h3 className="font-medium">Different Variants:</h3>
            <code className="bg-gray-200 p-2 rounded text-sm block mt-1">
              {`<StatusBadge status="pending" type="approval" variant="solid" />`}
            </code>
          </div>
          <div>
            <h3 className="font-medium">Props:</h3>
            <ul className="list-disc list-inside text-sm space-y-1 mt-1">
              <li><code>status</code> (string): The status value to display</li>
              <li><code>type</code> (string): 'task', 'approval', or 'review'</li>
              <li><code>size</code> (string): 'xs', 'sm', 'md', or 'lg'</li>
              <li><code>variant</code> (string): 'default', 'solid', or 'outline'</li>
              <li><code>showIcon</code> (boolean): Whether to show status icon</li>
              <li><code>className</code> (string): Additional CSS classes</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StatusBadgeDemo;
