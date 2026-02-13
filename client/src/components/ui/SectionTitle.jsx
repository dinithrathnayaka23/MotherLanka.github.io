const SectionTitle = ({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className = "",
}) => {
  const alignClass =
    align === "left" ? "text-left items-start" : "text-center items-center";

  return (
    <div className={`flex flex-col gap-3 ${alignClass} ${className}`}>
      {eyebrow && (
        <span className="text-primary font-semibold uppercase tracking-wide text-xs">
          {eyebrow}
        </span>
      )}
      <h2 className="text-3xl md:text-4xl font-extrabold text-textDark">
        {title}
      </h2>
      {subtitle && (
        <p className="max-w-2xl text-gray-600 text-base md:text-lg">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default SectionTitle;
