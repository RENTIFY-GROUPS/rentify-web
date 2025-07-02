import React, { useState } from 'react';

const MovingChecklist = () => {
  const [checklist, setChecklist] = useState([
    { id: 1, task: 'Notify landlord of move-out date', completed: false },
    { id: 2, task: 'Start packing non-essentials', completed: false },
    { id: 3, task: 'Arrange for utility transfers (electricity, water, internet)', completed: false },
    { id: 4, task: 'Change mailing address', completed: false },
    { id: 5, task: 'Clean the property thoroughly', completed: false },
    { id: 6, task: 'Return keys', completed: false },
    { id: 7, task: 'Confirm security deposit return', completed: false },
  ]);

  const handleToggleComplete = (id) => {
    setChecklist(prevChecklist =>
      prevChecklist.map(item =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Moving Checklist</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <ul className="space-y-3">
          {checklist.map(item => (
            <li key={item.id} className="flex items-center">
              <input
                type="checkbox"
                checked={item.completed}
                onChange={() => handleToggleComplete(item.id)}
                className="form-checkbox h-5 w-5 text-blue-600 rounded focus:ring-blue-500"
              />
              <span className={`ml-3 text-lg ${item.completed ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                {item.task}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default MovingChecklist;