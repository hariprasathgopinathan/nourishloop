import { useState } from 'react';
import Button from '../ui/Button';
import { createDonation } from '../../services/api';
import LocationPicker from '../map/LocationPicker';
import { CheckCircle2, AlertCircle, Utensils, MapPin, Clock, UploadCloud } from 'lucide-react';

const initialFormState = {
  foodName: '',
  category: '',
  quantity: '',
  unit: '',
  description: '',
  pickupAddress: '',
  pincode: '',
  location: null,
  availableUntil: '',
};

const InputWrapper = ({ label, error, required, children, icon: Icon }) => (
  <div className="flex flex-col group">
    <label className="text-[13px] font-bold text-brand-text mb-1.5 flex justify-between items-center transition-colors">
      <span className="flex items-center gap-1.5">
        {Icon && <Icon size={14} className="text-gray-400 group-focus-within:text-brand-donor transition-colors" />}
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      {error && <span className="text-red-500 text-[11px] font-bold flex items-center gap-1"><AlertCircle size={10}/> {error}</span>}
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
      !Number.isFinite(form.location.longitude)
    ) {
      newErrors.location = 'Invalid location coordinates';
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
    w-full px-3.5 py-2.5 bg-brand-surface border rounded-[8px] text-[13px] transition-all focus:outline-none focus:ring-1 focus:border-brand-donor focus:ring-brand-donor
    ${error ? 'border-red-300 focus:border-red-500 focus:ring-red-500 bg-red-50/10' : 'border-brand-border'}
  `;

  return (
    <div className="max-w-[800px] mx-auto pb-12">
      <div className="mb-6">
        <h2 className="text-[26px] font-bold text-brand-text mb-1 tracking-tight">Post a Donation</h2>
        <p className="text-[14px] text-brand-text-muted">Share surplus food with an organization nearby.</p>
      </div>

      {successMessage && (
        <div className="mb-6 p-4 bg-brand-donor-light border border-brand-donor/20 rounded-[8px] text-brand-text text-[13px] flex items-start gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] animate-in fade-in">
          <CheckCircle2 className="text-brand-donor mt-0.5" size={16} />
          <div>
            <h4 className="font-bold mb-0.5">Success</h4>
            <p className="text-brand-text-muted">{successMessage}</p>
          </div>
        </div>
      )}

      {errorMessage && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-[8px] text-brand-text text-[13px] flex items-start gap-3 shadow-[0_2px_8px_rgba(15,23,42,0.02)] animate-in fade-in">
          <AlertCircle className="text-red-600 mt-0.5" size={16} />
          <div>
            <h4 className="font-bold text-red-700 mb-0.5">Error</h4>
            <p className="text-red-600">{errorMessage}</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-brand-surface p-6 sm:p-8 rounded-[12px] border border-brand-border shadow-[0_2px_10px_rgba(15,23,42,0.02)] space-y-8 relative overflow-hidden">
        {/* Section 1: Food Details */}
        <section className="space-y-5">
          <div className="flex items-center gap-3 border-b border-brand-border pb-3">
            <div className="w-[24px] h-[24px] rounded-full bg-brand-donor text-white flex items-center justify-center text-[12px] font-bold">1</div>
            <h3 className="text-[16px] font-bold text-brand-text tracking-tight">Food Details</h3>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-5">
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

              <InputWrapper label="Category" error={errors.category} required>
                <div className="relative">
                  <select name="category" value={form.category} onChange={handleChange} className={`${inputClass(errors.category)} appearance-none cursor-pointer pr-10 text-brand-text font-medium`}>
                    <option value="" disabled>Select a category</option>
                    <option value="Prepared Meals">Prepared Meals</option>
                    <option value="Produce">Produce</option>
                    <option value="Bakery">Bakery</option>
                    <option value="Dairy">Dairy</option>
                    <option value="Packaged Food">Packaged Food</option>
                    <option value="Beverages">Beverages</option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-gray-400">
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
                    <select name="unit" value={form.unit} onChange={handleChange} className={`${inputClass(errors.unit)} appearance-none cursor-pointer pr-8 text-brand-text font-medium`}>
                      <option value="" disabled>Unit</option>
                      <option value="Plates">Plates</option>
                      <option value="Packets">Packets</option>
                      <option value="Boxes">Boxes</option>
                      <option value="kg">kg</option>
                      <option value="Litres">Litres</option>
                      <option value="Pieces">Pieces</option>
                      <option value="Other">Other</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 flex items-center px-3.5 pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                    </div>
                  </div>
                </InputWrapper>
              </div>

              <InputWrapper label="Description">
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Add any additional details (optional)"
                  className={`${inputClass()} resize-none`}
                />
              </InputWrapper>
            </div>

            {/* Image Upload Box */}
            <div className="lg:col-span-1">
              <label className="text-[13px] font-bold text-brand-text mb-1.5 block">Food Image (Optional)</label>
              <div className="border border-dashed border-brand-border rounded-[8px] h-[220px] flex flex-col items-center justify-center p-5 text-center cursor-pointer hover:bg-brand-neutral hover:border-brand-donor/50 transition-colors group">
                <div className="w-[40px] h-[40px] bg-gray-100 rounded-[8px] flex items-center justify-center mb-3 group-hover:bg-brand-donor-light transition-colors">
                  <UploadCloud className="text-gray-400 group-hover:text-brand-donor" size={20} />
                </div>
                <h4 className="font-bold text-[13px] text-brand-text group-hover:text-brand-donor mb-0.5">Click to upload</h4>
                <p className="text-[11px] text-brand-text-muted">or drag & drop</p>
                <p className="text-[11px] text-gray-400 mt-2">PNG, JPG up to 5MB</p>
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Pickup Details */}
        <section className="space-y-5 pt-2">
          <div className="flex items-center gap-3 border-b border-brand-border pb-3">
            <div className="w-[24px] h-[24px] rounded-full bg-brand-donor text-white flex items-center justify-center text-[12px] font-bold">2</div>
            <h3 className="text-[16px] font-bold text-brand-text tracking-tight">Pickup Details</h3>
          </div>

          <div className="bg-brand-neutral rounded-[8px] p-4 border border-brand-border mb-4 flex gap-3 items-start">
            <div className="bg-white p-1.5 rounded-[6px] text-brand-text-muted mt-0.5 border border-brand-border">
              <MapPin size={16} />
            </div>
            <div>
              <h4 className="font-bold text-[13px] text-brand-text mb-0.5">Pickup location</h4>
              <p className="text-[12px] text-brand-text-muted">Where should the NGO come to collect this food? Make sure the address is accurate.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
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

          <div className="pt-1">
            <LocationPicker
              value={form.location}
              onChange={(loc) => {
                setForm(prev => ({ ...prev, location: loc }));
                if (errors.location) setErrors(prev => ({ ...prev, location: undefined }));
              }}
              disabled={isSubmitting}
            />
            {errors.location && (
              <p className="mt-1.5 text-[11px] text-red-500 font-bold flex items-center gap-1">
                <AlertCircle size={12} /> {errors.location}
              </p>
            )}
          </div>
        </section>

        {/* Section 3: Availability */}
        <section className="space-y-5 pt-2">
          <div className="flex items-center gap-3 border-b border-brand-border pb-3">
            <div className="w-[24px] h-[24px] rounded-full bg-brand-donor text-white flex items-center justify-center text-[12px] font-bold">3</div>
            <h3 className="text-[16px] font-bold text-brand-text tracking-tight">Availability</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputWrapper label="Available Until" error={errors.availableUntil} required icon={Clock}>
              <input
                type="datetime-local"
                name="availableUntil"
                value={form.availableUntil}
                onChange={handleChange}
                className={`${inputClass(errors.availableUntil)} cursor-pointer font-medium text-brand-text`}
              />
            </InputWrapper>
          </div>
        </section>

        {/* Action Bar */}
        <div className="pt-6 mt-2 flex flex-col sm:flex-row items-center justify-end gap-3 border-t border-brand-border">
          <Button type="button" variant="ghost" className="w-full sm:w-auto px-5 py-2.5 text-[13px] font-bold text-brand-text" onClick={handleReset} disabled={isSubmitting}>
            Clear Form
          </Button>
          <Button type="submit" variant="primary" disabled={isSubmitting} isLoading={isSubmitting} className="w-full sm:w-auto px-6 py-2.5 rounded-[8px] text-[13px] font-bold bg-brand-donor">
            Post Donation
          </Button>
        </div>
      </form>
    </div>
  );
}
