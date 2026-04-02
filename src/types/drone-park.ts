export type DroneParkAsset = {
  url: string;
  alt: string;
  width?: number;
  height?: number;
  mime?: string;
};

export type DroneParkItem = {
  id: number | string;
  title: string;
  description?: string;
  image?: DroneParkAsset;
  order?: number;
  locale?: string;
};
