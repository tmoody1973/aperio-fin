import React, { useState, useEffect, useRef } from "react";
import { cn } from "../../lib/utils";

export const BentoGrid = ({ className, children, "aria-label": ariaLabel = "Dashboard items" }) => {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const gridRef = useRef(null);
  const itemRefs = useRef([]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    const items = React.Children.toArray(children);
    const itemCount = items.length;
    let newIndex = focusedIndex;

    switch (e.key) {
      case 'ArrowLeft':
        e.preventDefault();
        newIndex = Math.max(0, focusedIndex - 1);
        break;
      case 'ArrowRight':
        e.preventDefault();
        newIndex = Math.min(itemCount - 1, focusedIndex + 1);
        break;
      case 'ArrowUp':
        e.preventDefault();
        // Calculate items per row based on grid columns
        const cols = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1;
        newIndex = Math.max(0, focusedIndex - cols);
        break;
      case 'ArrowDown':
        e.preventDefault();
        const colsDown = window.innerWidth >= 1024 ? 4 : window.innerWidth >= 768 ? 2 : 1;
        newIndex = Math.min(itemCount - 1, focusedIndex + colsDown);
        break;
      case 'Home':
        e.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        e.preventDefault();
        newIndex = itemCount - 1;
        break;
      default:
        return;
    }

    if (newIndex !== focusedIndex) {
      setFocusedIndex(newIndex);
      // Focus the new item
      if (itemRefs.current[newIndex]) {
        itemRefs.current[newIndex].focus();
      }
    }
  };

  // Clone children and pass props for focus management
  const enhancedChildren = React.Children.map(children, (child, index) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        tabIndex: index === focusedIndex ? 0 : -1,
        onFocus: () => setFocusedIndex(index),
        ref: (el) => { itemRefs.current[index] = el; },
        'data-grid-index': index,
      });
    }
    return child;
  });

  return (
    <div
      ref={gridRef}
      role="grid"
      aria-label={ariaLabel}
      className={cn(
        "bento-grid max-w-7xl mx-auto focus-visible:outline-none",
        className
      )}
      onKeyDown={handleKeyDown}
    >
      {enhancedChildren}
    </div>
  );
};

export const BentoGridItem = React.forwardRef(({
  className,
  title,
  description,
  header,
  icon,
  onClick,
  children,
  href,
  as: Component = 'div',
  tabIndex,
  onFocus,
  'data-grid-index': gridIndex,
  ...otherProps
}, ref) => {
  const handleKeyDown = (e) => {
    // Handle Enter/Space for activation if it's interactive
    if ((e.key === 'Enter' || e.key === ' ') && (href || onClick)) {
      e.preventDefault();
      if (href) {
        window.location.href = href;
      } else if (onClick) {
        onClick(e);
      }
    }
  };

  const content = (
    <div className="flex flex-col h-full">
      {header && <div className="flex-1 mb-4">{header}</div>}
      {children && <div className="flex-1">{children}</div>}

      <div className="mt-auto">
        {icon && (
          <div className="mb-3">
            {icon}
          </div>
        )}
        <div className="headline-secondary text-lg mb-2 group-hover/bento:text-aperio-blue transition-colors">
          {title}
        </div>
        <div className="caption text-gray-600 text-sm leading-relaxed">
          {description}
        </div>
      </div>
    </div>
  );

  const baseClasses = cn(
    "bento-grid-item group/bento focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-aperio-blue",
    className
  );

  // If href is provided and Component is 'a', render as anchor
  if (Component === 'a' && href) {
    return (
      <a
        ref={ref}
        href={href}
        className={baseClasses}
        onClick={onClick}
        role="gridcell"
        tabIndex={tabIndex}
        onFocus={onFocus}
        onKeyDown={handleKeyDown}
        data-grid-index={gridIndex}
        {...otherProps}
      >
        {content}
      </a>
    );
  }

  // Otherwise render as specified component (default div)
  return (
    <Component
      ref={ref}
      className={baseClasses}
      onClick={onClick}
      role="gridcell"
      tabIndex={tabIndex}
      onFocus={onFocus}
      onKeyDown={handleKeyDown}
      data-grid-index={gridIndex}
      {...otherProps}
    >
      {content}
    </Component>
  );
});

BentoGridItem.displayName = 'BentoGridItem';