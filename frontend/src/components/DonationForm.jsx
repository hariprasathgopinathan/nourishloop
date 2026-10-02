import { useState } from 'react';
import Button from './ui/Button';

const initialFormState = {
  foodName: '',
  category: '',
  quantity: '',
  unit: '',
  description: '',
  pickupAddress: '',
  pincode: '',
  availableUntil: '',
};

const InputWrapper = ({ label, error, required, children }) => (
  <div className="flex flex-col">
    <label className="text-sm font-medium text-gray-700 mb-1.5 flex justify-between">
      <span>{label} {required && <span className="text-emerald-600">*</span>}</span>
      {error && <span className="text-red-500 text-xs font-normal">{error}</span>}
    </label>
    {children}
  </div>
);

export default function DonationForm() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    if (successMessage) setSuccessMessage('');
  };

  const validate = () => {
    const newErrors = {};
    if (!form.foodName.trim()) newErrors.foodName = 'Required';
    if (!form.category.trim()) newErrors.category = 'Required';
    if (!form.quantity) {
      newErrors.quantity = 'Required';
    } else if (Number(form.quantity) <= 0 || isNaN(Number(form.quantity))) {
      newErrors.quantity = 'Must be > 0';
    }
    if (!form.unit.trim()) newErrors.unit = 'Required';
    if (!form.pickupAddress.trim()) newErrors.pickupAddress = 'Required';
    if (!form.availableUntil) newErrors.availableUntil = 'Required';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSuccessMessage('');
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setSuccessMessage('Donation form is ready to submit.');
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    setSuccessMessage('');
  };

  const inputClass = (error) => `
    w-full px-3 py-2 border rounded-md text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent
    ${error ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-white hover:border-gray-400'}
  `;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create a Donation</h2>
        <p className="text-gray-500">Share surplus food with an organization nearby.</p>
      </div>

      {successMessage && (
        <div className="mb-8 p-4 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-800 text-sm font-medium flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-10">
        {/* Section 1: Food Details */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">1. Food Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <InputWrapper label="Food Name" error={errors.foodName} required>
                <input
                  type="text"
                  name="foodName"
                  value={form.foodName}
                  onChange={handleChange}
                  placeholder="e.g., Vegetable Rice, Whole Wheat Bread"
                  className={inputClass(errors.foodName)}
                />
              </InputWrapper>
            </div>
            
            <InputWrapper label="Category" error={errors.category} required>
              <select name="category" value={form.category} onChange={handleChange} className={inputClass(errors.category)}>
                <option value="">Select category</option>
                <option value="Prepared Meals">Prepared Meals</option>
                <option value="Produce">Produce</option>
                <option value="Bakery">Bakery</option>
                <option value="Dairy">Dairy</option>
                <option value="Packaged Food">Packaged Food</option>
                <option value="Beverages">Beverages</option>
                <option value="Other">Other</option>
              </select>
            </InputWrapper>

            <div className="grid grid-cols-2 gap-4">
              <InputWrapper label="Quantity" error={errors.quantity} required>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  placeholder="e.g., 30"
                  className={inputClass(errors.quantity)}
                />
              </InputWrapper>
              
              <InputWrapper label="Unit" error={errors.unit} required>
                <select name="unit" value={form.unit} onChange={handleChange} className={inputClass(errors.unit)}>
                  <option value="">Select unit</option>
                  <option value="Plates">Plates</option>
                  <option value="Packets">Packets</option>
                  <option value="Boxes">Boxes</option>
                  <option value="kg">kg</option>
                  <option value="Litres">Litres</option>
                  <option value="Pieces">Pieces</option>
                  <option value="Other">Other</option>
                </select>
              </InputWrapper>
            </div>

            <div className="sm:col-span-2">
              <InputWrapper label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add any additional details (optional)"
                  className={inputClass()}
                />
              </InputWrapper>
            </div>
          </div>
        </section>

        {/* Section 2: Pickup Details */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">2. Pickup Details</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="sm:col-span-2">
              <InputWrapper label="Pickup Address" error={errors.pickupAddress} required>
                <input
                  type="text"
                  name="pickupAddress"
                  value={form.pickupAddress}
                  onChange={handleChange}
                  placeholder="Full street address"
                  className={inputClass(errors.pickupAddress)}
                />
              </InputWrapper>
            </div>
            
            <InputWrapper label="Pincode" error={errors.pincode}>
              <input
                type="text"
                name="pincode"
                value={form.pincode}
                onChange={handleChange}
                placeholder="e.g., 600001"
                className={inputClass(errors.pincode)}
              />
            </InputWrapper>
          </div>
        </section>

        {/* Section 3: Availability */}
        <section>
          <h3 className="text-base font-semibold text-gray-900 mb-4 border-b border-gray-100 pb-2">3. Availability</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <InputWrapper label="Available Until" error={errors.availableUntil} required>
              <input
                type="datetime-local"
                name="availableUntil"
                value={form.availableUntil}
                onChange={handleChange}
                className={inputClass(errors.availableUntil)}
              />
            </InputWrapper>
          </div>
        </section>

        {/* Action Bar */}
        <div className="pt-6 mt-10 border-t border-gray-200 flex justify-end gap-3">
          <Button type="button" variant="ghost" onClick={handleReset}>
            Cancel
          </Button>
          <Button type="submit">
            Post Donation
          </Button>
        </div>
      </form>
    </div>
  );
}
