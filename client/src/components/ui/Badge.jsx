const styles = {
  primary: "bg-primary/10 text-primary",
  success: "bg-emerald-100 text-emerald-700",
  neutral: "bg-gray-100 text-gray-700",
};

const Badge = ({ children, variant = "primary", className = "" }) => {
  return (
    <span
      className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${styles[variant]} ${className}`}
    >
      {children}
    </span>
  );
};

export default Badge;
