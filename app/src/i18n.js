import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
  compatibilityJSON: "v3",
  lng: "en",
  fallbackLng: "en",
  resources: {
    en: {
      translation: {
        yourData: "Your Data",
        bmiDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        gender: "Gender",
        weight: "Weight",
        height: "Height",
        age: "Age",
        continue: "Continue",
        bmi: "BMI",
        underweight: "Underweight",
        normal: "Normal",
        overweight: "Overweight",
        obese: "Obese",
      },
    },
    ta: {
      translation: {
        yourData: "உங்கள் தகவல்கள்",
        bmiDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
        gender: "பாலினம்",
        weight: "எடை",
        height: "உயரம்",
        age: "வயது",
        continue: "தொடரவும்",
        bmi: "BMI",
        underweight: "குறைந்த எடை",
        normal: "சாதாரணம்",
        overweight: "அதிக எடை",
        obese: "அதிக உடல் பருமன்",
      },
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
