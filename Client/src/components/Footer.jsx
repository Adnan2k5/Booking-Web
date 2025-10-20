import React, { useState, useEffect, useRef } from 'react'
import { MapPin, Loader2 } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { axiosClient } from '../AxiosClient/axios'

export const Footer = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()

  const handleLogoClick = () => {
    navigate('/secret-nft-events')
  }

  // Dynamic sponsors fetched from backend
  const [sponsors, setSponsors] = useState([])
  const [loadingSponsors, setLoadingSponsors] = useState(true)
  const [sponsorError, setSponsorError] = useState(null)

  useEffect(() => {
    let ignore = false
    const fetchSponsors = async () => {
      try {
        setLoadingSponsors(true)
        setSponsorError(null)
        const base = import.meta.env.VITE_API_URL || 'http://localhost:8080'
        const res = await axiosClient.get(`/api/sponsors`)
        if (!ignore) {
          const data = Array.isArray(res.data?.data) ? res.data.data : []
          setSponsors(data.filter(s => s.isActive !== false))
        }
      } catch (e) {
        if (!ignore) setSponsorError('FAILED_TO_LOAD_SPONSORS')
      } finally {
        if (!ignore) setLoadingSponsors(false)
      }
    }
    fetchSponsors()
    return () => { ignore = true }
  }, [])

  // Modal state
  const [selectedPartner, setSelectedPartner] = useState(null)
  const closeButtonRef = useRef(null)

  // Close modal helper
  const closeModal = () => setSelectedPartner(null)

  // Escape key handling & focus management
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') closeModal()
    }
    if (selectedPartner) {
      window.addEventListener('keydown', onKey)
      // Slight delay to ensure element rendered
      setTimeout(() => closeButtonRef.current?.focus(), 30)
      // Prevent background scroll
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      window.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [selectedPartner])

  return (
    <footer className="bg-gray-900 text-white mt-12 py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* Left side - About Website */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-blue-400">{t("aboutAdventureBooking")}</h3>
            <p className="text-gray-300 leading-relaxed">
              {t("footerDescription")}
            </p>
          </div>

          {/* Middle - Terms & Support */}
          <div className="flex flex-col items-center space-y-6">
            <div className="flex flex-col gap-4 text-center">
              <Link
                to="/terms"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                {t("termsConditions")}
              </Link>
              <Link
                to="/privacy"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                {t("privacyPolicy")}
              </Link>
              <Link
                to="/support"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                {t("customerSupport")}
              </Link>
              <Link
                to="/faq"
                className="text-gray-300 hover:text-blue-400 transition-colors duration-300 font-medium"
              >
                {t("faq")}
              </Link>
            </div>
          </div>

          {/* Right side - Logo + Scrolling Partner Logos */}
          <div className="flex flex-col items-center md:items-end gap-6">
            <button
              onClick={handleLogoClick}
              className="flex items-center gap-3 bg-blue-600 hover:bg-blue-700 transition-all duration-300 px-6 py-3 rounded-lg group cursor-pointer shadow-lg shadow-blue-800/30"
            >
              <MapPin className="w-6 h-6 text-white group-hover:scale-110 transition-transform" />
              <span className="text-xl font-bold text-white tracking-wide">
                {t("adventureBooking")}
              </span>
            </button>

            {/* Scrolling logos */}
            <div className="w-full md:w-[280px] mt-5 relative overflow-hidden logo-marquee rounded-md border border-gray-700/60 bg-gray-800/50">
              <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-gray-900 to-transparent pointer-events-none z-10" />
              <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-gray-900 to-transparent pointer-events-none z-10" />
              <ul className="flex items-center gap-12 logo-marquee-track py-5 pl-6">
                {loadingSponsors && (
                  <li className="flex items-center gap-2 text-xs text-gray-400">
                    <Loader2 className="h-4 w-4 animate-spin" /> {t("loadingSponsors")}
                  </li>
                )}
                {!loadingSponsors && sponsorError && (
                  <li className="text-xs text-red-400">{sponsorError === 'FAILED_TO_LOAD_SPONSORS' ? t("failedToLoadSponsors") : sponsorError}</li>
                )}
                {!loadingSponsors && !sponsorError && sponsors.length === 0 && (
                  <li className="text-xs text-gray-400">{t("noSponsorsYet")}</li>
                )}
                {!loadingSponsors && !sponsorError && sponsors.length > 0 && (
                  sponsors.concat(sponsors).map((p, i) => (
                    <li
                      key={i}
                      className="flex-shrink-0 opacity-80 hover:opacity-100 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/70 rounded"
                      title={p.name}
                      tabIndex={0}
                      onClick={() => setSelectedPartner(p)}
                      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setSelectedPartner(p) } }}
                    >
                      <img
                        src={p.logoUrl}
                        alt={(p.name || 'Sponsor') + ' logo'}
                        loading="lazy"
                        className="h-12 w-auto object-contain drop-shadow-sm hover:drop-shadow"
                        onError={(e) => { e.currentTarget.style.opacity = '0.25' }}
                      />
                    </li>
                  ))
                )}
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-700 text-center">
          <p className="text-gray-400">
            {t("copyrightText")}
          </p>
        </div>
      </div>
      {/* Component-scoped styles for the scrolling marquee */}
      <style>{`
        .logo-marquee { --marquee-duration: 22s; }
        .logo-marquee-track {
          animation: marquee var(--marquee-duration) linear infinite;
          width: max-content;
        }
        .logo-marquee:hover .logo-marquee-track { animation-play-state: paused; }
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .logo-marquee-track { animation: none; }
        }
      `}</style>

      {selectedPartner && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" aria-modal="true"
          aria-label={selectedPartner.name + ' ' + t("sponsorDetails")}
        >
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in" onClick={closeModal} />
          <div className="relative w-full max-w-lg bg-gray-900 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-scale-in">
            <div className="absolute top-2 right-2">
              <button
                ref={closeButtonRef}
                onClick={closeModal}
                className="text-gray-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 rounded p-2"
                aria-label={t("closeSponsorDetails")}
              >
                ✕
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-5">
                <div className="shrink-0 bg-gray-800/60 rounded-lg p-4 border border-gray-700">
                  <img
                    src={selectedPartner.logoUrl}
                    alt={(selectedPartner.name || 'Sponsor') + ' logo large'}
                    className="h-20 w-auto object-contain"
                  />
                </div>
                <div className="space-y-1">
                  <h2 className="text-2xl font-bold tracking-wide text-white">{selectedPartner.name}</h2>
                  {selectedPartner.tier && (
                    <p className="text-sm font-medium text-blue-400 uppercase tracking-wide">{selectedPartner.tier}</p>
                  )}
                </div>
              </div>
              <p className="text-gray-300 leading-relaxed text-sm">
                {selectedPartner.description || t("noDescriptionProvided")}
              </p>
              <div className="flex items-center justify-between pt-2">
                {selectedPartner.website ? (
                  <a
                    href={selectedPartner.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 font-medium group"
                  >
                    {t("visitWebsite")}
                    <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
                  </a>
                ) : <span className="text-xs text-gray-500">{t("noWebsite")}</span>}
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-sm rounded-md border border-gray-700 text-gray-200 transition-colors"
                >
                  {t("close")}
                </button>
              </div>
            </div>
          </div>
          <style>{`
            .animate-fade-in { animation: fadeIn .25s ease-out; }
            .animate-scale-in { animation: scaleIn .25s ease-out; }
            @keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }
            @keyframes scaleIn { from { opacity:0; transform: translateY(12px) scale(.96); } to { opacity:1; transform: translateY(0) scale(1); } }
          `}</style>
        </div>
      )}
    </footer>
  )
}
