import { useLanguage } from "../../context/LanguageContext";

const destinations = [
  { name: "Ella", image: "https://www.erikastravels.com/wp-content/uploads/2017/10/9-Arch-Bridge-Train.jpg" },
  { name: "Sigiriya", image: "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/0f/ed/85/6b/um-palacio-no-topo-da.jpg?w=900&h=500&s=1" },
  { name: "Mirissa", image: "https://digitaltravelcouple.com/wp-content/uploads/2020/01/mirissa-beach-sri-lanka-1.jpg" },
  { name: "Anuradhapura", image: "https://cdn.prod.website-files.com/6364d88dd010ce5c6f8aa8fc/669645594428554919c6827c_Anuradhapura.jpg"},
  { name: "Kandy" , image: "https://whc.unesco.org/uploads/thumbs/site_0450_0020-1200-630-20151105154018.jpg"},
  { name: "Nuwara Eliya" , image: "https://lakpura.com/cdn/shop/files/LK951R0000-10-E_4fb5ce5e-c060-481b-9ee3-429c7a3a7b72.jpg?v=1689939550&width=3840"},
  { name: "Galle" , image: "https://jetwingtravels.com/wp-content/uploads/2023/08/Galle-Fort.jpg"},
  { name: "Polonnaruwa" , image: "https://www.andbeyond.com/wp-content/uploads/sites/5/Royal-Palace-of-King-Parakramabahu-in-the-world-heritage-city-Polonnaruwa-Sri-Lanka.jpg"},
  { name: "Sinharaja" , image: "https://airlinescrewtours.com/wp-content/uploads/2022/09/Si2.jpg"}
];

const FeaturedDestinations = () => {
  const { t } = useLanguage();

  return (
    <section className="bg-gradient-to-b from-primary/5 via-secondary/5 to-accent/5 py-20">
      <div className="max-w-7xl mx-auto px-6">
        
        <h2 className="text-3xl md:text-4xl font-extrabold text-textDark mb-16 text-center">
          {t("home.featuredDestinations.title")}
        </h2>

        <div className="grid md:grid-cols-3 gap-8">
          {destinations.map((place, i) => (
            <div
              key={i}
              className="relative rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-500 cursor-pointer"
            >
              <img
                src={place.image}
                alt={place.name}
                className="h-64 w-full object-cover transition-transform duration-500 hover:scale-110"
              />
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-6">
                <h3 className="text-white text-xl md:text-2xl font-semibold">
                  {place.name}
                </h3>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedDestinations;
