import { useEffect, useId, useRef, useState } from "react";
import styled from "styled-components";
import { FiArrowDown, FiArrowUp, FiCheck, FiChevronDown } from "react-icons/fi";
import { TbSortAscendingLetters, TbSortDescendingLetters } from "react-icons/tb";

const OPTIONS = [
  { value: "lowest", label: "Price: low to high", hint: "Cheapest posters first", icon: FiArrowUp },
  { value: "highest", label: "Price: high to low", hint: "Premium picks first", icon: FiArrowDown },
  { value: "a-z", label: "Name: A to Z", hint: "Alphabetical", icon: TbSortAscendingLetters },
  { value: "z-a", label: "Name: Z to A", hint: "Reverse alphabetical", icon: TbSortDescendingLetters },
];

// Sort dropdown in the shop's style (the native <select> list can't be styled).
// Keyboard: Enter/Space/arrows open it, arrows/Home/End move, Enter picks, Esc closes.
const SortMenu = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const rootRef = useRef(null);
  const buttonRef = useRef(null);
  const listId = useId();
  const selectedIndex = Math.max(0, OPTIONS.findIndex((option) => option.value === value));
  const selected = OPTIONS[selectedIndex];

  useEffect(() => {
    if (!open) return undefined;
    const closeOnOutsideClick = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", closeOnOutsideClick);
    document.addEventListener("touchstart", closeOnOutsideClick);
    return () => {
      document.removeEventListener("mousedown", closeOnOutsideClick);
      document.removeEventListener("touchstart", closeOnOutsideClick);
    };
  }, [open]);

  const openMenu = () => {
    setActiveIndex(selectedIndex);
    setOpen(true);
  };

  const choose = (index) => {
    onChange(OPTIONS[index].value);
    setOpen(false);
    buttonRef.current?.focus();
  };

  const handleKeyDown = (event) => {
    if (!open) {
      if (["ArrowDown", "ArrowUp", "Enter", " "].includes(event.key)) {
        event.preventDefault();
        openMenu();
      }
      return;
    }

    const last = OPTIONS.length - 1;
    const moves = {
      ArrowDown: () => setActiveIndex((index) => (index === last ? 0 : index + 1)),
      ArrowUp: () => setActiveIndex((index) => (index === 0 ? last : index - 1)),
      Home: () => setActiveIndex(0),
      End: () => setActiveIndex(last),
      Enter: () => choose(activeIndex),
      " ": () => choose(activeIndex),
      Escape: () => setOpen(false),
      Tab: () => setOpen(false),
    };
    if (moves[event.key]) {
      if (event.key !== "Tab") event.preventDefault();
      moves[event.key]();
    }
  };

  const SelectedIcon = selected.icon;

  return (
    <Wrapper ref={rootRef}>
      <button
        ref={buttonRef}
        type="button"
        id="sort"
        className={open ? "sort-trigger is-open" : "sort-trigger"}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => (open ? setOpen(false) : openMenu())}
        onKeyDown={handleKeyDown}>
        <SelectedIcon className="trigger-icon" aria-hidden="true" />
        <span className="trigger-label">{selected.label}</span>
        <FiChevronDown className="trigger-chevron" aria-hidden="true" />
      </button>

      {open && (
        <ul className="sort-menu" id={listId} role="listbox" aria-label="Sort products">
          {OPTIONS.map((option, index) => {
            const Icon = option.icon;
            const isSelected = index === selectedIndex;
            return (
              <li
                key={option.value}
                id={`${listId}-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`sort-option${index === activeIndex ? " is-active" : ""}${isSelected ? " is-selected" : ""}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseDown={(event) => event.preventDefault()}
                onClick={() => choose(index)}>
                <span className="option-icon" aria-hidden="true">
                  <Icon />
                </span>
                <span className="option-text">
                  <strong>{option.label}</strong>
                  <small>{option.hint}</small>
                </span>
                {isSelected && <FiCheck className="option-check" aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
      )}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  position: relative;
  width: 100%;

  .sort-trigger {
    width: 100%;
    min-width: 21rem;
    height: 4.1rem;
    display: flex;
    align-items: center;
    gap: 0.9rem;
    padding: 0 1.2rem 0 1.3rem;
    border: 1px solid #dfd1c2;
    border-radius: 1.2rem;
    background: #fff;
    color: #231f20;
    font: inherit;
    font-size: 1.4rem;
    font-weight: 600;
    text-transform: none;
    cursor: pointer;
    transition: border-color 0.2s ease, box-shadow 0.2s ease;
  }

  .sort-trigger:hover {
    border-color: #c9ad92;
  }

  .sort-trigger:focus {
    outline: none;
  }

  .sort-trigger:focus-visible,
  .sort-trigger.is-open {
    border-color: #231f20;
    box-shadow: 0 0 0 3px rgba(207, 109, 63, 0.18);
  }

  .trigger-icon {
    color: #cf6d3f;
    font-size: 1.6rem;
    flex-shrink: 0;
  }

  .trigger-label {
    flex: 1;
    text-align: left;
    white-space: nowrap;
  }

  .trigger-chevron {
    color: #8a5c43;
    font-size: 1.8rem;
    flex-shrink: 0;
    transition: transform 0.2s ease;
  }

  .is-open .trigger-chevron {
    transform: rotate(180deg);
  }

  .sort-menu {
    position: absolute;
    top: calc(100% + 0.8rem);
    right: 0;
    z-index: 30;
    width: max(100%, 28rem);
    margin: 0;
    padding: 0.6rem;
    list-style: none;
    background: #fffaf3;
    border: 1px solid #eadfce;
    border-radius: 1.6rem;
    box-shadow: 0 20px 40px rgba(40, 24, 14, 0.16), 0 2px 6px rgba(40, 24, 14, 0.06);
    animation: menuIn 0.16s ease-out;
    transform-origin: top right;
  }

  .sort-option {
    display: flex;
    align-items: center;
    gap: 1.1rem;
    padding: 0.9rem 1rem;
    border-radius: 1.1rem;
    cursor: pointer;
    color: #3f3833;
  }

  .sort-option.is-active {
    background: #f4e9dc;
  }

  .option-icon {
    width: 3.2rem;
    height: 3.2rem;
    flex-shrink: 0;
    border-radius: 0.9rem;
    display: grid;
    place-items: center;
    background: #fff;
    border: 1px solid #eadfce;
    color: #8a5c43;
    font-size: 1.6rem;
  }

  .is-selected .option-icon {
    background: #231f20;
    border-color: #231f20;
    color: #fff;
  }

  .option-text {
    flex: 1;
    display: grid;
    gap: 0.1rem;
  }

  .option-text strong {
    font-size: 1.4rem;
    font-weight: 600;
    color: #231f20;
  }

  .option-text small {
    font-size: 1.2rem;
    color: #8a7c70;
  }

  .option-check {
    color: #cf6d3f;
    font-size: 1.8rem;
    flex-shrink: 0;
  }

  @keyframes menuIn {
    from {
      opacity: 0;
      transform: translateY(-4px) scale(0.98);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .sort-menu {
      animation: none;
    }
  }

  @media (max-width: ${({ theme }) => theme.media.mobile}) {
    .sort-trigger {
      min-width: 0;
      height: 4.6rem;
    }

    .sort-menu {
      width: 100%;
      left: 0;
      right: auto;
    }
  }
`;

export default SortMenu;
