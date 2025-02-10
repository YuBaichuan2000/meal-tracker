"use client";

import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandItem,
  CommandEmpty,
  CommandList,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";
import { Command as CommandPrimitive } from "cmdk";
import { X as RemoveIcon, Check } from "lucide-react";
import React, {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useState,
  useRef,
} from "react";

const MultiSelectContext = createContext(null);

const useMultiSelect = () => {
  const context = useContext(MultiSelectContext);
  if (!context) {
    throw new Error("useMultiSelect must be used within MultiSelectProvider");
  }
  return context;
};

const MultiSelector = ({
  values,
  onValuesChange,
  loop = false,
  className,
  children,
  dir,
  ...props
}) => {
  const [inputValue, setInputValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const inputRef = useRef(null);
  const [isValueSelected, setIsValueSelected] = useState(false);
  const [selectedValue, setSelectedValue] = useState("");

  const onValueChangeHandler = useCallback(
    (val) => {
      if (values.includes(val)) {
        onValuesChange(values.filter((item) => item !== val));
      } else {
        onValuesChange([...values, val]);
      }
    },
    [values, onValuesChange]
  );

  const handleSelect = useCallback(
    (e) => {
      // (Optional) This function can be used to track text selection,
      // but it is not necessary for normal typing.
      e.preventDefault();
      const target = e.currentTarget;
      const selection = target.value.substring(
        target.selectionStart || 0,
        target.selectionEnd || 0
      );
      setSelectedValue(selection);
      setIsValueSelected(selection === inputValue);
    },
    [inputValue]
  );

  const handleKeyDown = useCallback(
    (e) => {
      e.stopPropagation();
      const target = inputRef.current;
      if (!target) return;

      const moveNext = () => {
        const nextIndex = activeIndex + 1;
        setActiveIndex(nextIndex > values.length - 1 ? (loop ? 0 : -1) : nextIndex);
      };

      const movePrev = () => {
        const prevIndex = activeIndex - 1;
        setActiveIndex(prevIndex < 0 ? values.length - 1 : prevIndex);
      };

      const moveCurrent = () => {
        const newIndex =
          activeIndex - 1 <= 0 ? (values.length - 1 === 0 ? -1 : 0) : activeIndex - 1;
        setActiveIndex(newIndex);
      };

      switch (e.key) {
        case "ArrowLeft":
          if (dir === "rtl") {
            if (values.length > 0 && (activeIndex !== -1 || loop)) {
              moveNext();
            }
          } else if (values.length > 0 && target.selectionStart === 0) {
            movePrev();
          }
          break;

        case "ArrowRight":
          if (dir === "rtl") {
            if (values.length > 0 && target.selectionStart === 0) {
              movePrev();
            }
          } else if (values.length > 0 && (activeIndex !== -1 || loop)) {
            moveNext();
          }
          break;

        case "Backspace":
        case "Delete":
          if (values.length > 0) {
            if (activeIndex !== -1 && activeIndex < values.length) {
              onValueChangeHandler(values[activeIndex]);
              moveCurrent();
            } else if (target.selectionStart === 0) {
              if (selectedValue === inputValue || isValueSelected) {
                onValueChangeHandler(values[values.length - 1]);
              }
            }
          }
          break;

        case "Enter":
          setOpen(true);
          break;

        case "Escape":
          if (activeIndex !== -1) {
            setActiveIndex(-1);
          } else if (open) {
            setOpen(false);
          }
          break;
      }
    },
    [
      values,
      inputValue,
      activeIndex,
      loop,
      dir,
      onValueChangeHandler,
      selectedValue,
      isValueSelected,
    ]
  );

  return (
    <MultiSelectContext.Provider
      value={{
        values,
        onValuesChange: onValueChangeHandler,
        open,
        setOpen,
        inputValue,
        setInputValue,
        activeIndex,
        setActiveIndex,
        ref: inputRef,
        handleSelect,
      }}
    >
      <Command
        onKeyDown={handleKeyDown}
        className={cn(
          "overflow-visible bg-transparent flex flex-col space-y-2",
          className
        )}
        dir={dir}
        {...props}
      >
        {children}
      </Command>
    </MultiSelectContext.Provider>
  );
};

const MultiSelectorTrigger = forwardRef(
  ({ className, children, ...props }, ref) => {
    const { values, onValuesChange, activeIndex } = useMultiSelect();

    // Prevent input blur when clicking on a badge
    const handleMouseDown = useCallback((e) => {
      e.preventDefault();
    }, []);

    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-wrap gap-1 p-1 py-2 ring-1 ring-muted rounded-lg bg-background",
          className
        )}
        {...props}
      >
        {values.map((item, index) => (
          <Badge
            key={item}
            className={cn(
              "px-1 rounded-xl flex items-center gap-1",
              activeIndex === index && "ring-2"
            )}
          >
            <span className="text-xs">{item}</span>
            <button
              aria-label={`Remove ${item} option`}
              type="button"
              onMouseDown={handleMouseDown}
              onClick={() => onValuesChange(item)}
            >
              <RemoveIcon className="h-4 w-4 hover:stroke-destructive" />
            </button>
          </Badge>
        ))}
        {children}
      </div>
    );
  }
);
MultiSelectorTrigger.displayName = "MultiSelectorTrigger";

