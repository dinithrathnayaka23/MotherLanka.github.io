const PageHeader = ({ title, highlight, subtitle, children }) => {
  return (
    <section className="bg-gradient-to-r from-primary/10 via-secondary/10 to-accent/10 py-24">
      <div className="max-w-7xl mx-auto px-6 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-extrabold text-textDark leading-tight">
          {title} {highlight && <span className="text-primary">{highlight}</span>}
        </h1>
        {subtitle && (
          <p className="mt-4 text-gray-700 text-lg md:text-xl max-w-3xl">
            {subtitle}
          </p>
        )}
        {children}
      </div>
    </section>
  );
};

export default PageHeader;
