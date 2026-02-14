// FIXED UI COMPONENT LIBRARY
// These components are NEVER modified by AI
// AI can only SELECT and COMPOSE them

import React from "react";

// ========== LAYOUT COMPONENTS ==========

interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  className?: string;
}

export function Container({
  children,
  maxWidth = "xl",
  className = "",
}: ContainerProps) {
  const widthClasses = {
    sm: "max-w-screen-sm",
    md: "max-w-screen-md",
    lg: "max-w-screen-lg",
    xl: "max-w-screen-xl",
    "2xl": "max-w-screen-2xl",
    full: "max-w-full",
  };

  return (
    <div className={`mx-auto px-4 ${widthClasses[maxWidth]} ${className}`}>
      {children}
    </div>
  );
}

interface GridProps {
  children: React.ReactNode;
  cols?: "1" | "2" | "3" | "4" | "6" | "12";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function Grid({
  children,
  cols = "3",
  gap = "md",
  className = "",
}: GridProps) {
  const colClasses = {
    "1": "grid-cols-1",
    "2": "grid-cols-1 md:grid-cols-2",
    "3": "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
    "4": "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
    "6": "grid-cols-2 md:grid-cols-3 lg:grid-cols-6",
    "12": "grid-cols-12",
  };

  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div className={`grid ${colClasses[cols]} ${gapClasses[gap]} ${className}`}>
      {children}
    </div>
  );
}

interface FlexProps {
  children: React.ReactNode;
  direction?: "row" | "col";
  justify?: "start" | "center" | "end" | "between" | "around";
  align?: "start" | "center" | "end" | "stretch";
  gap?: "sm" | "md" | "lg";
  className?: string;
}

export function Flex({
  children,
  direction = "row",
  justify = "start",
  align = "start",
  gap = "md",
  className = "",
}: FlexProps) {
  const directionClass = direction === "row" ? "flex-row" : "flex-col";
  const justifyClasses = {
    start: "justify-start",
    center: "justify-center",
    end: "justify-end",
    between: "justify-between",
    around: "justify-around",
  };
  const alignClasses = {
    start: "items-start",
    center: "items-center",
    end: "items-end",
    stretch: "items-stretch",
  };
  const gapClasses = {
    sm: "gap-2",
    md: "gap-4",
    lg: "gap-6",
  };

  return (
    <div
      className={`flex ${directionClass} ${justifyClasses[justify]} ${alignClasses[align]} ${gapClasses[gap]} ${className}`}
    >
      {children}
    </div>
  );
}

interface StackProps {
  children: React.ReactNode;
  spacing?: "sm" | "md" | "lg" | "xl";
}

export function Stack({ children, spacing = "md" }: StackProps) {
  const spacingClasses = {
    sm: "space-y-2",
    md: "space-y-4",
    lg: "space-y-6",
    xl: "space-y-8",
  };

  return (
    <div className={`flex flex-col ${spacingClasses[spacing]}`}>{children}</div>
  );
}

// ========== DISPLAY COMPONENTS ==========

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  footer?: React.ReactNode;
  variant?: "default" | "bordered" | "elevated";
  className?: string;
}

export function Card({
  children,
  title,
  subtitle,
  footer,
  variant = "default",
  className = "",
}: CardProps) {
  const variantClasses = {
    default: "bg-white border border-gray-300 shadow-sm",
    bordered: "bg-white border-2 border-gray-400 shadow-md",
    elevated: "bg-white shadow-xl border border-gray-200",
  };

  return (
    <div
      className={`rounded-xl overflow-hidden ${variantClasses[variant]} ${className}`}
    >
      {(title || subtitle) && (
        <div className="px-6 py-4 border-b border-gray-200 bg-linear-to-r from-gray-50 to-white">
          {title && (
            <h3 className="text-xl font-bold text-gray-900">{title}</h3>
          )}
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
      )}
      <div className="px-6 py-5 text-gray-800">{children}</div>
      {footer && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 text-gray-700">
          {footer}
        </div>
      )}
    </div>
  );
}

interface TableColumn {
  key: string;
  label: string;
}

interface TableProps {
  columns: TableColumn[];
  data: Record<string, unknown>[];
  striped?: boolean;
  hoverable?: boolean;
}

export function Table({
  columns,
  data,
  striped = true,
  hoverable = true,
}: TableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={`
                ${striped && idx % 2 === 1 ? "bg-gray-50" : ""}
                ${hoverable ? "hover:bg-gray-100" : ""}
              `}
            >
              {columns.map((col) => (
                <td
                  key={col.key}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {String(row[col.key] ?? "")}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface BadgeProps {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info";
  size?: "sm" | "md" | "lg";
}

export function Badge({
  children,
  variant = "default",
  size = "md",
}: BadgeProps) {
  const variantClasses = {
    default: "bg-gray-100 text-gray-800",
    success: "bg-green-100 text-green-800",
    warning: "bg-yellow-100 text-yellow-800",
    error: "bg-red-100 text-red-800",
    info: "bg-blue-100 text-blue-800",
  };

  const sizeClasses = {
    sm: "px-2 py-0.5 text-xs",
    md: "px-2.5 py-0.5 text-sm",
    lg: "px-3 py-1 text-base",
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full ${variantClasses[variant]} ${sizeClasses[size]}`}
    >
      {children}
    </span>
  );
}

interface AvatarProps {
  name?: string;
  src?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function Avatar({ name, src, size = "md" }: AvatarProps) {
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-10 w-10 text-sm",
    lg: "h-12 w-12 text-base",
    xl: "h-16 w-16 text-lg",
  };

  const initials = name
    ?.split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div
      className={`inline-flex items-center justify-center rounded-full bg-blue-500 text-white font-medium ${sizeClasses[size]}`}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={src}
          alt={name || "Avatar"}
          className="h-full w-full rounded-full object-cover"
        />
      ) : (
        <span>{initials || "?"}</span>
      )}
    </div>
  );
}

// Export all interactive components
export * from "./interactive";