const MultiSelectorInput = forwardRef(({ className, ...props }, ref) => {
  const {
    setOpen,
    inputValue,
    setInputValue,
    setActiveIndex,
    ref: inputRef,
  } = useMultiSelect();

  return (
    <CommandPrimitive.Input
      {...props}
      tabIndex={0}
      ref={inputRef}
      value={inputValue}
      onChange={(e) => setInputValue(e.target.value)}
      // Removed onSelect for normal typing
      onBlur={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onClick={() => setActiveIndex(-1)}
      className={cn(
        "ml-2 bg-transparent outline-none placeholder:text-muted-foreground flex-1",
        className
      )}
    />
  );
});
MultiSelectorInput.displayName = "MultiSelectorInput";

const MultiSelectorContent = forwardRef(({ children }, ref) => {
  const { open } = useMultiSelect();
  return <div ref={ref} className="relative">{open && children}</div>;
});
MultiSelectorContent.displayName = "MultiSelectorContent";

const MultiSelectorList = forwardRef(({ className, children }, ref) => (
  <CommandList
    ref={ref}
    className={cn(
      "p-2 flex flex-col gap-2 rounded-md scrollbar-thin scrollbar-track-transparent transition-colors w-full absolute bg-background shadow-md z-10 border border-muted top-0",
      className
    )}
  >
    {children}
    <CommandEmpty>
      <span className="text-muted-foreground">No results found</span>
    </CommandEmpty>
  </CommandList>
));
MultiSelectorList.displayName = "MultiSelectorList";

const MultiSelectorItem = forwardRef(({ value, children, ...props }, ref) => {
  const { values, onValuesChange, setInputValue } = useMultiSelect();
  const isIncluded = values.includes(value);

  // Prevent input blur when clicking on an item
  const handleMouseDown = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <CommandItem
      ref={ref}
      {...props}
      onMouseDown={handleMouseDown}
      onSelect={() => {
        onValuesChange(value);
        setInputValue("");
      }}
      className={cn(
        "rounded-md cursor-pointer px-2 py-1",
        isIncluded && "opacity-50"
      )}
    >
      {children}
      {isIncluded && <Check className="h-4 w-4" />}
    </CommandItem>
  );
});
MultiSelectorItem.displayName = "MultiSelectorItem";

export {
  MultiSelector,
  MultiSelectorTrigger,
  MultiSelectorInput,
  MultiSelectorContent,
  MultiSelectorList,
  MultiSelectorItem,
};
