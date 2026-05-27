import { useEffect, useRef } from "react"
import { useTranslation } from "react-i18next"
import {
  REACHER_AUTH_LINKS,
  TRAINING_SESSIONS,
  PLATFORM_STATS_IDS,
  CASE_STUDY_STATS_IDS,
  FOUNDERS,
  TEAM_MEMBERS,
  HUBSPOT_PORTAL_ID,
  HUBSPOT_FORM_ID,
} from "./constants"
import { CheckIcon, ExternalLinkIcon, UsersIcon, IdIcon } from "./components/Icons"

import "./merchant-training.css"

function MerchantTrainingPage() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <NavBar />
      <HeroSection />
      <StatsSection />
      <OfferingSection />
      <TeamSection />
      <RequirementsSection />

      {/* STEP 2: Pick your session + registration form */}
      <FormSection />

      <Footer />
    </div>
  )
}

function FormSection() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  return (
    <section id="signup" className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-block bg-[var(--mt-brand)] text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
            {t("form.step2Badge")}
          </div>
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-900 mb-4 merchant-training-serif-em"
            dangerouslySetInnerHTML={{ __html: t("form.title") }}
          />
          <p className="text-gray-600 text-lg">{t("form.subtitle")}</p>
        </div>

        <div className="bg-white p-8 md:p-12 rounded-2xl shadow-md border border-gray-200">
          {/* Available Sessions */}
          <div className="mb-8">
            <div className="inline-block text-[var(--mt-brand)] font-bold tracking-[0.28em] text-xs uppercase mb-3">
              {t("form.availableSessions")}
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{t("form.pickSession")}</h3>
            <div className="space-y-3 mb-4">
              {TRAINING_SESSIONS.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg border border-gray-100"
                >
                  <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded">
                    {t("form.available")}
                  </span>
                  <p className="text-gray-700 font-medium">
                    {t(`form.sessions.${session.id}.date`)}
                    {" — "}
                    {t(`form.sessions.${session.id}.day`)} {t(`form.sessions.${session.id}.time`)}
                    {" · "}
                    <span className="text-[var(--mt-brand)] font-semibold">
                      {t(`form.sessions.${session.id}.topic`)}
                    </span>
                  </p>
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mb-4">{t("form.sessionInfo")}</p>
            <p className="text-sm text-gray-700 font-medium bg-blue-50 p-3 rounded-lg">
              {t("form.sessionCallout")}
            </p>
          </div>

          <h3 className="text-xl font-bold mb-6 text-gray-900">
            {t("form.completeRegistration")}
          </h3>

          <HubSpotForm />
        </div>
      </div>
    </section>
  )
}

function HubSpotForm() {
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const scriptId = "hubspot-forms-script"

    function createForm() {
      if (!containerRef.current) return
      containerRef.current.innerHTML = ""
      window.hbspt?.forms?.create({
        portalId: HUBSPOT_PORTAL_ID,
        formId: HUBSPOT_FORM_ID,
        target: `#${containerRef.current.id}`,
      })
    }

    if (document.getElementById(scriptId)) {
      createForm()
      return
    }

    const script = document.createElement("script")
    script.id = scriptId
    script.src = "https://js.hsforms.net/forms/v2.js"
    script.async = true
    script.onload = createForm
    document.head.appendChild(script)
  }, [])

  return <div id="hubspot-form-container" ref={containerRef} className="min-h-[200px]" />
}

function NavBar() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  return (
    <nav className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center">
              <img
                src="/images/merchant-training/reacher-logo.png"
                alt="Reacher"
                className="w-10 h-10 mr-2"
              />
              <span className="font-bold text-xl text-[var(--mt-dark)]">{t("nav.reacher")}</span>
              <span className="hidden sm:inline mx-3 text-gray-300">{t("nav.separator")}</span>
              <span className="hidden sm:inline font-semibold text-gray-700">
                {t("nav.subtitle")}
              </span>
            </div>
          </div>
          <div className="flex items-center">
            <a
              href="#signup"
              className="bg-[var(--mt-brand)] hover:bg-[var(--mt-brand)]/90 text-white px-6 py-2 rounded-lg font-medium transition-all"
            >
              {t("nav.signUpNow")}
            </a>
          </div>
        </div>
      </div>
    </nav>
  )
}

function HeroSection() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  return (
    <section className="merchant-training-gradient-bg py-24 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-block mb-6 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-[var(--mt-accent)] text-xs font-bold tracking-[0.28em] uppercase">
          {t("hero.badge")}
        </div>
        <h1
          className="text-[clamp(2rem,5vw,4rem)] font-bold mb-6 leading-tight merchant-training-serif-em"
          dangerouslySetInnerHTML={{ __html: t("hero.title") }}
        />
        <p className="text-xl mb-8 max-w-3xl mx-auto opacity-90">{t("hero.description")}</p>
        <div className="flex justify-center gap-4 flex-wrap">
          <a
            href="#requirements"
            className="bg-white text-[var(--mt-brand)] px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all"
          >
            {t("hero.checkEligibility")}
          </a>
          <a
            href="#signup"
            className="bg-[var(--mt-orange)] hover:opacity-90 text-white px-8 py-3 rounded-lg font-semibold transition-all"
          >
            {t("hero.registerNow")}
          </a>
        </div>
      </div>
    </section>
  )
}

