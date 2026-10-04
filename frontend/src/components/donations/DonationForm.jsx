import { useState } from 'react';
import Button from '../ui/Button';
import { createDonation } from '../../services/api';
import LocationPicker from '../map/LocationPicker';
import { CheckCircle2, AlertCircle, Utensils, MapPin, Clock } from 'lucide-react';

const initialFormState = {
  foodName: '',
  category: '',
  quantity: '',
  unit: '',
  description: '',
  pickupAddress: '',
  pincode: '',
  location: null, // { latitude, longitude }
  availableUntil: '',
};

const InputWrapper = ({ label, error, required, children, icon: Icon }) => (
  <div className="flex flex-col group">
    <label className="text-sm font-medium text-gray-700 mb-2 flex justify-between items-center transition-colors group-focus-within:text-emerald-700">
      <span className="flex items-center gap-2">
        {Icon && <Icon size={16} className="text-gray-400 group-focus-within:text-emerald-600 transition-colors" />}
        {label} {required && <span className="text-emerald-500">*</span>}
      </span>
      {error && <span className="text-red-500 text-xs font-medium flex items-center gap-1"><AlertCircle size={12}/> {error}</span>}
    </label>
    {children}
  </div>
);

export default function DonationForm() {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
    if (successMessage) setSuccessMessage('');
    if (errorMessage) setErrorMessage('');
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
    if (!form.location) {
      newErrors.location = 'Please select a pickup location on the map';
    } else if (
      !Number.isFinite(form.location.latitude) ||
      !Number.isFinite(form.location.longitude) ||
      form.location.latitude < -90 || form.location.latitude > 90 ||
      form.location.longitude < -180 || form.location.longitude > 180
    ) {
      newErrors.location = 'Invalid location coordinates selected';
    }
    if (!form.availableUntil) newErrors.availableUntil = 'Required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMessage('');
    setErrorMessage('');
    
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      // scroll to top to see errors
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    
    setErrors({});
    setIsSubmitting(true);
    
    try {
      const donationData = {
        foodName: form.foodName,
        category: form.category,
        quantity: Number(form.quantity),
        unit: form.unit,
        description: form.description || undefined,
        pickupAddress: form.pickupAddress,
        pincode: form.pincode || undefined,
        latitude: form.location ? form.location.latitude : undefined,
        longitude: form.location ? form.location.longitude : undefined,
        availableUntil: form.availableUntil,
      };
      
      await createDonation(donationData);
      
      setForm(initialFormState);
      setSuccessMessage('Donation posted successfully! It is now visible to nearby NGOs.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      setErrorMessage(error.message || 'Failed to post donation. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setForm(initialFormState);
    setErrors({});
    setSuccessMessage('');
    setErrorMessage('');
  };

  const inputClass = (error) => `
    w-full px-4 py-3 bg-white border rounded-xl text-sm transition-all focus:outline-none focus:ring-4 focus:ring-emerald-500/10 focus:border-emerald-500
    ${error ? 'border-red-300 shadow-[0_0_0_4px_rgba(239,68,68,0.1)] focus:border-red-500 focus:ring-red-500/10 bg-red-50/30' : 'border-gray-200 hover:border-gray-300 shadow-sm'}
  `;

  return (
    <div className="max-w-3xl mx-auto pb-12">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-gray-900 mb-3 tracking-tight">Create a Donation</h2>
        <p className="text-gray-500 text-lg">Share surplus food with an organization nearby.</p>
      </div>

      {successMessage && (
        <div className="mb-8 p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-emerald-800 text-sm font-medium flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <CheckCircle2 className="text-emerald-600 mt-0.5" size={20} />
          <div>
            <h4 className="text-emerald-900 font-bold mb-1 text-base">Success</h4>
            <p className="text-emerald-700">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-8 p-5 bg-red-50 border border-red-200 rounded-2xl text-red-800 text-sm font-medium flex items-start gap-4 shadow-sm animate-in fade-in slide-in-from-top-4">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <div>
            <h4 className="text-red-900 font-bold mb-1 text-base">Error</h4>
            <p className="text-red-700">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 sm:p-10 rounded-[2rem] border border-gray-100 shadow-xl shadow-emerald-900/5 relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-emerald-50 to-transparent rounded-bl-[100px] -z-10 opacity-60"></div>
        
        {/* Section 1: Food Details */}
        <section className="space-y-6">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">1</div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Food Details</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="md:col-span-2">
              <InputWrapper label="Food Name" error={errors.foodName} required icon={Utensils}>
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
              <div className="relative">
                <select name="category" value={form.category} onChange={handleChange} className={`${inputClass(errors.category)} appearance-none cursor-pointer pr-10 font-medium text-gray-700`}>
                  <option value="" disabled>Select a category</option>
                  <option value="Prepared Meals">Prepared Meals</option>
                  <option value="Produce">Produce</option>
                  <option value="Bakery">Bakery</option>
                  <option value="Dairy">Dairy</option>
                  <option value="Packaged Food">Packaged Food</option>
                  <option value="Beverages">Beverages</option>
                  <option value="Other">Other</option>
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center px-4 pointer-events-none text-gray-500">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                </div>
              </div>
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
                <div className="relative">
                  <select name="unit" value={form.unit} onChange={handleChange} className={`${inputClass(errors.unit)} appearance-none cursor-pointer pr-8 font-medium text-gray-700`}>
                    <option value="" disabled>Unit</option>
                    <option value="Plates">Plates</option>
                    <option value="Packets">Packets</option>
                    <option value="Boxes">Boxes</option>
                    <option value="kg">kg</option>
                    <option value="Litres">Litres</option>
                    <option value="Pieces">Pieces</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3 pointer-events-none text-gray-500">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                  </div>
                </div>
              </InputWrapper>
            </div>

            <div className="md:col-span-2">
              <InputWrapper label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add any additional details about the food, packaging, or dietary info (optional)"
                  className={`${inputClass()} resize-none`}
                />
              </InputWrapper>
            </div>
          </div>
        </section>

        {/* Section 2: Pickup Details */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">2</div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Pickup Details</h3>
          </div>
          
          <div className="bg-emerald-50/50 rounded-2xl p-6 border border-emerald-100/50 mb-6 flex gap-4 items-start">
            <div className="bg-emerald-100 p-2 rounded-xl text-emerald-600 mt-0.5">
              <MapPin size={20} />
            </div>
            <div>
              <h4 className="font-semibold text-emerald-900 mb-1">Pickup location</h4>
              <p className="text-sm text-emerald-700/80">Where should the NGO come to collect this food? Make sure the address is accurate.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-2">
              <InputWrapper label="Pickup Address" error={errors.pickupAddress} required>
                <input
                  type="text"
                  name="pickupAddress"
                  value={form.pickupAddress}
                  onChange={handleChange}
                  placeholder="Full street address or business name"
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

          <div className="pt-2">
            <LocationPicker
              value={form.location}
              onChange={(loc) => {
                setForm(prev => ({ ...prev, location: loc }));
                if (errors.location) setErrors(prev => ({ ...prev, location: undefined }));
              }}
              disabled={isSubmitting}
            />
            {errors.location && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} /> {errors.location}
              </p>
            )}
          </div>
        </section>

        {/* Section 3: Availability */}
        <section className="space-y-6 pt-4">
          <div className="flex items-center gap-3 border-b border-gray-100 pb-4">
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">3</div>
            <h3 className="text-lg font-semibold text-gray-900 tracking-tight">Availability</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <InputWrapper label="Available Until" error={errors.availableUntil} required icon={Clock}>
              <input
                type="datetime-local"
                name="availableUntil"
                value={form.availableUntil}
                onChange={handleChange}
                className={`${inputClass(errors.availableUntil)} cursor-pointer font-medium text-gray-700`}
              />
            </InputWrapper>
          </div>
        </section>

        {/* Action Bar */}
        <div className="pt-8 mt-4 flex flex-col sm:flex-row items-center justify-end gap-4 border-t border-gray-100">
          <Button type="button" variant="ghost" size="lg" onClick={handleReset} disabled={isSubmitting} className="w-full sm:w-auto">
            Clear Form
          </Button>
          <Button type="submit" size="lg" disabled={isSubmitting} isLoading={isSubmitting} className="w-full sm:w-auto shadow-lg shadow-emerald-500/20 text-base px-8">
            Post Donation
          </Button>
        </div>
      </form>
    </div>
  );
}
