export interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
  featured?: boolean;
}

export interface Category {
  id: string;
  title: string;
  description: string;
  services: Service[];
}

export interface ServicesData {
  categories: Category[];
}
