export const SUPPORTED_LANGUAGES = [
  { code: "en", label: "English", flagCode: "us" },
  { code: "es", label: "Espanol", flagCode: "es" },
  { code: "fr", label: "Francais", flagCode: "fr" },
  { code: "nl", label: "Dutch", flagCode: "nl" },
  { code: "zh", label: "Chinese", flagCode: "cn" },
  { code: "ja", label: "Japanese", flagCode: "jp" },
  { code: "ko", label: "Korean", flagCode: "kr" },
  { code: "ru", label: "Russian", flagCode: "ru" },
];

const mergeDeep = (base, override) => {
  const output = { ...base };
  Object.keys(override || {}).forEach((key) => {
    const baseVal = base?.[key];
    const overrideVal = override[key];
    if (
      baseVal &&
      overrideVal &&
      typeof baseVal === "object" &&
      typeof overrideVal === "object" &&
      !Array.isArray(baseVal) &&
      !Array.isArray(overrideVal)
    ) {
      output[key] = mergeDeep(baseVal, overrideVal);
    } else {
      output[key] = overrideVal;
    }
  });
  return output;
};

const en = {
  nav: {
    home: "Home",
    destinations: "Destinations",
    stays: "Stays",
    experiences: "Experiences",
    about: "About",
    contact: "Contact",
    planTrip: "Plan Trip",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },
  footer: {
    tagline: "Discover Sri Lanka, crafted for unforgettable journeys.",
    crafted: "Crafted with care for travelers",
  },
  hero: {
    titleLine1: "Discover",
    titleLine2: "The Island of Wonders",
    subtitle:
      "From golden beaches to misty mountains, MotherLanka helps you explore Sri Lanka your way.",
    startExploring: "Start Exploring",
    learnMore: "Learn More",
  },
  home: {
    experienceSelector: {
      title: "Choose Your Experience",
      adventure: "Adventure",
      relax: "Relax",
      culture: "Culture",
      wildlife: "Wildlife",
    },
    featuredDestinations: { title: "Featured Destinations" },
    stats: {
      curatedDestinations: "Curated Destinations",
      verifiedStays: "Verified Stays",
      travelerRating: "Traveler Rating",
      localSupport: "Local Support",
    },
    howItWorks: {
      eyebrow: "How it works",
      title: "Plan your Sri Lanka adventure in minutes",
      subtitle:
        "Everything you need to explore the island - curated, simple, and beautiful.",
      step1Title: "Choose your vibe",
      step1Description: "Pick beaches, hill country, wildlife, or culture.",
      step2Title: "Build your itinerary",
      step2Description: "Mix destinations, stays, and experiences with ease.",
      step3Title: "Travel with confidence",
      step3Description: "Local tips, support, and curated recommendations.",
    },
    testimonials: {
      eyebrow: "Traveler love",
      title: "Stories from the MotherLanka community",
      subtitle: "Real travelers, real memories from Sri Lanka.",
      quote1:
        "The itinerary suggestions were spot on. We discovered hidden cafes and views we never would have found.",
      quote2:
        "Beautiful UI and super helpful for planning our family trip. The stays recommendations were perfect.",
      quote3:
        "Loved the balance between adventure and relaxation. The site feels premium and easy to use.",
    },
    newsletter: {
      eyebrow: "Stay inspired",
      title: "Get fresh Sri Lanka travel ideas",
      subtitle: "Monthly guides, new destinations, and exclusive trip tips.",
      placeholder: "Enter your email",
      subscribe: "Subscribe",
      sending: "Sending...",
      success: "Subscribed successfully.",
      error: "Subscription failed. Try again.",
      disclaimer:
        "By subscribing, you agree to receive occasional updates from MotherLanka.",
    },
  },
  pages: {
    destinations: {
      titlePrefix: "Explore",
      titleHighlight: "Sri Lanka",
      titleSuffix: "Destinations",
      subtitle:
        "Discover Sri Lanka's most beautiful places - from golden beaches to misty mountains and ancient heritage sites.",
      loading: "Loading destinations...",
      loadError: "Unable to load destinations right now.",
    },
    stays: {
      titlePrefix: "Find Your",
      titleHighlight: "Perfect Stay",
      subtitle: "Discover hotels, resorts, and unique stays across Sri Lanka",
      loading: "Loading stays...",
      loadError: "Unable to load stays right now.",
    },
    experiences: {
      titlePrefix: "Explore",
      titleHighlight: "Unforgettable Experiences",
      subtitle:
        "Discover adventures, culture, wildlife, and nature experiences across the beautiful island of Sri Lanka.",
      loading: "Loading experiences...",
      loadError: "Unable to load experiences right now.",
    },
    contact: {
      headerTitle: "Let's plan your",
      headerHighlight: "Sri Lanka journey",
      headerSubtitle:
        "Tell us your travel style and we'll help you build the perfect itinerary.",
    },
    notFound: {
      title: "Page not found",
      description:
        "The page you are looking for does not exist or was moved. Let's get you back on track.",
      backHome: "Back to Home",
      exploreDestinations: "Explore Destinations",
    },
  },
  filters: {
    all: "All",
    filterByCategory: "Filter by category",
    allDestinations: "All destinations",
  },
  cards: {
    explore: "Explore",
    perNight: "/night",
  },
  details: {
    destinationNotFound: "Destination not found",
    destinationNotFoundDesc:
      "We could not find the destination you are looking for.",
    loadingDestination: "Loading destination...",
    aboutDestination: "About {name}",
    bestTimeToVisit: "Best Time to Visit",
    planMyTrip: "Plan My Trip",
    experienceNotFound: "Experience not found",
    experienceNotFoundDesc:
      "We could not find the experience you are looking for.",
    browseExperiences: "Browse Experiences",
    loadingExperience: "Loading experience...",
    easyToBook: "Easy to book",
    highlights: "Highlights",
    whatYouWillDo: "What you will do",
    step: "Step {number}",
    included: "What's included",
    goodToKnow: "Good to know",
    bookNowHint:
      "Book now to reserve your preferred time. We will confirm details by email.",
    durationLabel: "Duration: {duration}",
    fullName: "Full name",
    email: "Email",
    phoneOptional: "Phone (optional)",
    travelDates: "Travel dates",
    guests: "Guests",
    message: "Message",
    sending: "Sending...",
    bookExperience: "Book Experience",
    bookingSent: "Booking request sent.",
    bookingFailed: "Could not submit booking. Try again.",
    stayNotFound: "Stay not found",
    stayNotFoundDesc:
      "We could not find the stay you are looking for. Try exploring other stays.",
    browseStays: "Browse Stays",
    rating: "rating",
    loadingStay: "Loading stay...",
    priceFrom: "Price from",
    bestFor: "Best for",
    couplesFamilies: "Couples & Families",
    scenicViews: "Scenic views",
    whyLove: "Why you will love it",
    amenities: "Amenities",
    houseRules: "House Rules",
    houseRulesDesc:
      "Check-in from 2:00 PM, check-out by 11:00 AM. Quiet hours after 10:00 PM.",
    cancellation: "Cancellation",
    cancellationDesc: "Free cancellation up to 48 hours before arrival.",
    paymentSuccess:
      "Payment received. We'll confirm your booking by email shortly.",
    paymentCancel: "Payment was cancelled. You can try again anytime.",
    address: "Address",
    city: "City",
    country: "Country",
    redirecting: "Redirecting...",
    payDeposit: "Pay Deposit",
    paymentInitFailed: "Payment initialization failed. Please try again.",
    depositHint: "A partial deposit is charged now to secure the booking.",
    similarStays: "Similar stays you may like",
    viewAll: "View all",
  },
  amenities: {
    wifi: "Free WiFi",
    restaurant: "Restaurant",
    pool: "Pool",
    spa: "Spa",
  },
};

