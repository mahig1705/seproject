import React from 'react';
import { cn } from '@/lib/utils';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
}

export const Table: React.FC<TableProps> = ({ children, className, ...props }) => {
  return (
    <div className="overflow-x-auto">
      <table
        className={cn(
          'w-full border-collapse',
          className
        )}
        {...props}
      >
        {children}
      </table>
    </div>
  );
};

interface TableHeaderProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableHeader: React.FC<TableHeaderProps> = ({ children, className, ...props }) => {
  return (
    <thead
      className={cn(
        'bg-gray-50',
        className
      )}
      {...props}
    >
      {children}
    </thead>
  );
};

interface TableBodyProps extends React.HTMLAttributes<HTMLTableSectionElement> {
  children: React.ReactNode;
}

export const TableBody: React.FC<TableBodyProps> = ({ children, className, ...props }) => {
  return (
    <tbody
      className={cn(
        'bg-white divide-y divide-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </tbody>
  );
};

interface TableRowProps extends React.HTMLAttributes<HTMLTableRowElement> {
  children: React.ReactNode;
}

export const TableRow: React.FC<TableRowProps> = ({ children, className, ...props }) => {
  return (
    <tr
      className={cn(
        'hover:bg-gray-50 transition-colors',
        className
      )}
      {...props}
    >
      {children}
    </tr>
  );
};

interface TableHeadProps extends React.ThHTMLAttributes<HTMLTableHeaderCellElement> {
  children: React.ReactNode;
}

export const TableHead: React.FC<TableHeadProps> = ({ children, className, ...props }) => {
  return (
    <th
      className={cn(
        'px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </th>
  );
};

interface TableCellProps extends React.TdHTMLAttributes<HTMLTableDataCellElement> {
  children: React.ReactNode;
}

export const TableCell: React.FC<TableCellProps> = ({ children, className, ...props }) => {
  return (
    <td
      className={cn(
        'px-4 py-4 whitespace-nowrap text-sm text-gray-900 border-b border-gray-200',
        className
      )}
      {...props}
    >
      {children}
    </td>
  );
};
