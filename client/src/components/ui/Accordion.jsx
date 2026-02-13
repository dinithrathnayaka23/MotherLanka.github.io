import { useState } from "react";

const AccordionItem = ({ title, body, isOpen, onToggle }) => {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all duration-300 hover:shadow-md">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="text-base font-semibold text-textDark">{title}</span>
        <span className="text-primary">
          <i className={`fas ${isOpen ? "fa-minus" : "fa-plus"}`} />
        </span>
      </button>
      {isOpen && <p className="mt-4 text-sm text-gray-600">{body}</p>}
    </div>
  );
};

const Accordion = ({ items = [] }) => {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="grid gap-4">
      {items.map((item, index) => (
        <AccordionItem
          key={index}
          title={item.title}
          body={item.body}
          isOpen={openIndex === index}
          onToggle={() =>
            setOpenIndex(openIndex === index ? -1 : index)
          }
        />
      ))}
    </div>
  );
};

export default Accordion;