const es = mergeDeep(en, {
  nav: {
    home: "Inicio",
    destinations: "Destinos",
    stays: "Alojamientos",
    experiences: "Experiencias",
    about: "Nosotros",
    contact: "Contacto",
    planTrip: "Planear viaje",
    openMenu: "Abrir menu",
    closeMenu: "Cerrar menu",
    language: "Idioma",
  },
  hero: {
    titleLine1: "Descubre",
    titleLine2: "La isla de las maravillas",
    subtitle:
      "Desde playas doradas hasta montanas con niebla, MotherLanka te ayuda a explorar Sri Lanka a tu manera.",
    startExploring: "Comenzar",
    learnMore: "Saber mas",
  },
  home: {
    experienceSelector: {
      title: "Elige tu experiencia",
      adventure: "Aventura",
      relax: "Relax",
      culture: "Cultura",
      wildlife: "Vida salvaje",
    },
    featuredDestinations: { title: "Destinos destacados" },
    stats: {
      curatedDestinations: "Destinos seleccionados",
      verifiedStays: "Alojamientos verificados",
      travelerRating: "Calificacion de viajeros",
      localSupport: "Soporte local",
    },
    howItWorks: {
      eyebrow: "Como funciona",
      title: "Planifica tu aventura en Sri Lanka en minutos",
      subtitle:
        "Todo lo que necesitas para explorar la isla: simple y bien seleccionado.",
      step1Title: "Elige tu estilo",
      step1Description: "Playa, montana, vida salvaje o cultura.",
      step2Title: "Crea tu itinerario",
      step2Description:
        "Combina destinos, alojamientos y experiencias con facilidad.",
      step3Title: "Viaja con confianza",
      step3Description: "Consejos locales, soporte y recomendaciones.",
    },
    testimonials: {
      eyebrow: "Opiniones",
      title: "Historias de la comunidad MotherLanka",
      subtitle: "Viajeros reales, recuerdos reales de Sri Lanka.",
      quote1:
        "Las sugerencias fueron precisas. Descubrimos lugares ocultos increibles.",
      quote2:
        "Interfaz hermosa y muy util para planificar el viaje familiar.",
      quote3:
        "Excelente equilibrio entre aventura y relax. Sitio premium y facil.",
    },
    newsletter: {
      eyebrow: "Mantente inspirado",
      title: "Recibe nuevas ideas de viaje en Sri Lanka",
      subtitle: "Guias mensuales, destinos nuevos y consejos exclusivos.",
      placeholder: "Ingresa tu correo",
      subscribe: "Suscribirse",
      sending: "Enviando...",
      success: "Suscripcion completada.",
      error: "La suscripcion fallo. Intenta de nuevo.",
      disclaimer:
        "Al suscribirte, aceptas recibir actualizaciones ocasionales de MotherLanka.",
    },
  },
  pages: {
    destinations: {
      titlePrefix: "Explora",
      titleSuffix: "destinos",
      subtitle:
        "Descubre los lugares mas bellos de Sri Lanka: playas, montanas y patrimonio.",
      loading: "Cargando destinos...",
      loadError: "No se pudieron cargar los destinos.",
    },
    stays: {
      titlePrefix: "Encuentra tu",
      titleHighlight: "estadia perfecta",
      subtitle: "Descubre hoteles, resorts y alojamientos unicos en Sri Lanka",
      loading: "Cargando alojamientos...",
      loadError: "No se pudieron cargar los alojamientos.",
    },
    experiences: {
      titleHighlight: "experiencias inolvidables",
      subtitle:
        "Aventura, cultura, vida salvaje y naturaleza por toda Sri Lanka.",
      loading: "Cargando experiencias...",
      loadError: "No se pudieron cargar las experiencias.",
    },
    contact: {
      headerTitle: "Planifiquemos tu",
      headerHighlight: "viaje por Sri Lanka",
      headerSubtitle:
        "Cuentanos tu estilo de viaje y te ayudaremos a crear el itinerario ideal.",
    },
    notFound: {
      title: "Pagina no encontrada",
      description:
        "La pagina que buscas no existe o fue movida. Volvamos al camino.",
      backHome: "Volver al inicio",
      exploreDestinations: "Explorar destinos",
    },
  },
  filters: { all: "Todo", filterByCategory: "Filtrar por categoria" },
  cards: { explore: "Explorar", perNight: "/noche" },
});

