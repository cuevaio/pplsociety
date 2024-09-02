'use client';

export const LocalDate = ({
  date,
  children,
}:
  | {
      date?: string;
      children: string;
    }
  | {
      date: string;
      children?: string;
    }) => {
  if (children) return new Date(children).toLocaleString();
  if (date) return new Date(date).toLocaleString();
  return null;
};
