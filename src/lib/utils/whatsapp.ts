const DEFAULT_WHATSAPP_PHONE = "3519385209";

export const getWhatsappUrl = (text: string) => {
  const phone =
    import.meta.env.WHATSAPP_PHONE?.trim().replace(/[^\d]/g, "") ||
    DEFAULT_WHATSAPP_PHONE;

  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`;
};