const fr = mergeDeep(en, {
  nav: {
    home: "Accueil",
    destinations: "Destinations",
    stays: "Sejours",
    experiences: "Experiences",
    about: "A propos",
    contact: "Contact",
    planTrip: "Planifier le voyage",
    openMenu: "Ouvrir le menu",
    closeMenu: "Fermer le menu",
    language: "Langue",
  },
  hero: {
    titleLine1: "Decouvrez",
    titleLine2: "L ile des merveilles",
    subtitle:
      "Des plages dorees aux montagnes brumeuses, MotherLanka vous aide a explorer le Sri Lanka a votre facon.",
    startExploring: "Commencer",
    learnMore: "En savoir plus",
  },
  home: {
    experienceSelector: {
      title: "Choisissez votre experience",
      adventure: "Aventure",
      relax: "Detente",
      culture: "Culture",
      wildlife: "Faune",
    },
    featuredDestinations: { title: "Destinations a la une" },
    stats: {
      curatedDestinations: "Destinations selectionnees",
      verifiedStays: "Sejours verifies",
      travelerRating: "Note des voyageurs",
      localSupport: "Support local",
    },
    howItWorks: {
      eyebrow: "Comment ca marche",
      title: "Planifiez votre aventure au Sri Lanka en quelques minutes",
      subtitle:
        "Tout ce qu il faut pour explorer l ile: simple, beau et utile.",
      step1Title: "Choisissez votre style",
      step1Description: "Plages, montagnes, faune ou culture.",
      step2Title: "Creez votre itineraire",
      step2Description:
        "Combinez destinations, sejours et experiences facilement.",
      step3Title: "Voyagez en confiance",
      step3Description: "Conseils locaux, support et recommandations.",
    },
    testimonials: {
      eyebrow: "Avis voyageurs",
      title: "Histoires de la communaute MotherLanka",
      subtitle: "De vrais voyageurs, de vrais souvenirs du Sri Lanka.",
      quote1:
        "Les suggestions etaient excellentes. Nous avons trouve des lieux caches magnifiques.",
      quote2:
        "Interface superbe et tres pratique pour organiser un voyage en famille.",
      quote3:
        "Excellent equilibre entre aventure et detente. Le site est premium et facile.",
    },
    newsletter: {
      eyebrow: "Restez inspire",
      title: "Recevez de nouvelles idees de voyage au Sri Lanka",
      subtitle: "Guides mensuels, nouveaux lieux et conseils exclusifs.",
      placeholder: "Entrez votre email",
      subscribe: "S abonner",
      sending: "Envoi...",
      success: "Abonnement reussi.",
      error: "Echec de l abonnement. Reessayez.",
      disclaimer:
        "En vous abonnant, vous acceptez de recevoir des mises a jour de MotherLanka.",
    },
  },
  pages: {
    destinations: {
      titlePrefix: "Explorez",
      titleSuffix: "destinations",
      subtitle:
        "Decouvrez les plus beaux endroits du Sri Lanka: plages, montagnes et heritage.",
      loading: "Chargement des destinations...",
      loadError: "Impossible de charger les destinations.",
    },
    stays: {
      titlePrefix: "Trouvez votre",
      titleHighlight: "sejour ideal",
      subtitle: "Hotels, resorts et sejours uniques au Sri Lanka",
      loading: "Chargement des sejours...",
      loadError: "Impossible de charger les sejours.",
    },
    experiences: {
      titleHighlight: "des experiences inoubliables",
      subtitle: "Aventure, culture, nature et faune a travers le Sri Lanka.",
      loading: "Chargement des experiences...",
      loadError: "Impossible de charger les experiences.",
    },
    contact: {
      headerTitle: "Planifions votre",
      headerHighlight: "voyage au Sri Lanka",
      headerSubtitle:
        "Parlez de votre style de voyage et nous vous aiderons avec l itineraire ideal.",
    },
    notFound: {
      title: "Page introuvable",
      description:
        "La page recherchee n existe pas ou a ete deplacee. Revenons en arriere.",
      backHome: "Retour a l accueil",
      exploreDestinations: "Explorer les destinations",
    },
  },
  filters: { all: "Tout", filterByCategory: "Filtrer par categorie" },
  cards: { explore: "Explorer", perNight: "/nuit" },
});

