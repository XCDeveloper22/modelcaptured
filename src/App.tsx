import { useState, useEffect, useCallback, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Facebook, Instagram, Twitter, Camera, User, Calendar, Briefcase, ArrowRight, ChevronDown, ChevronLeft, ChevronRight, CheckCircle2 } from 'lucide-react';
import { BUSINESS_INFO, GALLERY_IMAGES } from './constants';
import { cn } from './lib/utils';

// --- Splash Screen ---
const SplashScreen = ({ onComplete }: { onComplete: () => void, key?: string }) => {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1, ease: "easeInOut" }}
      className="fixed inset-0 z-[1000] bg-ink flex items-center justify-center p-12"
    >
      <div className="flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          className="flex flex-col items-center gap-8"
        >
          <img src="https://cdn.builder.io/api/v1/image/assets%2F9c74866fcfb14f7fbf68c14610585366%2F67a25810ea0b4bbb884977e79cc8e66a?format=webp&width=800&height=1200" alt="Model Captured Logo" className="w-32 h-32 md:w-48 md:h-48 object-contain" />
          <div className="flex flex-col items-center">
            <div className="text-2xl md:text-4xl font-light tracking-[0.4em] uppercase leading-none text-gold">
              Model Captured
            </div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.5, delay: 0.8, ease: "easeInOut" }}
              className="h-[1px] bg-gold/30 mt-6"
            />
            <motion.span 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="text-[9px] uppercase tracking-[0.6em] text-muted mt-4 font-medium"
            >
              Photography Studio
            </motion.span>
          </div>
        </motion.div>
      </div>
      
      <motion.div
        animate={{ opacity: [0, 1, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-12 text-[10px] uppercase tracking-widest text-muted/50"
      >
        Initializing Narrative...
      </motion.div>
    </motion.div>
  );
};

// --- Components ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const navLinks = [
    { name: 'Home', path: '/home' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Studio', path: '/services' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleNavClick = (path: string) => {
    setIsMobileMenuOpen(false);
    navigate(path);
  };

  return (
    <nav className={cn(
      "fixed top-0 left-0 w-full z-50 transition-all duration-700 px-6 md:px-12 py-8",
      isScrolled ? "bg-ink/90 backdrop-blur-md py-4 border-b border-border-subtle" : "bg-transparent"
    )}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/home" className="group flex items-center gap-3">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F9c74866fcfb14f7fbf68c14610585366%2F67a25810ea0b4bbb884977e79cc8e66a?format=webp&width=800&height=1200"
            alt="Model Captured"
            className="h-10 md:h-12 w-auto object-contain group-hover:opacity-80 transition-opacity"
          />
          <span className="hidden sm:inline text-xs md:text-sm uppercase tracking-widest font-light text-gold group-hover:opacity-80 transition-opacity">Model Captured</span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path}
              className={cn(
                "text-[10px] uppercase tracking-widest transition-colors pb-1 border-b",
                location.pathname === link.path ? "text-gold border-gold" : "text-muted border-transparent hover:text-gold"
              )}
            >
              {link.name}
            </Link>
          ))}
          <a
            href={BUSINESS_INFO.socials.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted hover:text-gold transition-colors"
          >
            <Facebook size={14} />
          </a>

          {/* Online Status Indicator */}
          <div className="flex items-center gap-2 ml-6 pl-6 border-l border-border-subtle">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              isOnline ? "bg-emerald-500" : "bg-red-500"
            )} />
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-light",
              isOnline ? "text-emerald-500" : "text-red-500"
            )}>
              {isOnline ? "Online" : "Offline"}
            </span>
          </div>
        </div>

        {/* Mobile Toggle */}
        <button 
          className="md:hidden p-2 text-gold"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 w-full bg-ink border-b border-border-subtle p-8 flex flex-col gap-6 md:hidden"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-xs uppercase tracking-widest text-muted hover:text-gold"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}

            {/* Mobile Status Indicator */}
            <div className="flex items-center gap-2 pt-4 border-t border-border-subtle">
              <div className={cn(
                "w-2 h-2 rounded-full transition-colors",
                isOnline ? "bg-emerald-500" : "bg-red-500"
              )} />
              <span className={cn(
                "text-xs uppercase tracking-widest font-light",
                isOnline ? "text-emerald-500" : "text-red-500"
              )}>
                {isOnline ? "Online" : "Offline"}
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = () => {
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 800], [0, 200]);
  const textY = useTransform(scrollY, [0, 800], [0, -100]);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallPrompt, setShowInstallPrompt] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallPrompt(false);
    }
  };

  return (
    <section className="relative min-h-screen pt-32 pb-16 px-6 md:px-12 flex items-center overflow-hidden">
      {/* Cinematic Parallax Background */}
      <motion.div 
        style={{ y: backgroundY }}
        className="absolute inset-0 z-0 h-[120%]"
      >
        <div className="absolute inset-0 bg-linear-to-b from-ink via-transparent to-ink z-1" />
        <img
          src="https://cdn.builder.io/api/v1/image/assets%2F042f24ecd42747f5b6b0219f1f4bfe8d%2Fb53309d712fd46dd99bb15da520d8ebf?format=webp&width=800&height=1200"
          alt="Cinematic Background"
          className="w-full h-full object-cover opacity-20 grayscale brightness-50"
          referrerPolicy="no-referrer"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-12 gap-8 items-center relative z-10">
        {/* Featured Image Block */}
        <div className="col-span-12 lg:col-span-7 relative group order-2 lg:order-1">
          <div className="absolute inset-0 minimal-border z-0"></div>
          <div className="absolute inset-4 bg-surface overflow-hidden">
            <img 
              src="https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?q=80&w=2000&auto=format&fit=crop"
              alt="Cinematic Photography"
              className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-1000"
              referrerPolicy="no-referrer"
            />
          </div>
          {/* Meta Tag */}
          <div className="absolute bottom-10 left-10 bg-ink px-5 py-3 border border-border-subtle shadow-2xl">
            <p className="text-[9px] uppercase tracking-widest font-medium">Photography</p>
          </div>
        </div>

        {/* Narrative & Contact */}
        <div className="col-span-12 lg:col-span-5 flex flex-col justify-center order-1 lg:order-2 lg:pl-12"
        >
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-6xl font-extralight italic mb-8 leading-tight">
              Capturing the <br/><span className="not-italic font-light">essence of form.</span>
            </h1>
            <p className="text-sm text-muted leading-relaxed mb-10 max-w-sm">
              Specializing in high-fashion editorial and cinematic portraiture. Our lens focuses on the intersection of light, movement, and the human story.
            </p>

            <div className="border border-border-subtle bg-ink/40 p-4 mb-8 max-w-sm">
              <p className="text-[9px] uppercase tracking-[0.4em] text-muted mb-3">Quick Commands</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 text-[10px] tracking-widest uppercase border border-gold/40 text-gold">/serversecurity</span>
                <span className="px-3 py-1 text-[10px] tracking-widest uppercase border border-gold/40 text-gold">/yearn</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-4 max-w-sm">
              <Link to="/gallery" className="w-full py-5 bg-gold text-ink text-[10px] uppercase tracking-widest font-bold hover:bg-gold-bright transition-all transform hover:-translate-y-0.5 text-center">
                Explore Portfolio
              </Link>
              {showInstallPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full py-5 border border-gold text-[10px] uppercase tracking-widest text-gold text-center hover:bg-gold hover:text-ink transition-colors"
                >
                  Install App
                </button>
              )}
              <a
                href={BUSINESS_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-5 border border-border-subtle text-[10px] uppercase tracking-widest text-gold text-center flex items-center justify-center gap-3 hover:bg-surface transition-colors"
              >
                <Facebook size={14} />
                Connect on Facebook
              </a>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

const Gallery = () => {
  const [filter, setFilter] = useState('All');
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const categories = ['All', 'Fashion', 'Portrait', 'Lifestyle'];

  const filteredImages = filter === 'All' 
    ? GALLERY_IMAGES 
    : GALLERY_IMAGES.filter(img => img.category === filter);

  const navigateLightbox = useCallback((direction: 'next' | 'prev') => {
    if (selectedIdx === null) return;
    const offset = direction === 'next' ? 1 : -1;
    let nextIdx = (selectedIdx + offset) % filteredImages.length;
    if (nextIdx < 0) nextIdx = filteredImages.length - 1;
    setSelectedIdx(nextIdx);
  }, [selectedIdx, filteredImages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIdx === null) return;
      if (e.key === 'ArrowRight') navigateLightbox('next');
      if (e.key === 'ArrowLeft') navigateLightbox('prev');
      if (e.key === 'Escape') setSelectedIdx(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIdx, navigateLightbox]);

  return (
    <section id="gallery" className="py-24 px-6 md:px-12 bg-ink border-t border-border-subtle">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <span className="text-meta">Featured Collection</span>
            <h2 className="text-4xl md:text-5xl font-extralight italic mt-4">Portfolio</h2>
          </div>
          
          <div className="flex flex-wrap gap-6">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={cn(
                  "text-[10px] uppercase tracking-[0.3em] font-medium pb-2 transition-all border-b",
                  filter === cat ? "border-gold text-gold" : "border-transparent text-muted hover:text-gold"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          <AnimatePresence mode="popLayout">
            {filteredImages.map((img, index) => (
              <motion.div
                key={img.url}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, delay: index * 0.05 }}
                className="group relative aspect-3/4 bg-surface minimal-border cursor-pointer"
                onClick={() => setSelectedIdx(index)}
              >
                <div className="absolute inset-4 overflow-hidden bg-ink">
                  <img 
                    src={img.url} 
                    alt={img.title}
                    className="w-full h-full object-cover grayscale brightness-90 group-hover:grayscale-0 group-hover:brightness-100 transition-all duration-1000"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="bg-ink/80 backdrop-blur-sm p-4 border border-border-subtle translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                    <span className="text-[8px] uppercase tracking-widest text-muted block mb-1">{img.category}</span>
                    <p className="text-sm font-light text-gold tracking-wide">{img.title}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedIdx !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12"
          >
            <button 
              className="absolute top-8 right-8 text-muted hover:text-gold z-10 p-2"
              onClick={() => setSelectedIdx(null)}
            >
              <X size={32} strokeWidth={1} />
            </button>

            <button 
              className="absolute left-4 top-1/2 -translate-y-1/2 text-muted hover:text-gold p-4 transition-colors hidden md:block"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('prev'); }}
            >
              <ChevronLeft size={48} strokeWidth={1} />
            </button>

            <button 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-gold p-4 transition-colors hidden md:block"
              onClick={(e) => { e.stopPropagation(); navigateLightbox('next'); }}
            >
              <ChevronRight size={48} strokeWidth={1} />
            </button>

            <div className="relative w-full max-w-5xl h-full flex flex-col items-center justify-center gap-6" onClick={(e) => e.stopPropagation()}>
              <motion.div
                key={filteredImages[selectedIdx].url}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative w-full h-[70vh]"
              >
                <img 
                  src={filteredImages[selectedIdx].url} 
                  alt={filteredImages[selectedIdx].title}
                  className="w-full h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
              
              <div className="text-center">
                <span className="text-[10px] uppercase tracking-[0.5em] text-muted mb-2 block">Series {selectedIdx + 1} / {filteredImages[selectedIdx].category}</span>
                <p className="text-3xl font-extralight italic text-gold">{filteredImages[selectedIdx].title}</p>
              </div>

              {/* Mobile Navigation */}
              <div className="flex gap-12 md:hidden">
                <button onClick={() => navigateLightbox('prev')} className="text-muted"><ChevronLeft size={32} /></button>
                <button onClick={() => navigateLightbox('next')} className="text-muted"><ChevronRight size={32} /></button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Services = () => {
  const [selectedService, setSelectedService] = useState<typeof BUSINESS_INFO.services[0] | null>(null);

  const icons = {
    Camera: <Camera size={24} strokeWidth={1.5} />,
    User: <User size={24} strokeWidth={1.5} />,
    Calendar: <Calendar size={24} strokeWidth={1.5} />,
    Briefcase: <Briefcase size={24} strokeWidth={1.5} />,
  };

  return (
    <section id="services" className="py-24 px-6 md:px-12 bg-surface">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col mb-20">
          <span className="text-meta">Model Captured</span>
          <h2 className="text-4xl md:text-5xl font-extralight italic mt-4">Photography Services</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 border-l border-t border-border-subtle">
          {BUSINESS_INFO.services.map((service, index) => (
            <div 
              key={service.title}
              className="p-12 border-r border-b border-border-subtle group hover:bg-ink transition-all cursor-pointer relative"
              onClick={() => setSelectedService(service)}
            >
              <div className="flex justify-between items-start mb-12">
                <span className="text-[10px] text-muted font-mono">0{index + 1}</span>
                <div className="text-muted group-hover:text-gold transition-colors">
                  {icons[service.icon as keyof typeof icons]}
                </div>
              </div>
              <h3 className="text-lg font-light tracking-wide mb-4 text-gold group-hover:translate-x-2 transition-transform">{service.title}</h3>
              <p className="text-[10px] text-muted leading-relaxed uppercase tracking-widest opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all">
                {service.description}
              </p>
              <div className="absolute bottom-12 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
                <ArrowRight size={16} className="text-gold" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Service Modal */}
      <AnimatePresence>
        {selectedService && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-ink/80 backdrop-blur-md flex items-center justify-center p-6"
            onClick={() => setSelectedService(null)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-ink border border-border-subtle p-12 max-w-2xl w-full relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-2 h-full bg-gold" />
              <button 
                className="absolute top-8 right-8 text-muted hover:text-gold"
                onClick={() => setSelectedService(null)}
              >
                <X size={24} strokeWidth={1} />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-surface text-gold">
                  {icons[selectedService.icon as keyof typeof icons]}
                </div>
                <div>
                   <span className="text-[10px] uppercase tracking-[0.3em] text-muted block mb-1">Service Detail</span>
                   <h3 className="text-3xl font-extralight italic text-gold">{selectedService.title}</h3>
                </div>
              </div>

              <p className="text-muted leading-relaxed text-sm italic mb-10 border-l border-border-subtle pl-6 py-2">
                {selectedService.longDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-6">
                <Link 
                  to="/contact" 
                  onClick={() => setSelectedService(null)}
                  className="px-8 py-4 bg-gold text-ink text-[10px] uppercase tracking-widest font-bold hover:bg-gold-bright transition-all text-center"
                >
                  Inquire Now
                </Link>
                <button 
                  onClick={() => setSelectedService(null)}
                  className="px-8 py-4 border border-border-subtle text-[10px] uppercase tracking-widest text-gold hover:bg-surface transition-all"
                >
                  Return to Studio
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    service: 'Fashion & Editorial',
    message: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) newErrors.name = 'Identification is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email port is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email structure';
    }
    if (!formData.message.trim()) newErrors.message = 'Brief narrative is required';
    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setErrors({});
    setIsSubmitting(true);

    // Simulate API delay
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      setFormData({
        name: '',
        email: '',
        service: 'Fashion & Editorial',
        message: ''
      });
      setTimeout(() => setIsSuccess(false), 5000);
    }, 1500);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  return (
    <section id="contact" className="py-32 px-6 md:px-12 bg-ink">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-16">
        <div className="lg:col-span-5">
          <span className="text-meta">Inquiry</span>
          <h2 className="text-5xl font-extralight italic mt-6 mb-10 leading-tight">Begin the <br /><span className="not-italic">Collaboration</span></h2>
          
          <div className="space-y-10">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-muted uppercase tracking-widest">Office</span>
              <p className="text-sm tracking-wide">Model Captured</p>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-[10px] text-muted uppercase tracking-widest">Social</span>
              <a href={BUSINESS_INFO.socials.facebook} className="text-sm tracking-wide hover:text-muted transition-colors border-b border-stone w-fit pb-1">Connect on Facebook</a>
            </div>
            <div className="flex flex-col gap-6 pt-6 border-t border-border-subtle">
              <div>
                <span className="text-[10px] text-muted uppercase tracking-widest"></span>
                <p className="text-[9px] text-muted mt-2"></p>
              </div>
              <div className="flex flex-col gap-3">
                <button
                  onClick={() => {
                    const userAgent = navigator.userAgent.toLowerCase();
                    if (userAgent.includes('win')) {
                      // Windows: Trigger download for .exe installer
                      alert('Windows installer download will be available soon. For now, use the "Install App" button in the hero section for PWA installation.');
                    } else if (userAgent.includes('mac')) {
                      // macOS: Trigger download for .dmg installer
                      alert('macOS installer download will be available soon. For now, use the "Install App" button in the hero section for PWA installation.');
                    } else {
                      alert('Download desktop installers via the hero section "Install App" button.');
                    }
                  }}
                  className="px-6 py-3 bg-gold text-ink text-[10px] uppercase tracking-widest font-bold hover:bg-gold-bright transition-all text-center w-full"
                >
                  Download Desktop
                </button>
                <button
                  onClick={() => {
                    if (navigator.share) {
                      navigator.share({
                        title: 'Model Captured',
                        text: 'Download and install Model Captured app - High-fashion editorial and cinematic portraiture',
                        url: window.location.href
                      });
                    } else {
                      // Fallback: Copy to clipboard or show message
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied! Share this with your mobile device to install the app.');
                    }
                  }}
                  className="px-6 py-3 border border-gold text-gold text-[10px] uppercase tracking-widest font-bold hover:bg-gold hover:text-ink transition-all text-center w-full"
                >
                  Install on Mobile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-7">
          <form onSubmit={handleSubmit} className="space-y-8 bg-surface p-12 border border-border-subtle relative overflow-hidden">
            <AnimatePresence>
              {isSuccess && (
                <motion.div 
                  initial={{ opacity: 0 }} 
                  animate={{ opacity: 1 }} 
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-ink/90 backdrop-blur-sm z-10 flex flex-col items-center justify-center text-center p-8"
                >
                  <CheckCircle2 size={48} className="text-gold mb-4" />
                  <h3 className="text-2xl font-light italic mb-2">Message Transmitted</h3>
                  <p className="text-sm text-muted">A consultant will review your inquiry shortly.</p>
                  <button 
                    type="button" 
                    onClick={() => setIsSuccess(false)}
                    className="mt-8 text-[10px] uppercase tracking-widest text-gold border-b border-gold pb-1"
                  >
                    Send another inquiry
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.4em] text-muted font-bold">Full name</label>
                <input 
                  type="text" 
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={cn(
                    "w-full bg-ink border-b py-3 text-xs focus:border-gold outline-none transition-colors rounded-none",
                    errors.name ? "border-red-500/50" : "border-border-subtle"
                  )} 
                  placeholder="Name" 
                />
                {errors.name && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.name}</p>}
              </div>
              <div className="space-y-3">
                <label className="text-[9px] uppercase tracking-[0.4em] text-muted font-bold">eMAIL aDDRESS</label>
                <input 
                  type="email" 
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={cn(
                    "w-full bg-ink border-b py-3 text-xs focus:border-gold outline-none transition-colors rounded-none",
                    errors.email ? "border-red-500/50" : "border-border-subtle"
                  )} 
                  placeholder="Email" 
                />
                {errors.email && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.email}</p>}
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.4em] text-muted font-bold">Project Discipline</label>
              <div className="relative">
                <select 
                  name="service"
                  value={formData.service}
                  onChange={handleChange}
                  className="w-full bg-ink border-b border-border-subtle py-3 text-xs focus:border-gold outline-none transition-colors rounded-none appearance-none cursor-pointer"
                >
                  <option>Fashion & Editorial</option>
                  <option>Cinematic Portraits</option>
                  <option>Event Coverage</option>
                  <option>Commercial</option>
                </select>
                <ChevronDown size={14} className="absolute right-0 top-1/2 -translate-y-1/2 text-muted pointer-events-none" />
              </div>
            </div>
            <div className="space-y-3">
              <label className="text-[9px] uppercase tracking-[0.4em] text-muted font-bold">Brief Narrative</label>
              <textarea 
                rows={4} 
                name="message"
                value={formData.message}
                onChange={handleChange}
                className={cn(
                  "w-full bg-ink border-b py-3 text-xs focus:border-gold outline-none transition-colors resize-none rounded-none",
                  errors.message ? "border-red-500/50" : "border-border-subtle"
                )} 
                placeholder="Tell us your story..."
              ></textarea>
              {errors.message && <p className="text-[9px] text-red-500 uppercase tracking-widest">{errors.message}</p>}
            </div>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gold text-ink text-[10px] uppercase tracking-widest font-bold py-5 hover:bg-gold-bright transition-all disabled:opacity-50"
            >
              {isSubmitting ? 'Transmitting Inbound...' : 'Initiate Contact'}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
};

const Footer = () => {
  return (
    <footer className="py-16 border-t border-border-subtle px-6 md:px-12 bg-ink">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center gap-10">
        <div className="flex flex-col">
          <img
            src="https://cdn.builder.io/api/v1/image/assets%2F9c74866fcfb14f7fbf68c14610585366%2F67a25810ea0b4bbb884977e79cc8e66a?format=webp&width=800&height=1200"
            alt="Model Captured"
            className="h-8 md:h-10 w-auto object-contain opacity-90 mb-4"
          />
          <span className="text-[8px] uppercase tracking-[0.5em] text-muted font-medium">© {new Date().getFullYear()} / All Rights Reserved</span>
        </div>
        
        <div className="flex gap-12">
          <div className="flex flex-col gap-2">
            <span className="text-[8px] text-muted tracking-widest uppercase">Social</span>
            <a href={BUSINESS_INFO.socials.facebook} className="text-[9px] uppercase tracking-widest hover:text-muted">Facebook</a>
          </div>
          <div className="flex flex-col gap-2">
            <span className="text-[8px] text-muted tracking-widest uppercase">Inquiry</span>
            <span className="text-[9px] uppercase tracking-widest">Booking Open</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

// --- Page Layout ---
const PageScroller = () => {
  const location = useLocation();

  useEffect(() => {
    const sectionMap: Record<string, string> = {
      '/gallery': 'gallery',
      '/services': 'services',
      '/contact': 'contact',
      '/home': 'home-top',
      '/': 'home-top'
    };

    const sectionId = sectionMap[location.pathname];
    if (sectionId) {
      if (sectionId === 'home-top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [location]);

  return (
    <div className="min-h-screen text-white">
      <div id="home-top" className="absolute top-0" />
      <Navbar />
      <Hero />
      <Gallery />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
};

export default function App() {
  const [showSplash, setShowSplash] = useState(true);

  return (
    <BrowserRouter>
      <AnimatePresence mode="wait">
        {showSplash ? (
          <SplashScreen key="splash" onComplete={() => setShowSplash(false)} />
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <PageScroller />
          </motion.div>
        )}
      </AnimatePresence>
    </BrowserRouter>
  );
}
