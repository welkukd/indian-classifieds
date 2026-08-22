"use client";

import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Camera, X, MapPin, Phone, MessageSquare, Tag, ArrowLeft, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

const categories = [
  "Electronics", "Vehicles", "Property", "Jobs", "Services",
  "Fashion", "Home & Garden", "Books & Hobbies", "Sports & Fitness", "Pets"
];

const subCategories: Record<string, string[]> = {
  Electronics: ["Mobiles", "Laptops", "TVs & Audio", "Cameras", "Gaming", "Accessories"],
  Vehicles: ["Cars", "Bikes & Scooters", "Commercial Vehicles", "Auto Parts", "Other Vehicles"],
  Property: ["Flats for Rent", "Flats for Sale", "Houses for Rent", "Houses for Sale", "PG/Hostels", "Commercial", "Land/Plots"],
  Jobs: ["IT & Software", "Sales & Marketing", "Accounting & Finance", "HR & Admin", "Engineering", "Teaching", "Part Time", "Work from Home"],
  Services: ["Repair & Maintenance", "Tutors & Coaching", "Event Services", "Beauty & Wellness", "Packers & Movers", "Other Services"],
  Fashion: ["Men's Clothing", "Women's Clothing", "Footwear", "Accessories", "Kids Wear", "Jewellery"],
  "Home & Garden": ["Furniture", "Home Decor", "Kitchen & Dining", "Garden & Outdoor", "Appliances", "Tools"],
  "Books & Hobbies": ["Books", "Musical Instruments", "Art & Collectibles", "Sports Equipment", "Toys & Games"],
  "Sports & Fitness": ["Gym Equipment", "Cycles", "Outdoor Gear", "Supplements", "Yoga & Wellness"],
  Pets: ["Dogs", "Cats", "Birds", "Fish & Aquarium", "Pet Accessories", "Pet Services"],
};

const cities = [
  "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
  "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
  "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
  "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
  "Rajkot", "Kalyan-Dombivli", "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad"
];

