import React from 'react';
import { LucideIcon } from 'lucide-react';

export interface DocSubSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface DocSection {
  id: string;
  title: string;
  icon: LucideIcon;
  subSections: DocSubSection[];
}
