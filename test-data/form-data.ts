export const textBoxData = {
  fullName: 'John Doe',
  email: 'john.doe@example.com',
  currentAddress: '123 Main Street, Springfield',
  permanentAddress: '456 Oak Avenue, Shelbyville',
};

export const tableRecord = {
  firstName: 'Alice',
  lastName: 'Smith',
  email: 'alice.smith@example.com',
  age: '28',
  salary: '75000',
  department: 'Engineering',
};

export const practiceFormData = {
  firstName: 'Jane',
  lastName: 'Doe',
  email: 'jane.doe@example.com',
  gender: 'Female' as const,
  mobile: '1234567890',
  dateOfBirth: '15 Jan 1995',
  subjects: ['Maths'],
  hobbies: ['Music'] as ('Sports' | 'Reading' | 'Music')[],
  address: '789 Pine Road, Shelbyville',
  state: 'NCR',
  city: 'Delhi',
};
