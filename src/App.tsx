/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Header from './components/Header.tsx';
import Hero from './components/Hero.tsx';
import About from './components/About.tsx';
import Exhibitions from './components/Exhibitions.tsx';
import RentalGuide from './components/RentalGuide.tsx';
import Customizer from './components/Customizer.tsx';
import Footer from './components/Footer.tsx';
import EventPopup from './components/EventPopup.tsx';

import { GalleryConfig, ExhibitionPost, RentalInquiry } from './types.ts';
import { INITIAL_CONFIG, INITIAL_EXHIBITIONS, INITIAL_INQUIRIES } from './data.ts';
import { Sliders, Shield, Info } from 'lucide-react';

export default function App() {
  const [config, setConfig] = useState<GalleryConfig>(() => {
    const saved = localStorage.getItem('g629_config');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.fontFamily === 'serif') {
          parsed.fontFamily = 'sans';
        }
        if (parsed.pointColor === '#D4C3A3' || parsed.pointColor === '#8A9099') {
          parsed.pointColor = '#003153';
        }
        if (parsed.pointColorLight === '#F7F4EF' || parsed.pointColorLight === '#F1F2F4') {
          parsed.pointColorLight = '#F0F4F8';
        }
        if (parsed.siteName === '갤러리629' || parsed.siteName === 'Gallery LIM303' || parsed.siteName === 'GALLERY LIM303') {
          parsed.siteName = 'LIM303 GALLERY';
        }
        if (parsed.siteSubName === 'GALLERY 629' || parsed.siteSubName === 'Gallery LIM303' || parsed.siteSubName === 'GALLERY LIM303' || parsed.siteSubName === 'LIM303 GALLERY') {
          parsed.siteSubName = 'PROJECT & EXHIBITION SPACE';
        }
        if (
          !parsed.aboutImage || 
          parsed.aboutImage === 'https://images.unsplash.com/photo-1494438639946-1ebd1d2038b5?q=80&w=1000' ||
          parsed.aboutImage === 'https://images.unsplash.com/photo-1518998053901-5348d3961a04?q=80&w=1200'
        ) {
          parsed.aboutImage = INITIAL_CONFIG.aboutImage;
        }
        if (parsed.aboutText) {
          parsed.aboutText = parsed.aboutText
            .replace(/갤러리629/g, 'LIM303 GALLERY')
            .replace(/Gallery LIM303/g, 'LIM303 GALLERY')
            .replace(/GALLERY LIM303/g, 'LIM303 GALLERY');
        }
        if (!parsed.heroBackgroundImage) {
          parsed.heroBackgroundImage = INITIAL_CONFIG.heroBackgroundImage;
        }
        if (!parsed.heroBackgroundMode) {
          parsed.heroBackgroundMode = 'minimal';
        }
        if (parsed.heroOverlayOpacity === undefined) {
          parsed.heroOverlayOpacity = 0;
        }
        // Update Space Specification to new defaults
        if (!parsed.rentalArea || parsed.rentalArea.includes('145㎡')) {
          parsed.rentalArea = '116㎡ (약 35평)';
        }
        if (!parsed.rentalHeight || parsed.rentalHeight.includes('3.6m')) {
          parsed.rentalHeight = '2.6m ~ 4.0m';
        }
        if (!parsed.rentalCapacity || parsed.rentalCapacity.includes('80명')) {
          parsed.rentalCapacity = '최대 60명 동시 수용 가능';
        }
        if (!parsed.aboutImages || parsed.aboutImages.length === 0) {
          parsed.aboutImages = INITIAL_CONFIG.aboutImages;
        }
        if (!parsed.phone || parsed.phone === '02-730-0629') {
          parsed.phone = '010-8020-5499';
        }
        if (!parsed.email || parsed.email === 'contact@lim303gallery.com') {
          parsed.email = 'lim303gallery@gmail.com';
        }
        if (!parsed.floorPlanImage) {
          parsed.floorPlanImage = INITIAL_CONFIG.floorPlanImage;
        }
        if (!parsed.formspreeEndpoint) {
          parsed.formspreeEndpoint = INITIAL_CONFIG.formspreeEndpoint;
        }
        return parsed;
      } catch (e) {
        console.error('Failed to parse saved config, using initial default.');
      }
    }
    return INITIAL_CONFIG;
  });

  const [posts, setPosts] = useState<ExhibitionPost[]>(() => {
    const saved = localStorage.getItem('g629_posts');
    if (saved) {
      try {
        const parsed: ExhibitionPost[] = JSON.parse(saved);
        return parsed.map((p) => {
          if (p.imageUrl === 'https://images.unsplash.com/photo-1577083552431-6e5fd01aa342?q=80&w=1200') {
            return { ...p, imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?q=80&w=800' };
          }
          return p;
        });
      } catch (e) {
        console.error('Failed to parse saved posts, using initial default.');
      }
    }
    return INITIAL_EXHIBITIONS;
  });

  const [inquiries, setInquiries] = useState<RentalInquiry[]>(() => {
    const saved = localStorage.getItem('g629_inquiries');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error('Failed to parse saved inquiries, using initial default.');
      }
    }
    return INITIAL_INQUIRIES;
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [isCustomizerOpen, setIsCustomizerOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('about');

  // Sync to local storage when state changes
  useEffect(() => {
    localStorage.setItem('g629_config', JSON.stringify(config));
  }, [config]);

  useEffect(() => {
    localStorage.setItem('g629_posts', JSON.stringify(posts));
  }, [posts]);

  useEffect(() => {
    localStorage.setItem('g629_inquiries', JSON.stringify(inquiries));
  }, [inquiries]);

  // Open customizer automatically when admin logs in for a super seamless UX
  useEffect(() => {
    if (isAdmin) {
      setIsCustomizerOpen(true);
    } else {
      setIsCustomizerOpen(false);
    }
  }, [isAdmin]);

  // Handle active section scrolling detection
  useEffect(() => {
    const sections = ['hero', 'about', 'exhibitions', 'rental', 'contact'];
    
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 120; // offset of Header
      
      for (const sect of sections) {
        const element = document.getElementById(sect);
        if (element) {
          const top = element.offsetTop;
          const height = element.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            // map contact form group back to 'contact'
            if (sect === 'hero') {
              setActiveSection('');
            } else {
              setActiveSection(sect === 'contact' ? 'contact' : sect);
            }
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Config custom change callbacks
  const handleConfigChange = (updatedConfig: GalleryConfig) => {
    setConfig(updatedConfig);
  };

  // Posts CRUD handles
  const handleAddPost = (newPost: ExhibitionPost) => {
    setPosts([newPost, ...posts]);
  };

  const handleUpdatePost = (updatedPost: ExhibitionPost) => {
    setPosts(posts.map((p) => (p.id === updatedPost.id ? updatedPost : p)));
  };

  const handleDeletePost = (id: string) => {
    setPosts(posts.filter((p) => p.id !== id));
  };

  // Inquiries CRUD handles
  const handleAddInquiry = (newInquiry: Omit<RentalInquiry, 'id' | 'createdAt' | 'status'>) => {
    const fullInq: RentalInquiry = {
      ...newInquiry,
      id: 'inquiry-' + Date.now(),
      createdAt: Date.now(),
      status: 'pending',
    };
    setInquiries([fullInq, ...inquiries]);
  };

  const handleUpdateInquiryStatus = (id: string, status: 'pending' | 'reviewed' | 'completed') => {
    setInquiries(
      inquiries.map((inq) => (inq.id === id ? { ...inq, status } : inq))
    );
  };

  const handleDeleteInquiry = (id: string) => {
    setInquiries(inquiries.filter((inq) => inq.id !== id));
  };

  // Dynamic style definition for real-time CSS customizer changes
  const dynamicRootStyle = {
    '--point-color': config.pointColor,
    '--point-color-bg': config.pointColorLight,
  } as React.CSSProperties;

  // Extract ongoing current active or first exhibition poster for layout decoration
  const currentExhibit = posts.find((p) => p.category === 'current');

  return (
    <div 
      style={dynamicRootStyle} 
      className={`${
        config.fontFamily === 'serif' ? 'font-serif-korean' : 'font-sans-korean'
      } min-h-screen relative flex flex-col bg-white overflow-hidden transition-all text-neutral-800`}
    >
      {/* Header component */}
      <Header
        config={config}
        isAdmin={isAdmin}
        setIsAdmin={setIsAdmin}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      {/* Main Sections block */}
      <main className="flex-1">
        {/* Banner presentation with slide indicator */}
        <Hero
          config={config}
          currentExhibit={currentExhibit}
          isAdmin={isAdmin}
          onExploreClick={() => {
            const el = document.getElementById('about');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
          onUpdateConfig={setConfig}
        />

        {/* Gallery context introduction with direct image change capability (Admin restricted) */}
        <About 
          config={config} 
          isAdmin={isAdmin}
          onUpdateConfig={setConfig} 
        />

        {/* Dynamic exhibitions viewer grid (Admin restricted) */}
        <Exhibitions 
          config={config} 
          posts={posts} 
          isAdmin={isAdmin}
          onAdminLogin={(pass: string) => {
            if (pass === '1234') {
              setIsAdmin(true);
              return true;
            }
            return false;
          }}
        />

        {/* Space guideline and live inquiry forms (Admin restricted upload) */}
        <RentalGuide 
          config={config} 
          isAdmin={isAdmin}
          onAddInquiry={handleAddInquiry} 
          onUpdateConfig={setConfig} 
        />
      </main>

      {/* Footer component */}
      <Footer config={config} />

      {/* Grand Open 30% Event Popup Modal */}
      <EventPopup config={config} />

      {/* Floating Control buttons for Admin */}
      {isAdmin && (
        <div className="fixed bottom-6 right-6 z-40 flex flex-col space-y-2.5 items-end">
          
          {/* Quick notification bubble info if there are pending inquiries */}
          {inquiries.some(i => i.status === 'pending') && (
            <div className="bg-orange-600 text-white text-[10px] font-black tracking-tight py-1 px-2.5 rounded-full shadow-md animate-bounce flex items-center space-x-1 border border-orange-500">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
              <span>미검토 대관 신청 {inquiries.filter(i => i.status === 'pending').length}건 접수됨</span>
            </div>
          )}

          {/* Core toggle button */}
          <button
            onClick={() => setIsCustomizerOpen(!isCustomizerOpen)}
            className="flex items-center space-x-2 bg-zinc-950 text-white hover:bg-zinc-900 border border-zinc-900 hover:border-zinc-800 py-3 px-5 rounded-full text-xs font-semibold tracking-wider shadow-xl transition-all hover:scale-[1.03]"
            title="실시간 에디터 패널 열기"
            id="floating-editor-trigger"
          >
            <Sliders size={13} className="animate-pulse text-neutral-300" />
            <span>편집기 패널 {isCustomizerOpen ? '접기' : '열기'}</span>
          </button>
        </div>
      )}

      {/* Simple Instruction Banner if not admin, to prompt them about testing the customization capability */}
      {!isAdmin && (
        <div className="fixed bottom-5 left-5 z-40 bg-white/90 backdrop-blur-md max-w-sm rounded-xl py-2 px-3.5 border border-zinc-200/80 shadow-lg text-left hidden md:flex items-center space-x-2.5 text-[11px] font-sans font-medium text-zinc-650 animate-in fade-in duration-700">
          <span className="w-5 h-5 rounded-full bg-zinc-100 flex items-center justify-center shrink-0">
            <Info size={11} className="text-zinc-600" />
          </span>
          <div>
            우측 상단 <strong className="text-zinc-950">관리자 로그인 (1234)</strong>을 실행하면 이미지, 텍스트, 색상, 서체를 포함한 실시간 사이트 편집이 가능합니다.
          </div>
        </div>
      )}

      {/* Sliding Control Customizer drawer */}
      {isCustomizerOpen && (
        <Customizer
          config={config}
          onConfigChange={handleConfigChange}
          posts={posts}
          onAddPost={handleAddPost}
          onUpdatePost={handleUpdatePost}
          onDeletePost={handleDeletePost}
          inquiries={inquiries}
          onUpdateInquiryStatus={handleUpdateInquiryStatus}
          onDeleteInquiry={handleDeleteInquiry}
          onClose={() => setIsCustomizerOpen(false)}
        />
      )}
    </div>
  );
}