function StatsSection() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-block text-[var(--mt-brand)] font-bold tracking-[0.28em] text-xs uppercase mb-3">
            {t("stats.byTheNumbers")}
          </span>
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-900 mb-4 merchant-training-serif-em"
            dangerouslySetInnerHTML={{ __html: t("stats.title") }}
          />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t("stats.subtitle")}</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto mb-16">
          {PLATFORM_STATS_IDS.map((id) => (
            <div
              key={id}
              className="bg-white p-6 rounded-2xl shadow-md text-center border border-gray-100"
            >
              <div className="text-5xl font-display merchant-training-text-brand-gradient mb-2">
                {t(`stats.${id}.value`)}
              </div>
              <p className="text-gray-700 text-sm font-medium">{t(`stats.${id}.label`)}</p>
            </div>
          ))}
        </div>

        <div className="bg-[var(--mt-dark)] text-white rounded-3xl p-10 md:p-14 max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <span className="inline-block text-[var(--mt-accent)] font-bold tracking-[0.28em] text-xs uppercase mb-3">
              {t("stats.caseStudyLabel")}
            </span>
            <h3
              className="text-3xl md:text-4xl font-bold merchant-training-serif-em mb-3"
              dangerouslySetInnerHTML={{ __html: t("stats.caseStudyTitle") }}
            />
            <p className="text-gray-300 mx-auto md:whitespace-nowrap">{t("stats.caseStudyDesc")}</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {CASE_STUDY_STATS_IDS.map((id) => (
              <div key={id} className="text-center">
                <div className="text-5xl font-display merchant-training-text-brand-gradient mb-2">
                  {t(`stats.${id}.value`)}
                </div>
                <p className="text-gray-300 text-sm">
                  {t(`stats.${id}.label`)}
                  <br />
                  <span className="text-gray-500">{t(`stats.${id}.prev`)}</span>
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function OfferingSection() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  const reacherPlusFeatures = t("offering.reacherPlusFeatures", {
    returnObjects: true,
  }) as string[]
  const creatorCommunityFeatures = t("offering.creatorCommunityFeatures", {
    returnObjects: true,
  }) as string[]

  return (
    <section id="features" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-900 mb-4 merchant-training-serif-em"
            dangerouslySetInnerHTML={{ __html: t("offering.title") }}
          />
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">{t("offering.subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Reacher Plus */}
          <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-8 rounded-2xl shadow-md merchant-training-card-hover border-2 border-[var(--mt-brand)]/20 relative">
            <div className="absolute top-4 right-4 merchant-training-brand-gradient text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">
              {t("offering.reacherPlus")}
            </div>
            <div className="w-14 h-14 merchant-training-brand-gradient rounded-xl flex items-center justify-center mb-6">
              <IdIcon className="text-white" />
            </div>
            <h3
              className="text-2xl font-bold mb-2 text-gray-900 merchant-training-serif-em"
              dangerouslySetInnerHTML={{ __html: t("offering.reacherPlusTitle") }}
            />
            <p className="text-gray-600 text-sm mb-5">{t("offering.reacherPlusDesc")}</p>
            <ul className="space-y-3 text-gray-700">
              {Array.isArray(reacherPlusFeatures) &&
                reacherPlusFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="text-[var(--mt-brand)] mt-1 flex-shrink-0" />
                    <strong>{feature}</strong>
                  </li>
                ))}
            </ul>
          </div>

          {/* Creator Community */}
          <div className="bg-gradient-to-br from-cyan-50 to-blue-50 p-8 rounded-2xl shadow-md merchant-training-card-hover border-2 border-[var(--mt-accent)]/30 relative">
            <div className="absolute top-4 right-4 bg-[var(--mt-accent)] text-white text-xs font-bold px-3 py-1 rounded-full tracking-wider">
              {t("offering.creatorCommunity")}
            </div>
            <div className="w-14 h-14 bg-[var(--mt-accent)] rounded-xl flex items-center justify-center mb-6">
              <UsersIcon className="text-white" />
            </div>
            <h3
              className="text-2xl font-bold mb-4 text-gray-900 merchant-training-serif-em"
              dangerouslySetInnerHTML={{ __html: t("offering.creatorCommunityTitle") }}
            />
            <ul className="space-y-3 text-gray-700">
              {Array.isArray(creatorCommunityFeatures) &&
                creatorCommunityFeatures.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <CheckIcon className="text-[var(--mt-accent)] mt-1 flex-shrink-0" />
                    <strong>{feature}</strong>
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

function TeamSection() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Founders */}
        <div className="text-center mb-12">
          <span className="inline-block text-[var(--mt-brand)] font-bold tracking-[0.28em] text-xs uppercase mb-3">
            {t("team.foundersLabel")}
          </span>
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-900 mb-3 merchant-training-serif-em"
            dangerouslySetInnerHTML={{ __html: t("team.foundersTitle") }}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {FOUNDERS.map((founder) => (
            <div
              key={founder.id}
              className="bg-gray-50 p-8 rounded-2xl text-center merchant-training-card-hover border border-gray-100"
            >
              <div className="w-28 h-28 rounded-full overflow-hidden mx-auto mb-4 ring-4 ring-[var(--mt-brand)]/20">
                <img
                  src={founder.photo}
                  alt={t(`team.founders.${founder.id}.name`)}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-1">
                {t(`team.founders.${founder.id}.name`)}
              </h3>
              <div className="text-[var(--mt-brand)] text-sm font-bold tracking-wider uppercase mb-3">
                {t(`team.founders.${founder.id}.title`)}
              </div>
              <p className="text-gray-600 text-base leading-relaxed">
                {t(`team.founders.${founder.id}.bio`)}
              </p>
            </div>
          ))}
        </div>

        {/* Team */}
        <div className="text-center mb-12">
          <span className="inline-block text-[var(--mt-brand)] font-bold tracking-[0.28em] text-xs uppercase mb-3">
            {t("team.teamLabel")}
          </span>
          <h2
            className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-900 mb-3 merchant-training-serif-em"
            dangerouslySetInnerHTML={{ __html: t("team.teamTitle") }}
          />
          <p className="text-gray-600 max-w-2xl mx-auto">{t("team.teamDesc")}</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.id}
              className="bg-gray-50 p-6 rounded-2xl merchant-training-card-hover border border-gray-100 text-center"
            >
              <div className="w-20 h-20 rounded-full overflow-hidden mx-auto mb-3 ring-2 ring-[var(--mt-accent)]/30">
                <img
                  src={member.photo}
                  alt={t(`team.members.${member.id}.name`)}
                  className="w-full h-full object-cover"
                />
              </div>
              <h4 className="text-lg font-bold text-gray-900 mb-1">
                {t(`team.members.${member.id}.name`)}
              </h4>
              <div className="text-xs text-[var(--mt-brand)] font-semibold tracking-wider uppercase mb-2">
                {t(`team.members.${member.id}.title`)}
              </div>
              <p
                className="text-gray-600 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: t(`team.members.${member.id}.bio`) }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function RequirementsSection() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  return (
    <section
      id="requirements"
      className="py-16 bg-gradient-to-br from-orange-50 to-amber-50 border-y-4 border-[var(--mt-orange)]"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-block bg-[var(--mt-orange)] text-white text-sm font-bold px-4 py-1 rounded-full mb-4">
            {t("requirements.step1Badge")}
          </div>
          <h2 className="text-[clamp(1.5rem,3vw,2.5rem)] font-bold text-gray-900 mb-3">
            {t("requirements.step1Title")}
          </h2>
          <p className="text-gray-700 text-lg">{t("requirements.step1Subtitle")}</p>
        </div>

        <div className="bg-white p-8 rounded-2xl shadow-lg border-4 border-[var(--mt-orange)] relative overflow-hidden">
          <div className="absolute top-0 right-0 bg-[var(--mt-orange)] text-white px-4 py-1 text-sm font-bold">
            {t("requirements.mandatory")}
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[var(--mt-orange)] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
              <CheckIcon className="text-white !w-5 !h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {t("requirements.req1Title")}
              </h3>
              <p
                className="text-gray-700 mb-4"
                dangerouslySetInnerHTML={{ __html: t("requirements.req1Desc") }}
              />
              <a
                href={REACHER_AUTH_LINKS.US.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-[var(--mt-orange)] hover:opacity-90 text-white px-8 py-4 rounded-lg font-bold inline-flex items-center gap-2 text-lg shadow-lg transform hover:scale-105 transition-all"
              >
                <ExternalLinkIcon className="text-white" /> {t("requirements.completeAuth")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  const { t } = useTranslation("merchant-training", { useSuspense: false })
  return (
    <footer className="bg-[var(--mt-dark)] text-gray-300 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <div className="flex items-center justify-center mb-6">
            <img
              src="/images/merchant-training/reacher-logo.png"
              alt="Reacher"
              className="w-10 h-10 mr-2"
            />
            <span className="font-bold text-xl text-white">{t("nav.reacher")}</span>
            <span className="mx-3 text-gray-500">{t("nav.separator")}</span>
            <span className="text-gray-400">{t("nav.subtitle")}</span>
          </div>
          <p className="mb-4">{t("footer.copyright")}</p>
          <p className="text-sm text-gray-400 max-w-2xl mx-auto">{t("footer.disclaimer")}</p>
        </div>
      </div>
    </footer>
  )
}

export { MerchantTrainingPage }

declare global {
  interface Window {
    hbspt?: {
      forms?: {
        create: (opts: { portalId: string; formId: string; target: string }) => void
      }
    }
  }
}
