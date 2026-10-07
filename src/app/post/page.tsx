"use client";

import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, ArrowRight, Camera, X, MapPin, Tag, CheckCircle,
  Smartphone, Car, Home, Briefcase, Wrench, Shirt, Sofa, BookOpen,
  Truck, Building, Building2, Users, Monitor, Laptop, Gamepad2,
  Palette, Dumbbell, PawPrint, Sparkles, Shield, Zap, Star
} from "lucide-react";
import { Button, Input, Textarea, Select, Badge, Card, CardHeader, CardContent } from "@/components/ui";
import { cn } from "@/lib/utils";

const categories = [
  { value: "electronics", label: "Electronics", icon: Smartphone, subcategories: ["Mobiles", "Laptops", "Tablets", "Cameras", "Audio", "Gaming", "Wearables", "Accessories"] },
  { value: "vehicles", label: "Vehicles", icon: Car, subcategories: ["Cars", "Bikes & Scooters", "Commercial Vehicles", "Auto Parts", "Cycles"] },
  { value: "property", label: "Property", icon: Home, subcategories: ["Flats for Rent", "Houses for Rent", "PG & Co-living", "Flats for Sale", "Houses for Sale", "Plots & Land", "Commercial Property", "Office Space"] },
  { value: "jobs", label: "Jobs", icon: Briefcase, subcategories: ["IT & Software", "Sales & Marketing", "Accounting & Finance", "HR & Admin", "Engineering", "Teaching", "Customer Service", "Drivers & Logistics"] },
  { value: "services", label: "Services", icon: Wrench, subcategories: ["Home Repair", "Tutors & Classes", "Beauty & Wellness", "Event Services", "Business Services", "Packers & Movers", "Appliance Repair", "Cleaning Services"] },
  { value: "fashion", label: "Fashion", icon: Shirt, subcategories: ["Men's Clothing", "Women's Clothing", "Kids' Clothing", "Footwear", "Accessories", "Jewellery", "Bags & Wallets", "Watches"] },
  { value: "home-garden", label: "Home & Garden", icon: Sofa, subcategories: ["Furniture", "Home Decor", "Kitchen & Dining", "Bedding & Bath", "Lighting", "Garden & Outdoor", "Appliances", "Storage"] },
  { value: "books-hobbies", label: "Books & Hobbies", icon: BookOpen, subcategories: ["Books", "Musical Instruments", "Art & Craft", "Collectibles", "Toys & Games", "Sports Equipment", "Fitness Equipment", "Pet Supplies"] },
];

const conditions = [
  { value: "new", label: "Brand New", desc: "Never used, in original packaging" },
  { value: "like_new", label: "Like New", desc: "Used but in excellent condition" },
  { value: "used", label: "Good", desc: "Visible wear but fully functional" },
  { value: "fair", label: "Fair", desc: "Significant wear, may need repair" },
];

const priceTypes = [
  { value: "fixed", label: "Fixed Price", desc: "Price is non-negotiable" },
  { value: "negotiable", label: "Negotiable", desc: "Open to reasonable offers" },
  { value: "exchange", label: "Exchange", desc: "Open to trade for other items" },
];

const steps = [
  { id: "details", title: "Details", description: "Category, title, description" },
  { id: "price", title: "Price", description: "Set your price and type" },
  { id: "location", title: "Location", description: "Where is the item?" },
  { id: "contact", title: "Contact", description: "How buyers reach you" },
];

