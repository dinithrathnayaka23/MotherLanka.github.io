import { useMemo, useState } from "react";
import { NavLink } from "react-router-dom";
import { useLanguage } from "../../context/LanguageContext";

const flagUrl = (flagCode) => `https://flagcdn.com/w20/${flagCode}.png`;

const LanguagePicker = ({ language, setLanguage, languages, label }) => {
  const [open, setOpen] = useState(false);
  const selected = useMemo(
    () => languages.find((lang) => lang.code === language) || languages[0],
    [language, languages]
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="rounded-full border border-gray-300 px-3 py-1.5 text-sm bg-white flex items-center gap-2"
      >
        <img
          src={flagUrl(selected.flagCode)}
          alt={selected.label}
          className="w-4 h-3 object-cover rounded-sm border border-gray-200"
        />
        <span>{label}</span>
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-200 rounded-xl shadow-lg z-50">
          {languages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => {
                setLanguage(lang.code);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm flex items-center gap-2 hover:bg-gray-50 ${
                lang.code === language ? "bg-gray-50 font-semibold" : ""
              }`}
            >
              <img
                src={flagUrl(lang.flagCode)}
                alt={lang.label}
                className="w-4 h-3 object-cover rounded-sm border border-gray-200"
              />
              <span>{lang.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { t, language, setLanguage, languages } = useLanguage();

  return (
    <nav className="fixed w-full z-50 bg-white/95 md:bg-white/70 backdrop-blur-md shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-1 flex justify-between items-center">
        <NavLink to="/" className="flex items-center gap-2">
          <img
            src="/MotherLanka3.png"
            alt="MotherLanka Logo"
            className="h-14 md:h-16 w-auto object-contain"
          />
        </NavLink>

        <div className="hidden md:flex items-center gap-10">
          <NavItem to="/">{t("nav.home")}</NavItem>
          <NavItem to="/destinations">{t("nav.destinations")}</NavItem>
          <NavItem to="/stays">{t("nav.stays")}</NavItem>
          <NavItem to="/experiences">{t("nav.experiences")}</NavItem>
          <NavItem to="/about">{t("nav.about")}</NavItem>
          <NavItem to="/contact">{t("nav.contact")}</NavItem>

          <LanguagePicker
            language={language}
            setLanguage={setLanguage}
            languages={languages}
            label={t("nav.language")}
          />

          <NavLink
            to="/contact"
            className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-2 rounded-full shadow-lg hover:scale-105 transition-transform duration-300 font-semibold"
          >
            {t("nav.planTrip")}
          </NavLink>
        </div>

        <button
          className="md:hidden text-3xl text-gray-800"
          onClick={() => setOpen((prev) => !prev)}
          aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
        >
          <i className={`fas ${open ? "fa-times" : "fa-bars"}`}></i>
        </button>
      </div>

      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-[620px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white text-gray-900 border-t border-gray-200 shadow-md">
          <div className="flex flex-col gap-6 p-6">
            <MobileNavItem to="/" setOpen={setOpen}>
              {t("nav.home")}
            </MobileNavItem>
            <MobileNavItem to="/destinations" setOpen={setOpen}>
              {t("nav.destinations")}
            </MobileNavItem>
            <MobileNavItem to="/stays" setOpen={setOpen}>
              {t("nav.stays")}
            </MobileNavItem>
            <MobileNavItem to="/experiences" setOpen={setOpen}>
              {t("nav.experiences")}
            </MobileNavItem>
            <MobileNavItem to="/about" setOpen={setOpen}>
              {t("nav.about")}
            </MobileNavItem>
            <MobileNavItem to="/contact" setOpen={setOpen}>
              {t("nav.contact")}
            </MobileNavItem>

            <LanguagePicker
              language={language}
              setLanguage={setLanguage}
              languages={languages}
              label={t("nav.language")}
            />

            <NavLink
              to="/contact"
              onClick={() => setOpen(false)}
              className="mt-2 bg-gradient-to-r from-primary to-secondary text-white py-3 rounded-full shadow-lg transition-transform duration-300 font-semibold text-center"
            >
              {t("nav.planTrip")}
            </NavLink>
          </div>
        </div>
      </div>
    </nav>
  );
};

const NavItem = ({ to, children }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `font-medium text-gray-700 hover:text-primary transition-colors duration-300 ${
        isActive ? "text-primary font-semibold" : ""
      }`
    }
  >
    {children}
  </NavLink>
);

const MobileNavItem = ({ to, children, setOpen }) => (
  <NavLink
    to={to}
    onClick={() => setOpen(false)}
    className="text-lg font-medium text-gray-700 hover:text-primary transition-colors duration-300"
  >
    {children}
  </NavLink>
);

export default Navbar;