export default function PostAd() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    subCategory: "",
    price: "",
    priceType: "fixed",
    condition: "used",
    city: "",
    locality: "",
    name: "",
    phone: "",
    whatsapp: "",
    images: [] as File[],
    imagePreviews: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateStep = (currentStep: number) => {
    const newErrors: Record<string, string> = {};
    if (currentStep === 1) {
      if (!formData.title.trim()) newErrors.title = "Title is required";
      else if (formData.title.length < 10) newErrors.title = "Title must be at least 10 characters";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      else if (formData.description.length < 20) newErrors.description = "Description must be at least 20 characters";
      if (!formData.category) newErrors.category = "Select a category";
      if (!formData.subCategory) newErrors.subCategory = "Select a sub-category";
    }
    if (currentStep === 2) {
      if (!formData.price.trim()) newErrors.price = "Price is required";
      else if (isNaN(Number(formData.price))) newErrors.price = "Enter a valid price";
      if (!formData.condition) newErrors.condition = "Select condition";
    }
    if (currentStep === 3) {
      if (!formData.city) newErrors.city = "Select your city";
      if (!formData.locality.trim()) newErrors.locality = "Enter your area/locality";
    }
    if (currentStep === 4) {
      if (!formData.name.trim()) newErrors.name = "Your name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\s/g, ""))) newErrors.phone = "Enter a valid 10-digit Indian mobile number";
      if (formData.whatsapp && !/^[6-9]\d{9}$/.test(formData.whatsapp.replace(/\s/g, ""))) newErrors.whatsapp = "Enter a valid WhatsApp number";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      if (step < 4) setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    router.push("/listings?posted=success");
  };

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (formData.images.length >= 6) return;
      if (!file.type.startsWith("image/")) return;
      if (file.size > 5 * 1024 * 1024) return;
      const newImages = [...formData.images, file];
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          images: newImages,
          imagePreviews: [...prev.imagePreviews, e.target?.result as string],
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };

  const progressSteps = [
    { label: "Details", icon: Tag },
    { label: "Price", icon: Tag },
    { label: "Location", icon: MapPin },
    { label: "Contact", icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <Link href="/" className="flex items-center gap-2 mb-6">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
            <span className="text-gray-600 hover:text-gray-900 transition-colors">Back to DesiList</span>
          </Link>
          <div className="flex items-center justify-between">
            {progressSteps.map((s, i) => (
              <React.Fragment key={s.label}>
                <div className="flex flex-col items-center">
                  <div className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all ${
                    i + 1 < step ? "bg-amber-500 text-white" :
                    i + 1 === step ? "bg-amber-500 text-white ring-4 ring-amber-200" :
                    "bg-gray-200 text-gray-400"
                  }`}>
                    {i + 1 < step ? <CheckCircle className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                  </div>
                  <span className={`text-xs font-medium mt-1.5 ${i + 1 <= step ? "text-amber-600" : "text-gray-400"}`}>
                    {s.label}
                  </span>
                </div>
                {i < progressSteps.length - 1 && (
                  <div className={`flex-1 h-1.5 mx-2 rounded transition-colors ${
                    i + 1 < step ? "bg-amber-500" : "bg-gray-200"
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>
          <p className="text-center text-sm text-gray-500 mt-4">
            Step {step} of 4 • Free forever • No card required
          </p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Step 1: Ad Details */}
          {step === 1 && (
            <div className="space-y-6" data-step="1">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Ad Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  placeholder="e.g., iPhone 15 Pro Max 256GB - Excellent Condition"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.title ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                  maxLength={80}
                />
                {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                <p className="text-sm text-gray-500 mt-1">{formData.title.length}/80 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe your item in detail: brand, model, condition, age, reason for selling, what's included..."
                  rows={6}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.description ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                  } focus:outline-none focus:ring-2 transition-colors resize-none`}
                  maxLength={2000}
                />
                {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                <p className="text-sm text-gray-500 mt-1">{formData.description.length}/2000 characters</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value, subCategory: ""})}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.category ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                  } focus:outline-none focus:ring-2 transition-colors bg-white`}
                >
                  <option value="">Select Category</option>
                  {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
              </div>

              {formData.category && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sub-Category *</label>
                  <select
                    value={formData.subCategory}
                    onChange={(e) => setFormData({...formData, subCategory: e.target.value})}
                    className={`w-full px-4 py-3 rounded-xl border ${
                      errors.subCategory ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                    } focus:outline-none focus:ring-2 transition-colors bg-white`}
                  >
                    <option value="">Select Sub-Category</option>
                    {subCategories[formData.category]?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                  {errors.subCategory && <p className="text-red-500 text-sm mt-1">{errors.subCategory}</p>}
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Photos (Max 6, 5MB each) *</label>
                <div className="grid grid-cols-3 gap-3 mb-3">
                  {formData.imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border-2 border-gray-200">
                      <img src={preview} alt={`Preview ${idx + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                  {formData.images.length < 6 && (
                    <label className="relative aspect-square rounded-xl border-2 border-dashed border-gray-300 cursor-pointer hover:border-amber-500 transition-colors group">
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400 group-hover:text-amber-500 transition-colors">
                        <Camera className="w-8 h-8 mb-1" />
                        <span className="text-xs">Add Photo</span>
                      </div>
                    </label>
                  )}
                </div>
                <p className="text-sm text-gray-500">{formData.images.length}/6 photos • Drag to reorder coming soon</p>
              </div>
            </div>
          )}

          {/* Step 2: Price & Condition */}
          {step === 2 && (
            <div className="space-y-6" data-step="2">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price (₹) *</label>
                <div className="flex items-center gap-3">
                  <span className="text-xl font-bold text-gray-900">₹</span>
                  <input
                    type="text"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value.replace(/[^\d]/g, "")})}
                    placeholder="e.g., 134900"
                    className={`flex-1 px-4 py-3 rounded-xl border ${
                      errors.price ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                    } focus:outline-none focus:ring-2 transition-colors text-xl font-medium`}
                    inputMode="numeric"
                  />
                </div>
                {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Price Type</label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { value: "fixed", label: "Fixed Price", desc: "Firm price" },
                    { value: "negotiable", label: "Negotiable", desc: "Open to offers" },
                    { value: "exchange", label: "Exchange", desc: "Trade for item" },
                  ].map(opt => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setFormData({...formData, priceType: opt.value})}
                      className={`p-4 rounded-xl border-2 text-left transition-all ${
                        formData.priceType === opt.value
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <p className="font-medium text-gray-900">{opt.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{opt.desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Condition *</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: "new", label: "Brand New", desc: "Sealed/Unused" },
                    { value: "like_new", label: "Like New", desc: "No signs of wear" },
                    { value: "used", label: "Good", desc: "Normal wear" },
                    { value: "fair", label: "Fair", desc: "Visible wear" },
                  ].map(cond => (
                    <button
                      key={cond.value}
                      type="button"
                      onClick={() => setFormData({...formData, condition: cond.value})}
                      className={`p-4 rounded-xl border-2 text-center transition-all ${
                        formData.condition === cond.value
                          ? "border-amber-500 bg-amber-50"
                          : "border-gray-200 hover:border-amber-300"
                      }`}
                    >
                      <p className="font-medium text-gray-900">{cond.label}</p>
                      <p className="text-xs text-gray-500 mt-1">{cond.desc}</p>
                    </button>
                  ))}
                </div>
                {errors.condition && <p className="text-red-500 text-sm mt-1">{errors.condition}</p>}
              </div>
            </div>
          )}

          {/* Step 3: Location */}
          {step === 3 && (
            <div className="space-y-6" data-step="3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">City *</label>
                <select
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.city ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                  } focus:outline-none focus:ring-2 transition-colors bg-white`}
                >
                  <option value="">Select City</option>
                  {cities.map(city => <option key={city} value={city}>{city}</option>)}
                </select>
                {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Area / Locality *</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.locality}
                    onChange={(e) => setFormData({...formData, locality: e.target.value})}
                    placeholder="e.g., Bandra West, Koramangala, Hitech City"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      errors.locality ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                    } focus:outline-none focus:ring-2 transition-colors`}
                  />
                </div>
                {errors.locality && <p className="text-red-500 text-sm mt-1">{errors.locality}</p>}
                <p className="text-sm text-gray-500 mt-1">Buyers see approximate area, not exact address</p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-800">Safety First</p>
                    <p className="text-sm text-amber-700 mt-1">
                      Meet in public places. Verify items before paying. Avoid advance payments to strangers.
                      DesiList never asks for OTP or bank details.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Contact */}
          {step === 4 && (
            <div className="space-y-6" data-step="4">
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                  <MessageSquare className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-blue-800">How buyers contact you</p>
                    <p className="text-sm text-blue-700 mt-1">
                      Your phone number is shown to interested buyers. WhatsApp opens directly for instant chat.
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Your Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Your full name"
                  className={`w-full px-4 py-3 rounded-xl border ${
                    errors.name ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                  } focus:outline-none focus:ring-2 transition-colors`}
                />
                {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    placeholder="98765 43210"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      errors.phone ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                    } focus:outline-none focus:ring-2 transition-colors`}
                    maxLength={15}
                  />
                </div>
                {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                <p className="text-sm text-gray-500 mt-1">Shown to buyers for calls & WhatsApp</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Number (Optional)</label>
                <div className="relative">
                  <MessageSquare className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="tel"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    placeholder="Same as above or different"
                    className={`w-full pl-12 pr-4 py-3 rounded-xl border ${
                      errors.whatsapp ? "border-red-500 focus:ring-red-500" : "border-gray-200 focus:ring-amber-500"
                    } focus:outline-none focus:ring-2 transition-colors`}
                    maxLength={15}
                  />
                </div>
                {errors.whatsapp && <p className="text-red-500 text-sm mt-1">{errors.whatsapp}</p>}
                <p className="text-sm text-gray-500 mt-1">Opens direct WhatsApp chat. Leave blank to use phone number.</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <h4 className="font-medium text-gray-900 mb-3">Your Ad Will Be:</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> 100% Free - No charges ever</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Live instantly after review</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Visible to buyers in your city</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Editable anytime from your dashboard</li>
                  <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Auto-expires after 60 days</li>
                </ul>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between pt-4 border-t border-gray-200 sticky bottom-0 bg-white pb-4 mt-8">
            <button
              type="button"
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            {step < 4 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-8 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2"
              >
                Continue
                <ArrowLeft className="w-5 h-5 -rotate-180" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-3 bg-amber-500 text-white font-semibold rounded-xl hover:bg-amber-600 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Posting...
                  </>
                ) : (
                  <>
                    Post Free Ad
                    <CheckCircle className="w-5 h-5" />
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </main>
    </div>
  );
}