const nl = mergeDeep(en, {
  nav: {
    home: "Home",
    destinations: "Bestemmingen",
    stays: "Verblijven",
    experiences: "Ervaringen",
    about: "Over ons",
    contact: "Contact",
    planTrip: "Plan reis",
    openMenu: "Menu openen",
    closeMenu: "Menu sluiten",
    language: "Taal",
  },
  hero: {
    titleLine1: "Ontdek",
    titleLine2: "Het eiland van wonderen",
    subtitle:
      "Van gouden stranden tot mistige bergen, MotherLanka helpt je Sri Lanka op jouw manier te verkennen.",
    startExploring: "Start verkennen",
    learnMore: "Meer info",
  },
  home: {
    experienceSelector: {
      title: "Kies jouw ervaring",
      adventure: "Avontuur",
      relax: "Ontspanning",
      culture: "Cultuur",
      wildlife: "Wilde dieren",
    },
    featuredDestinations: { title: "Uitgelichte bestemmingen" },
    stats: {
      curatedDestinations: "Geselecteerde bestemmingen",
      verifiedStays: "Geverifieerde verblijven",
      travelerRating: "Reizigersscore",
      localSupport: "Lokale ondersteuning",
    },
    howItWorks: {
      eyebrow: "Hoe het werkt",
      title: "Plan je Sri Lanka avontuur in minuten",
      subtitle: "Alles wat je nodig hebt om het eiland te ontdekken.",
      step1Title: "Kies je stijl",
      step1Description: "Stranden, hooglanden, wildlife of cultuur.",
      step2Title: "Bouw je route",
      step2Description:
        "Combineer bestemmingen, verblijven en ervaringen eenvoudig.",
      step3Title: "Reis met vertrouwen",
      step3Description: "Lokale tips, support en aanbevelingen.",
    },
    testimonials: {
      eyebrow: "Reizigersverhalen",
      title: "Verhalen van de MotherLanka community",
      subtitle: "Echte reizigers, echte herinneringen aan Sri Lanka.",
      quote1:
        "De routevoorstellen waren perfect. We ontdekten verborgen plekken.",
      quote2:
        "Mooie interface en heel handig voor onze gezinsreisplanning.",
      quote3:
        "Fijne balans tussen avontuur en rust. Gebruiksvriendelijk en strak.",
    },
    newsletter: {
      eyebrow: "Blijf geinspireerd",
      title: "Ontvang nieuwe Sri Lanka reisideeen",
      subtitle: "Maandelijkse gidsen, nieuwe plekken en exclusieve tips.",
      placeholder: "Voer je e-mail in",
      subscribe: "Abonneren",
      sending: "Verzenden...",
      success: "Succesvol geabonneerd.",
      error: "Abonneren mislukt. Probeer opnieuw.",
      disclaimer:
        "Door te abonneren ga je akkoord met updates van MotherLanka.",
    },
  },
  pages: {
    destinations: {
      titlePrefix: "Verken",
      titleSuffix: "bestemmingen",
      subtitle:
        "Ontdek de mooiste plekken van Sri Lanka: stranden, bergen en erfgoed.",
      loading: "Bestemmingen laden...",
      loadError: "Bestemmingen konden niet worden geladen.",
    },
    stays: {
      titlePrefix: "Vind jouw",
      titleHighlight: "perfecte verblijf",
      subtitle: "Hotels, resorts en unieke verblijven in Sri Lanka",
      loading: "Verblijven laden...",
      loadError: "Verblijven konden niet worden geladen.",
    },
    experiences: {
      titleHighlight: "onvergetelijke ervaringen",
      subtitle: "Avontuur, cultuur, natuur en wildlife in Sri Lanka.",
      loading: "Ervaringen laden...",
      loadError: "Ervaringen konden niet worden geladen.",
    },
    contact: {
      headerTitle: "Laten we jouw",
      headerHighlight: "Sri Lanka reis plannen",
      headerSubtitle:
        "Vertel je reisstijl en wij helpen met het perfecte schema.",
    },
    notFound: {
      title: "Pagina niet gevonden",
      description:
        "De pagina bestaat niet of is verplaatst. We brengen je terug op weg.",
      backHome: "Terug naar home",
      exploreDestinations: "Bestemmingen verkennen",
    },
  },
  filters: { all: "Alles", filterByCategory: "Filter op categorie" },
  cards: { explore: "Verkennen", perNight: "/nacht" },
});

const zh = mergeDeep(en, {});

const ja = mergeDeep(en, {});

const ko = mergeDeep(en, {});

const ru = mergeDeep(en, {});

export const translations = { en, es, fr, nl, zh, ja, ko, ru };