export default function PostAdPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState({
    category: "",
    subCategory: "",
    title: "",
    description: "",
    price: "",
    priceType: "negotiable",
    condition: "like_new",
    city: "",
    locality: "",
    pincode: "",
    contactName: "",
    phone: "",
    whatsapp: "",
    email: "",
    images: [] as string[],
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const validateStep = useCallback((step: number) => {
    const newErrors: Record<string, string> = {};
    if (step === 0) {
      if (!formData.category) newErrors.category = "Please select a category";
      if (!formData.subCategory) newErrors.subCategory = "Please select a subcategory";
      if (!formData.title.trim()) newErrors.title = "Title is required";
      else if (formData.title.length < 5) newErrors.title = "Title must be at least 5 characters";
      if (!formData.description.trim()) newErrors.description = "Description is required";
      else if (formData.description.length < 20) newErrors.description = "Description must be at least 20 characters";
    } else if (step === 1) {
      if (!formData.price) newErrors.price = "Price is required";
      else if (parseFloat(formData.price) <= 0) newErrors.price = "Price must be greater than 0";
      if (!formData.condition) newErrors.condition = "Please select condition";
    } else if (step === 2) {
      if (!formData.city) newErrors.city = "Please select a city";
      if (!formData.locality.trim()) newErrors.locality = "Locality is required";
    } else if (step === 3) {
      if (!formData.contactName.trim()) newErrors.contactName = "Your name is required";
      if (!formData.phone.trim()) newErrors.phone = "Phone number is required";
      else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ""))) newErrors.phone = "Enter a valid 10-digit number";
      if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Enter a valid email";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData]);

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < steps.length - 1) {
        setCurrentStep(currentStep + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/listings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      
      if (!response.ok) {
        throw new Error(result.error || "Failed to create listing");
      }
      
      // Success - redirect to dashboard or listing page
      if (result.data?.id) {
        router.push(`/listing/${result.data.id}?posted=success`);
      } else {
        router.push("/dashboard?posted=success");
      }
    } catch (error: any) {
      console.error("Failed to create listing:", error);
      alert(error.message || "Failed to post ad. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
    if (field === "category") {
      setFormData(prev => ({ ...prev, subCategory: "" }));
    }
  };

  const handleImageUpload = (files: FileList) => {
    Array.from(files).forEach(file => {
      if (file.type.startsWith("image/") && file.size <= 5 * 1024 * 1024) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({ ...prev, images: [...prev.images, e.target?.result as string] }));
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({ ...prev, images: prev.images.filter((_, i) => i !== index) }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files.length) handleImageUpload(e.dataTransfer.files);
  };

  const selectedCategory = categories.find(c => c.value === formData.category);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-neutral-200">
        <div className="container">
          <div className="flex items-center justify-between h-16 lg:h-20">
            <Link href="/" className="flex items-center gap-2" aria-label="DesiList Home">
              <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center">
                <span className="text-white font-bold text-xl">⬣</span>
              </div>
              <span className="text-2xl font-display font-bold text-neutral-900">DesiList</span>
            </Link>
            <div className="hidden lg:flex items-center gap-6">
              <nav className="flex items-center gap-1">
                <Link href="/listings" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors">Browse</Link>
                <Link href="/categories" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors">Categories</Link>
                <Link href="/safety" className="px-3 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 rounded-lg transition-colors">Safety</Link>
              </nav>
              <div className="w-px h-6 bg-neutral-200 mx-2" />
              <Link href="/auth" className="px-4 py-2 text-sm font-medium text-neutral-700 hover:text-neutral-900 transition-colors">Sign in</Link>
              <Link href="/post" className="btn btn-primary px-5 py-2.5 text-sm">
                <span className="text-xl mr-1">+</span>
                Post Free Ad
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main id="main-content" className="pt-6 pb-12 lg:pb-20">
        <div className="container">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {steps.map((step, i) => (
                <div key={step.id} className="flex items-center">
                  <div className={cn(
                    "flex items-center justify-center w-10 h-10 rounded-full font-semibold text-sm transition-all",
                    i < currentStep ? "bg-success-500 text-white" :
                    i === currentStep ? "bg-brand-500 text-white" :
                    "bg-neutral-200 text-neutral-500"
                  )}>
                    {i < currentStep ? <CheckCircle className="w-5 h-5" /> : i + 1}
                  </div>
                  {i < steps.length - 1 && (
                    <div className={cn(
                      "w-16 h-1 mx-2 rounded transition-all",
                      i < currentStep ? "bg-success-500" : "bg-neutral-200"
                    )} />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between mt-4 text-sm text-neutral-500">
              {steps.map((step, i) => (
                <div key={step.id} className={cn("text-center w-24", i === currentStep ? "font-semibold text-brand-600" : "")}>
                  <p className="font-medium">{step.title}</p>
                  <p className="text-xs">{step.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Card */}
          <Card className="w-full max-w-3xl mx-auto">
            <div className="pb-4 border-b border-neutral-200">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-2xl font-bold text-neutral-900">Post Your Free Ad</h1>
                  <p className="text-neutral-500 mt-1">Step {currentStep + 1} of {steps.length} — {steps[currentStep].description}</p>
                </div>
                <Badge variant="brand" size="sm">100% Free</Badge>
              </div>
            </div>

            <CardContent className="p-6 pt-0">
              {/* Step 1: Details */}
              {currentStep === 0 && (
                <div className="space-y-6 animate-slide-up">
                  <div>
                    <label className="label">Category <span className="text-error-500">*</span></label>
                    <Select
                      value={formData.category}
                      onChange={(e) => handleChange("category", e.target.value)}
                      options={categories.map(c => ({ value: c.value, label: c.label }))}
                      placeholder="Select a category"
                      className={cn("w-full", errors.category && "border-error-500 focus:ring-error-500")}
                    />
                    {errors.category && <p className="mt-1 text-sm text-error-500">{errors.category}</p>}
                  </div>

                  {selectedCategory && (
                    <div>
                      <label className="label">Subcategory <span className="text-error-500">*</span></label>
                      <Select
                        value={formData.subCategory}
                        onChange={(e) => handleChange("subCategory", e.target.value)}
                        options={selectedCategory.subcategories.map(s => ({ value: s, label: s }))}
                        placeholder="Select a subcategory"
                        className={cn("w-full", errors.subCategory && "border-error-500 focus:ring-error-500")}
                      />
                      {errors.subCategory && <p className="mt-1 text-sm text-error-500">{errors.subCategory}</p>}
                    </div>
                  )}

                  <div>
                    <label className="label">Ad Title <span className="text-error-500">*</span></label>
                    <Input
                      value={formData.title}
                      onChange={(e) => handleChange("title", e.target.value)}
                      placeholder="e.g., iPhone 15 Pro Max 256GB Natural Titanium"
                      maxLength={80}
                      className={cn(errors.title && "border-error-500 focus:ring-error-500")}
                    />
                    {errors.title && <p className="mt-1 text-sm text-error-500">{errors.title}</p>}
                  </div>

                  <div>
                    <label className="label">Description <span className="text-error-500">*</span></label>
                    <Textarea
                      value={formData.description}
                      onChange={(e) => handleChange("description", e.target.value)}
                      placeholder="Describe your item in detail — condition, features, specifications, reason for selling..."
                      rows={6}
                      maxLength={5000}
                      showCharCount
                      className={cn(errors.description && "border-error-500 focus:ring-error-500")}
                    />
                    {errors.description && <p className="mt-1 text-sm text-error-500">{errors.description}</p>}
                    <p className="mt-1 text-sm text-neutral-500">Mention brand, model, age, condition, accessories included, any defects. Be honest — it builds trust.</p>
                  </div>
                </div>
              )}

              {/* Step 2: Price */}
              {currentStep === 1 && (
                <div className="space-y-6 animate-slide-up">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Price (₹) <span className="text-error-500">*</span></label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 text-xl font-semibold">₹</span>
                        <Input
                          type="number"
                          value={formData.price}
                          onChange={(e) => handleChange("price", e.target.value)}
                          placeholder="Enter price"
                          inputMode="numeric"
                          className={cn("pl-10", errors.price && "border-error-500 focus:ring-error-500")}
                        />
                      </div>
                      {errors.price && <p className="mt-1 text-sm text-error-500">{errors.price}</p>}
                    </div>

                    <div>
                      <label className="label">Price Type <span className="text-error-500">*</span></label>
                      <Select
                        value={formData.priceType}
                        onChange={(e) => handleChange("priceType", e.target.value)}
                        options={priceTypes.map(p => ({ value: p.value, label: p.label }))}
                        placeholder="Select price type"
                        className={cn(errors.priceType && "border-error-500 focus:ring-error-500")}
                      />
                      {errors.priceType && <p className="mt-1 text-sm text-error-500">{errors.priceType}</p>}
                    </div>
                  </div>

                  <div>
                    <label className="label">Condition <span className="text-error-500">*</span></label>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      {conditions.map(cond => (
                        <label
                          key={cond.value}
                          className={cn(
                            "relative cursor-pointer p-4 rounded-xl border-2 transition-all",
                            "hover:border-brand-300",
                            formData.condition === cond.value 
                              ? "border-brand-500 bg-brand-50" 
                              : "border-neutral-200"
                          )}
                        >
                          <input
                            type="radio"
                            name="condition"
                            value={cond.value}
                            checked={formData.condition === cond.value}
                            onChange={(e) => handleChange("condition", e.target.value)}
                            className="sr-only"
                          />
                          <div className="text-center">
                            <p className="font-medium text-neutral-900">{cond.label}</p>
                            <p className="text-xs text-neutral-500 mt-0.5">{cond.desc}</p>
                          </div>
                          <div className={cn(
                            "absolute top-3 right-3 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                            formData.condition === cond.value 
                              ? "bg-brand-500 border-brand-500 text-white" 
                              : "border-neutral-300"
                          )}>
                            {formData.condition === cond.value && <CheckCircle className="w-3 h-3" />}
                          </div>
                        </label>
                      ))}
                    </div>
                    {errors.condition && <p className="mt-1 text-sm text-error-500">{errors.condition}</p>}
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {currentStep === 2 && (
                <div className="space-y-6 animate-slide-up">
                  <div>
                    <label className="label">City <span className="text-error-500">*</span></label>
                    <Select
                      value={formData.city}
                      onChange={(e) => handleChange("city", e.target.value)}
                      options={[
                        "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Kolkata",
                        "Pune", "Ahmedabad", "Jaipur", "Lucknow", "Kanpur", "Nagpur",
                        "Indore", "Thane", "Bhopal", "Visakhapatnam", "Patna", "Vadodara",
                        "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut",
                        "Rajkot", "Kalyan-Dombivali", "Vasai-Virar", "Varanasi", "Srinagar",
                        "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad",
                        "Ranchi", "Howrah", "Coimbatore", "Jabalpur", "Gwalior", "Vijayawada"
                      ].map(c => ({ value: c, label: c }))}
                      placeholder="Select your city"
                      className={cn("w-full", errors.city && "border-error-500 focus:ring-error-500")}
                    />
                    {errors.city && <p className="mt-1 text-sm text-error-500">{errors.city}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Locality / Area <span className="text-error-500">*</span></label>
                      <Input
                        value={formData.locality}
                        onChange={(e) => handleChange("locality", e.target.value)}
                        placeholder="e.g., Bandra West, Koramangala, Hitech City"
                        className={cn(errors.locality && "border-error-500 focus:ring-error-500")}
                      />
                      {errors.locality && <p className="mt-1 text-sm text-error-500">{errors.locality}</p>}
                    </div>

                    <div>
                      <label className="label">PIN Code</label>
                      <Input
                        value={formData.pincode}
                        onChange={(e) => handleChange("pincode", e.target.value)}
                        placeholder="e.g., 400050"
                        maxLength={6}
                        inputMode="numeric"
                      />
                    </div>
                  </div>

                  <p className="text-sm text-neutral-500">Your exact address is never shown. Buyers only see locality and city.</p>
                </div>
              )}

              {/* Step 4: Contact */}
              {currentStep === 3 && (
                <div className="space-y-6 animate-slide-up">
                  <div>
                    <label className="label">Your Name <span className="text-error-500">*</span></label>
                    <Input
                      value={formData.contactName}
                      onChange={(e) => handleChange("contactName", e.target.value)}
                      placeholder="Your full name"
                      className={cn(errors.contactName && "border-error-500 focus:ring-error-500")}
                    />
                    {errors.contactName && <p className="mt-1 text-sm text-error-500">{errors.contactName}</p>}
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="label">Phone Number <span className="text-error-500">*</span></label>
                      <Input
                        value={formData.phone}
                        onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="9876543210"
                        maxLength={10}
                        inputMode="numeric"
                        className={cn(errors.phone && "border-error-500 focus:ring-error-500")}
                      />
                      {errors.phone && <p className="mt-1 text-sm text-error-500">{errors.phone}</p>}
                    </div>

                    <div>
                      <label className="label">WhatsApp Number</label>
                      <Input
                        value={formData.whatsapp}
                        onChange={(e) => handleChange("whatsapp", e.target.value.replace(/\D/g, "").slice(0, 10))}
                        placeholder="Same as phone (optional)"
                        maxLength={10}
                        inputMode="numeric"
                      />
                      <p className="mt-1 text-xs text-neutral-500">If different from above. Buyers will message here.</p>
                    </div>
                  </div>

                  <div>
                    <label className="label">Email (optional)</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      placeholder="you@example.com"
                      className={cn(errors.email && "border-error-500 focus:ring-error-500")}
                    />
                    {errors.email && <p className="mt-1 text-sm text-error-500">{errors.email}</p>}
                    <p className="mt-1 text-xs text-neutral-500">We'll send a confirmation and ad analytics to this email.</p>
                  </div>

                  <div className="bg-neutral-50 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                      <Shield className="w-5 h-5 text-brand-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <p className="font-medium text-neutral-900">Your privacy matters</p>
                        <p className="text-sm text-neutral-600 mt-1">Phone numbers are masked until a buyer shows genuine interest. We never share your data with third parties.</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Images Upload (shown on all steps) */}
              <div className="border-t border-neutral-200 pt-6 mt-6">
                <label className="label">Photos <span className="text-neutral-500 font-normal">(up to 10, max 5MB each)</span></label>
                <div
                  className={cn(
                    "mt-3 grid grid-cols-2 md:grid-cols-5 gap-3",
                    dragActive && "bg-brand-50 border-2 border-brand-300 rounded-xl"
                  )}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
                >
                  {formData.images.map((img, i) => (
                    <div key={i} className="relative aspect-square rounded-xl overflow-hidden">
                      <img src={img} alt={`Upload ${i + 1}`} className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => removeImage(i)}
                        className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 transition-colors"
                        aria-label="Remove image"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                      {i === 0 && <Badge variant="brand" className="absolute bottom-2 left-2" size="xs">Cover</Badge>}
                    </div>
                  ))}
                  {formData.images.length < 10 && (
                    <label className={cn(
                      "relative aspect-square rounded-xl border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer transition-all",
                      "hover:border-brand-400 hover:bg-brand-50",
                      dragActive && "border-brand-500 bg-brand-50"
                    )}>
                      <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={(e) => e.target.files && handleImageUpload(e.target.files)}
                        className="absolute inset-0 opacity-0 cursor-pointer"
                      />
                      <Camera className="w-8 h-8 text-neutral-400 mb-2" />
                      <span className="text-sm font-medium text-neutral-600">Add Photos</span>
                      <span className="text-xs text-neutral-400">{formData.images.length}/10</span>
                    </label>
                  )}
                </div>
                {formData.images.length === 0 && (
                  <p className="mt-2 text-sm text-neutral-500">Listings with photos get 5x more views. Add at least 3 photos for best results.</p>
                )}
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-neutral-200">
                <Button
                  variant="ghost"
                  onClick={handleBack}
                  disabled={currentStep === 0}
                  leftIcon={<ArrowLeft className="w-4 h-4" />}
                >
                  Back
                </Button>
                <Button
                  size="lg"
                  onClick={handleNext}
                  isLoading={isSubmitting}
                  rightIcon={currentStep === steps.length - 1 ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
                  className="w-full sm:w-auto"
                >
                  {currentStep === steps.length - 1 ? "Post Free Ad" : "Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Trust Badges */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8 max-w-3xl mx-auto text-center">
            {[
              { icon: Shield, title: "Free Forever", desc: "No fees, ever" },
              { icon: Zap, title: "WhatsApp Connect", desc: "Direct buyer messages" },
              { icon: Star, title: "Verified Badge", desc: "Build trust faster" },
              { icon: Sparkles, title: "Boost Options", desc: "Promote when ready" },
            ].map((item, i) => (
              <div key={i} className="p-4 rounded-xl bg-white border border-neutral-200">
                <div className="w-10 h-10 rounded-xl bg-brand-100 text-brand-600 flex items-center justify-center mx-auto mb-2">
                  <item.icon className="w-5 h-5" />
                </div>
                <p className="font-medium text-neutral-900">{item.title}</p>
                <p className="text-xs text-neutral-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>

      <footer className="bg-neutral-900 text-neutral-400 py-12">
        <div className="container">
          <div className="border-t border-neutral-800 pt-8 text-center text-sm">
            <p>© 2025 DesiList. Made with care for India.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}