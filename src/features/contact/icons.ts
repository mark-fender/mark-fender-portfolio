import type { IconType } from 'react-icons';
import { FaGithub, FaInstagram, FaLinkedin } from 'react-icons/fa6';
import type { socials } from '@/content/site';

export const socialIcons: Record<(typeof socials)[number]['label'], IconType> = {
  LinkedIn: FaLinkedin,
  GitHub: FaGithub,
  Instagram: FaInstagram,
};
