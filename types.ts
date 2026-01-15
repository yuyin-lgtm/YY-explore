
export interface KPI {
  label: string;
  value: string;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  icon: string;
}

export interface Campaign {
  id: string;
  name: string;
  spend: number;
  revenue: number;
  roas: number;
  icon: string;
}

export interface Creator {
  handle: string;
  followers: string;
  avatar: string;
  tags: string[];
  videoCount: number;
  spend: number;
  revenue: number;
  roas: number;
  status: 'top' | 'retainer' | 'review' | 'high';
}

export interface Creative {
  id: string;
  title: string;
  spend: number;
  revenue: number;
  roas: number;
  thumbnail: string;
  tag: 'Delivering' | 'Bleeding' | 'Archived';
  secondaryTag?: string;
}
