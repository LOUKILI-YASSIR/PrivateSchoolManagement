// utils/hooks.js (optional)
import { useTranslation } from "react-i18next";
import { TYPE, DEFAULT } from './formConstants';

export const useFormOptions = () => {
  const { t: Traduction } = useTranslation();
  return {
    TYPE,
    DEFAULT,
    Traduction,
  };
};